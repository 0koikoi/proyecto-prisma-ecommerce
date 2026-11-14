import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { findVariantInCatalog } from '../../feature/catalog/services/catalogService';

const STORAGE_KEY = 'prisma_store_cart_v1';

const CartContext = createContext(null);

function loadInitialCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
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
  const [items, setItems] = useState(loadInitialCart);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback((variantId, quantity = 1) => {
    const numericId = Number(variantId);
    const addedQty = Math.max(1, Number(quantity) || 1);
    if (!numericId) return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.variantId === numericId);
      const catalogInfo = findVariantInCatalog(numericId);

      if (existingIndex >= 0) {
        const current = prevItems[existingIndex];
        const maxStock = catalogInfo?.availableStock ?? current.availableStock ?? 99;
        const nextQuantity = Math.min(current.quantity + addedQty, Math.max(1, maxStock));

        return prevItems.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: nextQuantity } : item,
        );
      }

      const newItem = {
        variantId: numericId,
        quantity: addedQty,
        name: catalogInfo?.name || `Variante #${numericId}`,
        slug: catalogInfo?.slug || '',
        size: catalogInfo?.size || '-',
        color: catalogInfo?.color || '-',
        salePrice: catalogInfo?.salePrice ?? 0,
        availableStock: catalogInfo?.availableStock ?? 99,
      };

      return [...prevItems, newItem];
    });
  }, []);

  const removeItem = useCallback((variantId) => {
    const numericId = Number(variantId);
    setItems((prevItems) => prevItems.filter((item) => item.variantId !== numericId));
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    const numericId = Number(variantId);
    const nextQty = Number(quantity);

    if (Number.isNaN(nextQty) || nextQty <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.variantId !== numericId));
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.variantId !== numericId) return item;
        const catalogInfo = findVariantInCatalog(numericId);
        const maxStock = catalogInfo?.availableStock ?? item.availableStock ?? 99;
        return {
          ...item,
          quantity: Math.min(nextQty, Math.max(1, maxStock)),
        };
      }),
    );
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
            const unitPrice = catalogInfo?.salePrice ?? Number(item.salePrice) ?? 0;
            return sum + unitPrice * (Number(item.quantity) || 0);
          }, 0)
          .toFixed(2),
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      totalItems,
      subtotal,
    }),
    [items, addItem, removeItem, updateQuantity, clear, totalItems, subtotal],
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
