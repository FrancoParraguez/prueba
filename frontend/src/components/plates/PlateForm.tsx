import React, { useState } from 'react';

interface PlateFormData {
  plateNumber: string;
  owner: string;
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'bus';
  vehicleModel: string;
  color: string;
  isActive: boolean;
}

interface PlateFormProps {
  initialData?: PlateFormData;
  onSubmit: (data: PlateFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PlateForm: React.FC<PlateFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<PlateFormData>({
    plateNumber: initialData?.plateNumber || '',
    owner: initialData?.owner || '',
    vehicleType: initialData?.vehicleType || 'car',
    vehicleModel: initialData?.vehicleModel || '',
    color: initialData?.color || '',
    isActive: initialData?.isActive ?? true
  });

  const [errors, setErrors] = useState<Partial<PlateFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PlateFormData> = {};

    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = 'Número de patente es requerido';
    } else if (!/^[A-Z0-9]{6,8}$/.test(formData.plateNumber.toUpperCase())) {
      newErrors.plateNumber = 'Formato de patente inválido (6-8 caracteres)';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Propietario es requerido';
    }

    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Modelo del vehículo es requerido';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        plateNumber: formData.plateNumber.toUpperCase()
      });
    }
  };

  const handleChange = (field: keyof PlateFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-6">
        {initialData ? 'Editar Patente' : 'Registrar Nueva Patente'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Patente *
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.plateNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.plateNumber}
            onChange={(e) => handleChange('plateNumber', e.target.value.toUpperCase())}
            placeholder="ABC123"
            disabled={!!initialData}
          />
          {errors.plateNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.plateNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Propietario *
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.owner ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.owner}
            onChange={(e) => handleChange('owner', e.target.value)}
            placeholder="Nombre del propietario"
          />
          {errors.owner && (
            <p className="text-red-500 text-sm mt-1">{errors.owner}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Vehículo *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.vehicleType}
            onChange={(e) => handleChange('vehicleType', e.target.value)}
          >
            <option value="car">Automóvil</option>
            <option value="motorcycle">Motocicleta</option>
            <option value="truck">Camión</option>
            <option value="bus">Autobús</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo del Vehículo *
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.vehicleModel}
            onChange={(e) => handleChange('vehicleModel', e.target.value)}
            placeholder="Toyota Corolla"
          />
          {errors.vehicleModel && (
            <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color *
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.color ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            placeholder="Azul"
          />
          {errors.color && (
            <p className="text-red-500 text-sm mt-1">{errors.color}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="mr-2"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Patente activa
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Registrar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlateForm;
