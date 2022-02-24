// get conversation
// Syntax: GET /api/thread/<thread id>/<"conversation"/"users">
// conversation: main conversation content
// users: content of users involved in the conversation
const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
const isInteger = require("is-sn-integer");
/*
* type:
  0: users
  1: details
  2: conversation
*/
router.get("/api/thread/:id", async (req, res) => {
  if (
    !isInteger(req.params.id) ||
    ![0, 1, 2].includes(Number(req.query.type)) ||
    (Number(req.query.type) === 2 && !isInteger(req.query.page))
  ) {
    res.status(400);
    res.send("Bad request");
    return;
  }
  const type = Number(req.query.type);
  const page = Number(req.query.page) || 1;
  const client = new MongoClient(mongouri);
  await client.connect();
  try {
    if (!type) {
      const users = client.db("metahkg-threads").collection("users");
      const r = await users.findOne(
        { id: Number(req.params.id) },
        { projection: { _id: 0 } }
      );
      if (!r) {
        res.status(404);
        res.send("Not found");
        return;
      }
      res.send(r);
      return;
    }
    const conversation = client
      .db("metahkg-threads")
      .collection("conversation");
    const summary = client.db("metahkg-threads").collection("summary");
    const result =
      type === 1
        ? await summary.findOne(
            { id: Number(req.params.id) },
            {
              projection: {
                _id: 0,
                sex: 0,
                vote: 0,
                catname: 0,
                lastModified: 0,
                createdAt: 0,
              },
            }
          )
        : await conversation.findOne(
            { id: Number(req.params.id) },
            {
              projection: {
                _id: 0,
                conversation: {
                  $filter: {
                    input: "$conversation",
                    cond: {
                      $and: [
                        { $gte: ["$$this.id", (page - 1) * 25 + 1] },
                        { $lte: ["$$this.id", page * 25] },
                      ],
                    },
                  },
                },
              },
            }
          );
    if (!result) {
      res.send([null]);
      return;
    }
    res.send(result?.conversation || result);
  } finally {
    await client.close();
  }
});
module.exports = router;
