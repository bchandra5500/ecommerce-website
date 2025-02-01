import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { findRelevantProducts } from "../utils/productRecommender";
import { enhancedProducts } from "../utils/productData";
import type { MatchScore } from "../utils/productRecommender";

interface Message {
  text: string;
  isUser: boolean;
  products?: (typeof enhancedProducts)[number][];
  scores?: MatchScore[];
}

const WELCOME_MESSAGE = {
  text: "👋 Hi! I'm your TechVault assistant powered by Bharat.AI. I can help you find the perfect tech products, answer questions about our catalog, and provide personalized recommendations. How can I assist you today?",
  isUser: false,
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
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
    const categories = [
      ...new Set(results.products.map((p) => p.metadata.category.primary)),
    ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);

    // Find relevant products with scores
    const results = findRelevantProducts(inputValue, enhancedProducts);

    // Generate appropriate response
    const response = generateResponse(inputValue, results);

    // Add bot response
    setMessages((prev) => [
      ...prev,
      {
        text: response,
        isUser: false,
        products: results.products,
        scores: results.scores,
      },
    ]);

    setInputValue("");
  };

  const handleAddToCart = (product: (typeof enhancedProducts)[number]) => {
    addToCart(product);

    // Find similar products for recommendation
    const similarResults = findRelevantProducts(
      product.metadata.semanticTags.join(" ") +
        " " +
        product.features.join(" "),
      enhancedProducts.filter((p) => p.id !== product.id)
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
    <div className="chat-widget">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105"
        >
          <ChatBubbleLeftIcon className="h-6 w-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[32rem] flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center rounded-t-lg">
            <div>
              <h3 className="font-bold text-lg">TechVault Assistant</h3>
              <p className="text-xs text-blue-100">Powered by Bharat.AI</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.isUser ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-md rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.products.map((product, idx) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-semibold text-gray-800">
                                {product.name}
                              </p>
                              {message.scores && (
                                <span className="text-xs text-gray-500">
                                  Match:{" "}
                                  {Math.round(message.scores[idx].final * 10) /
                                    10}
                                  /10
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              ${product.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">
                              {product.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.features
                                .slice(0, 3)
                                .map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-blue-600 text-white text-sm py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about our products..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[40px] max-h-[120px] transition-all duration-200"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105 self-end"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
