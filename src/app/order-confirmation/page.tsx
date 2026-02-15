'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderDetails {
  reference: string;
  amount: number;
  email: string;
  name: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      const order = JSON.parse(storedOrder);
      setOrderDetails(order);
      
      localStorage.removeItem('lastOrder');
    }
  }, []);

  if (!reference || !orderDetails) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Order Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase, {orderDetails.name}
          </p>
        </div>

        <div className="mb-8 rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Order Details
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Reference</span>
              <span className="font-mono font-medium text-gray-900">
                {orderDetails.reference}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">
                {orderDetails.email}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-3">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(orderDetails.amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Order Items
          </h2>

          <div className="space-y-3">
            {orderDetails.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            <strong>What happens next?</strong>
            <br />
            A confirmation email has been sent to <strong>{orderDetails.email}</strong>.
            Your order will be processed and shipped within 2-3 business days.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.push('/')}
            className="flex-1 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex-1 rounded-lg border-2 border-primary-600 bg-white px-6 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}