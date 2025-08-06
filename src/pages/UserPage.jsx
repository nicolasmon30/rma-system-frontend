import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Loader2,
  Users,
  Search,
  Filter,
  X,
  RefreshCw,
  Shield
} from 'lucide-react';

// Componentes locales existentes
import { UserHeader } from "../components/users/UserHeader";
import UserStats from '../components/users/UserStats';
import UserTable from '../components/users/UserTable';

// Hooks existentes
import { usePermissions } from '../hooks/usePermissions';
import { useUsers } from '../hooks/users/useUsers';
import { useDebounce } from '../hooks/useDebounce';
import { ProtectedComponent } from '../components/layout/ProtectedComponent';
import { UserRoleBadge } from '../components/users/UserRoleBadge';

const UserPage = () => {
  // Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados locales para modal de cambio de rol
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleChangeModalOpen, setIsRoleChangeModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('USER');
  const [isChangingRole, setIsChangingRole] = useState(false);

  // Permisos
  const { PERMISSIONS, can } = usePermissions();
  const canChangeRoles = can(PERMISSIONS.USER.MANAGE_ROLES);

  // Hook de usuarios existente
  const { users, isLoading, totalUsers, totalPages, loadUsers } = useUsers();

  // Debounce del término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Parámetros de búsqueda memoizados
  const searchParams = useMemo(() => ({
    search: debouncedSearchTerm,
    role: roleFilter !== 'ALL' ? roleFilter : undefined,
    countryId: countryFilter !== 'ALL' ? countryFilter : undefined,
    page: currentPage,
    limit: itemsPerPage,
  }), [debouncedSearchTerm, roleFilter, countryFilter, currentPage, itemsPerPage]);

  // Cargar usuarios cuando cambien los parámetros
  useEffect(() => {
    loadUsers(searchParams);
  }, [loadUsers, searchParams]);

  // Reset página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, countryFilter, statusFilter]);

  // Obtener países únicos de los usuarios
  const availableCountries = useMemo(() => {
    const countryMap = new Map();

    users.forEach(user => {
      user.countries?.forEach(country => {
        if (!countryMap.has(country.id)) {
          countryMap.set(country.id, country);
        }
      });
    });

    return Array.from(countryMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [users]);

  // Filtrar usuarios localmente por estado
  const filteredUsers = useMemo(() => {
    if (statusFilter === 'ALL') return users;

    return users.filter(user => {
      if (statusFilter === 'ACTIVE') return user.isActive;
      if (statusFilter === 'INACTIVE') return !user.isActive;
      return true;
    });
  }, [users, statusFilter]);

  // Información de paginación
  const paginationInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      startIndex,
      endIndex,
      showingFrom: startIndex + 1,
      showingTo: Math.min(endIndex, totalUsers)
    };
  }, [currentPage, itemsPerPage, totalUsers]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' ||
      roleFilter !== 'ALL' ||
      countryFilter !== 'ALL' ||
      statusFilter !== 'ALL';
  }, [searchTerm, roleFilter, countryFilter, statusFilter]);

  // Funciones de actualización de filtros
  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const updateRoleFilter = useCallback((role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  }, []);

  const updateCountryFilter = useCallback((country) => {
    setCountryFilter(country);
    setCurrentPage(1);
  }, []);

  const updateStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const changeItemsPerPage = useCallback((items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setRoleFilter('ALL');
    setCountryFilter('ALL');
    setStatusFilter('ALL');
    setCurrentPage(1);
  }, []);

  const refresh = useCallback(() => {
    loadUsers(searchParams);
  }, [loadUsers, searchParams]);

  const changePage = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Manejar cambio de rol
   */
  const handleRoleChange = useCallback((user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleChangeModalOpen(true);
  }, []);

  /**
   * Confirmar cambio de rol
   */
  const confirmRoleChange = useCallback(async () => {
    if (!selectedUser || !canChangeRoles) return;

    try {
      setIsChangingRole(true);

      // Aquí iría la llamada al servicio para cambiar el rol
      // await userService.changeUserRole(selectedUser.id, newRole);

      // Por ahora simulamos el cambio localmente
      console.log(`Cambiando rol de ${selectedUser.nombre} ${selectedUser.apellido} a ${newRole}`);

      // Cerrar modal y refrescar datos
      setIsRoleChangeModalOpen(false);
      setSelectedUser(null);
      refresh();

    } catch (error) {
      console.error('Error al cambiar rol:', error);
      // Aquí podrías mostrar un toast o notificación de error
    } finally {
      setIsChangingRole(false);
    }
  }, [selectedUser, newRole, canChangeRoles, refresh]);

  /**
   * Generar números de página para la paginación
   */
  const generatePageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Opciones para selectores
  const roleOptions = [
    { value: 'ALL', label: 'Todos los Roles' },
    { value: 'USER', label: 'Usuario' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'SUPERADMIN', label: 'Super Admin' },
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Todos los Estados' },
    { value: 'ACTIVE', label: 'Activos' },
    { value: 'INACTIVE', label: 'Inactivos' },
  ];

  const itemsPerPageOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ];

  // Opciones para el cambio de rol
  const roleChangeOptions = [
    { value: 'USER', label: 'Usuario' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'SUPERADMIN', label: 'Super Admin' },
  ];

  // Mostrar error si existe
  if (false) { // Cambiar por error cuando esté disponible
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error al cargar usuarios</h2>
          <p className="text-gray-600 mb-4">Error message here</p>
          <Button onClick={refresh}>Intentar nuevamente</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <UserHeader />

      {/* Filtros de búsqueda integrados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {/* Primera fila: Búsqueda y acciones principales */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Campo de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, email, empresa..."
                  value={searchTerm}
                  onChange={(e) => updateSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                {searchTerm && (
                  <button
                    onClick={() => updateSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                    Limpiar
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={refresh}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
              </div>
            </div>

            {/* Segunda fila: Filtros específicos */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Filtro de rol */}
              <div className="flex items-center gap-2 min-w-0">
                <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Select
                  value={roleFilter}
                  onValueChange={updateRoleFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de país */}
              <div className="flex items-center gap-2 min-w-0">
                <Select
                  value={countryFilter}
                  onValueChange={updateCountryFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="País" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los Países</SelectItem>
                    {availableCountries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de estado */}
              <div className="flex items-center gap-2 min-w-0">
                <Select
                  value={statusFilter}
                  onValueChange={updateStatusFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Items por página */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600 whitespace-nowrap">Mostrar:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => changeItemsPerPage(Number(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {itemsPerPageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Indicador de filtros activos */}
            {hasActiveFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Filter className="h-4 w-4" />
                  <span>Filtros activos:</span>
                  <div className="flex gap-2">
                    {searchTerm && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Búsqueda: "{searchTerm}"
                      </span>
                    )}
                    {roleFilter !== 'ALL' && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Rol: {roleOptions.find(r => r.value === roleFilter)?.label}
                      </span>
                    )}
                    {countryFilter !== 'ALL' && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                        País: {availableCountries.find(c => c.id === countryFilter)?.nombre}
                      </span>
                    )}
                    {statusFilter !== 'ALL' && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        Estado: {statusOptions.find(s => s.value === statusFilter)?.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <UserStats users={users} countries={availableCountries} />

        {/* Información de paginación */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Mostrando {paginationInfo.showingFrom} a {paginationInfo.showingTo} de {totalUsers} usuarios
              </p>
              {hasActiveFilters && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Filtrado
                </span>
              )}
            </div>
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Cargando usuarios...</span>
            </div>
          </div>
        ) : (
          <UserTable
            filteredUsers={users}
            currentUsers={users}
            onRoleChange={canChangeRoles ? handleRoleChange : undefined}
          />
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && !isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      changePage(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        changePage(page);
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      changePage(currentPage + 1);
                    }
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}


      {/* Modal de cambio de rol */}

      {/* Modal de cambio de rol */}
      <ProtectedComponent permission={PERMISSIONS.USER.MANAGE_ROLES}>
        <Dialog open={isRoleChangeModalOpen} onOpenChange={setIsRoleChangeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Cambiar Rol de Usuario
              </DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-secondary">{selectedUser.nombre} {selectedUser.apellido}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">Rol actual:</span>
                    <UserRoleBadge role={selectedUser.role} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Nuevo Rol
                  </label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleChangeOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={option.value === selectedUser.role}
                        >
                          {option.label}
                          {option.value === selectedUser.role && ' (Actual)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {newRole !== selectedUser.role && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Advertencia
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Esta acción cambiará los permisos del usuario. Asegúrate de que es lo que deseas hacer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoleChangeModalOpen(false)}
                disabled={isChangingRole}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmRoleChange}
                disabled={isChangingRole || newRole === selectedUser?.role}
                className="flex items-center gap-2"
              >
                {isChangingRole && <Loader2 className="h-4 w-4 animate-spin" />}
                {isChangingRole ? 'Cambiando...' : 'Confirmar Cambio'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ProtectedComponent>

    </>
  );
};

export default UserPage;