import React from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ShoppingCart() {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();

  const handleCheckout = () => {
    clearCart();
    toast.success("Order placed successfully!");
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your cart is empty
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Shopping Cart
      </h2>
      <div className="bg-white rounded-lg shadow-md">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 border-b border-gray-200 last:border-b-0"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-800 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-600 p-2"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-gray-900">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
