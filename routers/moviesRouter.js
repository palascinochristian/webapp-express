const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/moviesController");

// Index
router.get("/", moviesController.index);

// Show
router.get("/:id", moviesController.show);

//Store Review
router.post("/:id/reviews", moviesController.storeReview);

module.exports = router;
