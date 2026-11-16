import { test } from 'vitest';
import assert from 'node:assert/strict';
import { changeCart, reconcileCart } from './cartState.js';

const resolve = (id) => ({
  1: { name: 'Polera', salePrice: 59.9, availableStock: 3 },
  2: { name: 'Blusa', salePrice: 69.9, availableStock: 0 },
}[id]);

test('limita la primera compra y las adiciones sucesivas al stock', () => {
  assert.equal(changeCart([], 1, 10, resolve, 'add')[0].quantity, 3);
  const cart = changeCart([], 1, 2, resolve, 'add');
  assert.equal(changeCart(cart, 1, 2, resolve, 'add')[0].quantity, 3);
});

test('rechaza variantes inexistentes, agotadas y cantidades inválidas', () => {
  for (const id of [2, 99]) assert.deepEqual(changeCart([], id, 1, resolve, 'add'), []);
  for (const qty of [NaN, Infinity, 1.5, -1, 0]) assert.deepEqual(changeCart([], 1, qty, resolve, 'add'), []);
});

test('restaura precios del catálogo, agrupa duplicados y descarta datos corruptos', () => {
  const cart = reconcileCart([null, {}, { variantId: 1, quantity: 2, salePrice: 1 }, { variantId: '1', quantity: 2 }, { variantId: 2, quantity: -4 }], resolve);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].salePrice, 59.9);
  assert.equal(cart[0].quantity, 3);
  assert.ok(cart[0].stockWarning);
  assert.deepEqual(reconcileCart({}, resolve), []);
});

test('conserva las líneas agotadas o eliminadas para avisar y permitir quitarlas', () => {
  const cart = reconcileCart([{ variantId: 2, quantity: 1 }, { variantId: 99, quantity: 1 }], resolve);
  assert.ok(cart.every((item) => item.unavailable && item.stockWarning));
  assert.equal(changeCart(cart, 2, 0, resolve).length, 1);
});

test('revalida el inventario al actualizar y permite reducir la cantidad', () => {
  const cart = changeCart([], 1, 3, resolve, 'add');
  assert.equal(changeCart(cart, 1, 1, resolve)[0].quantity, 1);
  const changedStock = () => ({ ...resolve(1), availableStock: 1 });
  assert.equal(reconcileCart(cart, changedStock)[0].quantity, 1);
  assert.equal(changeCart(cart, 1, 10, changedStock)[0].quantity, 1);
});
