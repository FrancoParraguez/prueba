import React from 'react';

interface VerificationResultProps {
  result: {
    recognizedPlate: string;
    confidence: number;
    isMatch: boolean;
    plateInfo: any;
    vehicle: any;
    timestamp: Date;
  } | null;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-search mr-3 text-green-600"></i> Resultados
        </h2>
        <div className="text-center text-gray-500 py-8">
          <i className="fas fa-car text-4xl mb-4 opacity-50"></i>
          <p>Capture una imagen para ver los resultados</p>
        </div>
      </div>
    );
  }

  const { recognizedPlate, confidence, isMatch, plateInfo, vehicle, timestamp } = result;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-search mr-3 text-green-600"></i> Resultados
      </h2>

      <div className={`result-card border rounded-xl p-5 mb-6 ${
        isMatch 
          ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
          : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">
            {isMatch ? 'Patente Verificada' : 'Patente No Registrada'}
          </h3>
          <span className={`text-white text-sm px-2 py-1 rounded-full ${
            isMatch ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isMatch ? 'Registrada' : 'No registrada'}
          </span>
        </div>
        <div className="mb-4">
          <span className="plate-number text-xl">{recognizedPlate}</span>
          <span className="ml-3 text-sm text-gray-600">
            Confianza: {confidence.toFixed(2)}%
          </span>
        </div>
        
        {isMatch && plateInfo ? (
          <div className="text-gray-700">
            <p className="mb-1"><span className="font-medium">Propietario:</span> {plateInfo.owner}</p>
            <p className="mb-1"><span className="font-medium">Vehículo:</span> {plateInfo.vehicleType} - {plateInfo.model}</p>
            <p className="mb-1"><span className="font-medium">Color:</span> {plateInfo.color}</p>
          </div>
        ) : (
          <div className="text-gray-700">
            <p>Esta patente no se encuentra registrada en nuestra base de datos.</p>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p><span className="font-medium">Hora:</span> {new Date(timestamp).toLocaleTimeString()}</p>
          <p><span className="font-medium">Fecha:</span> {new Date(timestamp).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationResult;