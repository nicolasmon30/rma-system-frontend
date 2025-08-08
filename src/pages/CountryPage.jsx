
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Search,
    RefreshCw,
    Globe,
    Plus,
    Edit,
    Trash2,
    Users,
    Package,
    Building,
    FileText,
    AlertTriangle
} from 'lucide-react';
import { useCountries } from '../hooks/useCountries';
export function CountryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countryName, setCountryName] = useState('');
    const [errors, setErrors] = useState({});

    const {
        countries,
        loading,
        error,
        createCountry,
        updateCountry,
        deleteCountry,
        searchCountries,
        setError,
        fetchCountries
    } = useCountries();

    useEffect(() => {
        fetchCountries()
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                searchCountries(searchTerm);
            } else {
                fetchCountries();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const filteredCountries = countries?.filter(country =>
        country.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalStats = countries?.reduce((acc, country) => ({
        users: acc.users + (country._count?.users || 0),
        products: acc.products + (country._count?.products || 0),
        brands: acc.brands + (country._count?.brands || 0),
        rmas: acc.rmas + (country._count?.rmas || 0)
    }), { users: 0, products: 0, brands: 0, rmas: 0 });

    const getTotalUsage = (country) => {
        return (country._count?.users || 0) +
            (country._count?.products || 0) +
            (country._count?.brands || 0) +
            (country._count?.rmas || 0);
    };

    // Validación del nombre del país
    const validateCountryName = (name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setErrors(prev => ({ ...prev, nombre: 'El nombre del país es requerido' }));
            return false;
        }

        if (trimmedName.length < 2) {
            setErrors(prev => ({ ...prev, nombre: 'El nombre debe tener al menos 2 caracteres' }));
            return false;
        }

        if (trimmedName.length > 50) {
            setErrors(prev => ({ ...prev, nombre: 'El nombre no puede superar los 50 caracteres' }));
            return false;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-'\.]+$/.test(trimmedName)) {
            setErrors(prev => ({ ...prev, nombre: 'Solo se permiten letras, espacios, guiones, apostrofes y puntos' }));
            return false;
        }

        // Verificar duplicados
        const exists = countries.some(country =>
            country.nombre.toLowerCase() === trimmedName.toLowerCase() &&
            country.id !== selectedCountry?.id
        );

        if (exists) {
            setErrors(prev => ({ ...prev, nombre: 'Ya existe un país con este nombre' }));
            return false;
        }

        setErrors(prev => ({ ...prev, nombre: null }));
        return true;
    };

    // Handlers
    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsUpdateConfirmModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedCountry(null);
        setCountryName('');
        setErrors({});
    };

    const openEditModal = (country) => {
        setSelectedCountry(country);
        setCountryName(country.nombre);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (country) => {
        setSelectedCountry(country);
        setIsDeleteModalOpen(true);
    };

    const handleCreateCountry = async () => {
        if (!validateCountryName(countryName)) return;

        try {
            await createCountry({ nombre: countryName });
            // toast({
            //     title: "País creado",
            //     description: `${countryName} ha sido creado exitosamente.`,
            //     variant: "success"
            // });
            closeModals();
        } catch (error) {
            console.error(error)
            // toast({
            //     title: "Error",
            //     description: error.message || "Error al crear el país",
            //     variant: "destructive"
            // });
        }
    };

    const handleEditCountry = () => {
        if (!validateCountryName(countryName)) return;
        setIsEditModalOpen(false);
        setIsUpdateConfirmModalOpen(true);
    };

    const confirmUpdateCountry = async () => {
        try {
            await updateCountry(selectedCountry.id, { nombre: countryName });
            // toast({
            //     title: "País actualizado",
            //     description: `El país ha sido actualizado a "${countryName}".`,
            //     variant: "success"
            // });
            closeModals();
        } catch (error) {
            console.error(error)
            // toast({
            //     title: "Error",
            //     description: error.message || "Error al actualizar el país",
            //     variant: "destructive"
            // });
        }
    };

    const handleDeleteCountry = async () => {
        try {
            await deleteCountry(selectedCountry.id);
            // toast({
            //     title: "País eliminado",
            //     description: `${selectedCountry.nombre} ha sido eliminado exitosamente.`,
            //     variant: "success"
            // });
            closeModals();
        } catch (error) {
            console.error(error)
            // toast({
            //     title: "Error",
            //     description: error.message || "Error al eliminar el país",
            //     variant: "destructive"
            // });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-secondary shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Globe className="h-6 w-6" />
                                Gestión de Países
                            </h1>
                            <p className="text-gray-300 mt-1">Administración de países del sistema</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Nuevo País
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar países..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500">
                        <p className="text-sm font-medium text-gray-600">Total Países</p>
                        <p className="text-2xl font-bold text-secondary">{countries?.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-green-500">
                        <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                        <p className="text-2xl font-bold text-secondary">{totalStats?.users}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-purple-500">
                        <p className="text-sm font-medium text-gray-600">Total Productos</p>
                        <p className="text-2xl font-bold text-secondary">{totalStats?.products}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-yellow-500">
                        <p className="text-sm font-medium text-gray-600">Total RMAs</p>
                        <p className="text-2xl font-bold text-secondary">{totalStats?.rmas}</p>
                    </div>
                </div>
                {/* Countries Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredCountries?.length === 0 ? (
                        <div className="p-8 text-center">
                            <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">
                                {countries?.length === 0
                                    ? "No hay países registrados en el sistema."
                                    : "No se encontraron países que coincidan con la búsqueda."
                                }
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>País</TableHead>
                                    <TableHead className="text-center">Usuarios</TableHead>
                                    <TableHead className="text-center">Productos</TableHead>
                                    <TableHead className="text-center">Marcas</TableHead>
                                    <TableHead className="text-center">RMAs</TableHead>
                                    <TableHead className="text-center">Total</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCountries?.map((country) => (
                                    <TableRow key={country.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-primary" />
                                                <span className="font-semibold text-secondary">{country.nombre}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Users className="h-4 w-4 text-blue-500" />
                                                <span>{country._count.users}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Package className="h-4 w-4 text-green-500" />
                                                <span>{country._count.products}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Building className="h-4 w-4 text-purple-500" />
                                                <span>{country._count.brands}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <FileText className="h-4 w-4 text-yellow-500" />
                                                <span>{country._count.rmas}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="font-semibold text-secondary">
                                                {getTotalUsage(country)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditModal(country)}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openDeleteModal(country)}
                                                    className={`flex items-center gap-2 ${'text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
                                                        }`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
            {/* Create Country Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={closeModals}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Crear Nuevo País
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="create-country-name">Nombre del País *</Label>
                            <Input
                                id="create-country-name"
                                value={countryName}
                                onChange={(e) => {
                                    setCountryName(e.target.value);
                                    if (errors.nombre) {
                                        validateCountryName(e.target.value);
                                    }
                                }}
                                placeholder="Ingrese el nombre del país"
                                className={errors.nombre ? 'border-red-500' : ''}
                                maxLength={50}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {countryName.length}/50 caracteres
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModals}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateCountry}
                            disabled={!countryName.trim()}
                        >
                            Crear País
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Country Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={closeModals}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-primary" />
                            Editar País
                        </DialogTitle>
                    </DialogHeader>
                    {selectedCountry && (
                        <div className="space-y-4 py-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">País actual:</p>
                                <p className="text-lg font-semibold text-secondary">{selectedCountry.nombre}</p>
                            </div>

                            <div>
                                <Label htmlFor="edit-country-name">Nuevo nombre *</Label>
                                <Input
                                    id="edit-country-name"
                                    value={countryName}
                                    onChange={(e) => {
                                        setCountryName(e.target.value);
                                        if (errors.nombre) {
                                            validateCountryName(e.target.value);
                                        }
                                    }}
                                    placeholder="Ingrese el nuevo nombre del país"
                                    className={errors.nombre ? 'border-red-500' : ''}
                                    maxLength={50}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {countryName.length}/50 caracteres
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModals}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEditCountry}
                            disabled={!countryName.trim() || countryName === selectedCountry?.nombre}
                        >
                            Continuar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Confirmation Modal */}
            <Dialog open={isUpdateConfirmModalOpen} onOpenChange={() => setIsUpdateConfirmModalOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-amber-600 flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Confirmar Actualización
                        </DialogTitle>
                    </DialogHeader>
                    {selectedCountry && (
                        <div className="space-y-4 py-4">
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-amber-800 mb-1">¿Confirmar cambios?</p>
                                        <p className="text-sm text-amber-700">
                                            Esta acción actualizará el nombre del país en todo el sistema.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Nombre actual:</p>
                                        <p className="text-lg font-semibold text-gray-900">{selectedCountry.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Nuevo nombre:</p>
                                        <p className="text-lg font-semibold text-primary">{countryName.trim()}</p>
                                    </div>
                                </div>
                            </div>

                            {getTotalUsage(selectedCountry) > 0 && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-blue-800 mb-2">
                                        Este país tiene datos asociados que se actualizarán:
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            <span>{selectedCountry._count.users} usuarios</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-green-500" />
                                            <span>{selectedCountry._count.products} productos</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-purple-500" />
                                            <span>{selectedCountry._count.brands} marcas</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-yellow-500" />
                                            <span>{selectedCountry._count.rmas} RMAs</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsUpdateConfirmModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmUpdateCountry}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Confirmar Actualización
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Delete Country Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={closeModals}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Eliminar País
                        </DialogTitle>
                    </DialogHeader>
                    {selectedCountry && (
                        <div className="space-y-4 py-4">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-red-800 mb-1">¿Está seguro?</p>
                                        <p className="text-sm text-red-700">
                                            Esta acción eliminará permanentemente el país y no se puede deshacer.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-secondary mb-2">{selectedCountry.nombre}</p>
                                {getTotalUsage(selectedCountry) > 0 ? (
                                    <>
                                        <p className="text-sm text-amber-600 mb-3 font-medium">
                                            ⚠️ Este país tiene datos asociados que también serán afectados:
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-blue-500" />
                                                <span>{selectedCountry._count.users} usuarios</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-green-500" />
                                                <span>{selectedCountry._count.products} productos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-purple-500" />
                                                <span>{selectedCountry._count.brands} marcas</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-yellow-500" />
                                                <span>{selectedCountry._count.rmas} RMAs</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-600">
                                        <p className="text-sm text-gray-600">
                                            Este país no tiene usuarios, productos, marcas o RMAs asociados.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModals}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteCountry}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar País
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}