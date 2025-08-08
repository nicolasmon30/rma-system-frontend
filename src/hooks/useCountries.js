import { useState, useEffect } from 'react';
import { HttpClient } from '../services/api/httpClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { countryService } from '../services/country/countryService';

const httpClient = new HttpClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');

export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const countryServices = countryService(import.meta.env.VITE_API_BASE_URL);

  const fetchCountries = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await countryServices.getAllCountries({
              includeStats: true,
              ...params
      });
      console.log(response)
      
      setCountries(response);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching countries:', err);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  /**
     * Crear país
     */
    const createCountry = async (countryData) => {
        try {
            setLoading(true);
            const newCountry = await countryServices.createCountry(countryData);
            
            // Agregar el nuevo país al estado
            setCountries(prev => [newCountry, ...prev]);
            
            return newCountry;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualizar país
     */
    const updateCountry = async (countryId, countryData) => {
        try {
            setLoading(true);
            const updatedCountry = await countryServices.updateCountry(countryId, countryData);
            
            // Actualizar el país en el estado
            setCountries(prev => prev.map(country => 
                country.id === countryId ? updatedCountry : country
            ));
            
            return updatedCountry;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Eliminar país
     */
    const deleteCountry = async (countryId) => {
        try {
            setLoading(true);
            const result = await countryServices.deleteCountry(countryId);
            
            // Remover el país del estado
            setCountries(prev => prev.filter(country => country.id !== countryId));
            
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Buscar países
     */
    const searchCountries = async (searchTerm) => {
        await fetchCountries({ search: searchTerm });
    };

  return { countries, loading, error, fetchCountries , createCountry, updateCountry, deleteCountry , searchCountries, setError };
}