import React from "react";
import { useCart, type Product } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const products: Product[] = [
  {
    id: 1,
    name: "Pro Wireless Headphones",
    price: 299.99,
    description: "Premium noise-cancelling headphones with spatial audio",
    image: "/images/products/headphones.jpg",
    category: "tech",
    features: [
      "wireless",
      "noise-cancelling",
      "spatial audio",
      "premium",
      "bluetooth",
    ],
    useCase: ["music", "travel", "work", "commute"],
  },
  {
    id: 2,
    name: "SmartFit Watch Pro",
    price: 249.99,
    description: "Advanced fitness tracking with health monitoring",
    image: "/images/products/smartwatch.jpg",
    category: "tech",
    features: [
      "fitness tracking",
      "heart rate",
      "gps",
      "water resistant",
      "sleep tracking",
    ],
    useCase: ["fitness", "health", "sports", "daily wear"],
  },
  {
    id: 3,
    name: "UltraBook X1",
    price: 1299.99,
    description: "Ultra-thin laptop with 4K display and all-day battery",
    image: "/images/products/laptop.jpg",
    category: "tech",
    features: ["4K display", "thin", "lightweight", "powerful", "long battery"],
    useCase: ["work", "productivity", "creative", "professional"],
  },
  {
    id: 4,
    name: "HomeHub Speaker",
    price: 199.99,
    description: "Smart speaker with room-filling sound and voice control",
    image: "/images/products/speaker.jpg",
    category: "smart-home",
    features: ["voice control", "smart home", "high quality audio", "wireless"],
    useCase: ["music", "home", "entertainment"],
  },
  {
    id: 5,
    name: "SecureView Pro",
    price: 179.99,
    description: "1080p security camera with night vision and two-way audio",
    image: "/images/products/camera.jpg",
    category: "smart-home",
    features: ["1080p", "night vision", "two-way audio", "motion detection"],
    useCase: ["security", "monitoring", "home"],
  },
  {
    id: 6,
    name: "SmartDisplay Hub",
    price: 149.99,
    description: "7-inch display for smart home control and video calls",
    image: "/images/products/display.jpg",
    category: "smart-home",
    features: [
      "touch screen",
      "video calls",
      "smart home control",
      "voice control",
    ],
    useCase: ["communication", "home control", "entertainment"],
  },
  {
    id: 7,
    name: "PowerMat Pro",
    price: 59.99,
    description: "Fast wireless charging pad with multi-device support",
    image: "/images/products/charger.jpg",
    category: "accessories",
    features: ["wireless charging", "fast charging", "multi-device", "compact"],
    useCase: ["charging", "desk", "nightstand"],
  },
  {
    id: 8,
    name: "MechKeys Elite",
    price: 129.99,
    description: "Mechanical keyboard with RGB backlighting",
    image: "/images/products/keyboard.jpg",
    category: "accessories",
    features: ["mechanical", "rgb", "gaming", "tactile"],
    useCase: ["gaming", "typing", "work"],
  },
  {
    id: 9,
    name: "PowerBank 20000",
    price: 49.99,
    description: "20000mAh portable charger with fast charging",
    image: "/images/products/powerbank.jpg",
    category: "accessories",
    features: ["portable", "fast charging", "high capacity", "multi-port"],
    useCase: ["travel", "emergency", "outdoor"],
  },
];

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category") || "all";
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            <div className="relative aspect-w-16 aspect-h-9">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-500/80 text-white px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h2>
                <span className="text-lg font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 capitalize">
                  {product.category}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
