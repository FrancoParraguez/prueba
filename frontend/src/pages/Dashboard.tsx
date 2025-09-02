import React, { useState } from 'react';
import CameraCapture from '../components/camera/CameraCapture';
import VerificationResult from '../components/verification/VerificationResult';
import VerificationHistory from '../components/verification/VerificationHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerificationResult = (result: any) => {
    setVerificationResult(result);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Verificación de Patentes Vehiculares</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Sistema de reconocimiento de patentes mediante inteligencia artificial. 
          Capture una imagen y verifique si la patente está registrada en nuestra base de datos.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <i className="fas fa-car text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">1,248</h3>
              <p className="text-gray-600">Patentes Registradas</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">956</h3>
              <p className="text-gray-600">Verificaciones Hoy</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <i className="fas fa-bolt text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">98.3%</h3>
              <p className="text-gray-600">Precisión</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Camera Section */}
        <div className="w-full lg:w-2/3">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center h-96">
              <LoadingSpinner size="large" text="Procesando imagen..." />
            </div>
          ) : (
            <CameraCapture 
              onVerificationResult={handleVerificationResult}
              onLoading={handleLoading}
            />
          )}
        </div>

        {/* Results Section */}
        <div className="w-full lg:w-1/3">
          <VerificationResult result={verificationResult} />
          <VerificationHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;