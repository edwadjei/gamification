import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ApiPanel = ({ method, endpoint, description, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getMethodColor = () => {
    switch (method.toLowerCase()) {
      case 'post':
        return 'bg-post-green text-white';
      case 'put':
        return 'bg-put-orange text-white';
      case 'get':
        return 'bg-get-blue text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className={`${getMethodColor()} px-3 py-1 rounded-md mr-3 font-mono text-sm font-bold`}>
            {method}
          </span>
          <span className="font-mono text-gray-700 mr-4">{endpoint}</span>
          <span className="text-gray-600">{description}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};

export default ApiPanel;