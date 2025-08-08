import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { useBrands } from '../hooks/brand/useBrands';
import { useCountries } from '../hooks/useCountries';
import { usePermissions } from '../hooks/usePermissions';
import { useProduct } from '../hooks/product/useProduct';
import {
    Search,
    RefreshCw,
    Package,
    Plus,
    Edit,
    Trash2,
    FileText,
    AlertTriangle,
    Globe,
    Check,
    Building
} from 'lucide-react';


export function ProductPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('ALL');
    const [countryFilter, setCountryFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateConfirmModalOpen, setIsUpdateConfirmModalOpen] = useState(false);
    const [productName, setProductName] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedCountryIds, setSelectedCountryIds] = useState([]);
    const [errors, setErrors] = useState({});
    const [stats, setStats] = useState(null);


    const { products, fetchProducts , getProductStats, createProduct, deleteProduct, searchProducts, loading : productLoading , error: productError  , updateProduct , clearError , refresh } = useProduct();
    const { brands, loading, error, fetchBrands } = useBrands();
    const { countries, loading: countriesLoading, fetchCountries } = useCountries();
    const { PERMISSIONS } = usePermissions();

    // Cargar datos iniciales
    useEffect(() => {
        fetchBrands();
        loadStats();
        fetchCountries()
    }, []);


    const loadStats = async () => {
        try {
            const productStats = await getProductStats();
            setStats(productStats);
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
                    fetchProducts();
                }
            }, 500);
    
            return () => clearTimeout(timeoutId);
        }, [searchTerm]);

    const handleSearch = async (term) => {
        try {
            await searchProducts(term, { limit: 20 });
        } catch (error) {
            console.error('Error searching product:', error);
        }
    };

    const handleRefresh = async () => {
        await refresh();
        await loadStats();
    };

    const filteredProducts = products.filter((product) => {
        console.log(products)
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.countries.some(pc => pc.country.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesBrand = brandFilter === 'ALL' || product.brand.id === brandFilter;
        const matchesCountry = countryFilter === 'ALL' || product.countries.some(pc => pc.countryId === countryFilter);

        return matchesSearch && matchesBrand && matchesCountry;
    });

    const validateProductData = (name, brandId, countryIds) => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.nombre = 'El nombre del producto es requerido';
        } else if (name.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (name.trim().length > 150) {
            newErrors.nombre = 'El nombre no puede exceder 150 caracteres';
        } else {
            const isDuplicate = products.some(product =>
                product.nombre.toLowerCase() === name.trim().toLowerCase() &&
                product.id !== selectedProduct?.id
            );
            if (isDuplicate) {
                newErrors.nombre = 'Ya existe un producto con este nombre';
            }
        }

        if (!brandId) {
            newErrors.brand = 'Debe seleccionar una marca';
        }

        if (countryIds.length === 0) {
            newErrors.countries = 'Debe seleccionar al menos un país';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleCreateProduct = async () => {
        if (!validateProductData(productName, selectedBrandId, selectedCountryIds)) return;

        const selectedBrand = brands.find(b => b.id === selectedBrandId);
        console.log(selectedBrand)
        try {
            console.log("hereee")
            await createProduct({
                nombre: productName.trim(),
                countryIds: selectedCountryIds,
                brandId: selectedBrand.id

            })
            closeModals();
            await loadStats();
            // Opcional: mostrar notificación de éxito
        } catch (error) {
            console.log("error", error)
            setErrors({ submit: error.message });
        }
    };

    const handleEditProduct = () => {
        if (!selectedProduct || !validateProductData(productName, selectedBrandId, selectedCountryIds)) return;
        setIsUpdateConfirmModalOpen(true);
    };

    const confirmUpdateProduct = async () => {
        if (!selectedProduct) return;
        const selectedBrand = brands.find(b => b.id === selectedBrandId);
        try {
            await updateProduct(selectedProduct.id, {
                nombre: productName.trim(),
                countryIds: selectedCountryIds,
                brandId: selectedBrand.id

            });

            closeModals();
            await loadStats();
            // Opcional: mostrar notificación de éxito
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };


    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        try {
            await deleteProduct(selectedProduct.id);
            closeModals();
            await loadStats();
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    const openCreateModal = () => {
        setProductName('');
        setSelectedBrandId('');
        setSelectedCountryIds([]);
        setErrors({});
        setIsCreateModalOpen(true);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setProductName(product.nombre);
        setSelectedBrandId(product.brand.id);
        setSelectedCountryIds(product.countries.map(pc => pc.id));
        setErrors({});
        setIsEditModalOpen(true);
        console.log(selectedCountryIds)
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsUpdateConfirmModalOpen(false);
        setSelectedProduct(null);
        setProductName('');
        setSelectedBrandId('');
        setSelectedCountryIds([]);
        setErrors({});
    };

    const toggleCountrySelection = (countryId) => {
        setSelectedCountryIds(prev =>
            prev.includes(countryId)
                ? prev.filter(id => id !== countryId)
                : [...prev, countryId]
        );
    };

    const formatDate = (date) => {
        const dateFormat = new Date(date);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(dateFormat);
    };

    // Get unique brands and countries for filters
    const availableBrands = Array.from(new Set(products.map(p => p.brand.id)))
        .map(brandId => products.find(p => p.brand.id === brandId)?.brand)
        .filter(Boolean);

    const availableCountries = Array.from(new Set(products.flatMap(p => p.countries.map(pc => pc.countryId))))
        .map(countryId => countries.find(c => c.id === countryId))
        .filter(Boolean);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-secondary shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Package className="h-6 w-6" />
                                Gestión de Productos
                            </h1>
                            <p className="text-gray-300 mt-1">Administración de productos del sistema</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                onClick={openCreateModal}
                                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Nuevo Producto
                            </Button>
                            <Button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar productos, marcas o países..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Brand Filter */}
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <Select value={brandFilter} onValueChange={setBrandFilter}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filtrar por marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todas las Marcas</SelectItem>
                                    {availableBrands.map((brand) => (
                                        <SelectItem key={brand.id} value={brand.id}>
                                            {brand.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Country Filter */}
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <Select value={countryFilter} onValueChange={setCountryFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="País" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos los Países</SelectItem>
                                    {availableCountries.map((country) => (
                                        <SelectItem key={country.id} value={country.id}>
                                            {country.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500">
                        <p className="text-sm font-medium text-gray-600">Total Productos</p>
                        <p className="text-2xl font-bold text-secondary">{products.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-green-500">
                        <p className="text-sm font-medium text-gray-600">Total RMAs</p>
                        <p className="text-2xl font-bold text-secondary">
                            {products.reduce((sum, product) => sum + product._count.rmaItems, 0)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-purple-500">
                        <p className="text-sm font-medium text-gray-600">Marcas Únicas</p>
                        <p className="text-2xl font-bold text-secondary">
                            {new Set(products.map(p => p.brand.id)).size}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-yellow-500">
                        <p className="text-sm font-medium text-gray-600">Países Únicos</p>
                        <p className="text-2xl font-bold text-secondary">
                            {new Set(products.flatMap(p => p.countries.map(pc => pc.countryId))).size}
                        </p>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredProducts.length === 0 ? (
                        <div className="p-8 text-center">
                            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">
                                {products.length === 0
                                    ? "No hay productos registrados en el sistema."
                                    : "No se encontraron productos que coincidan con los filtros."
                                }
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Marca</TableHead>
                                    <TableHead>Países</TableHead>
                                    <TableHead className="text-center">RMAs</TableHead>
                                    <TableHead>Creado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-primary" />
                                                <span className="font-semibold text-secondary">{product.nombre}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-purple-500" />
                                                <span className="font-medium">{product.brand.nombre}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {product?.countries.map((pc) => (
                                                    <span
                                                        key={pc.id}
                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                    >
                                                        <Globe className="h-3 w-3" />
                                                        {pc.nombre}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <FileText className="h-4 w-4 text-yellow-500" />
                                                <span>{product._count.rmas}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">
                                                {formatDate(product.createdAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditModal(product)}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openDeleteModal(product)}
                                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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

            {/* Create Product Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={closeModals}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Crear Nuevo Producto
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div>
                            <Label htmlFor="create-product-name">Nombre del Producto *</Label>
                            <Input
                                id="create-product-name"
                                value={productName}
                                onChange={(e) => {
                                    setProductName(e.target.value);
                                    if (errors.nombre) {
                                        validateProductData(e.target.value, selectedBrandId, selectedCountryIds);
                                    }
                                }}
                                placeholder="Ingrese el nombre del producto"
                                className={errors.nombre ? 'border-red-500' : ''}
                                maxLength={150}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {productName.length}/150 caracteres
                            </p>
                        </div>

                        <div>
                            <Label className="text-base font-medium">Marca *</Label>
                            <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                                <SelectTrigger className={errors.brand ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Seleccione una marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand.id} value={brand.id}>
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                {brand.nombre}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.brand && (
                                <p className="text-sm text-red-600 mt-1">{errors.brand}</p>
                            )}
                        </div>

                        <div>
                            <Label className="text-base font-medium">Países Asociados *</Label>
                            <p className="text-sm text-gray-600 mb-3">
                                Seleccione los países donde este producto estará disponible
                            </p>
                            {errors.countries && (
                                <p className="text-sm text-red-600 mb-3">{errors.countries}</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                                {countries.map((country) => (
                                    <div
                                        key={country.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedCountryIds.includes(country.id)
                                                ? 'bg-primary/10 border-primary text-primary'
                                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        onClick={() => toggleCountrySelection(country.id)}
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
                            <p className="text-xs text-gray-500 mt-2">
                                {selectedCountryIds.length} país(es) seleccionado(s)
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModals}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateProduct}
                            disabled={!productName.trim() || !selectedBrandId || selectedCountryIds.length === 0}
                        >
                            Crear Producto
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Product Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={closeModals}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-primary" />
                            Editar Producto
                        </DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-6 py-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">Producto actual:</p>
                                <p className="text-lg font-semibold text-secondary">{selectedProduct.nombre}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Building className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm text-gray-600">{selectedProduct.brand.nombre}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedProduct.countries.map((pc) => (
                                        <span
                                            key={pc.id}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            <Globe className="h-3 w-3" />
                                            {pc.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="edit-product-name">Nuevo nombre *</Label>
                                <Input
                                    id="edit-product-name"
                                    value={productName}
                                    onChange={(e) => {
                                        setProductName(e.target.value);
                                        if (errors.nombre) {
                                            validateProductData(e.target.value, selectedBrandId, selectedCountryIds);
                                        }
                                    }}
                                    placeholder="Ingrese el nuevo nombre del producto"
                                    className={errors.nombre ? 'border-red-500' : ''}
                                    maxLength={150}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {productName.length}/150 caracteres
                                </p>
                            </div>

                            <div>
                                <Label className="text-base font-medium">Marca *</Label>
                                <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                                    <SelectTrigger className={errors.brand ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Seleccione una marca" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4" />
                                                    {brand.nombre}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.brand && (
                                    <p className="text-sm text-red-600 mt-1">{errors.brand}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-base font-medium">Países Asociados *</Label>
                                <p className="text-sm text-gray-600 mb-3">
                                    Seleccione los países donde este producto estará disponible
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
                                                className={` ${country.id} flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedCountryIds.includes(country.id)
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
                        <Button variant="outline" onClick={closeModals}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEditProduct}
                            disabled={!productName.trim() || !selectedBrandId || selectedCountryIds.length === 0 ||
                                (productName === selectedProduct?.nombre &&
                                    selectedBrandId === selectedProduct?.brand.id &&
                                    JSON.stringify(selectedCountryIds.sort()) === JSON.stringify(selectedProduct?.countries.map(pc => pc.countryId).sort()))}
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
                    {selectedProduct && (
                        <div className="space-y-4 py-4">
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-amber-800 mb-1">¿Confirmar cambios?</p>
                                        <p className="text-sm text-amber-700">
                                            Esta acción actualizará el producto en todo el sistema.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Nombre actual:</p>
                                    <p className="text-lg font-semibold text-gray-900">{selectedProduct.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Nuevo nombre:</p>
                                    <p className="text-lg font-semibold text-primary">{productName.trim()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Marca seleccionada:</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Building className="h-4 w-4 text-purple-500" />
                                        <span className="font-medium text-primary">
                                            {brands.find(b => b.id === selectedBrandId)?.nombre}
                                        </span>
                                    </div>
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

                            {selectedProduct._count.rmas > 0 && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-blue-800 mb-2">
                                        Este producto tiene datos asociados que se actualizarán:
                                    </p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText className="h-4 w-4 text-yellow-500" />
                                        <span>{selectedProduct._count.rmas} RMAs</span>
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
                            onClick={confirmUpdateProduct}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Confirmar Actualización
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Product Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={closeModals}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Eliminar Producto
                        </DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4 py-4">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-red-800 mb-1">¿Está seguro?</p>
                                        <p className="text-sm text-red-700">
                                            Esta acción eliminará permanentemente el producto y no se puede deshacer.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-secondary mb-2">{selectedProduct.nombre}</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <Building className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm text-gray-600">{selectedProduct.brand.nombre}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {selectedProduct.countries.map((pc) => (
                                        <span
                                            key={pc.id}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            <Globe className="h-3 w-3" />
                                            {pc.nombre}
                                        </span>
                                    ))}
                                </div>
                                {selectedProduct._count.rmas > 0 ? (
                                    <>
                                        <p className="text-sm text-amber-600 mb-3 font-medium">
                                            ⚠️ Este producto tiene datos asociados que también serán afectados:
                                        </p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-yellow-500" />
                                            <span>{selectedProduct._count.rmas} RMAs</span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        Este producto no tiene RMAs asociados.
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
                            onClick={handleDeleteProduct}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar Producto
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}