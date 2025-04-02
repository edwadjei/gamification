import React, { useState } from 'react';
import { createElement } from '../../api/apiClient';
import { useAppContext } from '../../context/AppContext';
import Button from '../Common/Button';

const ElementForm = () => {
  const { setIsLoading, setError } = useAppContext();
  const [formData, setFormData] = useState({
    eventId: '',
    projectId: '',
    scores: 10,
  });
  const [success, setSuccess] = useState(false);
  const [createdElement, setCreatedElement] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'scores' ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(null);
    setCreatedElement(null);

    try {
      const response = await createElement(formData);
      setSuccess(true);
      setCreatedElement(response.data);
      setFormData({
        eventId: '',
        projectId: '',
        scores: 10,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating element');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          Element created successfully.
          {createdElement && (
            <div className="mt-2">
              <p>Element ID: <span className="font-mono">{createdElement.elementId}</span></p>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-1">
            Event ID
          </label>
          <input
            type="text"
            id="eventId"
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter event UUID"
            required
          />
        </div>
        
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
            Project ID
          </label>
          <input
            type="text"
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter project UUID"
            required
          />
        </div>
        
        <div>
          <label htmlFor="scores" className="block text-sm font-medium text-gray-700 mb-1">
            Scores
          </label>
          <input
            type="number"
            id="scores"
            name="scores"
            value={formData.scores}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter points for correct answer"
            min="1"
            required
          />
        </div>
        
        <Button type="submit" variant="post">
          Create Element
        </Button>
      </form>
    </div>
  );
};

export default ElementForm;