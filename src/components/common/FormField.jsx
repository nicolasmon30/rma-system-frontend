import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function FormField({ 
  name, 
  type = 'text', 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  placeholder,
  required = false,
  className = '',
  disabled = false,
  icon: Icon,
  ...props 
}) {
  const hasError = touched && error;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative group">
        {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#399B7C] w-4 h-4 group-focus-within:text-[#0D2941] transition-colors" />
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-10 bg-white/5 border-[#399B7C] text-[##399B7C] placeholder-gray-500 focus:border-[#0D2941] focus:ring-2 transition-all duration-300 rounded-xl",
            hasError && "border-destructive focus-visible:ring-destructive",
            disabled && "bg-muted cursor-not-allowed"
          )}
          {...props}
        />
      </div>
      
      {hasError && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}