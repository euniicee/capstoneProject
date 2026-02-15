import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">
            &copy; {currentYear} QuickServe E-Commerce. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Built with Next.js 15 | Powered by Paystack
          </p>
        </div>
      </div>
    </footer>
  );
}
