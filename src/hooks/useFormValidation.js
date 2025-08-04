import { useState, useCallback } from 'react';
import { FormValidator } from '../utils/validation';

/**
 * Hook personalizado para manejar validación de formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación
 * @returns {Object} Objeto con valores, errores y funciones del formulario
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar valor de un campo
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  }, [errors]);

  // Marcar campo como tocado
  const setTouchedAction = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  // Validar un campo específico
  const validateField = useCallback((name, value = values[name]) => {
    const fieldRules = validationRules[name];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      const error = rule(value, values);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error,
        }));
        return error;
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: null,
    }));
    return null;
  }, [values, validationRules]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const formErrors = FormValidator.validateForm(values, validationRules);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [values, validationRules]);

  // Manejar cambio de campo
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValue(name, value);
  }, [setValue]);

  // Manejar blur de campo
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouchedAction(name);
    validateField(name, value);
  }, [setTouchedAction, validateField]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(validationRules).forEach(key => {
      allTouched[key] = true;
    });
    setTouchedAction(allTouched);

    // Validar formulario
    const isValid = validateForm();
    
    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Error en envío del formulario:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [values, validationRules, validateForm]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedAction({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setTouchedAction,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}