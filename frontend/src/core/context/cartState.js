export function reconcileCart(rows, resolveVariant) {
  const merged = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || !Number.isSafeInteger(Number(row.variantId)) || Number(row.variantId) <= 0) continue;
    const variantId = Number(row.variantId);
    const quantity = Number(row.quantity);
    if (!Number.isSafeInteger(quantity) || quantity <= 0) continue;
    const info = resolveVariant(variantId);
    const stock = Math.max(0, Math.floor(Number(info?.availableStock) || 0));
    const previous = merged.get(variantId);
    const requested = quantity + (previous?.quantity || 0);
    merged.set(variantId, {
      variantId, name: info?.name || 'Producto no disponible',
      slug: info?.slug || '', size: info?.size || '—', color: info?.color || '—',
      image: info?.image || '', salePrice: info?.salePrice || 0, availableStock: stock,
      quantity: stock > 0 ? Math.min(requested, stock) : requested,
      unavailable: !info || stock === 0,
      stockWarning: !info || stock === 0
        ? 'Este artículo ya no está disponible. Elimínalo para continuar.'
        : requested > stock ? `Ajustamos la cantidad a las ${stock} unidades disponibles.`
          : (typeof row.stockWarning === 'string' ? row.stockWarning : '') || previous?.stockWarning || '',
    });
  }
  return [...merged.values()];
}

export function changeCart(items, variantId, quantity, resolveVariant, mode = 'set') {
  const id = Number(variantId);
  const qty = Number(quantity);
  if (!Number.isSafeInteger(id) || !Number.isSafeInteger(qty)) return items;
  if (mode === 'set' && qty <= 0) return items.filter((item) => item.variantId !== id);
  if (qty <= 0) return items;
  const info = resolveVariant(id);
  if (!info || info.availableStock <= 0) return reconcileCart(items, resolveVariant);
  const existing = items.find((item) => item.variantId === id);
  const next = mode === 'add' ? (existing?.quantity || 0) + qty : qty;
  return reconcileCart([...items.filter((item) => item.variantId !== id), { variantId: id, quantity: next }], resolveVariant);
}
