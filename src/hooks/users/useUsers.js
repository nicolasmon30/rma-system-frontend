import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/users/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const loadUsers = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers(params);
      
      if (response.success) {
        setUsers(response.data.users);
        setTotalUsers(response.data.pagination.total);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, totalUsers, totalPages, loadUsers };
};