import React from 'react';
import { Users, Award, List, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
  const { activeTab, setActiveTab } = useAppContext();

  const menuItems = [
    { id: 'leaderboard', name: 'Leaderboard', icon: <Award size={20} /> },
    { id: 'userAnswers', name: 'User Answers', icon: <MessageSquare size={20} /> },
    { id: 'elements', name: 'Elements', icon: <List size={20} /> },
    { id: 'users', name: 'Users', icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-md ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;