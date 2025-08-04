import { Badge } from "@/components/ui/badge";


const statusConfig = {
  RMA_SUBMITTED: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Enviado' },
  AWAITING_GOODS: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Esperando Mercancía' },
  EVALUATING: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Evaluando' },
  PROCESSING: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Procesando' },
  PAYMENT: { color: 'bg-pink-100 text-pink-800 border-pink-200', label: 'Pago' },
  IN_SHIPPING: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'En Envío' },
  COMPLETE: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Completado' },
  REJECTED: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rechazado' },
};

export function StatusBadge(status) {
  const config = statusConfig[status.status];
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} font-medium`}
    >
      {config.label}
    </Badge>
  );
}