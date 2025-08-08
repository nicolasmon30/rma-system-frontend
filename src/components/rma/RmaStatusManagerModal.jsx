import { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
//import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowRight,
    Upload,
    FileText,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Package,
    DollarSign,
    Truck,
    Flag
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const RmaStatusManagerModal = ({ rma, open, onOpenChange, onStatusUpdate }) => {
    console.log(rma)
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [nextStatus, setNextStatus] = useState(null);
    const [quoteFile, setQuoteFile] = useState(null);
    const [confirmationData, setConfirmationData] = useState({});

    const getStatusLabel = (status) => {
        const labels = {
            'RMA_SUBMITTED': 'Enviado',
            'AWAITING_GOODS': 'Esperando Mercancía',
            'EVALUATING': 'Evaluando',
            'PAYMENT': 'Pago',
            'PROCESSING': 'Procesando',
            'IN_SHIPPING': 'En Envío',
            'COMPLETE': 'Completado',
            'REJECTED': 'Rechazado',
        };
        return labels[status] || status;
    };

    const getNextStatus = () => {
        const statusFlow = {
            'RMA_SUBMITTED': 'AWAITING_GOODS',
            'AWAITING_GOODS': 'EVALUATING',
            'EVALUATING': 'PAYMENT',
            'PAYMENT': 'PROCESSING',
            'PROCESSING': 'IN_SHIPPING',
            'IN_SHIPPING': 'COMPLETE',
            'COMPLETE': null,
            'REJECTED': null,
        };
        return statusFlow[rma?.status] || null;
    };

    const getStatusIcon = (status) => {
        const icons = {
            'RMA_SUBMITTED': Package,
            'AWAITING_GOODS': Package,
            'EVALUATING': FileText,
            'PAYMENT': DollarSign,
            'PROCESSING': FileText,
            'IN_SHIPPING': Truck,
            'COMPLETE': Flag,
            'REJECTED': XCircle,
        };
        const IconComponent = icons[status];
        return IconComponent;
    };

    const getStatusRequirements = (currentStatus, nextStatus) => {
        switch (currentStatus) {
            case 'EVALUATING':
                return nextStatus === 'PAYMENT' ? 'cotizacion' : null;
            case 'PAYMENT':
                return nextStatus === 'PROCESSING';
            case 'PROCESSING':
                return nextStatus === 'IN_SHIPPING' ;
            default:
                return null;
        }
    };

    const handleStatusAdvance = () => {
        const next = getNextStatus();
        if (!next) return;
        console.log(rma?.status)
        const requirement = getStatusRequirements(rma?.status, next);
        let data = {};
        if (requirement === 'cotizacion' && !quoteFile) {
            alert('Por favor, suba el archivo de cotización antes de continuar.');
            return;
        }

        if (requirement === 'cotizacion' && quoteFile) {
            data.cotizacion = {
                filename: quoteFile.name,
                url:quoteFile
            };
        }

        setNextStatus(next);
        setConfirmationData(data);
        setShowConfirmation(true);
    };

    const handleConfirmStatusChange = async () => {
        if (!nextStatus) return;
        console.log("file", nextStatus)
        try {
            if (nextStatus === 'PAYMENT' && confirmationData.cotizacion) {
                await onStatusUpdate(rma.id, nextStatus, confirmationData.cotizacion.url);
                setQuoteFile(null);
            } else {
                await onStatusUpdate(rma.id, nextStatus);
            }
            // Éxito - puedes añadir una notificación aquí
        } catch (error) {
            console.error('Error updating status:', error);
            // Manejar error - puedes mostrar una notificación de error
        } finally {
            setShowConfirmation(false);
            setNextStatus(null);
            onOpenChange(false);
            setConfirmationData(null);
        }
    };

    const nextStatusValue = getNextStatus();
    const StatusIcon = nextStatusValue ? getStatusIcon(nextStatusValue) : ArrowRight;
    const requirement = nextStatusValue ? getStatusRequirements(rma.status, nextStatusValue) : null;

    const getStatusDescription = (status) => {
        const descriptions = {
            'AWAITING_GOODS': 'Esperando recepción de los equipos del cliente',
            'EVALUATING': 'Evaluando el estado de los productos recibidos',
            'PAYMENT': 'Procesando cotización y esperando confirmación de pago',
            'PROCESSING': 'Procesando factura y preparando envío',
            'IN_SHIPPING': 'Productos en tránsito hacia el cliente',
            'COMPLETE': 'Proceso completado exitosamente',
        };
        return descriptions[status] || '';
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span className="text-secondary">Gestión de RMA - {rma?.nombreEmpresa}</span>
                            <StatusBadge status={rma?.status} />
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Current Status Information */}
                        <Card className="border-l-4 border-l-primary">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {(() => {
                                        const StatusIcon = getStatusIcon(rma?.status);
                                        return <StatusIcon className="h-5 w-5 text-primary" />;
                                    })()}
                                    Estado Actual: {rma?.status.replace('_', ' ')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{getStatusDescription(rma?.status)}</p>
                                {rma?.numeroTracking && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700">Número de Tracking:</p>
                                        <p className="font-mono text-secondary">{rma?.numeroTracking}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Advancement for other statuses */}
                        {nextStatusValue && rma?.status !== 'RMA_SUBMITTED' && rma?.status !== 'COMPLETE' && rma?.status !== 'REJECTED' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowRight className="h-5 w-5 text-primary" />
                                        Avanzar al Siguiente Estado
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <StatusBadge status={rma?.status} />
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                        <StatusBadge status={nextStatusValue} />
                                    </div>

                                    <p className="text-gray-600">
                                        Avanzar a: {getStatusLabel(nextStatusValue)} - {getStatusDescription(nextStatusValue)}
                                    </p>
                                    {/* File Upload Requirements */}
                                    {requirement === 'cotizacion' && (
                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">Subir Cotización *</Label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    onChange={(e) => setQuoteFile(e.target.files?.[0] || null)}
                                                    className="hidden"
                                                    id="cotizacion"
                                                />
                                                <label htmlFor="cotizacion" className="cursor-pointer">
                                                    <span className="text-primary hover:text-primary/80 font-medium">
                                                        Seleccionar archivo de cotización
                                                    </span>
                                                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (máx. 10MB)</p>
                                                </label>
                                                {quoteFile && (
                                                    <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                                                        <p className="text-sm text-green-800 font-medium">
                                                            ✓ Archivo seleccionado: {quoteFile.name}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            onClick={handleStatusAdvance}
                                            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                                            size="lg"

                                        >
                                            {(() => {
                                                const StatusIcon = getStatusIcon(nextStatusValue);
                                                return <StatusIcon className="h-5 w-5" />;
                                            })()}
                                            Avanzar a {getStatusLabel(nextStatusValue)}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                        }



                        {/* Completed Status */}
                        {rma?.status === 'COMPLETE' && (
                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                                            RMA Completado Exitosamente
                                        </h3>
                                        <p className="text-green-700">
                                            Este proceso de RMA ha sido completado. No se requieren más acciones.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Status Change Confirmation Dialog */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            Confirmar Cambio de Estado
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-gray-700">
                            ¿Está seguro de que desea cambiar el estado de esta RMA?
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-4 mb-3">
                                <StatusBadge status={rma?.status} />
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                                {nextStatus && <StatusBadge status={nextStatus} />}
                            </div>
                            <p className="text-sm text-gray-600">
                                <strong>RMA:</strong> {rma?.nombreEmpresa} (ID: {rma?.id})
                            </p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-800">
                                <strong>Nota:</strong> Esta acción no se puede deshacer. El estado cambiará inmediatamente.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmStatusChange} className="bg-primary hover:bg-primary/90">
                            Confirmar Cambio
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
