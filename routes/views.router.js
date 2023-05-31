const express = require("express");
const router = express.Router();
const stockPrices = require("../data/stock-price");

router.get("/", (req, res) => {
  res.render("products", {
    title: "Product List",
    styles: ["css/products.css"],
  });
});

router.get("*", (req, res) => {
  res.render("product-detail", {
    title: "Product Detail",
    styles: ["css/product-detail.css"],
  });
});

module.exports = router;
