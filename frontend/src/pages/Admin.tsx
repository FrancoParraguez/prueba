import React, { useState } from 'react';
import PlateList from '../components/plates/PlateList';
import PlateForm from '../components/plates/PlateForm';
import { registerPlate } from '../services/plateService';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/common/Notification';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'register'>('list');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotification({ type, message, isVisible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleRegisterPlate = async (formData: any) => {
    try {
      await registerPlate({
        plateNumber: formData.plateNumber,
        owner: formData.owner,
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel,
        color: formData.color
      });
      showNotification('success', 'Patente registrada exitosamente');
      setActiveTab('list');
    } catch (error: any) {
      showNotification('error', error.message || 'Error al registrar la patente');
    }
  };

  const handleFormCancel = () => {
    setActiveTab('list');
  };

  // Verificar permisos de administrador
  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <i className="fas fa-cog mr-3 text-blue-600"></i>
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestión de patentes vehiculares y configuración del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <i className="fas fa-car text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">1,248</h3>
              <p className="text-gray-600">Patentes Totales</p>
            </div>
          </div>
        </div>

        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">1,180</h3>
              <p className="text-gray-600">Patentes Activas</p>
            </div>
          </div>
        </div>

        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <i className="fas fa-pause-circle text-yellow-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">68</h3>
              <p className="text-gray-600">Patentes Inactivas</p>
            </div>
          </div>
        </div>

        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <i className="fas fa-search text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">2,456</h3>
              <p className="text-gray-600">Verificaciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <nav className="flex border-b">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'list'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-list mr-2"></i>
            Lista de Patentes
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-plus mr-2"></i>
            Registrar Patente
          </button>
        </nav>

        <div className="p-6">
          {activeTab === 'list' && <PlateList />}
          {activeTab === 'register' && (
            <PlateForm
              onSubmit={handleRegisterPlate}
              onCancel={handleFormCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;