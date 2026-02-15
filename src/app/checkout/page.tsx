'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePaystackPayment } from 'react-paystack';
import { useCartStore } from '@/store/cartStore';
import { checkoutFormSchema, CheckoutFormValues } from '@/lib/validation';
import { formatCurrency, generatePaymentReference, convertToKobo } from '@/lib/utils';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getVAT, getTotal, clearCart } = useCartStore();

  const [formData, setFormData] = useState<CheckoutFormValues>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormValues, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const vat = getVAT();
  const total = getTotal();

  React.useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof CheckoutFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      checkoutFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Partial<Record<keyof CheckoutFormValues, string>> = {};
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof CheckoutFormValues;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const paymentReference = generatePaymentReference();
  const paystackConfig = {
    reference: paymentReference,
    email: formData.email,
    amount: convertToKobo(total),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const onSuccess = () => {
    setIsProcessing(true);
    clearCart();
    
    const orderDetails = {
      reference: paymentReference,
      amount: total,
      email: formData.email,
      name: formData.firstName + ' ' + formData.lastName,
      items: items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    }
    
    router.push('/order-confirmation?reference=' + paymentReference);
  };

  const onClose = () => {
    setIsProcessing(false);
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    initializePayment({ onSuccess, onClose });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Shipping Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
                {errors.address && <p className="error-text">{errors.address}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  {errors.city && <p className="error-text">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  {errors.state && <p className="error-text">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
                {errors.zipCode && <p className="error-text">{errors.zipCode}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="mb-4 space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (7.5%)</span>
                <span className="font-medium">{formatCurrency(vat)}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing...
                </>
              ) : (
                'Pay with Paystack'
              )}
            </button>

            <p className="mt-4 text-center text-xs text-gray-500">
              Secure payment powered by Paystack
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}