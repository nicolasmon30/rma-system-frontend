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
import { Eye, CheckCircle, XCircle, Settings } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { ProtectedComponent } from '../layout/ProtectedComponent';
import RmaRejectModal from './RmaRejectModal';
import { RmaStatusManagerModal } from './RmaStatusManagerModal';


const RmaTable = ({ rmas, user, onApprove, onReject, loading, onStatusUpdate }) => {
    console.log("user of table", user, rmas)
    const { PERMISSIONS } = usePermissions();
    const [selectedRMA, setSelectedRMA] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [rmaToReject, setRmaToReject] = useState(null);

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
    const handleQuickApprove = async (rma) => {
        try {
            await onApprove(rma.id);
            console.log('Aprobada con Exito')
            // Puedes añadir una notificación de éxito aquí
        } catch (error) {
            console.error('Error approving RMA:', error);
            // Mostrar error al usuario
        }
    };

    const handleQuickReject = (rma) => {
        setRmaToReject(rma);
    };

    const handleRejectConfirm = async (rejectionReason) => {
        try {
            await onReject(rmaToReject.id, rejectionReason);
            setRmaToReject(null);
            // Puedes añadir una notificación de éxito aquí
        } catch (error) {
            console.error('Error rejecting RMA:', error);
            // Mostrar error al usuario
        }
    };

    const handleAdminManage = (rma) => {
        console.log(rma)
        setSelectedRMA(rma);
        setIsAdminModalOpen(true);
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
                                            <span className="text-sm text-gray-600">
                                                {formatDate(rma.createdAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="flex gap-2 justify-end">
                                            {
                                                rma.status === 'RMA_SUBMITTED' && (
                                                    <>
                                                        <ProtectedComponent permission={PERMISSIONS.RMA.CHANGE_STATUS}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleQuickApprove(rma)}
                                                                className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                                disabled={loading}
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                                Aprobar
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleQuickReject(rma)}
                                                                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                                Rechazar
                                                            </Button>
                                                        </ProtectedComponent>
                                                    </>
                                                )
                                            }
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(rma)}
                                                className="flex items-center gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver Detalles
                                            </Button>
                                            {
                                                rma.status != 'REJECTED' && (
                                                    <ProtectedComponent permission={PERMISSIONS.RMA.CHANGE_STATUS}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAdminManage(rma)}
                                                            className="flex items-center gap-2 text-primary hover:text-primary/80"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            Gestionar
                                                        </Button>

                                                    </ProtectedComponent>
                                                )
                                            }
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
            {/* Reject Dialog */}
            <RmaRejectModal
                open={!!rmaToReject}
                onOpenChange={(open) => !open && setRmaToReject(null)}
                onConfirm={handleRejectConfirm}
                loading={loading}
            />

            {/* Modal Change Status */}
            <RmaStatusManagerModal
                rma={selectedRMA}
                open={isAdminModalOpen}
                onOpenChange={setIsAdminModalOpen}
                onStatusUpdate={onStatusUpdate}
            />
        </>
    )
}

export default RmaTable