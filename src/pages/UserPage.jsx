// src/pages/UserPage.jsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
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
  Shield
} from 'lucide-react';

// Componentes locales existentes
import { UserHeader } from "../components/users/UserHeader";
import UserStats from '../components/users/UserStats';
import UserTable from '../components/users/UserTable';
import UserSearchFilters from '../components/users/UserSearchFilters';

// Hooks existentes
import { usePermissions } from '../hooks/usePermissions';
import { useUsers } from '../hooks/users/useUsers';
import { useDebounce } from '../hooks/useDebounce';
import { ProtectedComponent } from '../components/layout/ProtectedComponent';
import { UserRoleBadge } from '../components/users/UserRoleBadge';
import { UserTableSkeleton } from '../components/common/LoadingStates';
import { useUserRole } from '../hooks/users/useUserRole';

const UserPage = () => {
  // Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // Mantener para futuro uso
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados Update Role
  const { updateRole, loading: isChangingRole } = useUserRole();

  // Estados locales para modal de cambio de rol
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleChangeModalOpen, setIsRoleChangeModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('USER');
  //const [isChangingRole, setIsChangingRole] = useState(false);

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

  // ✅ MEJORAR: Obtener países únicos de los usuarios con mejor manejo
  const availableCountries = useMemo(() => {
    const countryMap = new Map();

    users.forEach(user => {
      // Verificar si user.countries existe y es un array
      if (user.countries && Array.isArray(user.countries)) {
        user.countries.forEach(country => {
          // Manejar tanto el formato directo como el formato con relación
          const countryData = country.country || country;
          if (countryData && countryData.id && !countryMap.has(countryData.id)) {
            countryMap.set(countryData.id, {
              id: countryData.id,
              nombre: countryData.nombre
            });
          }
        });
      }
    });

    return Array.from(countryMap.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  }, [users]);

  // ✅ CORREGIR: Filtrar usuarios localmente por TODOS los filtros
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // ✅ NUEVO: Filtrar por país localmente si es necesario
    // Nota: Este filtro local es adicional al filtro del servidor
    // Solo se aplica si hay un filtro de país seleccionado
    if (countryFilter !== 'ALL') {
      result = result.filter(user => {
        if (!user.countries || !Array.isArray(user.countries)) return false;

        return user.countries.some(userCountry => {
          const countryData = userCountry.country || userCountry;
          return countryData && countryData.id === countryFilter;
        });
      });
    }

    // ✅ MANTENER: Filtrar por estado (para uso futuro)
    if (statusFilter !== 'ALL') {
      result = result.filter(user => {
        if (statusFilter === 'ACTIVE') return user.isActive !== false; // Por defecto activo
        if (statusFilter === 'INACTIVE') return user.isActive === false;
        return true;
      });
    }

    return result;
  }, [users, countryFilter, statusFilter]);

  // ✅ MEJORAR: Información de paginación basada en usuarios filtrados
  const paginationInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalFiltered = filteredUsers.length;

    return {
      startIndex,
      endIndex,
      showingFrom: Math.min(startIndex + 1, totalFiltered),
      showingTo: Math.min(endIndex, totalFiltered),
      totalFiltered
    };
  }, [currentPage, itemsPerPage, filteredUsers.length]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' ||
      roleFilter !== 'ALL' ||
      countryFilter !== 'ALL' ||
      statusFilter !== 'ALL';
  }, [searchTerm, roleFilter, countryFilter, statusFilter]);

  // Funciones de callback para UserSearchFilters
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
      //setIsChangingRole(true);

      // Aquí iría la llamada al servicio para cambiar el rol
      // await userService.changeUserRole(selectedUser.id, newRole);

      console.log(`Cambiando rol de ${selectedUser.nombre} ${selectedUser.apellido} a ${newRole}`);

      const updatedUser = await updateRole(selectedUser.id, newRole, (user) => {
        // Callback opcional: actualizar usuario en la lista local si tienes una
        console.log('Usuario actualizado:', user);
        // Aquí podrías actualizar el estado local de usuarios si lo manejas
      });

      console.log('✅ Cambio de rol exitoso:', updatedUser);

      // Cerrar modal y refrescar datos
      setIsRoleChangeModalOpen(false);
      setSelectedUser(null);
      refresh();

    } catch (error) {
      console.error('Error al cambiar rol:', error);
    }
  }, [selectedUser, newRole, canChangeRoles, refresh]);

  /**
   * Generar números de página para la paginación
   */
  const generatePageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPagesCalculated = Math.ceil(filteredUsers.length / itemsPerPage);

    if (totalPagesCalculated <= maxVisiblePages) {
      for (let i = 1; i <= totalPagesCalculated; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPagesCalculated);
      } else if (currentPage >= totalPagesCalculated - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPagesCalculated - 3; i <= totalPagesCalculated; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPagesCalculated);
      }
    }

    return pages;
  }, [currentPage, filteredUsers.length, itemsPerPage]);

  // ✅ MEJORAR: Usuarios paginados localmente
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Calcular total de páginas basado en usuarios filtrados
  const totalPagesCalculated = Math.ceil(filteredUsers.length / itemsPerPage);

  // Opciones para el cambio de rol
  const roleChangeOptions = [
    { value: 'USER', label: 'Usuario' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'SUPERADMIN', label: 'Super Admin' },
  ];

  return (
    <>
      {/* Header */}
      <UserHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UserSearchFilters
          // Valores actuales
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          countryFilter={countryFilter}
          statusFilter={statusFilter}
          itemsPerPage={itemsPerPage}

          // Datos para opciones
          countries={availableCountries}

          // Estados
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}

          // Callbacks
          onSearchChange={updateSearchTerm}
          onRoleChange={updateRoleFilter}
          onCountryChange={updateCountryFilter}
          onStatusChange={updateStatusFilter}
          onItemsPerPageChange={changeItemsPerPage}
          onClearFilters={clearFilters}
          onRefresh={refresh}
        />

        {/* Stats - usar usuarios filtrados */}
        <UserStats users={filteredUsers} countries={availableCountries} />

        {/* ✅ MEJORAR: Información de paginación con datos correctos */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Mostrando {paginationInfo.showingFrom} a {paginationInfo.showingTo} de {paginationInfo.totalFiltered} usuarios
                {hasActiveFilters && filteredUsers.length !== users.length && (
                  <span className="text-gray-400 ml-1">
                    (de {users.length} total)
                  </span>
                )}
              </p>
              {hasActiveFilters && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Filtrado
                </span>
              )}
            </div>
            {totalPagesCalculated > 1 && (
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPagesCalculated}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading && users.length === 0 ? (
          // Skeleton loading para carga inicial
          <UserTableSkeleton rows={itemsPerPage} />
        ) : (
          // Tabla normal con overlay de loading para filtros
          <div className="relative">
            {/* Overlay de loading cuando se está filtrando */}
            {isLoading && users.length > 0 && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-gray-600">Actualizando...</span>
                </div>
              </div>
            )}

            <UserTable
              filteredUsers={filteredUsers}
              currentUsers={paginatedUsers}
              onRoleChange={canChangeRoles ? handleRoleChange : undefined}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* ✅ MEJORAR: Paginación con cálculos correctos */}
      {totalPagesCalculated > 1 && !isLoading && (
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
                    if (currentPage < totalPagesCalculated) {
                      changePage(currentPage + 1);
                    }
                  }}
                  className={currentPage === totalPagesCalculated ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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