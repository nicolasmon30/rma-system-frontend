import { useState, useEffect } from 'react';
import { HttpClient } from '../services/api/httpClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const httpClient = new HttpClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');

export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await httpClient.get(API_ENDPOINTS.COUNTRIES.LIST);
        
        if (response.success) {
          setCountries(response.data);
        } else {
          throw new Error(response.message || 'Error al cargar países');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}