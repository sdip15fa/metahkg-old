// get categories
// Syntax: GET /api/categories/<"all" | number(category id)>
// "all" returns an array of all categories
const express = require("express");
const router = express.Router();
const body_parser = require("body-parser");
const isInteger = require("is-sn-integer");
const { MongoClient } = require("mongodb");
const { mongouri } = require("../common");
router.get("/api/categories/:id", body_parser.json(), async (req, res) => {
  if (
    (req.params.id !== "all" &&
      !isInteger(req.params.id) &&
      !req.params.id.startsWith("bytid")) ||
    (req.params.id.startsWith("bytid") &&
      !isInteger(req.params.id.replace("bytid", "")))
  ) {
    res.status(400);
    res.send("Bad request.");
    return;
  }
  const client = new MongoClient(mongouri);
  try {
    await client.connect();
    const categories = client.db("metahkg-threads").collection("category");
    if (req.params.id === "all") {
      const c = await categories.find({}).toArray();
      const o = {};
      for (const i of c) {
        o[i.id] = i.name;
      }
      res.send(o);
      return;
    }
    if (req.params.id.startsWith("bytid")) {
      const summary = client.db("metahkg-threads").collection("summary");
      const s = await summary.findOne({
        id: Number(req.params.id.replace("bytid", "")),
      });
      const c = await categories.findOne({ id: s.category });
      if (!c) {
        res.status(404);
        res.send("Not found.");
        return;
      }
      res.send({ id: c.id, name: c.name });
      return;
    }
    const c = await categories.findOne({ id: Number(req.params.id) });
    if (!c) {
      res.status(404);
      res.send("Not found.");
      return;
    }
    res.send({ id: c.id, name: c.name });
  } finally {
    await client.close();
  }
});
module.exports = router;
