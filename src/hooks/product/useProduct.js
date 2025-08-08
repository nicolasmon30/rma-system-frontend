// src/hooks/brands/useBrands.js
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../../services/product/productService';

export function useProduct() {
    const [products, setProducts] = useState([]);
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

    const productServices = productService(import.meta.env.VITE_API_BASE_URL);

    /**
     * Cargar marcas con filtros
     */
    const fetchProducts = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await productServices.getProducts({
                page: pagination.page,
                limit: pagination.limit,
                ...params
            });

            if (response.products) {
                setProducts(response.products);
                setPagination(response.pagination || pagination);
            } else {
                // Si no hay estructura de paginación, asumir que es un array directo
                setProducts(Array.isArray(response) ? response : []);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching Products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit]);

    /**
     * Crear nueva marca
     */
    const createProduct = async (productData) => {
        console.log(productData)
        try {
            console.log("Heerreee hooks")
            setLoading(true);
            const newProduct = await productServices.createProduct(productData);
            
            // Agregar la nueva marca al estado
            setProducts(prev => [newProduct, ...prev]);
            
            return newProduct;
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
    const updateProduct = async (productId, productData) => {
        try {
            setLoading(true);
            const updatedProduct = await productServices.updateProduct(productId, productData);
            
            // Actualizar la marca en el estado
            setProducts(prev => prev.map(product => 
                product.id === productId ? updatedProduct : product
            ));
            
            return updatedProduct;
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
    const deleteProduct = async (productId) => {
        try {
            setLoading(true);
            const result = await productServices.deleteProduct(productId);
            
            // Remover la marca del estado
            setProducts(prev => prev.filter(product => product.id !== productId));
            
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
    const searchProducts = async (searchTerm, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const results = await productServices.searchProduct(searchTerm, options);
            setProducts(Array.isArray(results) ? results : []);
            return results;
        } catch (error) {
            setError(error.message);
            setProducts([]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtener estadísticas de marcas
     */
    const getProductStats = async () => {
        try {
            const stats = await productServices.getProductStats();
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
        fetchProducts();
    };

    return {
        // Datos
        products,
        loading,
        error,
        pagination,

        // Acciones
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        getProductStats,
        
        // Paginación
        changePage,
        changeLimit,
        
        // Utilidades
        clearError,
        refresh,
        setError
    };
}