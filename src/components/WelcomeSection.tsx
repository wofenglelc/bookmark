import React from 'react';
import { Bookmark, Folder, Search, Download, Upload, Smartphone, Monitor } from 'lucide-react';

interface WelcomeSectionProps {
  show: boolean;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        {/* Main introduction area */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-4 tracking-tight">
            Smart Bookmark Manager
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 font-light leading-relaxed">
            Desktop-like bookmark management experience to keep your web collections organized
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 text-gray-500">
              <Monitor className="w-5 h-5" />
              <span className="text-sm">Desktop Optimized</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm">Mobile Friendly</span>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Folder Management */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-md">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Folder Management</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create folders to organize bookmarks, supports drag & drop for intuitive management
            </p>
          </div>

          {/* Smart Search */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-md">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Quickly search bookmark content with multi-dimensional search by name, URL, and notes
            </p>
          </div>

          {/* Data Import/Export */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-md">
              <div className="flex space-x-1">
                <Upload className="w-3 h-3 text-white" />
                <Download className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Sync</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Support bookmark data import/export for easy backup and migration of your collections
            </p>
          </div>

          {/* Recent & Frequent */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-md">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent & Frequent</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Automatically tracks frequently used bookmarks for quick access to recently visited sites
            </p>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200/50">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Getting Started</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-3 font-semibold">
                1
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Right-click to Create</h4>
              <p className="text-sm text-gray-600">Right-click on empty space to create bookmarks or folders</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3 font-semibold">
                2
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Drag & Drop</h4>
              <p className="text-sm text-gray-600">Drag bookmarks into folders to organize them</p>
            </div>
            
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto mb-3 font-semibold">
                3
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Click to Visit</h4>
              <p className="text-sm text-gray-600">Click on bookmarks to quickly visit the corresponding website</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection; 