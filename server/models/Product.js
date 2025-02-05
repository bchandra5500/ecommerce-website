import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  category: {
    type: String,
    required: true,
    enum: ["phones", "computers", "headsets", "accessories"],
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "discontinued", "coming_soon"],
    default: "active",
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  specs: {
    type: {
      common: {
        releaseYear: Number,
        warranty: String,
      },
      details: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    required: true,
  },
  metadata: {
    type: {
      features: [String],
      useCases: [String],
      tags: [String],
      ratings: {
        average: {
          type: Number,
          default: 0,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      searchKeywords: [String],
    },
    required: true,
  },
});

// Update lastUpdated on every save
productSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
