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
const UserTable = ({ filteredUsers, currentUsers }) => {
    const formatDate = (date) => {
        const dateFormat = new Date(date);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(dateFormat);
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
                            <TableHead className="text-right">Acciones</TableHead>
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
                                    {

                                        user?.countries.map((country) => (
                                            <span key={country.id} className="text-sm">{country.nombre}</span>
                                        ))
                                    }
                                </TableCell>
                                <TableCell>
                                    <UserRoleBadge role={user.role} />
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">
                                        {formatDate(user.createdAt)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRoleChange(user)}
                                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Cambiar Rol
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default UserTable