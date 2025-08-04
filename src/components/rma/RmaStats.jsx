const RmaStats = ({rmas}) => {
    return (
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500">
                <p className="text-sm font-medium text-gray-600">Total RMAs</p>
                <p className="text-2xl font-bold text-[#0D2941]">{rmas.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-yellow-500">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-[#0D2941]">
                    {rmas.filter(rma => ['AWAITING_GOODS', 'EVALUATING', 'PROCESSING'].includes(rma.status)).length}
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-green-500">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-[#0D2941]">
                    {rmas.filter(rma => rma.status === 'COMPLETE').length}
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-red-500">
                <p className="text-sm font-medium text-gray-600">Rechazados</p>
                <p className="text-2xl font-bold text-[#0D2941]">
                    {rmas.filter(rma => rma.status === 'REJECTED').length}
                </p>
            </div>
        </div>
    )
}

export default RmaStats