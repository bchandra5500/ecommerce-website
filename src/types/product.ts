// Base product interface with common fields
export interface BaseProduct {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

// MongoDB specific
export interface MongoProduct extends BaseProduct {
  _id: string;
  specs: Record<string, string>;
}

// UI specific
export interface UIProduct extends BaseProduct {
  id: number;
  features: string[];
  useCase: string[];
}

// Enhanced with metadata for recommendations
export interface ProductMetadata {
  semanticTags: string[];
  category: {
    primary: string;
    secondary: string[];
  };
  useCases: Array<{
    name: string;
    confidence: number;
  }>;
  technicalSpecs: Record<string, string | number>;
}

export interface EnhancedProduct extends UIProduct {
  metadata: ProductMetadata;
}

// Conversion functions
export function convertMongoToUIProduct(product: MongoProduct): UIProduct {
  // Convert MongoDB _id to a number by using a hash of the string
  const hashId = product._id.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Convert specs to features and useCase arrays
  const features = Object.entries(product.specs)
    .filter(([key]) => !key.toLowerCase().includes("use"))
    .map(([_, value]) => value);

  const useCase = Object.entries(product.specs)
    .filter(([key]) => key.toLowerCase().includes("use"))
    .map(([_, value]) => value);

  return {
    id: Math.abs(hashId),
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    features,
    useCase,
  };
}

export function convertUIToMongoProduct(
  product: UIProduct
): Omit<MongoProduct, "_id"> {
  // Combine features and useCase into specs
  const specs: Record<string, string> = {};

  product.features.forEach((feature, index) => {
    specs[`feature${index + 1}`] = feature;
  });

  product.useCase.forEach((use, index) => {
    specs[`useCase${index + 1}`] = use;
  });

  return {
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    specs,
  };
}

export function convertUIToEnhancedProduct(
  product: UIProduct
): EnhancedProduct {
  // Create metadata from product information
  const metadata: ProductMetadata = {
    semanticTags: [...product.features, ...product.useCase],
    category: {
      primary: product.category,
      secondary: [],
    },
    useCases: product.useCase.map((use) => ({
      name: use,
      confidence: 1.0,
    })),
    technicalSpecs: {},
  };

  return {
    ...product,
    metadata,
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
