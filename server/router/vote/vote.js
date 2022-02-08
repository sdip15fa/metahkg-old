const body_parser = require("body-parser");
const express = require("express");
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
const router = express.Router();
router.post("/api/vote", body_parser.json(), async (req, res) => {
  if (
    !req.body.id ||
    !req.body.cid ||
    !req.body.vote ||
    Object.keys(req.body).length > 3 ||
    !(
      typeof req.body.cid === "number" &&
      typeof req.body.id === "number" &&
      ["up", "down"].includes(req.body.vote)
    )
  ) {
    res.status(400);
    res.send("Bad request");
    return;
  }
  const client = new MongoClient(mongouri);
  try {
    await client.connect();
    const threads = client.db("metahkg-threads").collection("conversation");
    const summary = client.db("metahkg-threads").collection("summary");
    const users = client.db("metahkg-users").collection("users");
    const votes = client.db("metahkg-users").collection("votes");
    const user = await users.findOne({ key: req.cookies.key });
    if (!user) {
      res.status(404);
      res.send("User not found.");
      return;
    }
    const thread = await threads.findOne({ id: req.body.id });
    const index = thread.conversation.findIndex((i) => i.id === req.body.cid);
    if (!thread || index < 0) {
      res.status(404);
      res.send("Not found.");
      return;
    }
    const uservotes = await votes.findOne({ id: user.id });
    if (!uservotes) {
      await votes.insertOne({ id: user.id });
    } else if (uservotes?.[req.body.id]?.[req.body.cid]) {
      res.status(403);
      res.send("You have already voted.");
      return;
    }
    await votes.updateOne(
      { id: user.id },
      { $set: { [`${req.body.id}.${req.body.cid}`]: req.body.vote } }
    );
    if (!thread.conversation[index]?.[req.body.vote]) {
      await threads.updateOne(
        { id: req.body.id },
        { $set: { [`conversation.${index}.${req.body.vote}`]: 0 } }
      );
    }
    await threads.updateOne(
      { id: req.body.id },
      { $inc: { [`conversation.${index}.${req.body.vote}`]: 1 } }
    );
    if (req.body.cid === 1) {
      await summary.updateOne(
        { id: req.body.id },
        { $inc: { vote: req.body.vote === "up" ? 1 : -1 } }
      );
    }
    res.send("ok");
  } finally {
    await client.close();
  }
});
module.exports = router;
