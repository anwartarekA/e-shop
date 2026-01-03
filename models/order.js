const mongoose = require("mongoose");
const validator = require("validator");
const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingAddress1: {
      type: String,
      required: true,
    },
    shippingAddress2: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: [validator.isMobilePhone, "Enter valid phone number"],
    },
    totalPrice: Number,
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);
orderSchema.virtual("id").get(function () {
  return this._id;
});
exports.Order = mongoose.model("Order", orderSchema);
