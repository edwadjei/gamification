import React from 'react';
import UserLoginForm from './UserLoginForm';
import UsersList from './UsersList';
import ApiPanel from '../Common/ApiPanel';

const Users = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <div className="text-sm text-gray-600">User management</div>
      </div>

      <ApiPanel 
        method="POST" 
        endpoint="/users/login" 
        description="Get or create a user by username"
      >
        <UserLoginForm />
      </ApiPanel>

      <ApiPanel 
        method="GET" 
        endpoint="/users" 
        description="Get all users"
      >
        <UsersList />
      </ApiPanel>
    </div>
  );
};

export default Users;