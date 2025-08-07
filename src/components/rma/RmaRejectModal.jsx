import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const RmaRejectModal = ({ open, onOpenChange, onConfirm, loading }) => {
    const [rejectionReason, setRejectionReason] = useState('');

    const handleSubmit = () => {
        if (!rejectionReason.trim()) return;
        onConfirm(rejectionReason);
        setRejectionReason('');
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange} className="font-poppins">
            <DialogContent className="font-poppins">
                <DialogHeader>
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Rechazar Solicitud RMA
                    </DialogTitle>
                    <DialogDescription>
                        Por favor, proporciona una razón detallada para el rechazo de este RMA.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div>
                        <label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-2 block">
                            Razón del Rechazo *
                        </label>
                        <textarea
                            id="reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Proporcione una explicación detallada del motivo del rechazo..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!rejectionReason.trim() || loading}
                        variant="destructive"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Rechazo'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RmaRejectModal