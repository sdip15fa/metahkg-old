const express = require("express");
const router = express.Router();
router.use(require("./conversation/threads"));
router.use(require("./conversation/comment"));
router.use(require("./conversation/create"));
router.use(require("./conversation/checkexist"));
module.exports = router;
