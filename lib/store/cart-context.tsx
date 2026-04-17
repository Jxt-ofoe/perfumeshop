'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { Product, CartItem, CartState, CartAction } from '@/lib/types';

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return { ...state, items: newItems };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.productId),
      };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const CART_STORAGE_KEY = 'velour-cart';

function getInitialState(): CartState {
  return { items: [], isOpen: false };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        parsed.forEach((item) => {
          for (let i = 0; i < item.quantity; i++) {
            dispatch({ type: 'ADD_ITEM', product: item.product });
          }
        });
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, hydrated]);

  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', product });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
