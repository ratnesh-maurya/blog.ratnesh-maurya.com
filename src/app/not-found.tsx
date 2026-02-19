'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      <div className="max-w-2xl mx-auto text-center">

        {/* 404 */}
        <div className="mb-10">
          <div className="relative inline-block">
            <span className="text-8xl sm:text-9xl font-extrabold select-none"
              style={{ color: 'var(--border)' }}>
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-500)' }}>
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
          style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h1>
        <p className="text-lg leading-relaxed mb-8"
          style={{ color: 'var(--text-secondary)' }}>
          The page you&apos;re looking for seems to have wandered off.
          Even the best developers get lost sometimes!
        </p>

        {/* Info card */}
        <div className="rounded-xl p-5 mb-8 text-left"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-500)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                What might have happened?
              </h3>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <li>• The URL might be mistyped</li>
                <li>• The page might have been moved or deleted</li>
                <li>• You might have clicked on a broken link</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Browse Blog
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
            style={{ borderColor: 'var(--border)', backgroundColor: 'transparent', color: 'var(--text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Popular Content
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/blog"
              className="flex items-center p-4 rounded-xl border transition-all duration-200 group"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-500)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Blog Posts</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Latest articles and tutorials</p>
              </div>
            </Link>
            <Link
              href="/silly-questions"
              className="flex items-center p-4 rounded-xl border transition-all duration-200 group"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                style={{ backgroundColor: 'var(--coral-50)', color: 'var(--coral-500)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Silly Questions</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Fun Q&amp;A and debug stories</p>
              </div>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          Fun fact: HTTP 404 was named after room 404 at CERN, where the web was born! 🌐
        </p>
      </div>
    </div>
  );
}
