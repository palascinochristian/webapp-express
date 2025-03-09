const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/moviesController");
const authMiddleware = require("../middlewares/authMiddleware");

// Index
router.get("/", moviesController.index);

// Show
router.get("/:id", moviesController.show);

//Store Review
router.post("/:id/reviews", authMiddleware, moviesController.storeReview);

module.exports = router;
