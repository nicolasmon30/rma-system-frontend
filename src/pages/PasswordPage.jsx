import { ChangePasswordForm } from "../components/auth/ChangePasswordForm";

export function PasswordPage() {
    return (
        <div className="flex-1 p-6">
            <div className='max-w-4xl mx-auto'>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#0D2941' }}>
                        Contraseña
                    </h1>
                    <p className="text-gray-600">
                        Gestiona tu contraseña
                    </p>
                </div>
                <ChangePasswordForm />
            </div>
        </div>
    );
}