import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-2 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mb-6 text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}