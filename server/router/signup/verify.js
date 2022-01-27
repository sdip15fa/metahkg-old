// verify email
/* Syntax: POST /api/verify
  {
    email (email used in sign up): string,
    code (verification code sent to user's email address): string
  }
*/
// if successfully verified, sets a cookie "key" of user's key which is randomly generated
require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const body_parser = require("body-parser");
const { mongouri } = require("../../common");
const { generate } = require("wcyat-rg");
const router = express.Router();
router.post("/api/verify", body_parser.json(), async (req, res) => {
  const client = new MongoClient(mongouri);
  if (
    !req.body.email ||
    !req.body.code ||
    !(
      typeof req.body.email === "string" && typeof req.body.code === "number"
    ) ||
    Object.keys(req.body).length > 2 ||
    req.body.code.toString().length !== 6
  ) {
    res.status(400);
    res.send("Bad request");
    return;
  }
  await client.connect();
  const verification = client.db("metahkg-users").collection("verification");
  const users = client.db("metahkg-users").collection("users");
  const data = await verification.findOne({ email: req.body.email });
  if (!data) {
    res.status(404);
    res.send("Not found. Your code night have expired.");
  } else if (data.code !== req.body.code) {
    res.status(401);
    res.send("Code incorrect.");
  } else {
    delete data._id;
    delete data.code;
    data.key = generate({
      include: { numbers: true, upper: true, lower: true, special: false },
      digits: 30,
    });
    data.id =
      ((await users.find().sort({ id: -1 }).limit(1).toArray())[0].id ||
        (await users.countDocuments({}))) + 1;
    await users.insertOne(data);
    res.cookie("key", data.key, {
      domain: process.env.domain,
      secure: true,
      httpOnly: true,
      path: "/",
      expires: new Date("2038-01-19T04:14:07.000Z"),
    });
    res.send({ id: data.id, key: data.key });
    await verification.deleteOne({ email: req.body.email });
  }
});
module.exports = router;
