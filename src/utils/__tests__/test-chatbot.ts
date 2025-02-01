import { findRelevantProducts, type MatchScore } from "../productRecommender";
import { enhancedProducts } from "../productData";

interface TestCase {
  category: string;
  query: string;
  expectedProducts: string[];
  description: string;
  matchType: string;
}

const chatbotTestCases: TestCase[] = [
  // Direct Product Queries
  {
    category: "Direct Product",
    query: "wireless headphones",
    expectedProducts: ["Pro Wireless Headphones"],
    description: "Should match exact product type with high confidence",
    matchType: "exact",
  },
  {
    category: "Direct Product",
    query: "earbuds for music",
    expectedProducts: ["Pro Wireless Headphones"],
    description: "Should match synonyms (earbuds -> headphones)",
    matchType: "semantic",
  },

  // Use Case Based Queries
  {
    category: "Use Case",
    query: "best device for gaming",
    expectedProducts: ["MechKeys Elite"],
    description: "Should prioritize products with gaming use case",
    matchType: "context",
  },
  {
    category: "Use Case",
    query: "something for home security",
    expectedProducts: ["SecureView Pro"],
    description: "Should match security use case and context",
    matchType: "context",
  },

  // Technical Specification Queries
  {
    category: "Technical",
    query: "4K display laptop",
    expectedProducts: ["UltraBook X1"],
    description: "Should match technical specifications",
    matchType: "technical",
  },
  {
    category: "Technical",
    query: "mechanical keyboard with RGB",
    expectedProducts: ["MechKeys Elite"],
    description: "Should match multiple technical features",
    matchType: "technical",
  },

  // Price Range Queries
  {
    category: "Price",
    query: "accessories under $100",
    expectedProducts: ["PowerMat Pro", "PowerBank 20000"],
    description: "Should filter by price range and category",
    matchType: "priceRange",
  },
  {
    category: "Price",
    query: "premium laptop",
    expectedProducts: ["UltraBook X1"],
    description: "Should understand premium price context",
    matchType: "priceRange",
  },

  // Combined Queries
  {
    category: "Combined",
    query: "affordable wireless charger for desk",
    expectedProducts: ["PowerMat Pro"],
    description: "Should handle price, feature, and use case",
    matchType: "combined",
  },
  {
    category: "Combined",
    query: "portable charger for travel under $50",
    expectedProducts: ["PowerBank 20000"],
    description: "Should combine price range and use case",
    matchType: "combined",
  },

  // Category Exploration
  {
    category: "Category",
    query: "show me smart home devices",
    expectedProducts: ["HomeHub Speaker", "SecureView Pro", "SmartDisplay Hub"],
    description: "Should return products in smart home category",
    matchType: "semantic",
  },
  {
    category: "Category",
    query: "what audio devices do you have",
    expectedProducts: ["Pro Wireless Headphones", "HomeHub Speaker"],
    description: "Should match primary category audio",
    matchType: "semantic",
  },

  // Feature-based Queries
  {
    category: "Features",
    query: "noise cancelling with long battery life",
    expectedProducts: ["Pro Wireless Headphones"],
    description: "Should match multiple features",
    matchType: "technical",
  },

  // Synonym Matching
  {
    category: "Synonyms",
    query: "notebook for work",
    expectedProducts: ["UltraBook X1"],
    description: "Should match synonyms (notebook -> laptop) with use case",
    matchType: "semantic",
  },

  // Edge Cases
  {
    category: "Edge Cases",
    query: "cheapest product",
    expectedProducts: ["PowerBank 20000"],
    description: "Should handle extreme price queries",
    matchType: "priceRange",
  },
  {
    category: "Edge Cases",
    query: "most expensive tech",
    expectedProducts: ["UltraBook X1"],
    description: "Should handle premium price queries",
    matchType: "priceRange",
  },
];

const runTests = () => {
  console.log("Running Chatbot Test Cases...\n");
  let passed = 0;
  let failed = 0;

  chatbotTestCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.category}`);
    console.log(`Query: "${testCase.query}"`);
    console.log(`Expected Products: ${testCase.expectedProducts.join(", ")}`);

    const results = findRelevantProducts(testCase.query, enhancedProducts);
    const resultNames = results.products.map((p) => p.name);

    // Check if all expected products are in results
    const missingProducts = testCase.expectedProducts.filter(
      (expected) => !resultNames.includes(expected)
    );

    // Check if any unexpected products are in results
    const unexpectedProducts = resultNames.filter(
      (result) => !testCase.expectedProducts.includes(result)
    );

    if (missingProducts.length === 0 && unexpectedProducts.length === 0) {
      console.log("✅ PASSED");
      console.log(
        `Match Scores: ${results.scores
          .map((s) => s.final.toFixed(1))
          .join(", ")}`
      );
      passed++;
    } else {
      console.log("❌ FAILED");
      if (missingProducts.length > 0) {
        console.log(`Missing Products: ${missingProducts.join(", ")}`);
      }
      if (unexpectedProducts.length > 0) {
        console.log(`Unexpected Products: ${unexpectedProducts.join(", ")}`);
      }
      console.log(`Actual Results: ${resultNames.join(", ")}`);
      console.log(
        `Match Scores: ${results.scores
          .map((s) => s.final.toFixed(1))
          .join(", ")}`
      );
      failed++;
    }
    console.log("\n---\n");
  });

  console.log(`Test Summary:`);
  console.log(`Total Tests: ${chatbotTestCases.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(
    `Success Rate: ${((passed / chatbotTestCases.length) * 100).toFixed(1)}%`
  );
};

// Run tests
runTests();
