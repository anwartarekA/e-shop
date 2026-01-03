const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const AppError = require("./../helpers/appError");
const catchAsync = require("./../helpers/catchAsync");
const { User } = require("./../models/user");
const createTokenAndSendCookie = require("./../helpers/createTokenAndSendCookie");
router.post(
  "/",
  catchAsync(async (req, res, next) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
      isAdmin: req.body.isAdmin,
    });
    await newUser.save();

    res.status(201).json({
      status: "success",
      newUser,
    });
  }),
);
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
      isAdmin: req.body.isAdmin,
    });
    await newUser.save();

    res.status(201).json({
      status: "success",
      newUser,
    });
  }),
);
router.get(
  `/`,
  catchAsync(async (req, res, next) => {
    const users = await User.find().select("-password -__v");
    if (!users)
      res.status(500).json({
        status: "error",
        success: false,
      });
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  }),
);
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide user id", 400));
    const checkId = mongoose.isValidObjectId(id);
    if (!checkId) return next(new AppError("privide valid id", 400));

    const user = await User.findById(id).select("-password -__v");
    if (!user) return next(new AppError("no user found with that id", 404));
    res.status(200).json({
      status: "success",
      data: { user },
    });
  }),
);
router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide user id", 400));
    const checkId = mongoose.isValidObjectId(id);
    if (!checkId) return next(new AppError("provide valid id", 400));

    const user = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: await bcrypt.hash(req.body.password, 12),
        confirmPassword: req.body.confirmPassword,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
      },
      {
        new: true,
      },
    ).select("-password -__v");
    if (!user) return next(new AppError("no user found with that id", 404));

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }),
);
router.put(
  "/:id/updateMe",
  catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword)
      return next(
        new AppError(
          "can't update password here, go to update password route",
          400,
        ),
      );

    if (req.body.isAdmin)
      return next(new AppError("not allowed to change your role", 403));
    const { id } = req.params;
    if (!id) return next(new AppError("provide user id", 400));
    const checkId = mongoose.isValidObjectId(id);
    if (!checkId) return next(new AppError("provide valid id", 400));
    const user = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      },
      { new: true },
    ).select("-password -__v");
    if (!user) return next(new AppError("no user found with that id", 404));
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }),
);
router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide user id", 400));
    const checkId = mongoose.isValidObjectId(id);
    if (!checkId) return next(new AppError("provide valid id", 400));
    const user = await User.findByIdAndDelete(id).select("-password -__v");
    if (!user) return next(new AppError("no user found with that id", 404));
    res.status(200).json({
      status: "success",
      data: {
        deletedUser: user,
      },
    });
  }),
);
router.post(
  "/login",
  catchAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.password)
      return next(new AppError("provide email or password", 400));
    const { email, password } = req.body;
    //1- get user based on it's email
    const user = await User.findOne({ email });
    //2- compare passwords
    if (!user || !(await user.comparePasswords(password, user.password)))
      return next(new AppError("invaild email or password", 500));
    //3- allow user authentication give him (jwt)
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRESIN,
      },
    );
    createTokenAndSendCookie(user, res);
    //4- send response
    res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  }),
);
module.exports = router;
