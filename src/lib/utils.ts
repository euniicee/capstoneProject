export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generatePaymentReference(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `QS-${timestamp}-${random}`;
}

export function convertToKobo(amount: number): number {
  return Math.round(amount * 100);
}

export function isInStock(stock: number): boolean {
  return stock > 0;
}

export function getStockStatusLabel(stock: number): string {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return `Only ${stock} left`;
  return 'In Stock';
}

export function getStockStatusColor(stock: number): string {
  if (stock === 0) return 'text-red-600';
  if (stock <= 5) return 'text-orange-600';
  return 'text-green-600';
}
