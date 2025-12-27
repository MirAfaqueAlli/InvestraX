const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  name: String,
  qty: Number,
  price: Number,
  mode: String,
  executedPrice: Number,
  status: { type: String, default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };
