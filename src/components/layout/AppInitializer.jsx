import { useAuth } from '../../contexts/auth/AuthContext';

export function AppInitializer({ children }) {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return children;
}