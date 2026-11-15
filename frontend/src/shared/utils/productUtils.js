export function getProductStock(product) {
  const availableStock = Number(product?.availableStock);
  if (product?.availableStock != null && Number.isFinite(availableStock)) {
    return Math.max(0, availableStock);
  }

  return (product?.variants || []).reduce(
    (total, variant) => total + Math.max(0, Number(variant.availableStock) || 0),
    0,
  );
}

export function getProductPrice(product) {
  if (product?.salePrice != null && Number.isFinite(Number(product.salePrice))) {
    return Number(product.salePrice);
  }

  const prices = (product?.variants || [])
    .map((variant) => Number(variant.salePrice))
    .filter(Number.isFinite);

  return prices.length ? Math.min(...prices) : 0;
}

export function getProductImages(product) {
  return (product?.images || [])
    .map((image) => (typeof image === 'string' ? image : image?.url || image?.src))
    .filter(Boolean);
}
