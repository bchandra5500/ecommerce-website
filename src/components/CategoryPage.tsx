import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import {
  MongoProduct,
  convertMongoToUIProduct,
  UIProduct,
} from "../types/product";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5002/api/products/category/${category}`
        );
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
  }, [category]);

  const handleAddToCart = (product: UIProduct) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {category === "all" ? "All Products" : category}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            <div className="h-80 bg-white p-4 flex items-center justify-center relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.status === "coming_soon" && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Coming Soon
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {product.brand} {product.model}
                  </p>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center mt-1 mb-2">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating.average.toFixed(1)} ({product.rating.count})
                  </span>
                </div>
                <span className="mx-2">•</span>
                <span className="text-sm text-gray-600">
                  {product.specs.common.warranty}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Common Specifications:</h3>
                <ul className="text-sm text-gray-600">
                  <li className="mb-1">
                    <span className="font-medium">Release Year:</span>{" "}
                    {product.specs.common.releaseYear}
                  </li>
                  <li className="mb-1">
                    <span className="font-medium">Warranty:</span>{" "}
                    {product.specs.common.warranty}
                  </li>
                </ul>

                <h3 className="font-semibold mb-2 mt-4">
                  Detailed Specifications:
                </h3>
                <ul className="text-sm text-gray-600">
                  {Object.entries(product.specs.details).map(([key, value]) => (
                    <li key={key} className="mb-1">
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>{" "}
                      {value}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.status === "coming_soon"}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      product.status === "coming_soon"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {product.status === "coming_soon"
                      ? "Coming Soon"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
