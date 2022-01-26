// get conversation
// Syntax: GET /api/thread/<thread id>/<"conversation"/"users">
// conversation: main conversation content
// users: content of users involved in the conversation
const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
router.get("/api/thread/:id/:file", async (req, res) => {
  const client = new MongoClient(mongouri);
  await client.connect();
  try {
    const c = client.db("metahkg-threads").collection(req.params.file);
    const result = await c.findOne({ id: Number(req.params.id) });
    if (!result) {
      res.status(404);
      res.send("Not found");
    } else {
      res.send(result);
    }
  } finally {
    await client.close();
  }
});
module.exports = router;
