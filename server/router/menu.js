const express = require("express");
const router = express.Router();
router.use(require("./menu/newest"));
router.use(require("./menu/hottest"));
module.exports = router;
