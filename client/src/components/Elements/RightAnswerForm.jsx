import React, { useState } from 'react';
import { setCorrectAnswer } from '../../api/apiClient';
import { useAppContext } from '../../context/AppContext';
import Button from '../Common/Button';

const RightAnswerForm = () => {
  const { setIsLoading, setError } = useAppContext();
  const [elementId, setElementId] = useState('');
  const [rightAnswer, setRightAnswer] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await setCorrectAnswer(elementId, { rightAnswer: parseInt(rightAnswer, 10) });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error setting correct answer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          Correct answer updated and score calculation triggered.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="elementId" className="block text-sm font-medium text-gray-700 mb-1">
            Element ID
          </label>
          <input
            type="text"
            id="elementId"
            value={elementId}
            onChange={(e) => setElementId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter element UUID"
            required
          />
        </div>
        
        <div>
          <label htmlFor="rightAnswer" className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer
          </label>
          <input
            type="number"
            id="rightAnswer"
            value={rightAnswer}
            onChange={(e) => setRightAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter correct answer number"
            required
          />
        </div>
        
        <Button type="submit" variant="put">
          Set Correct Answer
        </Button>
      </form>
    </div>
  );
};

export default RightAnswerForm;