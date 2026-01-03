const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "enter valid email"],
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "passwords are not the same",
    },
  },
  street: {
    type: String,
    required: true,
  },
  apartment: String,
  zip: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.pre("save", async function () {
  if (!this.isNew || !this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});
userSchema.methods.comparePasswords = async (plainPassword, hashPassword) =>
  await bcrypt.compare(plainPassword, hashPassword);
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});
exports.User = mongoose.model("User", userSchema);
