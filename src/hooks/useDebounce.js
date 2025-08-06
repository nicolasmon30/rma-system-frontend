// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Hook para hacer debounce de un valor
 * Útil para evitar múltiples llamadas a APIs durante la escritura
 * 
 * @param {any} value - Valor a debounce
 * @param {number} delay - Tiempo de retraso en milisegundos
 * @returns {any} Valor con debounce aplicado
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer un timeout para actualizar el valor debounced
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor o delay cambian
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}