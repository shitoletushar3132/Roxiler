const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  sold: Boolean,
  category: String,
  image: String,
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
