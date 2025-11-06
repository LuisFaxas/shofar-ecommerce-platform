import { resolveBrand } from '@/lib/store-runtime';
import { Suspense } from 'react';

async function HomePage() {
  const brand = await resolveBrand();

  // Dynamically import and render the brand-specific app
  if (brand.key === 'tooly') {
    const ToolyApp = (await import('@/brands/tooly')).default;
    return <ToolyApp />;
  }

  // Future tool brands will be added here
  // if (brand.key === 'other_tool_brand') { ... }

  // Fallback for unknown brands
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">SHOFAR Store</h1>
      <p className="text-lg text-gray-600">
        Unknown brand configuration. Current brand: {brand.key}
      </p>
    </main>
  );
}

function LoadingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading store...</p>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <HomePage />
    </Suspense>
  );
}