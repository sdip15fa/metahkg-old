const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const { mongouri } = require("../../common");
const sharp = require("sharp");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const credentials = new AWS.SharedIniFileCredentials({ profile: "s3" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "ap-northeast-1" });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
async function uploadtos3(filename) {
  const uploadParams = {
    Bucket: "metahkg",
    Key: `avatars/${filename.split("/").pop().split(".")[0]}`,
    Body: "",
    ContentType: `image/${filename
      .split(".")
      .pop()
      .replace("jpg", "jpeg")
      .replace("svg", "svg+xml")}`,
    CacheConfig: "no-cache",
  };
  const fileStream = fs.createReadStream(filename);
  fileStream.on("error", function (err) {
    console.log("File Error", err);
  });
  uploadParams.Body = fileStream;
  await s3.upload(uploadParams).promise();
}
async function compress(filename) {
  const width = 200;
  const r = width / 2;
  const circleShape = Buffer.from(
    `<svg><circle cx="${r}" cy="${r}" r="${r}" /></svg>`
  );
  await sharp(filename)
    .resize(width, width)
    .composite([
      {
        input: circleShape,
        blend: "dest-in",
      },
    ])
    .toFile(`${filename}.png`);
  fs.rm(filename, () => {});
}
router.post("/api/avatar", upload.single("avatar"), async (req, res) => {
  const client = new MongoClient(mongouri);
  if (
    ["jpg", "svg", "png", "jpeg"].indexOf(
      req?.file?.originalname.split(".").pop()
    ) === -1
  ) {
    res.status(400);
    res.send("File type not supported.");
    fs.rm(`uploads/${req?.file?.originalname}`);
    return;
  }
  try {
    await client.connect();
    const users = client.db("metahkg-users").collection("users");
    const user = await users.findOne({ key: req.cookies.key });
    if (!user) {
      res.status(404);
      res.send("Not found.");
      fs.rm(`uploads/${req.file.originalname}`);
      return;
    }
    const file = req.file;
    file.originalname = `${user.id}.${file.originalname.split(".").pop()}`;
    fs.rename(
      `uploads/${req.file.filename}`,
      `uploads/${file.originalname}`,
      (err) => {
        console.log(err);
      }
    );
    await compress(`uploads/${file.originalname}`);
    file.originalname += ".png";
    await uploadtos3(`uploads/${file.originalname}`);
    const url = `https://metahkg.s3.ap-northeast-1.amazonaws.com/avatars/${user.id}`;
    await users.updateOne({ id: user.id }, { $set: { avatar: url } });
    res.redirect("/profile/self");
    fs.rm(`uploads/${file.originalname}`, (err) => {});
  } finally {
    await client.close();
  }
});
module.exports = router;
