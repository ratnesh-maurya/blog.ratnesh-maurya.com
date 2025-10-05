export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" role="status" aria-label="Loading">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading content...</p>
      </div>
    </div>
  );
}

