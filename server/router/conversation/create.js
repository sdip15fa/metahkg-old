// Create a topic
/* Syntax: POST /api/create
{
  icomment (initial comment) : string,
  htoken (hcaptcha token) : string,
  title : string,
  category : number
} */
// only for human
const express = require("express");
const router = express.Router();
const body_parser = require("body-parser");
const { MongoClient } = require("mongodb");
const { mongouri, secret, domain } = require("../../common");
const { verify } = require("hcaptcha");
const axios = require("axios");
router.post("/api/create", body_parser.json(), async (req, res) => {
  const client = new MongoClient(mongouri);
  if (
    !req.body.icomment ||
    !req.body.htoken ||
    !req.body.title ||
    !req.body.category ||
    Object.keys(req.body)?.length > 4 ||
    !(
      typeof req.body.icomment === "string" &&
      typeof req.body.title === "string" &&
      typeof req.body.htoken === "string" &&
      typeof req.body.category === "number"
    )
  ) {
    res.status(400);
    res.send({ error: "Bad request." });
    return;
  }
  const hvalid = await verify(secret, req.body.htoken);
  if (!hvalid.success) {
    res.status(400);
    res.send({ error: "hCaptcha token invalid." });
    return;
  }
  try {
    await client.connect();
    const metahkgusers = client.db("metahkg-users").collection("users");
    const user = await metahkgusers.findOne({ key: req.cookies.key });
    if (!user) {
      res.status(400);
      res.send({ error: "User not found." });
      return;
    }
    const limit = client.db("metahkg-users").collection("limit");
    if ((await limit.countDocuments({ id: user.id, type: "create" })) >= 10) {
      res.status(429);
      res.send({ error: "You cannot create more than 10 topics a day." });
      return;
    }
    const categories = client.db("metahkg-threads").collection("category");
    const category = await categories.findOne({ id: req.body.category });
    if (!category) {
      res.status(404);
      res.send({ error: "Category not found." });
      return;
    }
    const summary = client.db("metahkg-threads").collection("summary");
    const conversation = client
      .db("metahkg-threads")
      .collection("conversation");
    const users = client.db("metahkg-threads").collection("users");
    const hottest = client.db("metahkg-threads").collection("hottest");
    const newcid =
      ((
        await summary
          .find()
          .sort({ id: -1 })
          .limit(1)
          .project({ id: 1, _id: 0 })
          .toArray()
      )[0]?.id || (await conversation.countDocuments())) + 1;
    const date = new Date();
    const slink = `https://l.wcyat.me/${
      (
        await axios.post("https://api-us.wcyat.me/create", {
          url: `https://${domain}/thread/${newcid}?page=1`,
        })
      ).data.id
    }`;
    await conversation.insertOne({
      id: newcid,
      conversation: [
        { id: 1, user: user.id, comment: req.body.icomment, createdAt: date },
      ],
      lastModified: date,
    });
    await users.insertOne({
      id: newcid,
      [user.id]: { name: user.user, sex: user.sex },
    });
    const s = {
      id: newcid,
      op: user.user,
      sex: user.sex,
      c: 1,
      vote: 0,
      slink: slink,
      title: req.body.title,
      category: category.id,
      catname: category.name,
      lastModified: date,
      createdAt: date,
    };
    await summary.insertOne(s);
    await hottest.insertOne({
      id: s.id,
      c: 1,
      category: s.category,
      lastModified: date,
      createdAt: date,
    });
    await limit.insertOne({ id: user.id, createdAt: date, type: "create" });
    res.send({ id: newcid });
  } finally {
    await client.close();
  }
});
module.exports = router;
