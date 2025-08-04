// src/components/rma/RmaFormView.jsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Trash2, Package, Building2 } from 'lucide-react';
import {mockProducts} from '../../mocks/mockProducts';

export const RmaFormView = ({
    open,
    onOpenChange,
    formData,
    errors,
    serviceOptions,
    onSubmit,
    onAddProduct,
    onRemoveProduct,
    onUpdateProduct,
    onInputChange,
    user
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-secondary flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Crear Nueva Solicitud RMA
                </DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Company Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Información del RMA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="direccion">Dirección *</Label>
                                <Input
                                    id="direccion"
                                    value={formData.direccion}
                                    onChange={(e) => onInputChange('direccion', e.target.value)}
                                    className={errors.direccion ? 'border-red-500' : ''}
                                />
                                {errors.direccion && <p className="text-sm text-red-600">{errors.direccion}</p>}
                            </div>

                            <div>
                                <Label htmlFor="codigoPostal">Código Postal *</Label>
                                <Input
                                    id="codigoPostal"
                                    value={formData.codigoPostal}
                                    onChange={(e) => onInputChange('codigoPostal', e.target.value)}
                                    className={errors.codigoPostal ? 'border-red-500' : ''}
                                />
                                {errors.codigoPostal && <p className="text-sm text-red-600">{errors.codigoPostal}</p>}
                            </div>

                            <div>
                                <Label>Tipo de Servicio *</Label>
                                <Select
                                    value={formData.serviceType}
                                    onValueChange={(value) => onInputChange('serviceType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {serviceOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Productos
                            </CardTitle>
                            <Button
                                type="button"
                                onClick={onAddProduct}
                                className="flex items-center gap-2"
                                size="sm"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar Producto
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {errors.products && <p className="text-sm text-red-600">{errors.products}</p>}
                        {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

                        {formData.products.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No hay productos agregados</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.products.map((product, index) => (
                                    <ProductForm
                                        key={product.id}
                                        product={product}
                                        index={index}
                                        errors={errors}
                                        onRemove={onRemoveProduct}
                                        onUpdate={onUpdateProduct}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Crear RMA
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
);

const ProductForm = ({ product, index, errors, onRemove, onUpdate }) => (
    <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
                <h4 className="font-medium text-secondary">Producto {index + 1}</h4>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Label>Producto *</Label>
                    <Select
                        value={product.productId}
                        onValueChange={(value) => onUpdate(product.id, 'productId', value)}
                    >
                        <SelectTrigger className={errors[`product_${index}_productId`] ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccione un producto" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockProducts.map((prod) => (
                                <SelectItem key={prod.id} value={prod.id}>
                                    {prod.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors[`product_${index}_productId`] && (
                        <p className="text-sm text-red-600">{errors[`product_${index}_productId`]}</p>
                    )}
                </div>

                <div>
                    <Label>Número de Serie *</Label>
                    <Input
                        value={product.serialNumber}
                        onChange={(e) => onUpdate(product.id, 'serialNumber', e.target.value)}
                        className={errors[`product_${index}_serialNumber`] ? 'border-red-500' : ''}
                    />
                    {errors[`product_${index}_serialNumber`] && (
                        <p className="text-sm text-red-600">{errors[`product_${index}_serialNumber`]}</p>
                    )}
                </div>

                <div>
                    <Label>Modelo *</Label>
                    <Input
                        value={product.model}
                        onChange={(e) => onUpdate(product.id, 'model', e.target.value)}
                        className={errors[`product_${index}_model`] ? 'border-red-500' : ''}
                    />
                    {errors[`product_${index}_model`] && (
                        <p className="text-sm text-red-600">{errors[`product_${index}_model`]}</p>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
);