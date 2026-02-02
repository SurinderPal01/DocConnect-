const express = require("express");
const router = express.Router();
const { suggestDoctor ,suggestSpecialization } = require("../controllers/aiController");

// router.post("/suggest-doctor", suggestSpecialization );
router.post("/suggest-doctor", suggestDoctor );

module.exports = router;
