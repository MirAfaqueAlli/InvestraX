const express = require("express");
const router = express.Router();
const auth = require("../middlewares/AuthMiddleware");

const User = require("../models/UserModel");
const Holding = require("../models/HoldingsModel");
const Order = require("../models/OrdersModel");

// ================= CREATE NEW ORDER =================
router.post("/new", auth, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const quantity = Number(qty);
    const unitPrice = Number(price);
    const amount = quantity * unitPrice;

    if (!name || !quantity || !unitPrice || !mode) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ================= BUY =================
    if (mode === "BUY") {
      if (user.balance < amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
      }

      // Deduct balance
      user.balance = Number((user.balance - amount).toFixed(2));
      await user.save();

      // Update holdings
      let holding = await Holding.findOne({ user: user._id, name });

      if (holding) {
        const newQty = holding.qty + quantity;
        const newAvg =
          (holding.qty * holding.avg + quantity * unitPrice) / newQty;

        holding.qty = newQty;
        holding.avg = Number(newAvg.toFixed(2));
        holding.price = unitPrice;
        holding.net = String((holding.qty * holding.price).toFixed(2));
        await holding.save();
      } else {
        await Holding.create({
          user: user._id,
          name,
          qty: quantity,
          avg: unitPrice,
          price: unitPrice,
          net: String((quantity * unitPrice).toFixed(2)),
        });
      }
    }

    // ================= SELL =================
    if (mode === "SELL") {
      const holding = await Holding.findOne({ user: user._id, name });

      if (!holding || holding.qty < quantity) {
        return res.status(400).json({
          success: false,
          message: "Not enough quantity to sell",
        });
      }

      holding.qty -= quantity;
      user.balance = Number((user.balance + amount).toFixed(2));

      if (holding.qty === 0) await holding.deleteOne();
      else {
        holding.price = unitPrice;
        holding.net = String((holding.qty * holding.price).toFixed(2));
        await holding.save();
      }

      await user.save();
    }

    // Save order
    await Order.create({
      user: user._id,
      name,
      qty: quantity,
      price: unitPrice,
      mode,
      executedPrice: unitPrice,
      status: "FILLED",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= GET USER ORDERS =================
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
