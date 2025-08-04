import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { cn } from "@/lib/utils"
export function SelectField({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  placeholder,
  required = false,
  options = [],
  className = '',
  disabled = false,
  icon: Icon,
  ...props 
}) {
  const hasError = touched && error;

  return (
    <div className={cn("space-y-2 ", className)}>
      {/* <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label> */}
      <div className="relative group">
        {Icon && (
              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#399B7C] w-4 h-4 group-focus-within:text-[#0D2941] transition-colors" />
        )}
        <Select 
          value={value} 
          onValueChange={(newValue) => {
            // Simular evento para compatibilidad con useFormValidation
            const syntheticEvent = {
              target: { name, value: newValue }
            };
            onChange(syntheticEvent);
          }}
          disabled={disabled}
          className="w-full"
        >
          <SelectTrigger className={cn(
            hasError && "border-destructive focus:ring-destructive" ,
            "w-full pl-10 bg-white/5 border-[#399B7C] text-[##399B7C] placeholder-gray-500 focus:border-[#0D2941] focus:ring-2 transition-all duration-300 rounded-xl"
          )}>
            <SelectValue className="font-poppins" placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="w-full font-poppins">
            {options.map((option) => (
              <SelectItem className="font-poppins" key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {hasError && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}