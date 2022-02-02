// Signup for an account
// humans only
/* Syntax: POST /api/register
{
  user (username): string,
  pwd (password, sha256 hashed): string,
  email: string,
  htoken (hcaptcha token): string,
  sex: "male" | "female"
}
*/
require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const body_parser = require("body-parser");
const { mongouri, secret } = require("../../common");
const EmailValidator = require("email-validator");
const { verify } = require("hcaptcha");
const random = require("random");
const bcrypt = require("bcrypt");
const mailgun = require("mailgun-js");
const DOMAIN = "metahkg.wcyat.me";
const mg = mailgun({ apiKey: process.env.api_key, domain: DOMAIN });
const router = express.Router();
async function valid(req, res) {
  if (
    !req.body.user ||
    !req.body.pwd ||
    !req.body.htoken ||
    !req.body.email ||
    !req.body.sex ||
    req.body.user.split(" ")[1] ||
    req.body.user.length > 15 ||
    !(
      typeof req.body.user === "string" &&
      typeof req.body.pwd === "string" &&
      typeof req.body.email === "string" &&
      typeof req.body.htoken === "string"
    ) ||
    (req.body.sex !== "female" && req.body.sex !== "male") ||
    Object.keys(req.body).length > 5 ||
    !EmailValidator.validate(req.body.email)
  ) {
    res.status(400);
    res.send("Bad request");
    return false;
  }
  const hvalid = await verify(secret, req.body.htoken);
  if (!hvalid.success) {
    res.status(400);
    res.send("hCaptcha token invalid.");
    return false;
  }
  return true;
}
async function exceptions(req, res, client) {
  const banned = client.db("metahkg-users").collection("banned");
  console.log(req.ip);
  if (await banned.findOne({ ip: req.ip })) {
    res.status(403);
    res.send("You are banned from creating accounts.");
    console.log(`Banned ${req.ip}`);
    return false;
  }
  const verification = client.db("metahkg-users").collection("verification");
  const users = client.db("metahkg-users").collection("users");
  if (
    (await users.countDocuments({ user: req.body.user })) ||
    (await verification.countDocuments({ user: req.body.user }))
  ) {
    res.status(409);
    res.send("Username exists.");
    return false;
  } else if (
    (await users.countDocuments({ email: req.body.email })) ||
    (await verification.countDocuments({ email: req.body.email }))
  ) {
    res.status(409);
    res.send("Email exists.");
    return false;
  }
  return true;
}
router.post("/api/register", body_parser.json(), async (req, res) => {
  const client = new MongoClient(mongouri);
  if (!(await valid(req, res))) {
    return;
  }
  await client.connect();
  if (!(await exceptions(req, res, client))) {
    return;
  }
  const verification = client.db("metahkg-users").collection("verification");
  const code = random.int(100000, 999999);
  const verify = {
    from: "Metahkg support <support@metahkg.wcyat.me>",
    to: req.body.email,
    subject: "Metahkg verification code",
    text: `Your verification code is ${code}.`,
  };
  await mg.messages().send(verify, function (error, body) {
    console.log(body);
  });
  const hashed = await bcrypt.hash(req.body.pwd, 10);
  await verification.insertOne({
    createdAt: new Date(),
    code: code,
    email: req.body.email,
    pwd: hashed,
    user: req.body.user,
    sex: req.body.sex,
  });
  res.send("Ok");
});
module.exports = router;
