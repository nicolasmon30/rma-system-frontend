import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Button } from '../common/Button';
import { User } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Cerrar menú al hacer click fuera
  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        {/* <div className="header-left">
          <Link to={ROUTES.DASHBOARD} className="logo">
            <h1>MiApp</h1>
          </Link>
        </div> */}

        {/* <nav className="header-nav">
          <Link to={ROUTES.DASHBOARD} className="nav-link">
            Dashboard
          </Link>
        </nav> */}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#399B7C' }}>
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium" style={{ color: '#0D2941' }}>
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          {/* <div className="user-menu-container">
            <button 
              className="user-menu-trigger"
              onClick={toggleUserMenu}
              aria-expanded={showUserMenu}
            >
              <div className="user-avatar">
                <span>{user?.nombre?.[0]?.toUpperCase()}</span>
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user?.nombre} {user?.apellido}
                </span>
                <span className="user-email">{user?.email}</span>
              </div>
              <svg 
                className={`dropdown-arrow ${showUserMenu ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
              >
                <path d="M6 8L2 4h8l-4 4z" fill="currentColor"/>
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div className="menu-overlay" onClick={closeUserMenu}></div>
                <div className="user-dropdown">
                  <Link 
                    to={ROUTES.PROFILE} 
                    className="dropdown-item"
                    onClick={closeUserMenu}
                  >
                    <span className="dropdown-icon">👤</span>
                    Mi Perfil
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">🚪</span>
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div> */}
        </div>
      </div>
    </header>
  );
}
