import React, { useState } from 'react';
import { submitUserAnswer } from '../../api/apiClient';
import { useAppContext } from '../../context/AppContext';
import Button from '../Common/Button';

const UserAnswerForm = () => {
  const { setIsLoading, setError } = useAppContext();
  const [formData, setFormData] = useState({
    userId: '',
    elementId: '',
    userAnswer: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'userAnswer' ? parseInt(value, 10) || '' : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await submitUserAnswer(formData);
      setSuccess(true);
      setFormData({
        userId: '',
        elementId: '',
        userAnswer: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting user answer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          Answer submitted successfully.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter user UUID"
            required
          />
        </div>
        
        <div>
          <label htmlFor="elementId" className="block text-sm font-medium text-gray-700 mb-1">
            Element ID
          </label>
          <input
            type="text"
            id="elementId"
            name="elementId"
            value={formData.elementId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter element UUID"
            required
          />
        </div>
        
        <div>
          <label htmlFor="userAnswer" className="block text-sm font-medium text-gray-700 mb-1">
            User Answer
          </label>
          <input
            type="number"
            id="userAnswer"
            name="userAnswer"
            value={formData.userAnswer}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter answer number"
            required
          />
        </div>
        
        <Button type="submit" variant="post">
          Submit Answer
        </Button>
      </form>
    </div>
  );
};

export default UserAnswerForm;