export function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) {
  const buttonClass = `btn btn-${variant} btn-${size} ${disabled || loading ? 'disabled' : ''} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="loading-spinner">⟳</span>}
      {children}
    </button>
  );
}