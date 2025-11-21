import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext();
const CART_KEY = 'novashop_cart';

const deserializeCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to read cart from storage', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(deserializeCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: quantity
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, qty: Math.max(1, Number(qty) || 1) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    const items = cart.reduce(
      (acc, item) => {
        acc.count += item.qty;
        acc.amount += item.price * item.qty;
        return acc;
      },
      { count: 0, amount: 0 }
    );
    return items;
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount: totals.count,
    cartTotal: Number(totals.amount.toFixed(2))
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
