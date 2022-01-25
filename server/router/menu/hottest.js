// get hottest 20 threads in a category
// note: category 1 returns all categories
// Syntax: GET /api/hottest/<category id>
const express = require("express");
const isInteger = require("is-sn-integer");
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
const router = express.Router();
router.get("/api/hottest/:category", async (req, res) => {
  if (
    (!isInteger(req.params.category) &&
      !req.params.category.startsWith("bytid")) ||
    (req.params.category.startsWith("bytid") &&
      !isInteger(req.params.category.replace("bytid", "")))
  ) {
    res.status(400);
    res.send("Bad request.");
    return;
  }
  const client = new MongoClient(mongouri);
  try {
    await client.connect();
    let category = Number(req.params.category);
    const hottest = client.db("metahkg-threads").collection("hottest");
    const summary = client.db("metahkg-threads").collection("summary");
    if (req.params.category.startsWith("bytid")) {
      const s = await summary.findOne({
        id: Number(req.params.category.replace("bytid", "")),
      });
      if (!s || !s.category) {
        res.send([404]);
        return;
      }
      category = s.category;
    }
    if (
      !(await client
        .db("metahkg-threads")
        .collection("category")
        .findOne({ id: category }))
    ) {
      res.send([404]);
      return;
    }
    const data = await hottest
      .find(category === 1 ? {} : { category: category })
      .sort({ c: -1, lastModified: -1 })
      .limit(20)
      .toArray();
    for (let index = 0; index < data.length; index++) {
      data[index] = await summary.findOne({ id: data[index].id });
    }
    res.send(data.length ? data : [404]);
  } finally {
    await client.close();
  }
});
module.exports = router;
