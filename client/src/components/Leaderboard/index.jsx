import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../../api/apiClient';
import { useAppContext } from '../../context/AppContext';
import ApiPanel from '../Common/ApiPanel';
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import Button from '../Common/Button';

const Leaderboard = () => {
  const { setIsLoading, setError } = useAppContext();
  const [leaderboard, setLeaderboard] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [projectId, setProjectId] = useState('');
  const [eventId, setEventId] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      // Build query params
      const params = {};
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;
      if (projectId) params.projectId = projectId;
      if (eventId) params.eventId = eventId;
      
      const response = await getLeaderboard(params);
      setLeaderboard(response.data.leaderboard || []);
      setTotalUsers(response.data.total || 0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leaderboard data');
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [limit, offset]);

  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  const handlePrevPage = () => {
    setOffset(Math.max(0, offset - limit));
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setOffset(0); // Reset to first page
    fetchLeaderboard();
  };

  // Mock data for development/preview
  const mockLeaderboard = [
    { userId: "7f8d9e1a-2b3c-4d5e-6f7g-8h9i0j1k2l3m", totalScore: 150, rank: 1 },
    { userId: "a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p", totalScore: 120, rank: 2 },
    { userId: "q7r8s9t0-u1v2-w3x4-y5z6-7a8b9c0d1e2f", totalScore: 115, rank: 3 },
    { userId: "3g4h5i6j-7k8l-9m0n-1o2p-3q4r5s6t7u8v", totalScore: 90, rank: 4 },
    { userId: "9w0x1y2z-3a4b-5c6d-7e8f-9g0h1i2j3k4l", totalScore: 85, rank: 5 },
  ];

  // Use mock data if leaderboard is empty (development mode)
  const displayData = leaderboard.length > 0 ? leaderboard : mockLeaderboard;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        <div className="text-sm text-gray-600">Leaderboard data</div>
      </div>

      <ApiPanel 
        method="GET" 
        endpoint="/leaderboard" 
        description="Get leaderboard data"
      >
        <div className="bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-6 p-4">
            <div></div>
            <button 
              onClick={toggleFilters}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <Filter size={16} className="mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-md mb-6 mx-4">
              <form onSubmit={handleFilterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                      Project ID
                    </label>
                    <input
                      type="text"
                      id="projectId"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder="Filter by project ID"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-1">
                      Event ID
                    </label>
                    <input
                      type="text"
                      id="eventId"
                      value={eventId}
                      onChange={(e) => setEventId(e.target.value)}
                      placeholder="Filter by event ID"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="get"
                  >
                    Apply Filters
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={toggleSortDirection}
                  >
                    <div className="flex items-center">
                      Total Score
                      {sortDirection === 'desc' ? (
                        <ArrowDown size={14} className="ml-1" />
                      ) : (
                        <ArrowUp size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-mono">{user.userId.substring(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div>
              <label htmlFor="limit" className="text-sm text-gray-600 mr-2">
                Items per page:
              </label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setOffset(0); // Reset to first page on limit change
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={offset === 0}
                className={`flex items-center px-3 py-1 border rounded-md text-sm ${
                  offset === 0
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {Math.floor(offset / limit) + 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={totalUsers > 0 && offset + limit >= totalUsers}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </ApiPanel>
    </div>
  );
};

export default Leaderboard;