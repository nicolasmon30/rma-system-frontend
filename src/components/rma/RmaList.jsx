const RmaList = ({ startIndex,endIndex,totalItems,totalPages,currentPage }) => {
    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-gray-600">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} solicitudes
                    </p>
                    {totalPages > 1 && (
                        <div className="text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RmaList