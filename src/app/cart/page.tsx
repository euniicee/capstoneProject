"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, getVAT, getTotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const vat = getVAT();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-600">
            Start shopping to add items to your cart
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const imageUrl =
                item.product.image ||
                item.product.imageUrl ||
                "/placeholder.png";

              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={
                        item.product.image?.startsWith("/")
                          ? item.product.image
                          : "/placeholder.png"
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.product.category}
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-3 border-b border-gray-200 pb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (7.5%)</span>
                <span className="font-medium">{formatCurrency(vat)}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => router.push("/")}
              className="mt-3 w-full rounded-lg border-2 border-primary-600 bg-white px-6 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
