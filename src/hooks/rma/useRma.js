import { useState, useEffect } from 'react';
import { rmaListService } from '../../services/rma/listService';

export function useRma() {
  const [rmas, setRmas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null
  });
  const rmaListServices = rmaListService(import.meta.env.VITE_API_BASE_URL);

  const fetchRmas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await rmaListServices.getAll(filters);
      console.log(response , Object.keys(response).length === 0)
      if (response) {
        setRmas(response);
      } else {
        throw new Error(response.message || 'Error al cargar rmas');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rmas:', err);
    } finally {
      setLoading(false);
    }
  };
  const addRma = (newRma) => {
    setRmas(prev => [newRma, ...prev]); 
  };
  useEffect(() => {
    fetchRmas();
  }, []);

  return { rmas, loading, error, addRma };
}