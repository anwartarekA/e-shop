const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const AppError = require("./../helpers/appError");
const catchAsync = require("./../helpers/catchAsync");
const { Category } = require("./../models/category");
router.post(
  "/",
  catchAsync(async (req, res, next) => {
    const newCategory = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    await newCategory.save();
    res.status(201).json({
      status: "success",
      newCategory,
    });
  }),
);
router.get(
  `/`,
  catchAsync(async (req, res, next) => {
    const categories = await Category.find();

    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  }),
);
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide id", 400));
    const validId = mongoose.isValidObjectId(id);
    if (!validId) return next(new AppError("not valid id", 400));

    const category = await Category.findById(id);
    res.status(200).json({
      status: "success",
      category: cat,
    });
  }),
);
router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide id", 400));
    const validId = mongoose.isValidObjectId(id);
    if (!validId) return next(new AppError("not valid id", 400));
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true },
    );
    res.status(200).json({
      status: "success",
      category,
    });
  }),
);
router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide id", 400));
    const validId = mongoose.isValidObjectId(id);
    if (!validId) return next(new AppError("not valid id", 400));
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return next(new AppError("no category found with that id", 400));
    res.status(200).json({
      status: "success",
      deletedCategory: category,
    });
  }),
);
module.exports = router;
