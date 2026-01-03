const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    richDescription: String,
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    countInStock: Number,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: Number,
    numReviews: Number,
  },
  { timestamps: true },
);
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", {
  virtuals: true,
});
exports.Product = mongoose.model("Product", productSchema);
