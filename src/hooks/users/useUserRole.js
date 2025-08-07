import { useState, useCallback } from "react";
import { userService } from "../../services/users/userService";

export const useUserRole = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Actualizar rol de usuario
     * @param {string} userId - ID del usuario
     * @param {string} newRole - Nuevo rol
     * @param {Function} onSuccess - Callback de éxito opcional
     * @returns {Promise<Object>} Usuario actualizado
   */

    const updateRole = useCallback(async (userId, newRole, onSuccess) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.updateUserRole(userId, newRole);
            // Mostrar notificación de éxito
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(response.data);
            }

            return response.data;
        } catch (err) {
            const errorMessage = err.message || 'Error al actualizar rol';
            setError(errorMessage);

            // Mostrar notificación de error

            // Re-lanzar el error para que el componente pueda manejarlo si es necesario
            throw err;
        } finally {
            setLoading(false);
        }
    }, [])

    /**
   * Limpiar estado de error
   */
    const clearError = useCallback(() => {
        setError(null);
    }, []);


    return {
        updateRole,
        loading,
        error,
        clearError
    };
}