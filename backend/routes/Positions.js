const express = require("express");
const router = express.Router();
const auth = require("../middlewares/AuthMiddleware");
const PositionsModel = require("../models/PositionsModel");

router.get("/", auth, async (req, res) => {
  try {
    const positions = await PositionsModel.find({
      user: req.userId,
    });

    res.json({
      success: true,
      positions,
    });
  } catch (error) {
    console.error("Fetch positions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch positions",
    });
  }
});

module.exports = router;
