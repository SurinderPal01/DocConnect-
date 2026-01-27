const express = require("express");
const router = express.Router();
const { suggestDoctor } = require("../controllers/aiController");

router.post("/suggest-doctor", suggestDoctor);

module.exports = router;
