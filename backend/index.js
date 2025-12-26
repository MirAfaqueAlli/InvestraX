require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;
const sendEmail = require("./utils/sendEmail");
const cookieParser = require("cookie-parser");


const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");
const { UserModel } = require("./models/UserModel");
const authMiddleware = require("./middlewares/AuthMiddleware");
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,              
  })
);


mongoose.connect(url).then(() => {
  console.log("Connected to MongoDB");
});

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});
app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});


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


app.post("/signup", async (req, res) => {
  try{
    const { name, email, mobile, password, pan, dob } = req.body; 
  const existingUser = await UserModel.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists."
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
    isVerified: false
  });
  await newUser.save();
   await sendEmail({
  to: email,
  subject: "Verify your account",
  text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
});


  console.log(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully."
  });
}catch (error) {
  console.error("Error during signup:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
}
});

app.post("/verify-otp", async (req, res) => {
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


app.post("/login", async (req, res) => {
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

    // 🍪 Send token as HTTP-only cookie
    res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  domain: "localhost",   // ⭐ VERY IMPORTANT
  maxAge: 24 * 60 * 60 * 1000,
});


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


app.post("/newOrder", async (req, res) => {
  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });
  newOrder.save();
  res.send("Order received");
});

app.listen(PORT, () => {
  console.log("Server is running on port 3002");
});
