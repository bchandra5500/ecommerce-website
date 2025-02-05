import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import {
  CommandLineIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ChevronDownIcon,
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
    const categories = [...new Set(results.products.map((p) => p.category))];
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

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

    const results = findRelevantProducts(inputValue, products);
    const response = generateResponse(inputValue, results);

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
        const uiProducts = mongoProducts.map(convertMongoToUIProduct);
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

  return (
    <div className="fixed bottom-4 right-4 font-[system-ui]">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-[450px] h-[85vh] flex flex-col border border-gray-200 animate-in slide-in-from-bottom-3 duration-300">
          <div className="bg-gradient-to-r from-indigo-600/90 to-blue-700/90 backdrop-blur-lg text-white p-4 flex items-center gap-3 rounded-t-2xl relative border-b border-white/10">
            <SparklesIcon className="h-6 w-6 text-blue-200" />
            <div>
              <h3 className="font-bold text-lg tracking-tight">TechVaultGPT</h3>
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
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${message.isUser ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block max-w-[85%] p-4 rounded-2xl ${
                    message.isUser
                      ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-br-none shadow-lg"
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
                  <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap font-[450] tracking-[0.01em]">
                    {message.text}
                  </p>
                  {message.products && message.products.length > 0 && (
                    <div className="mt-4 space-y-4">
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
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3 mt-3">
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
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-sm py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 font-medium"
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
              <div className="flex items-start space-x-2">
                <div className="bg-white/80 backdrop-blur-sm text-gray-800 shadow-md rounded-2xl rounded-bl-none border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/30">
                    <SparklesIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">
                      TechVaultGPT
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {typingText}
                    </p>
                    <span className="animate-pulse">▋</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm"
          >
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask me about our tech products..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm py-3 pl-4 pr-12 text-[0.9375rem] leading-6 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  rows={1}
                  style={{ maxHeight: "150px" }}
                />
                <div className="absolute right-3 bottom-3">
                  <button
                    type="submit"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    disabled={!inputValue.trim()}
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600/90 to-blue-700/90 rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative animate-in fade-in slide-in-from-bottom-3"
        >
          <SparklesIcon className="h-6 w-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      )}
    </div>
  );
}
