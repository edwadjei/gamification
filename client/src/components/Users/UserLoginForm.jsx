import React, { useState } from 'react';
import { loginUser } from '../../api/apiClient';
import { useAppContext } from '../../context/AppContext';
import Button from '../Common/Button';

const UserLoginForm = () => {
  const { setIsLoading, setError, setCurrentUser } = useAppContext();
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(null);
    setUserData(null);

    try {
      const response = await loginUser({ username });
      setSuccess(true);
      setUserData(response.data);
      setCurrentUser(response.data);
      setUsername('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging in user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          User login successful.
          {userData && (
            <div className="mt-2">
              <p>User ID: <span className="font-mono">{userData.userId}</span></p>
              <p>Username: <span className="font-medium">{userData.username}</span></p>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter username"
            required
          />
        </div>
        
        <Button type="submit" variant="post">
          Login / Register
        </Button>
      </form>
    </div>
  );
};

export default UserLoginForm;