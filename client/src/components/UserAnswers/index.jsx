import React from 'react';
import UserAnswerForm from './UserAnswerForm';
import ApiPanel from '../Common/ApiPanel';

const UserAnswers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">User Answers</h2>
        <div className="text-sm text-gray-600">User answer submission</div>
      </div>

      <ApiPanel 
        method="POST" 
        endpoint="/user-answers" 
        description="Submit a user answer"
      >
        <UserAnswerForm />
      </ApiPanel>
    </div>
  );
};

export default UserAnswers;