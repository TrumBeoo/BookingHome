import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

export const useUsers = (initialParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUsers({
        ...initialParams,
        ...params,
        skip: params.page * params.limit || 0,
        limit: params.limit || 10,
      });
      
      setUsers(response.items || response.users || []);
      setPagination({
        page: params.page || 0,
        limit: params.limit || 10,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / (params.limit || 10)),
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      const updatedUser = await userService.updateUser(userId, userData);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateUserStatus = useCallback(async (userId, status) => {
    try {
      const updatedUser = await userService.updateUserStatus(userId, status);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const sendBulkEmail = useCallback(async (userIds, emailData) => {
    try {
      return await userService.sendBulkEmail(userIds, emailData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchUsers(initialParams);
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUser,
    updateUserStatus,
    deleteUser,
    sendBulkEmail,
    refetch: () => fetchUsers(initialParams),
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUserStats();
      setStats(response);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

export const useUserDetails = (userId) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [userResponse, bookingsResponse, propertiesResponse] = await Promise.allSettled([
        userService.getUserById(userId),
        userService.getUserBookings(userId),
        userService.getHostProperties(userId),
      ]);

      if (userResponse.status === 'fulfilled') {
        setUser(userResponse.value);
      }
      
      if (bookingsResponse.status === 'fulfilled') {
        setBookings(bookingsResponse.value.items || []);
      }
      
      if (propertiesResponse.status === 'fulfilled') {
        setProperties(propertiesResponse.value.items || []);
      }

      // If any request failed, set error from the first failed one
      const failedRequest = [userResponse, bookingsResponse, propertiesResponse]
        .find(result => result.status === 'rejected');
      
      if (failedRequest) {
        setError(failedRequest.reason.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return {
    user,
    bookings,
    properties,
    loading,
    error,
    refetch: fetchUserDetails,
  };
};