const express = require("express");
const router = express.Router();
router.use(require("./profile/history"));
router.use(require("./profile/profile"));
router.use(require("./profile/avatar"));
module.exports = router;
