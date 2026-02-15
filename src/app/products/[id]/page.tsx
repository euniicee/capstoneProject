'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { fetchProductById } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import { formatCurrency, isInStock, getStockStatusLabel, getStockStatusColor } from '@/lib/utils';
import { LoadingPage } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductById(params.id);
      
      if (!data) {
        setError('Product not found');
      } else {
        setProduct(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !isInStock(product.stock)) return;
    
    setIsAdding(true);
    addItem(product, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
      router.push('/cart');
    }, 500);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorMessage message={error} onRetry={loadProduct} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  const inStock = isInStock(product.stock);
  const imageUrl = product.image || product.imageUrl || '/placeholder.png';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Products
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-2xl font-bold text-white">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-2 inline-block self-start rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            {product.category}
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mb-6 text-lg text-gray-600">{product.description}</p>

          <div className="mb-6 flex items-center justify-between border-y border-gray-200 py-4">
            <span className="text-4xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <span className={`text-lg font-medium ${getStockStatusColor(product.stock)}`}>
              {getStockStatusLabel(product.stock)}
            </span>
          </div>

          {inStock && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-lg font-semibold transition-colors ${
              inStock
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            }`}
          >
            <ShoppingCart className="h-6 w-6" />
            {isAdding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}