export function SuccessMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="success-alert">
      <span className="success-icon">✓</span>
      <span className="success-text">{message}</span>
      {onClose && (
        <button 
          className="success-close" 
          onClick={onClose}
          aria-label="Cerrar mensaje de éxito"
        >
          ×
        </button>
      )}
    </div>
  );
}