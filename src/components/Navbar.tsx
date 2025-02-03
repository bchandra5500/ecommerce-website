import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search query:", searchQuery);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-white hover:text-blue-100 transition-colors"
          >
            <ComputerDesktopIcon className="h-12 w-12" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold leading-none">TechVault</span>
              <span className="text-lg text-blue-200 font-medium">
                Powered by Bharat.AI
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-2xl mx-12"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-6 py-3 text-lg rounded-lg text-gray-900 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </div>
          </form>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="flex items-center space-x-4 text-white hover:text-blue-100 transition-colors px-4"
          >
            <div className="relative">
              <ShoppingCartIcon className="h-12 w-12" />
              {itemCount > 0 && (
                <span className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-base font-bold animate-bounce">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-lg font-medium">Cart</span>
          </Link>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-blue-900/50 backdrop-blur-sm text-white border-t border-blue-700">
        <div className="container mx-auto px-6">
          <div className="flex justify-between py-6">
            <Link
              to="/"
              className={`text-lg font-medium px-6 py-2 rounded-lg transition-all duration-200 ${
                currentPath === "/"
                  ? "bg-blue-700/50 text-white"
                  : "hover:bg-blue-800/30 text-blue-100"
              }`}
            >
              All Products
            </Link>
            <Link
              to="/category/headsets"
              className={`text-lg font-medium px-6 py-2 rounded-lg transition-all duration-200 ${
                currentPath === "/category/headsets"
                  ? "bg-blue-700/50 text-white"
                  : "hover:bg-blue-800/30 text-blue-100"
              }`}
            >
              Headsets
            </Link>
            <Link
              to="/category/phones"
              className={`text-lg font-medium px-6 py-2 rounded-lg transition-all duration-200 ${
                currentPath === "/category/phones"
                  ? "bg-blue-700/50 text-white"
                  : "hover:bg-blue-800/30 text-blue-100"
              }`}
            >
              Phones
            </Link>
            <Link
              to="/category/computers"
              className={`text-lg font-medium px-6 py-2 rounded-lg transition-all duration-200 ${
                currentPath === "/category/computers"
                  ? "bg-blue-700/50 text-white"
                  : "hover:bg-blue-800/30 text-blue-100"
              }`}
            >
              Computers
            </Link>
            <Link
              to="/category/accessories"
              className={`text-lg font-medium px-6 py-2 rounded-lg transition-all duration-200 ${
                currentPath === "/category/accessories"
                  ? "bg-blue-700/50 text-white"
                  : "hover:bg-blue-800/30 text-blue-100"
              }`}
            >
              Accessories
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
