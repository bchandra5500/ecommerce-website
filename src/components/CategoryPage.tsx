import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { MongoProduct } from "../types/product";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<MongoProduct[]>([]);
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
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-80 bg-white p-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
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
                      <span className="font-medium">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
