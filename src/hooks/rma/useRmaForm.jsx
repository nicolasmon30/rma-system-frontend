import { useState } from 'react';

export const useRmaForm = (open, onOpenChange, rmaService, countryId, onRmaCreated) => {
  const [formData, setFormData] = useState({
    direccion: '',
    codigoPostal: '',
    serviceType: 'REPAIR',
    products: [],
  });

  const [errors, setErrors] = useState({});

  const serviceOptions = [
    { value: 'CALIBRATION', label: 'Calibración' },
    { value: 'REPAIR', label: 'Reparación' },
    { value: 'BOTH', label: 'Ambos' }
  ];

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: Date.now().toString(),
          productId: '',
          serialNumber: '',
          model: '',
          reporteEvaluacion: ''
        }
      ]
    }));
  };

  const removeProduct = (id) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const updateProduct = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    console.log(formData, countryId)
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = 'El código postal es requerido';
    } else if (!/^\d{5}$/.test(formData.codigoPostal)) {
      newErrors.codigoPostal = 'El código postal debe tener 5 dígitos';
    }

    if (formData.products.length === 0) {
      newErrors.products = 'Debe agregar al menos un producto';
    }

    formData.products.forEach((product, index) => {
      if (!product.productId) {
        newErrors[`product_${index}_productId`] = 'Debe seleccionar un producto';
      }
      if (!product.serialNumber.trim()) {
        newErrors[`product_${index}_serialNumber`] = 'El número de serie es requerido';
      }
      if (!product.model.trim()) {
        newErrors[`product_${index}_model`] = 'El modelo es requerido';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
        ...formData,
        countryId
    }
    console.log("eeee", data)
    if (validateForm()) {
      try {
        const newRma = await rmaService.create(data);
        if (onRmaCreated) {
          onRmaCreated(newRma);
        }
        resetForm();
        onOpenChange(false);
      } catch (error) {
        console.error('Error creating RMA:', error);
        setErrors({ submit: error.message });
      }
    }else{
        console.log("error", e)
    }
  };

  const resetForm = () => {
    setFormData({
      countryId: '',
      direccion: '',
      codigoPostal: '',
      serviceType: 'REPAIR',
      products: []
    });
    setErrors({});
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    errors,
    serviceOptions,
    handleSubmit,
    addProduct,
    removeProduct,
    updateProduct,
    resetForm,
    handleOpenChange,
    handleInputChange
  };
};