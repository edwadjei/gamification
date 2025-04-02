import React, { useState, useEffect } from 'react';
import { getUsers } from '../../api/apiClient';
import { useAppContext } from '../../context/AppContext';
import Button from '../Common/Button';

const UsersList = () => {
  const { setIsLoading, setError } = useAppContext();
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  // Mock data for development
  const mockUsers = [
    { userId: '7f8d9e1a-2b3c-4d5e-6f7g-8h9i0j1k2l3m', username: 'user1' },
    { userId: 'a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p', username: 'user2' },
    { userId: 'q7r8s9t0-u1v2-w3x4-y5z6-7a8b9c0d1e2f', username: 'user3' },
  ];

  // Display mock data if not loaded or empty response
  const displayUsers = isLoaded && users.length > 0 ? users : mockUsers;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleRefresh} variant="get" size="sm">
          Refresh Users
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayUsers.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {user.userId.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.username}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;