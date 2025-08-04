import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useCountries } from '../../hooks/useCountries';
import { REGISTER_VALIDATION_RULES } from '../../utils/validation';
import { ROUTES } from '../../constants/routes';
import { FormField } from '../common/FormField';
import { SelectField } from '../common/SelectField'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BriefcaseBusiness, Globe, Lock, Mail, MapPin, Phone, User } from "lucide-react";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const { countries, loading: countriesLoading } = useCountries();
  
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(
    {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
      telefono: '',
      empresa: '',
      direccion: '',
      countryId: '',
    },
    REGISTER_VALIDATION_RULES
  );

  const onSubmit = async (formValues) => {
    try {
      const { confirmPassword, ...registerData } = formValues;
      await register(registerData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Error en registro:', err);
    }
  };

  const countryOptions = countries.map(country => ({
    value: country.id,
    label: country.nombre,
  }));

  return (
    <div className="h-svh flex items-center ">
      <div className="mx-auto max-w-2xl">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-8 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#399B7C] rounded-2xl mb-6 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold mb-2">
                Crear Cuenta
              </h2>

              <p className="text-sm">
                Completa el formulario para registrarte en nuestra plataforma
              </p>
            </div>
            <form 
              className="px-8 pb-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit);
              }}
            >
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="form-section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    label="Nombre"
                    name="nombre"
                    value={values.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.nombre}
                    touched={touched.nombre}
                    placeholder="Tu nombre"
                    icon={User}
                    required
                  />

                  <FormField
                    label="Apellido"
                    name="apellido"
                    value={values.apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.apellido}
                    touched={touched.apellido}
                    placeholder="Tu apellido"
                    icon={User}
                    required
                  />
                </div>
                <div className='mb-4'>
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    touched={touched.email}
                    placeholder="tu@email.com"
                    icon={Mail}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    placeholder="Tu contraseña"
                    icon={Lock}
                    required
                  />

                  <FormField
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    placeholder="Confirma tu contraseña"
                    icon={Lock}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    icon={Phone}
                    required
                  />
                  <FormField
                    label="Dirección"
                    name="direccion"
                    value={values.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.direccion}
                    touched={touched.direccion}
                    placeholder="Tu dirección completa"
                    icon={MapPin}
                    required
                  />
                </div>
              </div>

              <div className="form-section mb-4">
                
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
                  icon={BriefcaseBusiness}
                />
              </div>
              <div className='mb-10'>

                <SelectField
                  label="País"
                  name="countryId"
                  value={values.countryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.countryId}
                  touched={touched.countryId}
                  placeholder="Selecciona tu país"
                  options={countryOptions}
                  required
                  disabled={countriesLoading}
                  icon={Globe}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isSubmitting || countriesLoading}
              >
                {(isLoading || isSubmitting || countriesLoading) && (
                  <div className="loading-spinner mr-2" />
                )}
                Crear Cuenta
              </Button>

              <div className="text-center pt-4 border-t mt-8">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes una cuenta?{' '}
                  <Link 
                    to={ROUTES.LOGIN} 
                    className="font-medium registerLink hover:underline"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}