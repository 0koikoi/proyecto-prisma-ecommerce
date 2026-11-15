import { apiClient, simulateNetworkDelay, USE_MOCK } from '../../../core/api/apiClient';
import mockCatalog from './mockCatalog.json';

// Carrito inicial de demostración: tallas, precios y cantidades diferentes.
export function getDemoCartItems() {
  return USE_MOCK ? [
    { variantId: 102, quantity: 1 },
    { variantId: 201, quantity: 2 },
    { variantId: 302, quantity: 1 },
  ] : [];
}

export async function getProducts(filters = {}) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    let results = [...mockCatalog];

    if (filters.line) {
      const normalizedLine = String(filters.line).toUpperCase();
      results = results.filter((product) => product.line === normalizedLine);
    }

    if (filters.category) {
      results = results.filter(
        (product) =>
          product.category.toLowerCase() === String(filters.category).toLowerCase(),
      );
    }

    if (filters.search) {
      const term = String(filters.search).toLowerCase().trim();
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term),
      );
    }

    return results;
  }

  // NOTA: Los endpoints /api/public/... son provisionales hasta que el backend los exponga.
  // const params = new URLSearchParams(filters).toString();
  // const query = params ? `?${params}` : '';
  // return apiClient(`/api/public/catalog/products${query}`);
  return apiClient('/api/public/catalog/products');
}

export async function getProductBySlug(slug) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    const product = mockCatalog.find((item) => item.slug === slug);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }
    return product;
  }

  // NOTA: Ruta provisional sujeta a definición del backend público.
  // return apiClient(`/api/public/catalog/products/${encodeURIComponent(slug)}`);
  return apiClient(`/api/public/catalog/products/${encodeURIComponent(slug)}`);
}

export async function getCategories() {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    const categoryMap = new Map();

    for (const product of mockCatalog) {
      const key = `${product.line}:${product.category}`;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          line: product.line,
          name: product.category,
        });
      }
    }

    return Array.from(categoryMap.values());
  }

  // NOTA: Ruta provisional sujeta a definición del backend público.
  // return apiClient('/api/public/catalog/categories');
  return apiClient('/api/public/catalog/categories');
}

export function findVariantInCatalog(variantId) {
  const numericId = Number(variantId);
  for (const product of mockCatalog) {
    const variant = product.variants.find((item) => item.id === numericId);
    if (variant) {
      return {
        variantId: variant.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images?.[0] || '',
        line: product.line,
        category: product.category,
        size: variant.size,
        color: variant.color,
        salePrice: variant.salePrice,
        availableStock: variant.availableStock,
      };
    }
  }
  return null;
}

export const catalogService = {
  getProducts,
  getProductBySlug,
  getCategories,
  findVariantInCatalog,
};
