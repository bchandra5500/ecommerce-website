import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import {
  CommandLineIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { findRelevantProducts } from "../utils/productRecommender";
import type { MatchScore } from "../utils/productRecommender";
import {
  UIProduct,
  MongoProduct,
  convertMongoToUIProduct,
} from "../types/product";

interface Message {
  text: string;
  isUser: boolean;
  products?: UIProduct[];
  scores?: MatchScore[];
}

const WELCOME_MESSAGE = {
  text: `👋 Welcome to TechVaultGPT!

I'm your AI shopping assistant, powered by advanced machine learning to help you discover the perfect tech products. I can:

• Find products based on your specific needs
• Compare different options
• Provide personalized recommendations
• Answer questions about our catalog

Try asking something like:
"Find me a gaming laptop under $2000"
"What's the best noise-cancelling headphone?"
"I need a powerful computer for video editing"`,
  isUser: false,
};

const TYPING_MESSAGES = [
  "Analyzing your request...",
  "Searching product database...",
  "Calculating recommendations...",
  "Processing results...",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const typingIndex = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addToCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  const generateResponse = (
    query: string,
    results: ReturnType<typeof findRelevantProducts>
  ): string => {
    if (results.products.length === 0) {
      return "I couldn't find any products that closely match your requirements. Could you please provide more details about what you're looking for? For example, what specific features or use cases are most important to you?";
    }

    const topScore = results.scores[0].final;
    const isHighConfidence = topScore >= 8.5;
    const isMediumConfidence = topScore >= 7.5 && topScore < 8.5;

    // Get unique categories from results
    const categories = [...new Set(results.products.map((p) => p.category))];

    // Get key features mentioned in query
    const queryTokens = query.toLowerCase().split(" ");
    const mentionedFeatures = results.products[0].features.filter((f) =>
      queryTokens.some((token) => f.toLowerCase().includes(token))
    );

    if (isHighConfidence) {
      if (mentionedFeatures.length > 0) {
        return `I've found some excellent matches that specifically include ${mentionedFeatures.join(
          ", "
        )}. Here are the best options based on your requirements:`;
      }
      return `I've found some highly relevant ${categories.join(
        " and "
      )} products that perfectly match your needs:`;
    }

    if (isMediumConfidence) {
      return `Here are some products that align with your requirements. Each one offers different features that might interest you:`;
    }

    return `I've found some products that might be relevant to your needs. Take a look at these options:`;
  };

  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5002/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const mongoProducts: MongoProduct[] = await response.json();
        console.log(
          "MongoDB Products:",
          JSON.stringify(mongoProducts, null, 2)
        );
        const uiProducts = mongoProducts.map(convertMongoToUIProduct);
        console.log(
          "Converted UI Products:",
          JSON.stringify(uiProducts, null, 2)
        );
        setProducts(uiProducts);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);

    if (loading) {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm still loading the product catalog. Please try again in a moment.",
          isUser: false,
        },
      ]);
      return;
    }

    if (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm having trouble accessing the product catalog. Please try again later.",
          isUser: false,
        },
      ]);
      return;
    }

    console.log("Current products state:", JSON.stringify(products, null, 2));
    console.log("User query:", inputValue);

    // Find relevant products with scores
    const results = findRelevantProducts(inputValue, products);
    console.log("Search results:", JSON.stringify(results, null, 2));

    // Generate appropriate response
    const response = generateResponse(inputValue, results);
    console.log("Generated response:", JSON.stringify(response, null, 2));

    // Show typing animation
    setIsTyping(true);
    typingIndex.current = 0;
    const randomTyping =
      TYPING_MESSAGES[Math.floor(Math.random() * TYPING_MESSAGES.length)];
    const typingInterval = setInterval(() => {
      if (typingIndex.current < randomTyping.length) {
        setTypingText(randomTyping.slice(0, typingIndex.current + 1));
        typingIndex.current++;
      } else {
        clearInterval(typingInterval);
        // Add bot response after typing animation
        setTimeout(() => {
          setIsTyping(false);
          setTypingText("");
          setMessages((prev) => [
            ...prev,
            {
              text: response,
              isUser: false,
              products: results.products,
              scores: results.scores,
            },
          ]);
        }, 500);
      }
    }, 25);

    setInputValue("");
  };

  const handleAddToCart = (product: UIProduct) => {
    addToCart(product);

    // Find similar products for recommendation
    const similarResults = findRelevantProducts(
      product.features.join(" ") + " " + product.useCases.join(" "),
      products.filter((p: UIProduct) => p.id !== product.id)
    );

    setMessages((prev) => [
      ...prev,
      {
        text: `✅ Great choice! I've added the ${product.name} to your cart. ${
          similarResults.products.length > 0
            ? "You might also be interested in these similar products:"
            : ""
        }`,
        isUser: false,
        products: similarResults.products,
        scores: similarResults.scores,
      },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-[450px] h-[85vh] flex flex-col border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-4 flex items-center gap-3 rounded-t-2xl relative">
            <SparklesIcon className="h-6 w-6 text-blue-200" />
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                TechVaultGPT
                <span className="bg-blue-200/20 text-xs px-2 py-0.5 rounded-full">
                  Beta
                </span>
              </h3>
              <p className="text-xs text-blue-200 flex items-center gap-1">
                <RocketLaunchIcon className="h-3 w-3" />
                AI Shopping Assistant
              </p>
            </div>
            <div className="absolute right-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-200">Online</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <ChevronDownIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.isUser ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[85%] p-4 rounded-2xl ${
                    message.isUser
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-800 shadow-md rounded-bl-none border border-gray-100"
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/30">
                      <SparklesIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">
                        TechVaultGPT
                      </span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.products.map((product, idx) => (
                        <div
                          key={product.id}
                          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02]"
                        >
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              {message.scores && (
                                <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <SparklesIcon className="h-3 w-3" />
                                  {Math.round(message.scores[idx].final * 10) /
                                    10}
                                  /10
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <p className="font-semibold text-gray-800 text-base">
                                  {product.name}
                                </p>
                                <p className="text-base font-bold text-blue-600">
                                  ${product.price.toFixed(2)}
                                </p>
                              </div>
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {product.features
                                .slice(0, 3)
                                .map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100/50 transition-colors hover:bg-blue-100"
                                  >
                                    {feature}
                                  </span>
                                ))}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white text-sm py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                              <span>Add to Cart</span>
                              <RocketLaunchIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start space-x-2 mb-4">
                <div className="bg-white/80 backdrop-blur-sm text-gray-800 shadow-md rounded-2xl rounded-bl-none border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/30">
                    <SparklesIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">
                      TechVaultGPT
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">{typingText}</p>
                    <span className="animate-pulse">▋</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200"
          >
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <CommandLineIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message TechVaultGPT..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[45px] max-h-[120px] transition-all duration-200"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-2.5 rounded-xl hover:from-indigo-700 hover:to-blue-800 transition-all transform hover:scale-105 self-end flex items-center gap-2"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
