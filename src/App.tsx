import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCatalog from "./components/ProductCatalog";
import ShoppingCart from "./components/ShoppingCart";
import ChatWidget from "./components/ChatWidget";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ProductCatalog />} />
              <Route path="/cart" element={<ShoppingCart />} />
            </Routes>
          </main>
          <ChatWidget />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
