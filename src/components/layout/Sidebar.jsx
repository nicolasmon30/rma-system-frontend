import { Link, useNavigate, useLocation } from "react-router-dom";
import { X, LogOut, LayoutDashboard, User, icons, Lock } from "lucide-react"
import { ROUTES } from "../../constants/routes"
import { useAuth } from '../../contexts/auth/AuthContext';


// Definir los items del menú
const NAV_ITEMS = [
    {
        label: "Dashboard",
        path: ROUTES.DASHBOARD, // o "/dashboard"
        icon: LayoutDashboard, // Reemplaza con el icono correcto
    },
    {
        label: "Perfil",
        path: ROUTES.PROFILE, // o "/profile"
        icon: User, // Reemplaza con el icono correcto
    },
    {
        label: "Contraseña",
        path: ROUTES.PASSWORD,
        icon: Lock
    }
    // Agrega más items según necesites
];

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN)
    };

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 bg-[#0D2941]">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">Rma System</h1>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden text-white hover:text-gray-300 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            <nav className="mt-8 px-4">
                <ul className="space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${location.pathname === item.path
                                        ? "text-white bg-[#399B7C]"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}

export default SideBar