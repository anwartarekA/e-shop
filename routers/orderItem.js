const express = require("express");
const router = express.Router();
const { OrderItem } = require("./../models/orderItems");
router.post("/", (req, res) => {
  const newOrderItem = new OrderItem({
    name: req.body.name,
  });
  newOrderItem
    .save()
    .then(() =>
      res.status(201).json({
        status: "success",
        newOrderItem,
      }),
    )
    .catch((err) =>
      res.status(500).json({
        status: "fail",
        success: false,
      }),
    );
});
router.get(`/`, async (req, res) => {
  const OrderItems = await OrderItem.find();
  res.send(OrderItems);
});
module.exports = router;
