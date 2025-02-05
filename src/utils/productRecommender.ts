import { type UIProduct } from "../types/product";

export interface MatchScore {
  exact: number; // Direct matches (0-1)
  semantic: number; // Meaning matches (0-1)
  context: number; // Use case relevance (0-1)
  technical: number; // Feature matches (0-1)
  final: number; // Weighted combination (0-10)
}

// Need to declare this for price comparisons
const uiProducts: UIProduct[] = [];

// Query type detection
const detectQueryType = (
  query: string
): "direct" | "useCase" | "priceRange" | "combined" => {
  const pricePatterns = [
    /under \$\d+/i,
    /less than \$\d+/i,
    /cheaper than \$\d+/i,
    /affordable/i,
    /budget/i,
    /cheap/i,
    /expensive/i,
    /premium/i,
    /cheapest/i,
    /most expensive/i,
  ];

  const useCasePatterns = [
    /for (gaming|work|music|travel|home|office)/i,
    /good for/i,
    /best for/i,
    /recommend for/i,
  ];

  const hasPrice = pricePatterns.some((pattern) => pattern.test(query));
  const hasUseCase = useCasePatterns.some((pattern) => pattern.test(query));

  if (hasPrice && hasUseCase) return "combined";
  if (hasPrice) return "priceRange";
  if (hasUseCase) return "useCase";
  return "direct";
};

// Enhanced synonym matching
const findSynonyms = (word: string): string[] => {
  const synonymMap: Record<string, string[]> = {
    // Product types
    headphones: [
      "headphone",
      "headset",
      "earphones",
      "earbuds",
      "audio device",
      "audio",
      "sound",
      "listening device",
      "cordless audio",
      "cordless",
    ],
    keyboard: ["keyboards", "typing", "keys", "input device", "mechanical"],
    laptop: [
      "notebook",
      "computer",
      "ultrabook",
      "pc",
      "device",
      "computing",
      "workstation",
    ],
    speaker: ["speakers", "audio", "sound system", "sound", "music"],
    camera: ["cameras", "security cam", "webcam", "surveillance"],
    display: ["screen", "monitor", "display", "hub"],
    charger: ["charging", "power adapter", "power supply", "power", "charge"],
    powerbank: ["battery pack", "portable charger", "power bank", "battery"],

    // Features
    wireless: ["cordless", "bluetooth", "wire-free", "no wires", "wifi"],
    portable: ["mobile", "travel", "carry", "lightweight", "compact"],
    gaming: ["game", "gamer", "games", "play", "rgb"],
    professional: ["pro", "work", "business", "office", "premium"],
    premium: ["high-end", "quality", "luxury", "top", "professional", "best"],

    // Use cases
    music: ["audio", "sound", "listening", "songs", "entertainment"],
    work: ["office", "professional", "business", "productivity", "desk"],
    travel: ["portable", "journey", "trip", "commute", "mobile"],
    home: ["house", "domestic", "residential", "indoor", "smart home"],
    security: ["monitoring", "surveillance", "protection", "safety"],
    accessories: ["accessory", "addon", "peripheral", "extra"],
    audio: ["sound", "music", "listening", "headphones", "speakers"],
  };

  return synonymMap[word.toLowerCase()] || [];
};

// Price range parsing
const parsePriceRange = (query: string): { min: number; max: number } => {
  const priceMatch = query.match(/\$(\d+)/);

  // Handle explicit price ranges
  if (priceMatch) {
    const price = parseInt(priceMatch[1]);
    if (/under|less than|cheaper than/.test(query)) {
      return { min: 0, max: price };
    }
    return { min: price * 0.8, max: price * 1.2 }; // 20% flexibility
  }

  // Handle special price queries
  if (query.includes("cheapest") || query.includes("most affordable")) {
    return { min: 0, max: Infinity }; // Will sort by price later
  }
  if (query.includes("most expensive")) {
    return { min: 0, max: Infinity }; // Will sort by price later
  }
  if (
    query.includes("budget") ||
    query.includes("cheap") ||
    query.includes("affordable")
  ) {
    return { min: 0, max: 100 };
  }
  if (query.includes("premium") || query.includes("expensive")) {
    return { min: 500, max: Infinity };
  }

  return { min: 0, max: Infinity };
};

// Utility functions for text processing
const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
};

const calculateExactMatch = (
  query: string[],
  product: UIProduct,
  queryType: ReturnType<typeof detectQueryType>
): number => {
  let score = 0;
  const searchableText = [
    product.name.toLowerCase(),
    product.description.toLowerCase(),
    ...product.features,
    ...product.useCases,
    product.brand.toLowerCase(),
    product.model.toLowerCase(),
  ].join(" ");

  // Direct product type matching gets highest weight
  const productTypeMatch = query.some(
    (term) =>
      product.name.toLowerCase().includes(term) ||
      product.category.includes(term)
  );
  if (productTypeMatch) score += 2;

  // Other matches
  query.forEach((term) => {
    if (searchableText.includes(term)) score += 0.5;

    // Check synonyms with higher weight for product type matches
    const synonyms = findSynonyms(term);
    if (synonyms.some((syn) => product.name.toLowerCase().includes(syn))) {
      score += 0.5; // Higher weight for product name matches
    } else if (synonyms.some((syn) => searchableText.includes(syn))) {
      score += 0.3;
    }
  });

  // Normalize score
  return Math.min(score / (queryType === "direct" ? 2 : 3), 1);
};

const calculateSemanticMatch = (
  query: string[],
  product: UIProduct,
  queryType: ReturnType<typeof detectQueryType>
): number => {
  let score = 0;
  const searchableText = [
    product.name.toLowerCase(),
    product.description.toLowerCase(),
    ...product.features,
    ...product.useCases,
    product.brand.toLowerCase(),
    product.model.toLowerCase(),
    product.category,
  ].join(" ");

  query.forEach((term) => {
    // Check direct term and its synonyms
    const allTerms = [term, ...findSynonyms(term)];
    const matchCount = allTerms.filter((t) =>
      searchableText.includes(t)
    ).length;
    score += matchCount * 0.3;

    // Extra weight for category matches
    if (allTerms.some((t) => product.category.includes(t))) {
      score += 0.5;
    }
  });

  // Normalize score
  return Math.min(score / (queryType === "useCase" ? 2 : 3), 1);
};

const calculateContextMatch = (
  query: string[],
  product: UIProduct,
  queryType: ReturnType<typeof detectQueryType>
): number => {
  let score = 0;
  const queryText = query.join(" ");

  // Use case matching
  product.useCases.forEach((useCase: string) => {
    const useCaseTerms = [useCase, ...findSynonyms(useCase)];
    if (useCaseTerms.some((term) => queryText.includes(term))) {
      score += 0.5;
    }
  });

  // Price range matching with strict filtering
  const priceRange = parsePriceRange(queryText);
  const isInPriceRange =
    product.price >= priceRange.min && product.price <= priceRange.max;

  if (queryType === "priceRange") {
    if (isInPriceRange) {
      // Special handling for edge cases
      if (queryText.includes("cheapest")) {
        score +=
          product.price ===
          Math.min(...uiProducts.map((p: UIProduct) => p.price))
            ? 2
            : 0;
      } else if (queryText.includes("most expensive")) {
        score +=
          product.price ===
          Math.max(...uiProducts.map((p: UIProduct) => p.price))
            ? 2
            : 0;
      } else {
        // For normal price ranges, prefer products using 70-90% of max price
        const priceRatio = product.price / priceRange.max;
        score += priceRatio >= 0.7 && priceRatio <= 0.9 ? 1 : 0.5;
      }
    } else {
      score -= 2; // Increased penalty for products outside price range
    }
  } else if (isInPriceRange) {
    score += 0.3; // Small boost for matching price range in non-price queries
  }

  // Category relevance with broader matching
  const queryTerms = new Set(queryText.split(" "));
  const isAudioQuery =
    queryTerms.has("audio") ||
    queryTerms.has("sound") ||
    queryTerms.has("music") ||
    queryTerms.has("headphones") ||
    queryTerms.has("earphones") ||
    queryTerms.has("earbuds");

  if (isAudioQuery && product.category !== "headsets") {
    score -= 1; // Penalize non-audio products for audio queries
  }

  if (queryText.includes(product.category)) {
    score += 0.8; // Increased weight for category matches
  }

  // Normalize score
  return Math.min(Math.max(score, 0), 1); // Ensure score is between 0 and 1
};

const calculateTechnicalMatch = (
  query: string[],
  product: UIProduct
): number => {
  let score = 0;
  const queryText = query.join(" ");

  // Technical specifications matching
  Object.entries(product.specs.details).forEach(
    ([key, value]: [string, any]) => {
      const specTerms = [key, value.toString()];
      if (specTerms.some((term) => queryText.includes(term))) {
        score += 0.5;
      }
    }
  );

  // Feature matching with synonyms
  product.features.forEach((feature: string) => {
    const featureTerms = [feature, ...findSynonyms(feature)];
    if (featureTerms.some((term) => queryText.includes(term))) {
      score += 1;
    }
  });

  // Normalize score
  return Math.min(
    score /
      (product.features.length + Object.keys(product.specs.details).length),
    1
  );
};

const calculateFinalScore = (
  scores: Omit<MatchScore, "final">,
  queryType: ReturnType<typeof detectQueryType>
): number => {
  // Adjust weights based on query type
  const weights = {
    direct: {
      exact: 0.5,
      semantic: 0.3,
      context: 0.1,
      technical: 0.1,
    },
    useCase: {
      exact: 0.1,
      semantic: 0.3,
      context: 0.5,
      technical: 0.1,
    },
    priceRange: {
      exact: 0.1,
      semantic: 0.1,
      context: 0.7, // Increased for better price matching
      technical: 0.1,
    },
    combined: {
      exact: 0.2,
      semantic: 0.2,
      context: 0.4,
      technical: 0.2,
    },
  };

  const typeWeights = weights[queryType];
  const weightedScore =
    scores.exact * typeWeights.exact +
    scores.semantic * typeWeights.semantic +
    scores.context * typeWeights.context +
    scores.technical * typeWeights.technical;

  // Convert to 0-10 scale
  return weightedScore * 10;
};

export const findRelevantProducts = (
  query: string,
  products: UIProduct[],
  confidenceThreshold = 6.0 // Lowered threshold for better recall
): { products: UIProduct[]; scores: MatchScore[] } => {
  // Update uiProducts for price comparisons
  uiProducts.length = 0;
  uiProducts.push(...products);

  const queryTokens = tokenize(query);
  const queryType = detectQueryType(query);
  const queryText = query.toLowerCase();

  // Pre-filter products based on price for price-specific queries
  let filteredProducts = products;
  if (queryType === "priceRange" || queryText.includes("premium")) {
    const priceRange = parsePriceRange(query);
    filteredProducts = products.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Special handling for premium queries
    if (queryText.includes("premium")) {
      // Ensure we get high-end products
      const premiumThreshold = Math.max(
        500,
        Math.max(...products.map((p) => p.price)) * 0.7
      );
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= premiumThreshold
      );
    }

    // For "most expensive", only return the actual most expensive product
    if (queryText.includes("most expensive")) {
      const maxPrice = Math.max(...filteredProducts.map((p) => p.price));
      filteredProducts = filteredProducts.filter((p) => p.price === maxPrice);
    }
  }

  // Pre-filter products based on category and specific terms
  const isPersonalAudioQuery =
    queryText.includes("earbuds") ||
    queryText.includes("earphones") ||
    queryText.includes("headphones") ||
    queryText.includes("cordless") ||
    queryText.includes("commuting");

  const isAudioQuery =
    isPersonalAudioQuery ||
    queryText.includes("audio") ||
    queryText.includes("sound") ||
    (queryText.includes("music") && !queryText.includes("speaker"));

  const isLaptopQuery =
    queryText.includes("laptop") ||
    queryText.includes("notebook") ||
    queryText.includes("computer") ||
    (queryText.includes("premium") && queryText.includes("device"));

  const isDisplayQuery =
    queryText.includes("display") ||
    queryText.includes("screen") ||
    queryText.includes("monitor");

  // Apply category filters
  if (isAudioQuery) {
    // For personal audio queries, only return headphones
    if (isPersonalAudioQuery) {
      const headphones = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes("headphone") ||
          p.category === "headsets"
      );
      // If we found headphones, use them, otherwise fall back to all audio devices
      if (headphones.length > 0) {
        filteredProducts = headphones;
      } else {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === "headsets"
        );
      }
    } else {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === "headsets"
      );
    }
  } else if (isLaptopQuery) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === "computers"
    );
  } else if (isDisplayQuery && isLaptopQuery) {
    // If query mentions both display and laptop, prioritize laptops
    filteredProducts = filteredProducts.filter(
      (p) => p.category === "computers"
    );
  }

  const productsWithScores = filteredProducts.map((product) => {
    const scores: Omit<MatchScore, "final"> = {
      exact: calculateExactMatch(queryTokens, product, queryType),
      semantic: calculateSemanticMatch(queryTokens, product, queryType),
      context: calculateContextMatch(queryTokens, product, queryType),
      technical: calculateTechnicalMatch(queryTokens, product),
    };

    const finalScore = calculateFinalScore(scores, queryType);

    // Apply additional score adjustments
    let adjustedScore = finalScore;

    // Boost scores for exact category matches
    if (queryText.includes(product.category)) {
      adjustedScore *= 1.2;
    }

    // Boost scores for premium products in premium queries
    if (queryText.includes("premium") && product.price >= 500) {
      adjustedScore *= 1.3;
    }

    // Boost scores for voice control and smart home integration
    if (
      (queryText.includes("voice control") ||
        queryText.includes("smart home integration")) &&
      (product.features.includes("voice control") ||
        product.description.toLowerCase().includes("voice control"))
    ) {
      adjustedScore *= 1.4;
    }

    // Boost scores for personal audio devices in relevant queries
    if (
      isPersonalAudioQuery &&
      product.name.toLowerCase().includes("headphone")
    ) {
      adjustedScore *= 1.5;
    }

    return {
      product,
      score: {
        ...scores,
        final: adjustedScore,
      },
    };
  });

  // Special handling for price-based queries
  if (queryType === "priceRange") {
    if (query.includes("cheapest")) {
      productsWithScores.sort((a, b) => a.product.price - b.product.price);
    } else if (query.includes("most expensive")) {
      productsWithScores.sort((a, b) => b.product.price - a.product.price);
    }
  }

  // Filter by confidence threshold and sort by score
  const filteredAndSorted = productsWithScores
    .filter((item) => item.score.final >= confidenceThreshold)
    .sort((a, b) => b.score.final - a.score.final)
    .slice(0, 3);

  // For certain queries, limit to top result only
  if (
    queryText.includes("most expensive") ||
    queryText.includes("cheapest") ||
    isPersonalAudioQuery
  ) {
    return {
      products: filteredAndSorted.slice(0, 1).map((item) => item.product),
      scores: filteredAndSorted.slice(0, 1).map((item) => item.score),
    };
  }

  return {
    products: filteredAndSorted.map((item) => item.product),
    scores: filteredAndSorted.map((item) => item.score),
  };
};
