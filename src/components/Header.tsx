import React from 'react';
import { Database } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 py-6 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database size={32} className="text-blue-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">API Storage</h1>
              <p className="text-gray-400 text-sm">Manage your API services in one place</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
