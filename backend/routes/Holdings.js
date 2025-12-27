const express = require("express");
const router = express.Router();
const auth = require("../middlewares/AuthMiddleware");
const Holding = require("../models/HoldingsModel");

router.get("/", auth, async (req, res) => {
  const holdings = await Holding.find({ user: req.userId });
  res.json(holdings);
});

module.exports = router;
