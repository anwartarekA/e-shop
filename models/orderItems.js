const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
orderItemSchema.virtual("id").get(function () {
  return this._id;
});
orderItemSchema.set("toJSON", {
  virtuals: true,
});
exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);
