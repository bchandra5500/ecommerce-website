import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ShoppingCart from "./components/ShoppingCart";
import ChatWidget from "./components/ChatWidget";
import CategoryPage from "./components/CategoryPage";
import { CartProvider } from "./context/CartContext";
import { VALID_CATEGORIES } from "./types/product";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/category/all" replace />}
              />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route
                path="/category/:category"
                element={<CategoryPageWrapper />}
              />
              <Route
                path="*"
                element={<Navigate to="/category/all" replace />}
              />
            </Routes>
          </main>
          <ChatWidget />
        </div>
      </CartProvider>
    </Router>
  );
}

// Wrapper component to validate category parameter
function CategoryPageWrapper() {
  const { category } = useParams<{ category: string }>();

  // Check if category is valid or if it's "all"
  if (
    !category ||
    (category !== "all" && !VALID_CATEGORIES.includes(category as any))
  ) {
    return <Navigate to="/category/all" replace />;
  }

  return <CategoryPage />;
}

export default App;
