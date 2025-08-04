import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useState } from "react"
import { useFormValidation } from '../../hooks/useFormValidation';
import { LOGIN_VALIDATION_RULES } from '../../utils/validation';
import { ROUTES } from '../../constants/routes';
import { FormField } from '../common/FormField';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, User, Mail, Lock,  Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(
    { email: '', password: '' },
    LOGIN_VALIDATION_RULES
  );

  const onSubmit = async (formValues) => {
    try {
      await login(formValues);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto h-svh items-center flex">
        <Card className="w-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-8 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#399B7C] rounded-2xl mb-6 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold mb-2">
                Welcome Back
              </h2>

              <p className="text-sm">
                Sign in to continue your journey
              </p>
            </div>
            <form 
              className="px-8 pb-8 space-y-6"
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
              <div className="space-y-4">
                <Label htmlFor="email" className="text-sm font-medium">
                    Email
                </Label>
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
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative group">
                  <FormField
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    placeholder="Tu contraseña"
                    icon={Lock}
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className=" showPassword absolute right-0 top-[18px] transform  -translate-y-1/2 text-gray-400 hover:bg-[#0D2941] transition-colors "
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-white" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="loginBtn w-full bg-[#0D2941]"
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) && (
                  <div className="loading-spinner mr-2" />
                )}
                Iniciar Sesión
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{' '}
                  <Link 
                    to={ROUTES.REGISTER} 
                    className="registerLink font-medium hover:underline"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

    </div>
  );
}