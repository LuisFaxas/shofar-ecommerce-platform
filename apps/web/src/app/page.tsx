import { resolveBrand } from '@/lib/brand-runtime';
import { headers } from 'next/headers';

export default async function HomePage() {
  const brand = await resolveBrand();
  const headersList = headers();
  const host = headersList.get('host') || 'localhost';

  // Determine resolution mode
  const resolutionMode = process.env.BRAND_KEY
    ? 'Mode A (BRAND_KEY environment variable)'
    : 'Mode B (Host-based resolution)';

  // Dynamic import based on brand - will be expanded in future work orders
  if (brand.key === 'tooly') {
    const ToolyApp = (await import('@/brands/tooly')).default;
    return <ToolyApp />;
  }

  if (brand.key === 'peptides') {
    // Peptides brand is a future placeholder
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">PEPTIDES Brand - Future Implementation</h1>
          <p className="text-lg text-gray-600 mb-8">
            This brand will have its own unique frontend in future work orders.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Brand Resolution Info:</h2>
            <dl className="space-y-2">
              <div>
                <dt className="font-medium">Brand:</dt>
                <dd className="text-gray-600">{brand.displayName}</dd>
              </div>
              <div>
                <dt className="font-medium">Key:</dt>
                <dd className="text-gray-600">{brand.key}</dd>
              </div>
              <div>
                <dt className="font-medium">Domain:</dt>
                <dd className="text-gray-600">{brand.domain}</dd>
              </div>
              <div>
                <dt className="font-medium">Current Host:</dt>
                <dd className="text-gray-600">{host}</dd>
              </div>
              <div>
                <dt className="font-medium">Resolution Mode:</dt>
                <dd className="text-gray-600">{resolutionMode}</dd>
              </div>
              <div>
                <dt className="font-medium">Channel Token:</dt>
                <dd className="text-gray-600">{brand.channelToken}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Test API endpoint: <a href="/api/test-brand" className="underline">/api/test-brand</a></p>
          </div>
        </div>
      </main>
    );
  }

  // Fallback for unknown brands
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Brand Not Found</h1>
        <p className="text-lg text-gray-600 mb-4">
          The requested brand "{brand.key}" is not configured.
        </p>
        <div className="bg-red-50 p-4 rounded">
          <p className="text-sm">Host: {host}</p>
          <p className="text-sm">Resolution Mode: {resolutionMode}</p>
        </div>
      </div>
    </main>
  );
}