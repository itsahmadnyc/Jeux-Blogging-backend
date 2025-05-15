const express = require("express");
const { trackVisitor } = require("../controllers/visitor.controller");
const router = express.Router();





router.post('/track-visit', trackVisitor )

module.exports = router;