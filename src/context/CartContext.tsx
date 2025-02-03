import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  UIProduct,
  MongoProduct,
  convertMongoToUIProduct,
} from "../types/product";

interface CartItem extends UIProduct {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: UIProduct | MongoProduct) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: UIProduct | MongoProduct) => {
    // Convert MongoProduct to UIProduct if needed
    const uiProduct: UIProduct =
      "_id" in product ? convertMongoToUIProduct(product) : product;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === uiProduct.id
      );
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === uiProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...uiProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export type { CartItem };
