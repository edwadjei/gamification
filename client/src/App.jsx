import React from 'react';
import Layout from './components/Layout';
import UserAnswers from './components/UserAnswers';
import Elements from './components/Elements';
import Users from './components/Users';
import Leaderboard from './components/Leaderboard';
import { useAppContext } from './context/AppContext';

function App() {
  const { activeTab, isLoading, error } = useAppContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'userAnswers':
        return <UserAnswers />;
      case 'elements':
        return <Elements />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'users':
        return <Users />;
      default:
        return <Leaderboard />;
    }
  };

  return (
    <Layout>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        renderContent()
      )}
    </Layout>
  );
}

export default App;