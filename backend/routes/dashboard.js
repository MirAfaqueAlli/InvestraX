const express = require("express");
const router = express.Router();
const auth = require("../middlewares/AuthMiddleware");

const  UserModel = require("../models/UserModel");
const HoldingsModel = require("../models/HoldingsModel");

router.get("/summary", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    const holdings = await HoldingsModel.find({ user: req.userId });

    let investment = 0;
    let currentValue = 0;

    holdings.forEach((h) => {
      investment += h.qty * h.avg;
      currentValue += h.qty * h.price;
    });

    const usedMargin = investment;
    const availableMargin = user.balance;
    const openingBalance = user.balance + usedMargin; 
    const pnl = currentValue - investment;

    res.json({
      success: true,
      summary: {
        holdingsCount: holdings.length,
        investment,
        currentValue,
        pnl,
        availableMargin,
        usedMargin,
        openingBalance,
      },
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load summary",
    });
  }
});

module.exports = router;
