'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You&apos;re Offline
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still browse cached content!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="block w-full bg-white text-orange-600 py-3 px-6 rounded-lg font-semibold border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-orange-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Offline Tips
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li>• Check your WiFi or mobile data connection</li>
            <li>• Some pages may still be available from cache</li>
            <li>• Try refreshing the page once you&apos;re back online</li>
            <li>• The app will automatically sync when connection is restored</li>
          </ul>
        </div>

        {/* PWA Info */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            📱 This is a Progressive Web App (PWA) - install it for a better offline experience!
          </p>
        </div>
      </div>
    </div>
  );
}
