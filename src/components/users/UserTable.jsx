import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRoleBadge } from "./UserRoleBadge";
import {
    Users,
    Settings,
} from 'lucide-react';

import { usePermissions } from "../../hooks/usePermissions";
import { ProtectedComponent } from "../layout/ProtectedComponent";

const UserTable = ({ filteredUsers = [],
    currentUsers = [],
    onRoleChange,
    isLoading = false }) => {

    const { PERMISSIONS } = usePermissions();

    const formatDate = (date) => {
        const dateFormat = new Date(date);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(dateFormat);
    };

    /**
         * ✅ NUEVA: Función para renderizar países con tu layout original
         * Pero con lógica mejorada para múltiples países
         */
    const renderCountries = (countries) => {
        if (!countries || !Array.isArray(countries) || countries.length === 0) {
            return (
                <div className="flex items-center gap-1 text-gray-400">
                    <Globe className="h-3 w-3" />
                    <span className="text-xs">Sin países</span>
                </div>
            );
        }

        // Extraer datos del país (manejar formato con relación o directo)
        const countryNames = countries.map(country => {
            const countryData = country.country || country;
            return countryData?.nombre || 'País desconocido';
        });

        // Si es un solo país, mostrarlo simple
        if (countryNames.length === 1) {
            return (
                <div className="flex items-center gap-1">
                    <span className="text-sm">{countryNames[0]}</span>
                </div>
            );
        }

        return (
            <div className="space-y-1">
                <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">
                        {countryNames.length} países
                    </span>
                </div>
                <div className="text-sm text-gray-600">
                    {/* Mostrar los primeros 2 países */}
                    {countryNames.slice(0, 2).join(', ')}
                    {countryNames.length > 2 && (
                        <span className="text-gray-400">
                            {' '}+{countryNames.length - 2} más
                        </span>
                    )}
                </div>
            </div>
        );
    }

    /**
     * ✅ MANTENER: Función para mostrar el botón de cambiar rol
     */
    const shouldShowRoleButton = (user) => {
        return onRoleChange && !isLoading;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {currentUsers.length === 0 ? (
                <div className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">
                        {filteredUsers.length === 0
                            ? "No se encontraron usuarios que coincidan con los filtros."
                            : "No hay usuarios en esta página."
                        }
                    </p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>País</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Registrado</TableHead>
                            <ProtectedComponent permission={PERMISSIONS.USER.MANAGE_ROLES}>
                                <TableHead className="text-right">Acciones</TableHead>
                            </ProtectedComponent>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50">
                                <TableCell>
                                    <div>
                                        <p className="font-semibold text-secondary">{user.nombre} {user.apellido}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {renderCountries(user.countries)}
                                </TableCell>
                                <TableCell>
                                    <UserRoleBadge role={user.role} />
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">
                                        {formatDate(user.createdAt)}
                                    </span>
                                </TableCell>
                                {shouldShowRoleButton(user) && (
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onRoleChange(user)}
                                            className="flex items-center gap-2 text-primary hover:text-primary/80"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Cambiar Rol
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default UserTable