require('dotenv').config();
const mongouri = process.env.DB_URI;
const secret = process.env.hcaptchasecret;
module.exports = { mongouri, secret };