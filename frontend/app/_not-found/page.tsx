// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600">Page Not Found</h2>
        <p className="text-gray-500">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}