import React from 'react';
import { useAppContext } from '../../context/AppContext';

const Header = () => {
  const { currentUser } = useAppContext();
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800 mr-6">Gamification System</h1>
        </div>
        <div className="flex items-center">
          {currentUser ? (
            <div className="text-sm text-gray-600">
              Logged in as: <span className="font-medium">{currentUser.username || currentUser.userId}</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Not logged in
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;