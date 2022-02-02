// check whether a thread exist
// syntax: POST /api/check {id : number}
const express = require("express");
const router = express.Router();
const body_parser = require("body-parser");
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
router.post("/api/check", body_parser.json(), async (req, res) => {
  const client = new MongoClient(mongouri);
  if (
    !req.body.id ||
    Object.keys(req.body).length > 1 ||
    typeof req.body.id !== "number"
  ) {
    res.status(400);
    res.send("Bad request.");
    return;
  }
  try {
    await client.connect();
    if (
      !(await client
        .db("metahkg-threads")
        .collection("conversation")
        .findOne({ id: req.body.id }))
    ) {
      res.status(404);
      res.send("Not found.");
      return;
    }
    res.send("ok");
  } finally {
    await client.close();
  }
});
module.exports = router;
