import { useState } from 'react';
import { ProfileForm } from './ProfileForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function ProfilePage() {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handlePasswordChangeSuccess = () => {
    setShowPasswordModal(false);
  };

  return (
    <main className='flex-1 p-6 font-poppins'>
      <div className='max-w-4xl mx-auto'>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0D2941' }}>
            Mi Perfil
          </h1>
          <p className="text-gray-600">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        <ProfileForm />
        {/* <div className="profile-page">
          <div className="profile-actions">
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              Cambiar Contraseña
            </Button>
          </div>

          

          <Modal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            title="Cambiar Contraseña"
            size="small"
          >
          </Modal>
            <ChangePasswordForm onSuccess={handlePasswordChangeSuccess} />
        </div> */}

      </div>
    </main>
  );
}