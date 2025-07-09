'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Blog Toolbox', subtitle }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const isHomePage = pathname === '/';
  
  const handleBackClick = () => {
    router.push('/');
  };
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {!isHomePage && (
            <button
              onClick={handleBackClick}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="mr-2">←</span>
              トップに戻る
            </button>
          )}
        </div>
      </div>
    </header>
  );
};