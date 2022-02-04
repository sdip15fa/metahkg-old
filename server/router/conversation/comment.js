// add a comment
// Syntax: POST /api/comment {id (thread id) : number, comment : string}
// client must have a cookie "key"
const express = require("express");
const router = express.Router();
const body_parser = require("body-parser");
const { MongoClient } = require("mongodb");
const { mongouri, timediff } = require("../../common");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const jsdomwindow = new JSDOM("").window;
const DOMPurify = createDOMPurify(jsdomwindow);
router.post("/api/comment", body_parser.json(), async (req, res) => {
  const client = new MongoClient(mongouri);
  if (
    !req.body.id ||
    !req.body.comment ||
    Object.keys(req.body).length > 2 ||
    !(typeof req.body.id === "number" && typeof req.body.comment === "string")
  ) {
    res.status(400);
    res.send("Bad request");
    return;
  }
  await client.connect();
  try {
    const conversation = client
      .db("metahkg-threads")
      .collection("conversation");
    const users = client.db("metahkg-threads").collection("users");
    const summary = client.db("metahkg-threads").collection("summary");
    const metahkgusers = client.db("metahkg-users").collection("users");
    const limit = client.db("metahkg-users").collection("limit");
    const hottest = client.db("metahkg-threads").collection("hottest");
    const key = req.cookies.key;
    const user = await metahkgusers.findOne({ key: key });
    if (
      !(await metahkgusers.findOne({ key: key })) ||
      !(await conversation.findOne({ id: req.body.id }))
    ) {
      res.status(404);
      res.send("Not found.");
      return;
    }
    const newid = (await summary.findOne({ id: req.body.id })).c + 1;
    if ((await limit.countDocuments({ id: user.id, type: "comment" })) >= 300) {
      res.status(429);
      res.send("You cannot add more than 300 comments a day.");
      return;
    }
    await conversation.updateOne(
      { id: req.body.id },
      {
        $push: {
          conversation: {
            id: newid,
            user: user.id,
            comment: DOMPurify.sanitize(req.body.comment),
            createdAt: new Date(),
          },
        },
        $currentDate: { lastModified: true },
      }
    );
    await summary.updateOne(
      { id: req.body.id },
      { $inc: { c: 1 }, $currentDate: { lastModified: true } }
    );
    if (!(await users.findOne({ id: req.body.id })[user.id])) {
      await users.updateOne(
        { id: req.body.id },
        { $set: { [user.id]: { sex: user.sex, name: user.user } } }
      );
    }
    const h = await hottest.findOne({ id: req.body.id });
    if (h) {
      await hottest.updateOne(
        { id: req.body.id },
        {
          $inc: { c: 1 },
          $currentDate:
            timediff(h.createdAt) > 86400
              ? { lastModified: true, createdAt: true }
              : { lastModified: true },
        }
      );
    } else {
      const s = await summary.findOne({
        id: req.body.id,
      });
      const o = {
        lastModified: new Date(),
        createdAt: new Date(),
        id: s.id,
        c: 1,
        category: s.category,
      };
      await hottest.insertOne(o);
    }
    res.send({ id: newid });
  } finally {
    await client.close();
  }
});
module.exports = router;
