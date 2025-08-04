import { useAuth } from "../../contexts/auth/AuthContext";
import { useRmaForm } from "../../hooks/rma/useRmaForm";
import { RmaFormView } from "./RmaFormView";

export function CreateRMAModal({ open, onOpenChange, rmaService,onRmaCreated }) {
  const { user } = useAuth();
  const countryId = user?.countries[0]?.id;
  console.log(user.countries[0].id)
  const {
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
  } = useRmaForm(open, onOpenChange, rmaService, countryId, onRmaCreated);



  return (
    <RmaFormView
      open={open}
      onOpenChange={handleOpenChange}
      formData={formData}
      errors={errors}
      serviceOptions={serviceOptions}
      onSubmit={handleSubmit}
      onAddProduct={addProduct}
      onRemoveProduct={removeProduct}
      onUpdateProduct={updateProduct}
      onInputChange={handleInputChange}
    />
  );
}