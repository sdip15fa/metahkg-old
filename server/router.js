const express = require("express");
const router = express.Router();
router.use(require("./router/signup"));
router.use(require("./router/menu"));
router.use(require("./router/categories"));
router.use(require("./router/signin"));
router.use(require("./router/conversation"));
router.use(require("./router/logout"));
module.exports = router;
