// src/app/page.tsx
import { fetchProducts } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

export default async function HomePage() {
  let products = [];
  try {
    products = await fetchProducts();
  } catch (err) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        Failed to load products
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">Discover Our Products</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}