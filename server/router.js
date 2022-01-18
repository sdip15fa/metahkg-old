const express = require("express");
const router = express.Router();
router.use(require("./router/signup"));
router.use(require("./router/menu"));
router.use(require("./router/categories"));
router.use(require("./router/signin"));
router.use(require("./router/conversation"));
router.use(require("./router/logout"));
router.use(require("./router/search"));
router.use(require("./router/vote/vote"));
router.use(require("./router/vote/getvotes"));
module.exports = router;
