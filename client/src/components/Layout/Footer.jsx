import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm">
          Gamification System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;