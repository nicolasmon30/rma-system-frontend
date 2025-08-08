// src/hooks/brands/useBrands.js
import { useState, useEffect, useCallback } from 'react';
import { brandService } from '../../services/brand/brandService';

export function useBrands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
    });

    const brandServices = brandService(import.meta.env.VITE_API_BASE_URL);

    /**
     * Cargar marcas con filtros
     */
    const fetchBrands = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await brandServices.getAllBrands({
                page: pagination.page,
                limit: pagination.limit,
                ...params
            });

            if (response.brands) {
                setBrands(response.brands);
                setPagination(response.pagination || pagination);
            } else {
                // Si no hay estructura de paginación, asumir que es un array directo
                setBrands(Array.isArray(response) ? response : []);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching brands:', err);
            setBrands([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit]);

    /**
     * Crear nueva marca
     */
    const createBrand = async (brandData) => {
        try {
            setLoading(true);
            const newBrand = await brandServices.createBrand(brandData);
            
            // Agregar la nueva marca al estado
            setBrands(prev => [newBrand, ...prev]);
            
            return newBrand;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualizar marca
     */
    const updateBrand = async (brandId, brandData) => {
        try {
            setLoading(true);
            const updatedBrand = await brandServices.updateBrand(brandId, brandData);
            
            // Actualizar la marca en el estado
            setBrands(prev => prev.map(brand => 
                brand.id === brandId ? updatedBrand : brand
            ));
            
            return updatedBrand;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Eliminar marca
     */
    const deleteBrand = async (brandId) => {
        try {
            setLoading(true);
            const result = await brandServices.deleteBrand(brandId);
            
            // Remover la marca del estado
            setBrands(prev => prev.filter(brand => brand.id !== brandId));
            
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Buscar marcas
     */
    const searchBrands = async (searchTerm, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const results = await brandServices.searchBrands(searchTerm, options);
            setBrands(Array.isArray(results) ? results : []);
            return results;
        } catch (error) {
            setError(error.message);
            setBrands([]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtener estadísticas de marcas
     */
    const getBrandStats = async () => {
        try {
            const stats = await brandServices.getBrandStats();
            return stats;
        } catch (error) {
            console.error('Error getting brand stats:', error);
            return null;
        }
    };

    /**
     * Cambiar página
     */
    const changePage = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    /**
     * Cambiar límite por página
     */
    const changeLimit = (newLimit) => {
        setPagination(prev => ({ 
            ...prev, 
            limit: newLimit,
            page: 1 // Reset a primera página
        }));
    };

    /**
     * Limpiar error
     */
    const clearError = () => {
        setError(null);
    };

    /**
     * Refrescar datos
     */
    const refresh = () => {
        fetchBrands();
    };

    return {
        // Datos
        brands,
        loading,
        error,
        pagination,

        // Acciones
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand,
        searchBrands,
        getBrandStats,
        
        // Paginación
        changePage,
        changeLimit,
        
        // Utilidades
        clearError,
        refresh,
        setError
    };
}