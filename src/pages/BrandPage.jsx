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
import {
    Search,
    RefreshCw,
    Building,
    Plus,
    Edit,
    Trash2,
    Package,
    FileText,
    AlertTriangle,
    Globe,
    Check,
    Loader2,
    X
} from 'lucide-react';

// Hooks y servicios
import { useBrands } from '../hooks/brand/useBrands';
import { useCountries } from '../hooks/useCountries';
import { usePermissions } from '../hooks/usePermissions';
import { ProtectedComponent } from '../components/layout/ProtectedComponent';

export function BrandPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] = useState(false);
    const [brandName, setBrandName] = useState('');
    const [selectedCountryIds, setSelectedCountryIds] = useState([]);
    const [errors, setErrors] = useState({});
    const [stats, setStats] = useState(null);

    // Hooks para datos
    const {
        brands,
        loading,
        error,
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand,
        searchBrands,
        getBrandStats,
        clearError,
        refresh
    } = useBrands();

    const { countries, loading: countriesLoading, fetchCountries } = useCountries();
    const { PERMISSIONS } = usePermissions();

    // Cargar datos iniciales
    useEffect(() => {
        fetchBrands();
        loadStats();
        fetchCountries()
    }, []);

    // Función para cargar estadísticas
    const loadStats = async () => {
        try {
            const brandStats = await getBrandStats();
            setStats(brandStats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    // Función de búsqueda con debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                handleSearch(searchTerm);
            } else {
                fetchBrands();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleSearch = async (term) => {
        try {
            await searchBrands(term, { limit: 20 });
        } catch (error) {
            console.error('Error searching brands:', error);
        }
    };

    const handleRefresh = async () => {
        await refresh();
        await loadStats();
    };

    const filteredBrands = brands.filter((brand) =>
        brand.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brand.countries && brand.countries.some(country =>
            country.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    const validateBrandData = (name, countryIds) => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.nombre = 'El nombre de la marca es requerido';
        } else if (name.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (name.trim().length > 100) {
            newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
        } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\-&]+$/.test(name.trim())) {
            newErrors.nombre = 'El nombre solo puede contener letras, números, espacios y caracteres especiales básicos';
        } else {
            const isDuplicate = brands.some(brand =>
                brand.nombre.toLowerCase() === name.trim().toLowerCase() &&
                brand.id !== selectedBrand?.id
            );
            if (isDuplicate) {
                newErrors.nombre = 'Ya existe una marca con este nombre';
            }
        }

        if (!countryIds || countryIds.length === 0) {
            newErrors.countries = 'Debe seleccionar al menos un país';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateBrand = async () => {
        if (!validateBrandData(brandName, selectedCountryIds)) return;

        try {
            await createBrand({
                nombre: brandName.trim(),
                countryIds: selectedCountryIds
            });

            closeModals();
            await loadStats();
            // Opcional: mostrar notificación de éxito
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    const handleEditBrand = () => {
        if (!validateBrandData(brandName, selectedCountryIds)) return;
        setIsUpdateConfirmModalOpen(true);
    };

    const confirmUpdateBrand = async () => {
        if (!selectedBrand) return;

        try {
            await updateBrand(selectedBrand.id, {
                nombre: brandName.trim(),
                countryIds: selectedCountryIds
            });

            closeModals();
            await loadStats();
            // Opcional: mostrar notificación de éxito
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    const handleDeleteBrand = async () => {
        if (!selectedBrand) return;

        try {
            await deleteBrand(selectedBrand.id);
            closeModals();
            await loadStats();
            // Opcional: mostrar notificación de éxito
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    const openCreateModal = () => {
        setBrandName('');
        setSelectedCountryIds([]);
        setErrors({});
        setIsCreateModalOpen(true);
    };

    const openEditModal = (brand) => {
        console.log(brand.countries?.map(country => country.id))
        setSelectedBrand(brand);
        setBrandName(brand.nombre);
        setSelectedCountryIds(brand.countries?.map(country => country.id) || []);
        setErrors({});
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (brand) => {
        setSelectedBrand(brand);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsUpdateConfirmModalOpen(false);
        setSelectedBrand(null);
        setBrandName('');
        setSelectedCountryIds([]);
        setErrors({});
        clearError();
    };

    const toggleCountrySelection = (countryId) => {
        setSelectedCountryIds(prev =>
            prev.includes(countryId)
                ? prev.filter(id => id !== countryId)
                : [...prev, countryId]
        );
    };

    const formatDate = (date) => {
        console.log(date)
        const dateFormat = new Date(date);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(dateFormat);
    };

    const getTotalUsage = (brand) => {
        return brand._count.products + brand._count.rmas;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-secondary shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Building className="h-6 w-6" />
                                Gestión de Marcas
                            </h1>
                            <p className="text-gray-300 mt-1">Administración de marcas del sistema</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <ProtectedComponent permission={PERMISSIONS.BRAND.CREATE}>
                                <Button
                                    onClick={openCreateModal}
                                    className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                                    disabled={loading}
                                >
                                    <Plus className="h-4 w-4" />
                                    Nueva Marca
                                </Button>
                            </ProtectedComponent>
                            <Button
                                onClick={handleRefresh}
                                disabled={loading}
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-red-800">Error</p>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearError}
                                className="text-red-600 hover:text-red-700 ml-auto"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar marcas o países..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500">
                        <p className="text-sm font-medium text-gray-600">Total Marcas</p>
                        <p className="text-2xl font-bold text-secondary">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats?.totalBrands || brands.length)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-green-500">
                        <p className="text-sm font-medium text-gray-600">Con Productos</p>
                        <p className="text-2xl font-bold text-secondary">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats?.brandsWithProducts || brands.filter(b => (b.productCount || 0) > 0).length)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-purple-500">
                        <p className="text-sm font-medium text-gray-600">Promedio Productos</p>
                        <p className="text-2xl font-bold text-secondary">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats?.averageProductsPerBrand || 0)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-yellow-500">
                        <p className="text-sm font-medium text-gray-600">Países Únicos</p>
                        <p className="text-2xl font-bold text-secondary">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : new Set(brands.flatMap(brand => brand.countries?.map(c => c.id) || [])).size}
                        </p>
                    </div>
                </div>

                {/* Brands Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading && brands.length === 0 ? (
                        <div className="p-8 text-center">
                            <Loader2 className="h-8 w-8 mx-auto mb-4 text-primary animate-spin" />
                            <p className="text-gray-500">Cargando marcas...</p>
                        </div>
                    ) : filteredBrands.length === 0 ? (
                        <div className="p-8 text-center">
                            <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">
                                {brands.length === 0
                                    ? "No hay marcas registradas en el sistema."
                                    : "No se encontraron marcas que coincidan con la búsqueda."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            {loading && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Marca</TableHead>
                                        <TableHead>Países</TableHead>
                                        <TableHead className="text-center">Productos</TableHead>
                                        <TableHead>Creado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBrands.map((brand) => (
                                        <TableRow key={brand.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 text-primary" />
                                                    <span className="font-semibold text-secondary">{brand.nombre}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {brand.countries?.map((country) => (
                                                        <span
                                                            key={country.id}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                        >
                                                            <Globe className="h-3 w-3" />
                                                            {country.nombre}
                                                        </span>
                                                    )) || <span className="text-gray-500 text-sm">Sin países</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Package className="h-4 w-4 text-green-500" />
                                                    <span>{brand.productCount || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(brand.createdAt)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <ProtectedComponent permission={PERMISSIONS.BRAND.UPDATE}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditModal(brand)}
                                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                                            disabled={loading}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Editar
                                                        </Button>
                                                    </ProtectedComponent>
                                                    <ProtectedComponent permission={PERMISSIONS.BRAND.DELETE}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDeleteModal(brand)}
                                                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                            disabled={loading}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Eliminar
                                                        </Button>
                                                    </ProtectedComponent>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Brand Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={closeModals}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Crear Nueva Marca
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-600">{errors.submit}</p>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="create-brand-name">Nombre de la Marca *</Label>
                            <Input
                                id="create-brand-name"
                                value={brandName}
                                onChange={(e) => {
                                    setBrandName(e.target.value);
                                    if (errors.nombre) {
                                        validateBrandData(e.target.value, selectedCountryIds);
                                    }
                                }}
                                placeholder="Ingrese el nombre de la marca"
                                className={errors.nombre ? 'border-red-500' : ''}
                                maxLength={100}
                                disabled={loading}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {brandName.length}/100 caracteres
                            </p>
                        </div>

                        <div>
                            <Label className="text-base font-medium">Países Asociados *</Label>
                            <p className="text-sm text-gray-600 mb-3">
                                Seleccione los países donde esta marca estará disponible
                            </p>
                            {errors.countries && (
                                <p className="text-sm text-red-600 mb-3">{errors.countries}</p>
                            )}

                            {countriesLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    <span className="ml-2 text-gray-600">Cargando países...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                                    {countries.map((country) => (
                                        <div
                                            key={country.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedCountryIds.includes(country.id)
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                }`}
                                            onClick={() => !loading && toggleCountrySelection(country.id)}
                                        >
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedCountryIds.includes(country.id)
                                                    ? 'bg-primary border-primary'
                                                    : 'border-gray-300'
                                                }`}>
                                                {selectedCountryIds.includes(country.id) && (
                                                    <Check className="h-3 w-3 text-white" />
                                                )}
                                            </div>
                                            <Globe className="h-4 w-4" />
                                            <span className="font-medium">{country.nombre}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                {selectedCountryIds.length} país(es) seleccionado(s)
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModals} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateBrand}
                            disabled={loading || !brandName.trim() || selectedCountryIds.length === 0}
                            className="flex items-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Crear Marca
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Brand Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={closeModals}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-primary" />
                            Editar Marca
                        </DialogTitle>
                    </DialogHeader>
                    {selectedBrand && (
                        <div className="space-y-6 py-4">
                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-600">{errors.submit}</p>
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">Marca actual:</p>
                                <p className="text-lg font-semibold text-secondary">{selectedBrand.nombre}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedBrand.countries?.map((country) => (
                                        <span
                                            key={country.id}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            <Globe className="h-3 w-3" />
                                            {country.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="edit-brand-name">Nuevo nombre *</Label>
                                <Input
                                    id="edit-brand-name"
                                    value={brandName}
                                    onChange={(e) => {
                                        setBrandName(e.target.value);
                                        if (errors.nombre) {
                                            validateBrandData(e.target.value, selectedCountryIds);
                                        }
                                    }}
                                    placeholder="Ingrese el nuevo nombre de la marca"
                                    className={errors.nombre ? 'border-red-500' : ''}
                                    maxLength={100}
                                    disabled={loading}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {brandName.length}/100 caracteres
                                </p>
                            </div>

                            <div>
                                <Label className="text-base font-medium">Países Asociados *</Label>
                                <p className="text-sm text-gray-600 mb-3">
                                    Seleccione los países donde esta marca estará disponible
                                </p>
                                {errors.countries && (
                                    <p className="text-sm text-red-600 mb-3">{errors.countries}</p>
                                )}
                                {countriesLoading ? (
                                    <div className="flex items-center justify-center p-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span className="ml-2 text-gray-600">Cargando países...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                                        {countries.map((country) => (
                                            <div
                                                key={country.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedCountryIds.includes(country.id)
                                                        ? 'bg-primary/10 border-primary text-primary'
                                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                onClick={() => !loading && toggleCountrySelection(country.id)}
                                            >
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedCountryIds.includes(country.id)
                                                        ? 'bg-primary border-primary'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    {selectedCountryIds.includes(country.id) && (
                                                        <Check className="h-3 w-3 text-white" />
                                                    )}
                                                </div>
                                                <Globe className="h-4 w-4" />
                                                <span className="font-medium">{country.nombre}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    {selectedCountryIds.length} país(es) seleccionado(s)
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModals} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEditBrand}
                            disabled={loading || !brandName.trim() || selectedCountryIds.length === 0 ||
                                (brandName === selectedBrand?.nombre &&
                                    JSON.stringify(selectedCountryIds.sort()) === JSON.stringify(selectedBrand?.countries?.map(c => c.id).sort()))}
                            className="flex items-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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
                    {selectedBrand && (
                        <div className="space-y-4 py-4">
                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-600">{errors.submit}</p>
                                </div>
                            )}

                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-amber-800 mb-1">¿Confirmar cambios?</p>
                                        <p className="text-sm text-amber-700">
                                            Esta acción actualizará la marca en todo el sistema.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div>

                                    <p className="text-sm font-medium text-gray-700">Nombre actual:</p>
                                    <p className="text-lg font-semibold text-gray-900">{selectedBrand.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Nuevo nombre:</p>
                                    <p className="text-lg font-semibold text-primary">{brandName.trim()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Países seleccionados:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedCountryIds.map((countryId) => {
                                            const country = countries.find(c => c.id === countryId);
                                            return (
                                                <span
                                                    key={countryId}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                                >
                                                    <Globe className="h-3 w-3" />
                                                    {country?.nombre}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {getTotalUsage(selectedBrand) > 0 && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-blue-800 mb-2">
                                        Esta marca tiene datos asociados que se actualizarán:
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-green-500" />
                                            <span>{selectedBrand._count.products} productos</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-yellow-500" />
                                            <span>{selectedBrand._count.rmas} RMAs</span>
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
                            onClick={confirmUpdateBrand}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Confirmar Actualización
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Brand Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={closeModals}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Eliminar Marca
                        </DialogTitle>
                    </DialogHeader>
                    {selectedBrand && (
                        <div className="space-y-4 py-4">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-red-800 mb-1">¿Está seguro?</p>
                                        <p className="text-sm text-red-700">
                                            Esta acción eliminará permanentemente la marca y no se puede deshacer.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-secondary mb-2">{selectedBrand.nombre}</p>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {selectedBrand.countries.map((bc) => (
                                        <span
                                            key={bc.id}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            <Globe className="h-3 w-3" />
                                            {bc?.country?.nombre}
                                        </span>
                                    ))}
                                </div>
                                {getTotalUsage(selectedBrand) > 0 ? (
                                    <>
                                        <p className="text-sm text-amber-600 mb-3 font-medium">
                                            ⚠️ Esta marca tiene datos asociados que también serán afectados:
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-green-500" />
                                                <span>{selectedBrand._count.products} productos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-yellow-500" />
                                                <span>{selectedBrand._count.rmas} RMAs</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        Esta marca no tiene productos o RMAs asociados.
                                    </p>
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
                            onClick={handleDeleteBrand}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar Marca
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}