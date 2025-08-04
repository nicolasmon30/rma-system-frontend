import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../../services/auth/authService';
import { AuthTokenManager } from '../../services/auth/authTokenManager';

// Estados del contexto de autenticación
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  INITIALIZE_COMPLETE: 'INITIALIZE_COMPLETE',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Estado inicial
const initialState = {
  user: AuthTokenManager.getUser(),
  isAuthenticated: AuthTokenManager.isAuthenticated(),
  isLoading: false,
  isInitializing: true,
  error: null,
};

// Reducer para manejar el estado de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
    case AUTH_ACTIONS.REGISTER_ERROR:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isInitializing: false,
        isAuthenticated: false,
        user: null
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.INITIALIZE_COMPLETE:
      return {
        ...state,
        isInitializing: false
      };


    default:
      return state;
  }
}

// Contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si el usuario ya está autenticado al cargar la app
  useEffect(() => {
    console.log('Starting auth initialization...');
    const initializeAuth = async () => {
      try {
        console.log('Checking authentication...');
        // Verificar autenticación solo si hay token
        if (AuthTokenManager.isAuthenticated()) {
          // Si no hay usuario en el estado pero sí en localStorage, usarlo
          if (!state.user && AuthTokenManager.getUser()) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: AuthTokenManager.getUser() },
            });
          }
          // Si no hay usuario en localStorage, hacer petición
          else if (!AuthTokenManager.getUser()) {
            const response = await authService.getProfile();
            if (response.success) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: response.data },
              });
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        AuthTokenManager.removeToken();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } finally {
         console.log('Initialization complete');
        dispatch({ type: AUTH_ACTIONS.INITIALIZE_COMPLETE });
      }
    };

    initializeAuth();
  }, []);

  // Acciones del contexto
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: response.data,
        });
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message,
      });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await authService.register(userData);

      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: response.data,
        });
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_ERROR,
        payload: error.message,
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateProfile = async (updateData) => {
    try {
      const response = await authService.updateProfile(updateData);

      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_PROFILE,
          payload: response.data,
        });
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      return await authService.changePassword(passwordData);
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const contextValue = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    isInitializing: state.isInitializing,

    // Acciones
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
}