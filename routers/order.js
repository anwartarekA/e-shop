const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Order } = require("./../models/order");
const { OrderItem } = require("./../models/orderItems");
const { Product } = require("./../models/product");
const catchAsync = require("./../helpers/catchAsync");
const AppError = require("./../helpers/appError");
const isAdmin = require("../helpers/isadmin");
router.post(
  "/",
  isAdmin,
  catchAsync(async (req, res, next) => {
    // const token = req.headers.authorization.split(" ")[1];
    const token = req.headers.cookie.split("=")[1];
    const decoded = jwt.decode(token);
    const { id } = decoded;
    const { orderItems } = req.body;
    const orderItemsIds = await Promise.all(
      orderItems.map(async (orderItem) => {
        const item = await OrderItem.create(orderItem);
        return item._id;
      }),
    );
    const arrayTotalPrices = await Promise.all(
      orderItems.map(async (orderItem) => {
        const product = await Product.findById(orderItem.product).select(
          "price",
        );
        const totalPrice = product.price * orderItem.quantity;
        return totalPrice;
      }),
    );
    const totalPrices = arrayTotalPrices.reduce(
      (acc, current) => acc + current,
      0,
    );
    const newOrder = new Order({
      orderItems: orderItemsIds,
      user: id,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      country: req.body.country,
      city: req.body.city,
      zip: req.body.zip,
      phone: req.body.phone,
      totalPrice: totalPrices,
      status: req.body.status,
    });
    const order = await newOrder.save();
    res.status(201).json({
      status: "success",
      newOrder: order,
    });
  }),
);
router.get(
  `/`,
  catchAsync(async (req, res, next) => {
    const orders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.send(orders);
  }),
);
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide product id", 400));
    if (!mongoose.isValidObjectId(id))
      return next(new AppError("order's id is not valid", 500));
    const order = await Order.findById(id)
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: { path: "category" } },
      })
      .populate("user", "name");
    if (!order) return next(new AppError("no order found with that id", 404));
    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  }),
);
router.put(
  "/:id",
  isAdmin,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide product id", 400));
    if (!mongoose.isValidObjectId(id))
      return next(new AppError("order's id is not valid", 500));
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true },
    );
    if (!updatedOrder)
      return next(new AppError("no order found with that id", 404));
    res.status(200).json({
      status: "success",
      data: {
        updatedOrder,
      },
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
      return next(new AppError("order's id is not valid", 500));
    const deletedOrder = await Order.findByIdAndDelete(id);
    const { orderItems } = deletedOrder;
    await Promise.all(
      orderItems.map(
        async (orderItem) => await OrderItem.findByIdAndDelete(orderItem),
      ),
    );
    if (!deletedOrder)
      return next(new AppError("no order found with that id", 404));
    res.status(200).json({
      status: "success",
      data: {
        deletedOrder,
      },
    });
  }),
);
router.get(
  "/get/count",
  catchAsync(async (req, res, next) => {
    const count = await Order.countDocuments();
    res.status(200).json({ status: "success", count });
  }),
);
router.get(
  "/get/totalSales",
  catchAsync(async (req, res, next) => {
    const orders = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    if (!orders)
      return next(new AppError("the grouping can not be generated", 500));
    res.status(200).json({
      status: "success",
      totalSales: orders.pop().totalSales,
    });
  }),
);
router.get(
  "/get/orders/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("provide valid id", 400));
    if (!mongoose.isValidObjectId(id))
      return next(new AppError("id isn't valid", 400));

    const orders = await Order.find({ user: id });
    if (!orders) return next(new AppError("no orders for this user", 500));
    res.status(200).json({
      status: "success",
      result: orders.length,
      data: {
        orders,
      },
    });
  }),
);
module.exports = router;
