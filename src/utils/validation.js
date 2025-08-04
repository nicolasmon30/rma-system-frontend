import { VALIDATION_RULES } from '../constants/validationRules';

/**
 * Clase para manejar validaciones de formularios
 */
export class FormValidator {
  /**
   * Valida un campo requerido
   * @param {string} value - Valor a validar
   * @returns {string|null} Mensaje de error o null si es válido
   */
  static validateRequired(value) {
    if (!value || value.toString().trim() === '') {
      return VALIDATION_RULES.REQUIRED.MESSAGE;
    }
    return null;
  }

  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {string|null} Mensaje de error o null si es válido
   */
  static validateEmail(email) {
    if (!email) return null;
    
    if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
      return VALIDATION_RULES.EMAIL.MESSAGE;
    }
    return null;
  }

  /**
   * Valida contraseña
   * @param {string} password - Contraseña a validar
   * @returns {string|null} Mensaje de error o null si es válido
   */
  static validatePassword(password) {
    if (!password) return null;
    
    if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      return `La contraseña debe tener al menos ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres`;
    }
    
    if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
      return VALIDATION_RULES.PASSWORD.MESSAGE;
    }
    
    return null;
  }

  /**
   * Valida confirmación de contraseña
   * @param {string} password - Contraseña original
   * @param {string} confirmPassword - Confirmación de contraseña
   * @returns {string|null} Mensaje de error o null si es válido
   */
  static validatePasswordConfirmation(password, confirmPassword) {
    if (!confirmPassword) return null;
    
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  }

  /**
   * Valida número de teléfono
   * @param {string} phone - Teléfono a validar
   * @returns {string|null} Mensaje de error o null si es válido
   */
  static validatePhone(phone) {
    if (!phone) return null;
    
    if (!VALIDATION_RULES.PHONE.PATTERN.test(phone)) {
      return VALIDATION_RULES.PHONE.MESSAGE;
    }
    return null;
  }

  /**
   * Valida un formulario completo
   * @param {Object} formData - Datos del formulario
   * @param {Object} validationRules - Reglas de validación para cada campo
   * @returns {Object} Objeto con errores por campo
   */
  static validateForm(formData, validationRules) {
    const errors = {};

    Object.keys(validationRules).forEach(fieldName => {
      const rules = validationRules[fieldName];
      const value = formData[fieldName];

      for (const rule of rules) {
        const error = rule(value, formData);
        if (error) {
          errors[fieldName] = error;
          break; // Solo mostrar el primer error por campo
        }
      }
    });

    return errors;
  }
}

/**
 * Reglas de validación para el formulario de registro
 */
export const REGISTER_VALIDATION_RULES = {
  nombre: [FormValidator.validateRequired],
  apellido: [FormValidator.validateRequired],
  email: [
    FormValidator.validateRequired,
    FormValidator.validateEmail,
  ],
  password: [
    FormValidator.validateRequired,
    FormValidator.validatePassword,
  ],
  confirmPassword: [
    FormValidator.validateRequired,
    (value, formData) => FormValidator.validatePasswordConfirmation(formData.password, value),
  ],
  telefono: [
    FormValidator.validateRequired,
    FormValidator.validatePhone,
  ],
  empresa: [FormValidator.validateRequired],
  direccion: [FormValidator.validateRequired],
  countryId: [FormValidator.validateRequired],
};

/**
 * Reglas de validación para el formulario de login
 */
export const LOGIN_VALIDATION_RULES = {
  email: [
    FormValidator.validateRequired,
    FormValidator.validateEmail,
  ],
  password: [FormValidator.validateRequired],
};

/**
 * Reglas de validación para actualización de perfil
 */
export const PROFILE_UPDATE_VALIDATION_RULES = {
  nombre: [FormValidator.validateRequired],
  apellido: [FormValidator.validateRequired],
  telefono: [
    FormValidator.validateRequired,
    FormValidator.validatePhone,
  ],
  empresa: [FormValidator.validateRequired],
  direccion: [FormValidator.validateRequired],
};

/**
 * Reglas de validación para cambio de contraseña
 */
export const CHANGE_PASSWORD_VALIDATION_RULES = {
  currentPassword: [FormValidator.validateRequired],
  newPassword: [
    FormValidator.validateRequired,
    FormValidator.validatePassword,
  ],
  confirmNewPassword: [
    FormValidator.validateRequired,
    (value, formData) => FormValidator.validatePasswordConfirmation(formData.newPassword, value),
  ],
};
