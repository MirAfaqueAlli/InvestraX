require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;
const sendEmail = require("./utils/SendEmail");
const cookieParser = require("cookie-parser");

const HoldingsModel = require("./models/HoldingsModel");
const PositionsModel = require("./models/PositionsModel");
const OrdersModel = require("./models/OrdersModel");
const UserModel = require("./models/UserModel");


const authMiddleware = require("./middlewares/AuthMiddleware");
const guestMiddleware = require("./middlewares/GuestMiddleware");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_HOME_URL,
      process.env.FRONTEND_DASHBOARD_URL
],
    credentials: true,
  })
);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Do not crash the server; DB-related routes will fail until connection is restored
  });

app.get("/holdings", authMiddleware, async (req, res) => {
  const holdings = await HoldingsModel.find({
    user: req.userId,
  });

  res.json({
    success: true,
    holdings,
  });
});


const positionsRouter = require("./routes/Positions");
app.use("/positions", positionsRouter);
// Orders route
const ordersRouter = require("./routes/Orders");
app.use("/orders", ordersRouter);

// Dashboard route
const dashboardRouter = require("./routes/dashboard");
app.use("/dashboard", dashboardRouter);

app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("ME error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.post("/signup", guestMiddleware, async (req, res) => {
  try {
    const { name, email, mobile, password, pan, dob } = req.body;

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = new UserModel({
      name,
      email,
      mobile,
      password,
      pan,
      dob,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await newUser.save();

    try{
    await sendEmail({
      to: email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`
    });
  } catch(err){
    console.error("Error sending OTP email:", err);
  }

    console.log(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

app.post("/verify-otp", guestMiddleware, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // SUCCESS CASE
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.post("/login", guestMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify OTP before login",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔐 Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    };


    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Logout
app.post("/logout", (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    const quantity = Number(qty);
    const unitPrice = Number(price);
    const requiredAmount = quantity * unitPrice;

    if (!name || !quantity || !unitPrice || !mode) {
      return res.status(400).json({
        success: false,
        message: "Invalid order parameters",
      });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 1️⃣ CREATE ORDER FIRST (PENDING)
    const order = new OrdersModel({
      user: user._id,
      name,
      qty: quantity,
      price: unitPrice,
      mode,
      status: "PENDING",
    });
    await order.save();

    // ================= BUY FLOW =================
    if (mode === "BUY") {
      if (user.balance < requiredAmount) {
        order.status = "REJECTED";
        await order.save();

        return res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
      }

      // 2️⃣ EXECUTE
      user.balance = Number((user.balance - requiredAmount).toFixed(2));
      await user.save();

      // 3️⃣ UPDATE HOLDINGS
      let holding = await HoldingsModel.findOne({ user: user._id, name });

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
        holding = new HoldingsModel({
          user: user._id,
          name,
          qty: quantity,
          avg: unitPrice,
          price: unitPrice,
          net: String((quantity * unitPrice).toFixed(2)),
        });
        await holding.save();
      }

      // 4️⃣ UPDATE POSITIONS
      let position = await PositionsModel.findOne({ user: user._id, name });

      if (position) {
        const newQty = position.qty + quantity;
        const newAvg =
          (position.qty * position.avg + quantity * unitPrice) / newQty;

        position.qty = newQty;
        position.avg = Number(newAvg.toFixed(2));
        position.price = unitPrice;
        position.net = String((position.qty * position.price).toFixed(2));
        await position.save();
      } else {
        position = new PositionsModel({
          user: user._id,
          product: name,
          name,
          qty: quantity,
          avg: unitPrice,
          price: unitPrice,
          net: String((quantity * unitPrice).toFixed(2)),
        });
        await position.save();
      }

      // 5️⃣ FINALIZE ORDER
      order.status = "FILLED";
      order.executedPrice = unitPrice;
      await order.save();

      return res.json({
        success: true,
        message: "Buy executed",
      });
    }

    // ================= SELL FLOW =================
    if (mode === "SELL") {
      let holding = await HoldingsModel.findOne({ user: user._id, name });

      if (!holding || holding.qty < quantity) {
        order.status = "REJECTED";
        await order.save();

        return res.status(400).json({
          success: false,
          message: "Not enough shares to sell",
        });
      }

      const proceeds = quantity * unitPrice;

      // 2️⃣ UPDATE HOLDINGS
      holding.qty -= quantity;
      if (holding.qty === 0) {
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        holding.price = unitPrice;
        holding.net = String((holding.qty * holding.price).toFixed(2));
        await holding.save();
      }

      // 3️⃣ UPDATE POSITIONS
      let position = await PositionsModel.findOne({ user: user._id, name });
      if (position) {
        position.qty -= quantity;
        if (position.qty === 0) {
          await PositionsModel.deleteOne({ _id: position._id });
        } else {
          position.price = unitPrice;
          position.net = String((position.qty * position.price).toFixed(2));
          await position.save();
        }
      }

      // 4️⃣ UPDATE FUNDS
      user.balance = Number((user.balance + proceeds).toFixed(2));
      await user.save();

      // 5️⃣ FINALIZE ORDER
      order.status = "FILLED";
      order.executedPrice = unitPrice;
      await order.save();

      return res.json({
        success: true,
        message: "Sell executed",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Unknown order type",
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});



app.listen(PORT, () => {
  console.log("Server is running on port 3002");
});
