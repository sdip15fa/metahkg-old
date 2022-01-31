const express = require("express");
const router = express.Router();
router.use(require("./signup/register"));
router.use(require("./signup/verify"));
module.exports = router;
