import React from 'react';
import ElementForm from './ElementForm';
import RightAnswerForm from './RightAnswerForm';
import ApiPanel from '../Common/ApiPanel';

const Elements = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Elements</h2>
        <div className="text-sm text-gray-600">Element management</div>
      </div>

      <ApiPanel 
        method="POST" 
        endpoint="/elements" 
        description="Create a new element"
      >
        <ElementForm />
      </ApiPanel>

      <ApiPanel 
        method="PUT" 
        endpoint="/elements/{elementId}/right-answer" 
        description="Set the correct answer for an element"
      >
        <RightAnswerForm />
      </ApiPanel>
    </div>
  );
};

export default Elements;