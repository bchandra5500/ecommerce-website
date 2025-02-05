// Base product interface with common fields
export interface BaseProduct {
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  brand: string;
  model: string;
}

// MongoDB specific product interface
export interface MongoProduct extends BaseProduct {
  _id: string;
  status: "active" | "discontinued" | "coming_soon";
  specs: {
    common: {
      releaseYear: number;
      warranty: string;
    };
    details: Record<string, any>;
  };
  metadata: {
    features: string[];
    useCases: string[];
    tags: string[];
    ratings: {
      average: number;
      count: number;
    };
    searchKeywords: string[];
  };
  dateAdded: string;
  lastUpdated: string;
}

// UI specific product interface
export interface UIProduct extends BaseProduct {
  id: string; // Using MongoDB _id directly
  status: string;
  features: string[];
  useCases: string[];
  rating: {
    average: number;
    count: number;
  };
  specs: {
    common: {
      releaseYear: number;
      warranty: string;
    };
    details: Record<string, any>;
  };
}

// Conversion function from MongoDB to UI format
export function convertMongoToUIProduct(product: MongoProduct): UIProduct {
  return {
    id: product._id,
    name: product.name,
    brand: product.brand,
    model: product.model,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    status: product.status,
    features: product.metadata.features,
    useCases: product.metadata.useCases,
    rating: product.metadata.ratings,
    specs: product.specs,
  };
}

// Valid categories for type checking
export const VALID_CATEGORIES = [
  "phones",
  "computers",
  "headsets",
  "accessories",
] as const;
export type Category = (typeof VALID_CATEGORIES)[number];
