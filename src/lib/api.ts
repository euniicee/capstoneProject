// src/lib/api.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  imageUrl?: string;
}

function parseImage(images: any): string {
  if (!images) return '/placeholder.png';

  try {
    if (typeof images === 'string' && images.startsWith('[')) {
      const parsed = JSON.parse(images);
      return parsed[0] ?? '/placeholder.png';
    }

    if (Array.isArray(images)) {
      return images[0] ?? '/placeholder.png';
    }

    if (typeof images === 'string') {
      return images;
    }
  } catch {}

  return '/placeholder.png';
}

// Fetch all products
export async function fetchProducts(): Promise<Product[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch('https://api.oluwasetemi.dev/products', {
      signal: controller.signal,
    });

       if (!res.ok) {
      console.error('Failed to fetch products:', res.status);
      return [];
    }

    const json = await res.json();

    // The API returns { data: [...] } so we extract the array
       // Ensure we always return an array safely
   if (Array.isArray(json?.data)) {
  return json.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    category: item.category ?? 'uncategorized',
    stock: item.quantity ?? 0,
    image: parseImage(item.images),
  }));
}

    return [];
  } catch (err) {
        console.error('Fetch error:', err);
    return []; // prevent app crash if API fails or times out
  } finally {
    clearTimeout(timeout);
  }
}

// Fetch a single product by id
export async function fetchProductById(id: string): Promise<Product | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`https://api.oluwasetemi.dev/products/${id}`, {
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data || null; // assuming API returns { data: {...} }
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Get unique categories from products
export function getProductCategories(products: Product[]): string[] {
  const categories = products.map((p) => p.category);
  return Array.from(new Set(categories));
}

// Filter products by search and category
export function filterProducts(
  products: Product[],
  searchQuery: string,
  selectedCategory: string
): Product[] {
  return products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}