import React from 'react';

interface PlateData {
  id: string;
  plate_number: string;
  owner: string;
  vehicle_type: string;
  vehicle_model: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

interface PlateItemProps {
  plate: PlateData;
  onEdit: (plate: PlateData) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const PlateItem: React.FC<PlateItemProps> = ({
  plate,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'car': return 'fas fa-car';
      case 'motorcycle': return 'fas fa-motorcycle';
      case 'truck': return 'fas fa-truck';
      case 'bus': return 'fas fa-bus';
      default: return 'fas fa-car';
    }
  };

  const getVehicleTypeName = (type: string) => {
    switch (type) {
      case 'car': return 'Automóvil';
      case 'motorcycle': return 'Motocicleta';
      case 'truck': return 'Camión';
      case 'bus': return 'Autobús';
      default: return 'Vehículo';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      plate.is_active ? 'border-green-500' : 'border-red-500'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <i className={`${getVehicleTypeIcon(plate.vehicle_type)} text-2xl text-blue-600 mr-3`}></i>
          <div>
            <div className="plate-number text-xl font-bold mb-1">
              {plate.plate_number}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              plate.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {plate.is_active ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(plate)}
            className="text-blue-600 hover:text-blue-800 p-2"
            title="Editar"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => onToggleActive(plate.id, !plate.is_active)}
            className={`p-2 ${
              plate.is_active 
                ? 'text-yellow-600 hover:text-yellow-800' 
                : 'text-green-600 hover:text-green-800'
            }`}
            title={plate.is_active ? 'Desactivar' : 'Activar'}
          >
            <i className={`fas ${plate.is_active ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button
            onClick={() => onDelete(plate.id)}
            className="text-red-600 hover:text-red-800 p-2"
            title="Eliminar"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Propietario:</span>
          <p className="text-gray-800">{plate.owner}</p>
        </div>
        <div>
          <span className="font-medium">Tipo:</span>
          <p className="text-gray-800">{getVehicleTypeName(plate.vehicle_type)}</p>
        </div>
        <div>
          <span className="font-medium">Modelo:</span>
          <p className="text-gray-800">{plate.vehicle_model}</p>
        </div>
        <div>
          <span className="font-medium">Color:</span>
          <p className="text-gray-800">{plate.color}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Registrada: {new Date(plate.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default PlateItem;