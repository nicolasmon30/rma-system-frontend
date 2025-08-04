const UserStats = ({ users, countries }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-secondary">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-green-500">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-secondary">
                    {users.filter(user => user.isActive).length}
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-purple-500">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-secondary">
                    {users.filter(user => user.role === 'ADMIN' || user.role === 'SUPERADMIN').length}
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-yellow-500">
                <p className="text-sm font-medium text-gray-600">Países</p>
                <p className="text-2xl font-bold text-secondary">{countries.length}</p>
            </div>
        </div>
    )
}

export default UserStats