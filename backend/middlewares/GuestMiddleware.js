const jwt = require("jsonwebtoken");

const GuestMiddleware = (req, res, next) => {
  const token = req.cookies && req.cookies.token;

  // If no token, requester is a guest — allow
  if (!token) return next();

  try {
    // If token is valid, user is already authenticated — block access to guest-only routes
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(403).json({ success: false, message: "Already authenticated" });
  } catch (err) {
    // Invalid token -> treat as guest
    return next();
  }
};

module.exports = GuestMiddleware;