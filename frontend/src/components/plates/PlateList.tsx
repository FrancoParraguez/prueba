import React, { useState, useEffect } from 'react';
import PlateItem from './PlateItem';
import PlateForm from './PlateForm';
import LoadingSpinner from '../common/LoadingSpinner';
import { getAllPlates, updatePlate, deletePlate } from '../../services/plateService';

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

const PlateList: React.FC = () => {
  const [plates, setPlates] = useState<PlateData[]>([]);
  const [filteredPlates, setFilteredPlates] = useState<PlateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingPlate, setEditingPlate] = useState<PlateData | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPlates();
  }, []);

  useEffect(() => {
    filterPlates();
  }, [plates, searchTerm, filterType]);

  const fetchPlates = async () => {
    try {
      setLoading(true);
      const response = await getAllPlates();
      setPlates(response.plates || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterPlates = () => {
    let filtered = plates;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(plate =>
        plate.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plate.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plate.vehicle_model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      if (filterType === 'active') {
        filtered = filtered.filter(plate => plate.is_active);
      } else if (filterType === 'inactive') {
        filtered = filtered.filter(plate => !plate.is_active);
      } else {
        filtered = filtered.filter(plate => plate.vehicle_type === filterType);
      }
    }

    setFilteredPlates(filtered);
  };

  const handleEdit = (plate: PlateData) => {
    setEditingPlate(plate);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta patente?')) {
      try {
        await deletePlate(id);
        await fetchPlates();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const plate = plates.find(p => p.id === id);
      if (plate) {
        await updatePlate(id, {
          owner: plate.owner,
          vehicleType: plate.vehicle_type,
          vehicleModel: plate.vehicle_model,
          color: plate.color,
          isActive,
        });
        await fetchPlates();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingPlate) {
        await updatePlate(editingPlate.id, formData);
      }
      await fetchPlates();
      setShowForm(false);
      setEditingPlate(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPlate(null);
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Cargando patentes..." />;
  }

  if (showForm) {
    return (
      <PlateForm
        initialData={editingPlate ? {
          plateNumber: editingPlate.plate_number,
          owner: editingPlate.owner,
          vehicleType: editingPlate.vehicle_type as any,
          vehicleModel: editingPlate.vehicle_model,
          color: editingPlate.color,
          isActive: editingPlate.is_active
        } : undefined}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles de filtrado */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por patente, propietario o modelo..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
              <option value="car">Automóviles</option>
              <option value="motorcycle">Motocicletas</option>
              <option value="truck">Camiones</option>
              <option value="bus">Autobuses</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredPlates.length} de {plates.length} patentes
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lista de patentes */}
      <div className="grid gap-6">
        {filteredPlates.length > 0 ? (
          filteredPlates.map(plate => (
            <PlateItem
              key={plate.id}
              plate={plate}
              onEdit={handleEdit}
              onDelete={handleDelete}
             onToggleActive={handleToggleActive}
           />
         ))
       ) : (
         <div className="bg-white rounded-lg shadow p-12 text-center">
           <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
           <h3 className="text-xl font-medium text-gray-600 mb-2">
             No se encontraron patentes
           </h3>
           <p className="text-gray-500">
             {searchTerm || filterType !== 'all' 
               ? 'Intenta ajustar los filtros de búsqueda'
               : 'No hay patentes registradas en el sistema'
             }
           </p>
         </div>
       )}
     </div>
   </div>
 );
};

export default PlateList;