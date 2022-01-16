const express = require('express');
const router = express.Router();
router.use(require("./menu/newest"));
module.exports = router;