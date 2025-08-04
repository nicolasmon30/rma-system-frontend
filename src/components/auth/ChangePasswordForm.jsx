import { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { CHANGE_PASSWORD_VALIDATION_RULES } from '../../utils/validation';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { SuccessMessage } from '../common/SuccessMessage';
import { User, Settings, Lock, Save } from 'lucide-react';

export function ChangePasswordForm({ onSuccess }) {
  const { changePassword } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormValidation(
    {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    CHANGE_PASSWORD_VALIDATION_RULES
  );

  const onSubmit = async (formValues) => {
    try {
      setError('');
      setSuccess('');

      const { confirmNewPassword, ...passwordData } = formValues;
      const response = await changePassword(passwordData);

      if (response.success) {
        setSuccess('Contraseña actualizada exitosamente');
        resetForm();

        // Opcional: cerrar modal después de 2 segundos
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-poppins">
      {/* Card Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#399B7C' }}>
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#0D2941' }}>
                Cambiar contraseña
              </h2>
              <p className="text-gray-600">
                Ten encuenta la información que ingresas.
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#399B7C' }}
            >
              <Settings className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>
      <form
        className="px-8 py-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}
      >
        <ErrorMessage message={error} onClose={() => setError('')} />
        <SuccessMessage message={success} onClose={() => setSuccess('')} />
        <div className='space-y-2 mb-6'>
          <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
            Contraseña Actual
          </label>
          <FormField
            label="Contraseña Actual"
            name="currentPassword"
            type="password"
            value={values.currentPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.currentPassword}
            touched={touched.currentPassword}
            placeholder="Tu contraseña actual"
            disabled={!isEditing}
            required
            icon={Lock}
          />
        </div>
        <div className='space-y-2 mb-6'>
          <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
            Nueva Contraseña
          </label>
          <FormField
            label="Nueva Contraseña"
            name="newPassword"
            type="password"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.newPassword}
            touched={touched.newPassword}
            placeholder="Tu nueva contraseña"
            disabled={!isEditing}
            required
            icon={Lock}
          />
        </div>
        <div className='space-y-2 mb-6'>
          <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
            Confirmar Contraseña
          </label>
          <FormField
            label="Confirmar Nueva Contraseña"
            name="confirmNewPassword"
            type="password"
            value={values.confirmNewPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmNewPassword}
            touched={touched.confirmNewPassword}
            placeholder="Confirma tu nueva contraseña"
            disabled={!isEditing}
            required
            icon={Lock}
          />
        </div>
        {
          isEditing && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                loading={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90 transform hover:scale-105"
                style={{ backgroundColor: '#399B7C' }}
              >
                <Save className="w-5 h-5" />
                Cambiar Contraseña
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-lg border-2 font-medium transition-all duration-200 hover:bg-gray-50"
                style={{
                  borderColor: '#0D2941',
                  color: '#0D2941'
                }}
              >
                Cancelar
              </Button>
            </div>
          )
        }
      </form>
    </div>
  );
}