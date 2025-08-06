import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, RefreshCw } from 'lucide-react';

/**
 * Componente de filtros de búsqueda para usuarios
 * Memoizado para evitar re-renders innecesarios
 */
const UserSearchFilters = memo(({
  // Valores actuales
  searchTerm,
  roleFilter,
  countryFilter,
  statusFilter,
  itemsPerPage,
  
  // Datos para opciones
  countries = [],
  
  // Estados
  isLoading,
  hasActiveFilters,
  
  // Callbacks
  onSearchChange,
  onRoleChange,
  onCountryChange,
  onStatusChange,
  onItemsPerPageChange,
  onClearFilters,
  onRefresh
}) => {
  // Opciones de roles
  const roleOptions = [
    { value: 'ALL', label: 'Todos los Roles' },
    { value: 'USER', label: 'Usuario' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'SUPERADMIN', label: 'Super Admin' },
  ];

  // Opciones de estado
  const statusOptions = [
    { value: 'ALL', label: 'Todos los Estados' },
    { value: 'ACTIVE', label: 'Activos' },
    { value: 'INACTIVE', label: 'Inactivos' },
  ];

  // Opciones de items por página
  const itemsPerPageOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ];

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
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
                onClick={onClearFilters}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onRefresh}
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
              onValueChange={onRoleChange}
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
              onValueChange={onCountryChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los Países</SelectItem>
                {countries.map((country) => (
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
              onValueChange={onStatusChange}
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
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
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
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
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
                  País: {countries.find(c => c.id === countryFilter)?.nombre}
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
  );
});

UserSearchFilters.displayName = 'UserSearchFilters';

export default UserSearchFilters;