require("dotenv").config();
const mongouri = process.env.DB_URI;
const secret = process.env.hcaptchasecret;
function timediff(sdate) {
  const startDate = new Date(sdate);
  const endDate = new Date();
  const diff = endDate.getTime() - startDate.getTime();
  return diff / 1000;
}

module.exports = { mongouri, secret, timediff };
