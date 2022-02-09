const express = require("express");
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
const isInteger = require("is-sn-integer");
const router = express.Router();
router.get("/api/getvotes", async (req, res) => {
  if (!req.query.id || !isInteger(req.query.id)) {
    res.status(400);
    res.send("Bad request.");
    return;
  }
  const client = new MongoClient(mongouri);
  const id = Number(req.query.id);
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
      { projection: { [id]: 1, _id: 0 } }
    );
    res.send(uservotes?.[id] || { none: "none" });
  } finally {
    await client.close();
  }
});
module.exports = router;
