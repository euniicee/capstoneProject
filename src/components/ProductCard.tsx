'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency, isInStock, getStockStatusLabel, getStockStatusColor } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock(product.stock)) return;

    setIsAdding(true);
    addItem(product, 1);

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const inStock = isInStock(product.stock);

  // Fix: handle images properly (handles arrays, strings, and JSON-stringified arrays)
  let imageUrl = '/placeholder.png';
    if (Array.isArray(product.images) && product.images.length > 0) {
    imageUrl = product.images[0];
  } else if (typeof product.images === 'string' && product.images) {
    try {
      // Handle case where images is a JSON string like '["url1","url2"]'
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageUrl = parsed[0];
      } else {
        imageUrl = product.images;
      }
    } catch {
      // If it's just a normal string URL
      imageUrl = product.images;
    }
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-lg font-bold text-white">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
            {product.name}
          </h3>

          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
            {product.description || 'No description available.'}
          </p>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <span className={`text-sm font-medium ${getStockStatusColor(product.stock)}`}>
              {getStockStatusLabel(product.stock)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${
              inStock
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {isAdding ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}