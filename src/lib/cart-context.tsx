'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from './types';

interface CartContextType {
  items: CartItem[];
  selectedItems: CartItem[];
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSelectItem: (productId: string) => void;
  toggleSelectAll: (selectedState?: boolean) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  totalItemsCount: number;
  totalPrice: number;
  selectedItemsCount: number;
  selectedTotalPrice: number;
  isAllSelected: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('glowbeauty_cart');
      if (savedCart) {
        const parsed: CartItem[] = JSON.parse(savedCart);
        // Ensure default selected = true if missing
        const formatted = parsed.map((item) => ({
          ...item,
          selected: item.selected ?? true,
        }));
        setItems(formatted);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('glowbeauty_cart', JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage', error);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, quantity = 1, openDrawer = true) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].selected = true;
        return updated;
      } else {
        return [...prevItems, { product, quantity, selected: true }];
      }
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleSelectItem = (productId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, selected: !(item.selected ?? true) }
          : item
      )
    );
  };

  const toggleSelectAll = (selectedState?: boolean) => {
    setItems((prevItems) => {
      const targetState =
        selectedState ?? !prevItems.every((item) => item.selected ?? true);
      return prevItems.map((item) => ({ ...item, selected: targetState }));
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearSelectedItems = () => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.selected ?? true))
    );
  };

  const selectedItems = items.filter((item) => item.selected ?? true);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const selectedItemsCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const isAllSelected =
    items.length > 0 && items.every((item) => item.selected ?? true);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelectItem,
        toggleSelectAll,
        clearCart,
        clearSelectedItems,
        totalItemsCount,
        totalPrice,
        selectedItemsCount,
        selectedTotalPrice,
        isAllSelected,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
