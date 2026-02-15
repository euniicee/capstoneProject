# QuickServe E-Commerce Store

A modern, full-stack e-commerce application built with Next.js 15, TypeScript, and Paystack payment integration.

## Live Demo

- **Local**: http://localhost:3000

## Features

- **Product Catalog**: Browse products with search and category filtering
- **Shopping Cart**: Add/remove items with real-time price calculations
- **Checkout Flow**: Secure payment processing with Paystack
- **Order Confirmation**: Post-payment order summary
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: Persistent cart state with localStorage

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Lucide React** - Modern icon library

### Payment
- **Paystack** - Payment gateway for secure transactions
- **react-paystack** - Official React integration

## Stack Justification

### Why Next.js 15?
- **App Router**: Modern routing with server components for better performance
- **Server-Side Rendering (SSR)**: Improved SEO and initial page load
- **Image Optimization**: Automatic image optimization with next/image
- **TypeScript Support**: First-class TypeScript integration

### Why Zustand over Redux?
- **Simplicity**: Minimal boilerplate compared to Redux
- **Bundle Size**: Only ~1.2kb (Redux is ~11kb)
- **No Provider Needed**: Direct store access without context wrappers
- **Persist Middleware**: Easy localStorage integration for cart persistence

### Why Tailwind CSS?
- **Rapid Development**: Utility classes speed up styling
- **Performance**: Purges unused CSS in production
- **Responsive**: Mobile-first approach

### Why Paystack?
- **African Market Focus**: Optimized for Nigerian and African payments
- **Security**: PCI DSS compliant with fraud detection
- **Easy Integration**: Simple React SDK with TypeScript support

## Setup Instructions

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Paystack Account** - Get test keys from https://paystack.com

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY= pk_test_9c4bc72d97820dea07c66a3ecfdcb0fbf5b046f9
NEXT_PUBLIC_API_BASE_URL=https://api.oluwasetemi.dev
```

### 3. Run Development Server
```bash
npm run dev
```

##  Payment Flow

### Complete Payment Journey
```
1. Browse Products → 2. Add to Cart → 3. View Cart → 4. Checkout → 5. Paystack Payment → 6. Order Confirmation
```

### Detailed Flow

1. **Cart Management**: Zustand manages cart state with localStorage persistence
2. **Checkout**: User fills shipping form, validates with Zod
3. **Payment**: Click "Pay with Paystack" → Modal opens
4. **Processing**: User enters card details in secure Paystack modal
5. **Verification**: On success, cart cleared and order saved
6. **Confirmation**: Redirect to order confirmation with details

### Test Card Details
```
Card: 5060 6666 6666 6666 666
Expiry: 12/25
CVV: 123
PIN: 1111
```

### Payment Security

- Only public key exposed (client-side)
- Paystack handles all sensitive data
- PCI DSS Level 1 certified
- All amounts converted to kobo (₦100 = 10000 kobo)

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout with Paystack
│   └── order-confirmation/ # Success page
├── components/            # Reusable UI components
├── lib/                   # Utilities and API
├── store/                 # Zustand state
└── types/                 # TypeScript types
```

## Testing Payment

1. Add products to cart
2. Go to checkout
3. Fill form with test data
4. Use test card above
5. Complete payment
6. View order confirmation

