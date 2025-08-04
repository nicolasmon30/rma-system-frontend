import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { PROFILE_UPDATE_VALIDATION_RULES } from '../../utils/validation';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { SuccessMessage } from '../common/SuccessMessage';
import { User, Settings, Mail, Phone, Building, MapPin, Save, Globe } from 'lucide-react';

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(
    {
      nombre: '',
      apellido: '',
      telefono: '',
      empresa: '',
      direccion: '',
    },
    PROFILE_UPDATE_VALIDATION_RULES
  );

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setValue('nombre', user.nombre || '');
      setValue('apellido', user.apellido || '');
      setValue('telefono', user.telefono || '');
      setValue('empresa', user.empresa || '');
      setValue('direccion', user.direccion || '');
      console.log(user)
    }
  }, [user]);

  const onSubmit = async (formValues) => {
    try {
      setError('');
      setSuccess('');

      const response = await updateProfile(formValues);

      if (response.success) {
        setSuccess('Perfil actualizado exitosamente');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return <div className="loading">Cargando perfil...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#399B7C' }}>
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#0D2941' }}>
                Información Personal
              </h2>
              <p className="text-gray-600">
                Actualiza tus datos de contacto y información profesional
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
      {/* Form */}
      <form
        className="px-8 py-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}
      >
        <ErrorMessage message={error} onClose={() => setError('')} />
        <SuccessMessage message={success} onClose={() => setSuccess('')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className='space-y-2'>
            <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
              Nombre
            </label>
            <FormField
              label="Nombre"
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nombre}
              touched={touched.nombre}
              placeholder="Tu nombre"
              disabled={!isEditing}
              required
              className="form-field-half"
              icon={User}
            />
          </div>
          <div className='space-y-2'>
            <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
              Apellido
            </label>
            <FormField
              label="Apellido"
              name="apellido"
              value={values.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.apellido}
              touched={touched.apellido}
              placeholder="Tu apellido"
              disabled={!isEditing}
              required
              className="form-field-half"
              icon={User}
            />
          </div>
          <div className='space-y-2'>
            <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
              Email
            </label>
            <FormField
              label="Email"
              name="email"
              type="email"
              value={user.email}
              disabled
              icon={Mail}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
              Telefono
            </label>
            <FormField
              label="Teléfono"
              name="telefono"
              type="tel"
              value={values.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.telefono}
              touched={touched.telefono}
              placeholder="+57 300 123 4567"
              required
              disabled={!isEditing}
              icon={Phone}
            />
          </div>
          <div className='space-y-2'>
            <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
              Empresa
            </label>
            <FormField
              label="Empresa"
              name="empresa"
              value={values.empresa}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.empresa}
              touched={touched.empresa}
              placeholder="Nombre de tu empresa"
              required
              disabled={!isEditing}
              icon={Building}
            />
          </div>
          <div className='space-y-2'>
            <label className="block text-sm font-medium" style={{ color: '#0D2941' }}>
              Dirección
            </label>
            <FormField
              label="Dirección"
              name="direccion"
              value={values.direccion}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.direccion}
              touched={touched.direccion}
              placeholder="Dirección completa"
              required
              disabled={!isEditing}
              icon={MapPin}
            />
          </div>
          <div className="space-y-2">
            <h3 className="block text-sm font-medium" style={{ color: '#0D2941' }}>Países Asignados</h3>
            <div className="pl-3 bg-muted border-1 py-1 border-[#399B7C]  placeholder-gray-500 focus:border-[#0D2941] focus:ring-2 transition-all duration-300 rounded-xl flex items-center justify-start gap-3 opacity-50">
              <Globe className='text-[#399B7C] w-4 h-4'/>
              {user.countries && user.countries.length > 0 ? (
                user.countries.map((country) => (
                  <span key={country.id} className="text-muted-foreground">
                    {country.nombre}
                  </span>
                ))
              ) : (
                <p className="no-countries">No tienes países asignados</p>
              )}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
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
                Actualizar Perfil
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