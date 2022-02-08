const bodyParser = require("body-parser");
const express = require("express");
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
const router = express.Router();
router.post("/api/getvotes", bodyParser.json(), async (req, res) => {
  if (
    !req.body.id ||
    Object.keys(req.body).length > 1 ||
    typeof req.body.id !== "number"
  ) {
    res.status(400);
    res.send("Bad request.");
    return;
  }
  const client = new MongoClient(mongouri);
  try {
    await client.connect();
    const votes = client.db("metahkg-users").collection("votes");
    const users = client.db("metahkg-users").collection("users");
    const user = await users.findOne({ key: req.cookies.key });
    if (!user) {
      res.status(404);
      res.send("User not found");
      return;
    }
    const uservotes = await votes.findOne(
      { id: user.id },
      { projection: { [req.body.id]: 1, _id: 0 } }
    );
    res.send(uservotes?.[req.body.id] || { none: "none" });
  } finally {
    await client.close();
  }
});
module.exports = router;
