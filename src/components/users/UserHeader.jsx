import { Users } from 'lucide-react';

export function UserHeader()  {
  return (
    <header className="bg-secondary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="h-6 w-6" />
                Gestión de Usuarios
              </h1>
              <p className="text-gray-300 mt-1">Administración de usuarios del sistema</p>
            </div>
          </div>
        </div>
      </header>
  )
}

