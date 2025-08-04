import { StatusBadge } from "../rma/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, MapPin, Package, Calendar, AlertCircle, Building2, Hash } from "lucide-react";


export function RMADetailModal({ rma, open, onOpenChange }) {
  if (!rma) return null;

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date) => {
    const dateFormat = new Date(date);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateFormat);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-secondary">Detalles de RMA</span>
            <StatusBadge status={rma.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Información de la Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Nombre</p>
                <p className="text-sm text-gray-900">{rma.nombreEmpresa}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Código Postal</p>
                <p className="text-sm text-gray-900">{rma.codigoPostal}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700">Dirección</p>
                <p className="text-sm text-gray-900">{rma.direccion}</p>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Información del Servicio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Servicio</p>
                <p className="text-sm text-gray-900">{rma.servicio}</p>
              </div>
              {rma.numeroTracking && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Número de Tracking</p>
                  <p className="text-sm font-mono text-secondary bg-white px-2 py-1 rounded border">
                    {rma.numeroTracking}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Products Section */}
          {rma.products && rma.products.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Productos ({rma.products.length})
              </h3>
              <div className="space-y-3">
                {rma.products.map((productItem, index) => (
                  <Card key={productItem.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Producto</p>
                          <p className="text-sm text-gray-900 font-semibold">{productItem.product.nombre}</p>
                          <p className="text-xs text-gray-600">Marca: {productItem.product.brand.nombre}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Modelo</p>
                          <p className="text-sm text-gray-900">{productItem.model}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Número de Serie</p>
                          <p className="text-sm font-mono text-secondary bg-white px-2 py-1 rounded border">
                            {productItem.serial}
                          </p>
                        </div>
                        {productItem.reporteEvaluacion && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Reporte de Evaluación</p>
                            <p className="text-sm text-gray-900">{productItem.reporteEvaluacion}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {rma.razonRechazo && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Razón de Rechazo
              </h3>
              <p className="text-sm text-red-700">{rma.razonRechazo}</p>
            </div>
          )}

          {/* File Downloads */}
          {(rma.cotizacion || rma.ordenCompra) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Archivos Disponibles
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                {rma.cotizacion && (
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(rma.cotizacion)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar Cotización
                  </Button>
                )}

                {rma.ordenCompra && (
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(rma.ordenCompra)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar Orden de Compra
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Fechas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Fecha de Creación</p>
                <p className="text-sm text-gray-900">{formatDate(rma.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Última Actualización</p>
                <p className="text-sm text-gray-900">{formatDate(rma.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}