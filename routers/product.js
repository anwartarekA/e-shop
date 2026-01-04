const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const AppError = require("./../helpers/appError");
const catchAsync = require("./../helpers/catchAsync");
const { Product } = require("./../models/product");
const { Category } = require("./../models/category");
const multer = require("multer");
const storage = require("./../helpers/upload");
const isAdmin = require("./../helpers/isadmin");
const upload = multer({
  storage: storage,
});
router.post(
  "/",
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  catchAsync(async (req, res, next) => {
    // http://localhost:3000/public/uploads/adasdjask
    let path, paths;
    if (req.files["image"])
      path = `${req.protocol}://${req.get("host")}/${req.files["image"][0].path}`;

    if (req.files["images"])
      paths = req.files["images"].map(
        (file) => `${req.protocol}://${req.get("host")}/${file.path}`,
      );
    const checkCategoryId = mongoose.isValidObjectId(req.body.category);
    if (!checkCategoryId)
      return next(new AppError("not valid category id", 400));
    const category = await Category.findById(req.body.category);
    if (!category)
      return next(new AppError("no category found with that id", 404));
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      amountInStock: req.body.amountInStock,
      description: req.body.description,
      image: path,
      images: paths,
      richDescription: req.body.richDescription,
      category: req.body.category,
      brand: req.body.brand,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });
    await newProduct.save();

    res.status(201).json({
      status: "success",
      newProduct,
    });
  }),
);
router.get(
  `/`,
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.query) {
      Object.keys(req.query).forEach((key) => {
        if (key === "category") filter[key] = req.query.category.split(",");
        else filter[key] = req.query[key];
      });
    }
    const products = await Product.find(filter).populate("category");
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  }),
);
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return next(new AppError("provide product id", 400));
    if (!mongoose.isValidObjectId(id))
      return next(new AppError("product id is not valid", 500));
    const product = await Product.findById(id).populate("category");
    if (!product)
      return next(new AppError("no product found with that id", 404));
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }),
);
router.put(
  "/:id",
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide product id", 400));
    if (!mongoose.isValidObjectId(id))
      return next(new AppError("product id is not valid", 500));
    let path, paths;
    if (req.files["image"])
      path = `${req.protocol}://${req.get("host")}/${req.files["image"][0].path}`;

    if (req.files["images"])
      paths = req.files["images"].map(
        (file) => `${req.protocol}://${req.get("host")}/${file.path}`,
      );
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        price: req.body.price,
        amountInStock: req.body.amountInStock,
        description: req.body.description,
        image: path,
        images: paths,
        richDescription: req.body.richDescription,
        category: req.body.category,
        brand: req.body.brand,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true },
    );
    if (!updatedProduct)
      return next(new AppError("no product found with that id", 404));
    res.status(200).json({
      status: "success",
      product: updatedProduct,
    });
  }),
);
router.delete(
  "/:id",
  isAdmin,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide product id", 400));
    if (!mongoose.isValidObjectId(id))
      return next(new AppError("product id is not valid", 500));

    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      deletedProduct: product,
    });
  }),
);
router.get(
  "/get/count",
  catchAsync(async (req, res, next) => {
    const productCounts = await Product.countDocuments();
    res.status(200).json({
      status: "success",
      count: productCounts,
    });
  }),
);
router.get(
  "/get/featured",
  catchAsync(async (req, res, next) => {
    const featuredProducts = await Product.find({ isFeatured: true });
    res.status(200).json({
      status: "success",
      data: featuredProducts,
    });
  }),
);
router.get(
  "/get/featured/:count",
  catchAsync(async (req, res, next) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true })
      .populate("category")
      .limit(+count);
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  }),
);
module.exports = router;
