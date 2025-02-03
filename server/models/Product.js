import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["headsets", "phones", "computers", "accessories"],
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  specs: {
    type: Map,
    of: String,
    default: {},
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
