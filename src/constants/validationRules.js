export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Por favor ingresa un email válido',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  },
  PHONE: {
    PATTERN: /^[+]?[\d\s-()]+$/,
    MESSAGE: 'Por favor ingresa un número de teléfono válido',
  },
  REQUIRED: {
    MESSAGE: 'Este campo es obligatorio',
  },
};