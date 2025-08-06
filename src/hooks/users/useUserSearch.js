import { useState, useEffect, useCallback, useMemo } from 'react';
import { userService } from '../../services/users/userService';
import { useDebounce } from '../useDebounce';

/**
 * Hook para manejar la búsqueda y filtrado de usuarios
 * @param {Object} initialFilters - Filtros iniciales
 * @returns {Object} Estado y funciones de búsqueda
 */

export const useUserSearch = (initialFilters = {}) => {
    const [users, setUSers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [countryFilter, setCountryFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Debounce del término de búsqueda para evitar muchas peticiones
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Memoizar parámetros de búsqueda para evitar re-renders innecesarios
    const searchParams = useMemo(() => ({
        search: debouncedSearchTerm,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        countryId: countryFilter !== 'ALL' ? countryFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
        ...initialFilters
    }), [
        debouncedSearchTerm,
        roleFilter,
        countryFilter,
        currentPage,
        itemsPerPage,
        initialFilters
    ]);

    /**
  * Función principal para cargar usuarios
  */
    const loadUsers = useCallback(async (params = searchParams) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await userService.getUsers(params);

            if (response.success) {
                setUsers(response.data.users);
                setTotalUsers(response.data.pagination.total);
                setTotalPages(response.data.pagination.totalPages);
            } else {
                throw new Error(response.message || 'Error al cargar usuarios');
            }
        } catch (err) {
            console.error('Error loading users:', err);
            setError(err.message);
            setUsers([]);
            setTotalUsers(0);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    /**
     * Actualizar término de búsqueda
     */
    const updateSearchTerm = useCallback((term) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset a primera página
    }, []);

    /**
     * Actualizar filtro de rol
     */
    const updateRoleFilter = useCallback((role) => {
        setRoleFilter(role);
        setCurrentPage(1);
    }, []);

    /**
     * Actualizar filtro de país
     */
    const updateCountryFilter = useCallback((country) => {
        setCountryFilter(country);
        setCurrentPage(1);
    }, []);

    /**
     * Actualizar filtro de estado
     */
    const updateStatusFilter = useCallback((status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    }, []);

    /**
     * Cambiar página
     */
    const changePage = useCallback((page) => {
        setCurrentPage(page);
        // Scroll suave al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /**
     * Cambiar items por página
     */
    const changeItemsPerPage = useCallback((items) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    }, []);

    /**
     * Limpiar todos los filtros
     */
    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setRoleFilter('ALL');
        setCountryFilter('ALL');
        setStatusFilter('ALL');
        setCurrentPage(1);
    }, []);

    /**
     * Refrescar datos
     */
    const refresh = useCallback(() => {
        loadUsers();
    }, [loadUsers]);

    // Efecto para cargar usuarios cuando cambien los parámetros
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Información de paginación calculada
    const paginationInfo = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return {
            startIndex,
            endIndex,
            currentCount: users.length,
            showingFrom: startIndex + 1,
            showingTo: Math.min(endIndex, totalUsers)
        };
    }, [currentPage, itemsPerPage, users.length, totalUsers]);

    // Estado de filtros activos
    const hasActiveFilters = useMemo(() => {
        return searchTerm !== '' ||
            roleFilter !== 'ALL' ||
            countryFilter !== 'ALL' ||
            statusFilter !== 'ALL';
    }, [searchTerm, roleFilter, countryFilter, statusFilter]);

    return {
        // Datos
        users,
        totalUsers,
        totalPages,
        paginationInfo,

        // Estados
        isLoading,
        error,
        hasActiveFilters,

        // Filtros actuales
        searchTerm,
        roleFilter,
        countryFilter,
        statusFilter,
        currentPage,
        itemsPerPage,

        // Acciones de filtros
        updateSearchTerm,
        updateRoleFilter,
        updateCountryFilter,
        updateStatusFilter,
        clearFilters,

        // Acciones de paginación
        changePage,
        changeItemsPerPage,

        // Acciones generales
        refresh,
        loadUsers
    };
}