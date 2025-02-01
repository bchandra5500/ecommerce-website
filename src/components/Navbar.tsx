import React, { useState } from "react";
import { Link } from "react-router-dom";
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
      <div className="bg-blue-900/50 backdrop-blur-sm text-white">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 py-4 text-base overflow-x-auto scrollbar-hide">
            <Link
              to="/?category=all"
              className="whitespace-nowrap hover:text-blue-200 transition-colors border-b-2 border-transparent hover:border-blue-200 py-1"
            >
              All Products
            </Link>
            <Link
              to="/?category=tech"
              className="whitespace-nowrap hover:text-blue-200 transition-colors border-b-2 border-transparent hover:border-blue-200 py-1"
            >
              High-end Tech
            </Link>
            <Link
              to="/?category=smart-home"
              className="whitespace-nowrap hover:text-blue-200 transition-colors border-b-2 border-transparent hover:border-blue-200 py-1"
            >
              Smart Home
            </Link>
            <Link
              to="/?category=accessories"
              className="whitespace-nowrap hover:text-blue-200 transition-colors border-b-2 border-transparent hover:border-blue-200 py-1"
            >
              Accessories
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
