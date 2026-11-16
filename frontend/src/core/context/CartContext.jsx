import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { changeCart, reconcileCart } from './cartState';
import { findVariantInCatalog, getDemoCartItems } from '../../feature/catalog/services/catalogService';
import { USE_MOCK } from '../api/apiClient';

const STORAGE_KEY = USE_MOCK ? 'prisma_store_demo_cart_v1' : 'prisma_store_cart_v1';

const CartContext = createContext(null);

function loadInitialCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDemoCartItems();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getDemoCartItems();
  } catch {
    return getDemoCartItems();
  }
}

function saveCartToStorage(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Funciona en memoria si localStorage está bloqueado o sin espacio
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => reconcileCart(loadInitialCart(), findVariantInCatalog));
  const [isOpen, setIsOpen] = useState(false);
  const openCart = useCallback(() => {
    setItems((items) => reconcileCart(items, findVariantInCatalog));
    setIsOpen(true);
  }, []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback((id, quantity = 1) => {
    setItems((items) => changeCart(items, id, quantity, findVariantInCatalog, 'add'));
  }, []);

  const removeItem = useCallback((variantId) => {
    const numericId = Number(variantId);
    setItems((prevItems) => prevItems.filter((item) => item.variantId !== numericId));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((items) => changeCart(items, id, quantity, findVariantInCatalog));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      Number(
        items
          .reduce((sum, item) => {
            const catalogInfo = findVariantInCatalog(item.variantId);
            const unitPrice = catalogInfo?.salePrice ?? (Number(item.salePrice) || 0);
            return sum + (item.unavailable ? 0 : unitPrice) * (Number(item.quantity) || 0);
          }, 0)
          .toFixed(2),
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isOpen, openCart, closeCart,
      canCheckout: items.length > 0 && items.every((item) => !item.unavailable),
      addItem,
      removeItem,
      updateQuantity,
      clear,
      totalItems,
      subtotal,
    }),
    [items, addItem, removeItem, updateQuantity, clear, totalItems, subtotal, isOpen, openCart, closeCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}

export { CartContext };
