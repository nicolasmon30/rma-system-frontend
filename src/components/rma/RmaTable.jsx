import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StatusBadge } from '../rma/StatusBadge';
import { Button } from '@/components/ui/button';
import { RMADetailModal } from "./RMADetailModal";
import { Filter, Search, RefreshCw, Eye } from 'lucide-react';
const RmaTable = ({ rmas , user }) => {
    console.log("user of table", user, rmas)
    const [selectedRMA, setSelectedRMA] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatDate = (date) => {
        const dateFormat = new Date(date);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(dateFormat);
    };

    const handleViewDetails = (rma) => {
        setSelectedRMA(rma);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden ">
                    {rmas.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">
                                No hay rmas en esta pagina
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Empresa</TableHead>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Tracking</TableHead>
                                    <TableHead>Creado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rmas.map((rma) => (
                                    <TableRow key={rma.id} className="cursor-pointer hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <div>
                                                <p className="font-semibold text-secondary">{rma.nombreEmpresa}</p>
                                                <p className="text-sm text-gray-500">{rma.direccion}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">{rma.servicio}</p>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={rma.status} />
                                        </TableCell>
                                        <TableCell>
                                            {rma.numeroTracking ? (
                                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {rma.numeroTracking}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">
                                                {formatDate(rma.createdAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(rma)}
                                                className="flex items-center gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver Detalles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
            {/* Detail Modal */}
            <RMADetailModal
                rma={selectedRMA}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    )
}

export default RmaTable