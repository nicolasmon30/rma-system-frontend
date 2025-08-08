import { useState } from 'react';
import { useAuth } from '../contexts/auth/AuthContext';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import RmaTable from '../components/rma/RmaTable';
import { CreateRMAModal } from '../components/rma/CreateRMAModal';
import { createRmaService } from '../services/rma/createService';
import { useRma } from '../hooks/rma/useRma';
import RmaList from '../components/rma/RmaList';
import RmaStats from '../components/rma/RmaStats';

export function DashboardPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const rmaService = createRmaService(import.meta.env.VITE_API_BASE_URL);

  const { rmas, loading, error, addRma, approveRma, rejectRma, markAsEvaluating, markAsPayment, markAsProcessing } = useRma()

  const filteredRMAs = rmas.filter((rma) => {
    const matchesSearch = rma.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rma.servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rma.numeroTracking?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || rma.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredRMAs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRMAs = filteredRMAs.slice(startIndex, endIndex);

  const handleStatusUpdate = async (rmaId, newStatus, file) => {
    switch (newStatus) {
      case 'EVALUATING':
        return markAsEvaluating(rmaId);
      case 'PAYMENT':
          return markAsPayment(rmaId, file);
      case 'PROCESSING':
          return markAsProcessing(rmaId, file);
      // Puedes añadir más casos para otros estados aquí
      default:
        throw new Error(`Status transition not implemented: ${newStatus}`);
    }
  };

  return (
    <div className="flex-1 font-poppins">
      <div className="bg-[#0D2941] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">RMA'S</h1>
              <p className="text-gray-300 mt-1">Gestión de solicitudes de autorización de devolución</p>
            </div>
            <div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nueva RMA
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Status Filter */}
            {/* Items per page */}
          </div>
        </div>
      </div>
      {/* Stats */}
      <RmaStats rmas={rmas} />
      {/* RMA List */}
      <RmaList startIndex={startIndex} endIndex={endIndex} totalItems={totalItems} totalPages={totalPages} currentPage={currentPage} />

      {/* RMA Table */}
      <RmaTable rmas={rmas} user={user} loading={loading} onApprove={approveRma} onReject={rejectRma} onStatusUpdate={handleStatusUpdate} />
      {/* Create RMA Modal */}
      <CreateRMAModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        rmaService={rmaService}
        onRmaCreated={addRma}
      />

    </div>
  );
}
