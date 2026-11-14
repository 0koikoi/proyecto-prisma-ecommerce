const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatCurrency(amount) {
  const num = Number(amount);
  if (Number.isNaN(num)) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(num);
}

export function formatDate(dateInput) {
  if (!dateInput) return '';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  return dateFormatter.format(date);
}
