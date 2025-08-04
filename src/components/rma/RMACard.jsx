import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../rma/StatusBadge";
import { Download, MapPin, Package, Calendar, AlertCircle } from "lucide-react";


export function RMACard({ rma }) {
    console.log(rma.status)
  const handleDownload = (file) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-[#399B7C]">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-[#0D2941]">
            {rma.nombreEmpresa}
          </CardTitle>
          <StatusBadge status={rma.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-[#399B7C] mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Dirección</p>
              <p className="text-sm text-gray-600">{rma.direccion}</p>
              <p className="text-sm text-gray-600">CP: {rma.codigoPostal}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-[#399B7C] mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Servicio</p>
              <p className="text-sm text-gray-600">{rma.servicio}</p>
            </div>
          </div>
        </div>

        {/* Tracking Number */}
        {rma.numeroTracking && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Número de Tracking</p>
            <p className="text-sm font-mono text-[#0D2941]">{rma.numeroTracking}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {rma.razonRechazo && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Razón de Rechazo</p>
                <p className="text-sm text-red-700">{rma.razonRechazo}</p>
              </div>
            </div>
          </div>
        )}

        {/* File Downloads */}
        <div className="flex flex-col sm:flex-row gap-2">
          {rma.cotizacion && (
            <Button
              variant="outline"
              size="sm"
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
              size="sm"
              onClick={() => handleDownload(rma.ordenCompra)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar Orden de Compra
            </Button>
          )}
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">Creado</p>
              <p className="text-xs text-gray-600">{formatDate(rma.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">Actualizado</p>
              <p className="text-xs text-gray-600">{formatDate(rma.updatedAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}