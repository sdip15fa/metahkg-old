const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const body_parser = require("body-parser");
const { mongouri } = require("../common");
router.post("/api/search", body_parser.json(), async (req, res) => {
  if (
    !req.body.q ||
    (!req.body.sort && !req.body.sort === 0) ||
    Object.keys(req.body).length > 2 ||
    !(typeof req.body.q === "string" && typeof req.body.sort === "number") ||
    !req.body.sort in [0, 1, 2]
  ) {
    res.status(400);
    res.send("Bad request.");
    return;
  }
  const client = new MongoClient(mongouri);
  try {
    await client.connect();
    const summary = client.db("metahkg-threads").collection("summary");
    const sortc = {
      0: {},
      1: { createdAt: -1 },
      2: { lastModified: -1 }
    }[req.body.sort];
    const data = await summary
      .find({ $text: { $search: req.body.q } })
      .sort(sortc)
      .limit(100)
      .toArray();
    res.send(data);
  } finally {
    await client.close();
  }
});
module.exports = router;
