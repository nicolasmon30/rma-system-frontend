import { Badge } from "@/components/ui/badge";


const roleConfig = {
  USER: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Usuario' },
  ADMIN: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Administrador' },
  SUPERADMIN: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Super Admin' },
};

export function UserRoleBadge({ role }) {
  const config = roleConfig[role] || {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'Desconocido'
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} font-medium`}
    >
      {config.label}
    </Badge>
  );
}