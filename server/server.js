require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rootRouter = express.Router();
require("dotenv").config();
const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://js.hcaptcha.com https://sa.wcyat.engineer https://analytics.wcyat.me https://static.cloudflareinsights.com https://cdnjs.cloudflare.com"
  );
  return next();
});
app.use(cookieParser());
app.use(require("./router"));
app.use(express.static("build"));
rootRouter.get("(/*)?", async (req, res, next) => {
  res.sendFile("index.html", { root: "build" });
});
app.use(rootRouter);
app.listen(process.env.port, () => {
  console.log(`listening at port ${process.env.port}`);
});
