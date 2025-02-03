import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {
  MongoProduct,
  UIProduct,
  convertMongoToUIProduct,
} from "../types/product";

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: MongoProduct[] = await response.json();
        setProducts(data.map(convertMongoToUIProduct));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const category = searchParams.get("category") || "all";
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);

  const handleAddToCart = (product: UIProduct) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            <div className="h-80 bg-white p-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
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
              <div className="flex flex-wrap gap-1 mb-4">
                {product.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-500/80 text-white px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
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
