import React from 'react';

interface CameraControlsProps {
  onCapture: () => void;
  onToggleCamera: () => void;
  onSwitchCamera: () => void;
  cameraEnabled: boolean;
  selectedCamera: string;
  loading?: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onToggleCamera,
  onSwitchCamera,
  cameraEnabled,
  selectedCamera,
  loading = false
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <select 
        className="border rounded-lg px-4 py-2 w-full md:w-auto"
        value={selectedCamera}
        onChange={(e) => onSwitchCamera()}
        disabled={loading}
      >
        <option value="environment">Cámara Trasera</option>
        <option value="user">Cámara Frontal</option>
      </select>
      
      <button 
        className="btn-success px-6 py-2 rounded-lg text-white font-medium disabled:opacity-50"
        onClick={onCapture}
        disabled={!cameraEnabled || loading}
      >
        <i className="fas fa-camera mr-2"></i>
        {loading ? 'Procesando...' : 'Capturar'}
      </button>
      
      <button 
        className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg text-white font-medium disabled:opacity-50"
        onClick={onToggleCamera}
        disabled={loading}
      >
        <i className={`fas ${cameraEnabled ? 'fa-pause' : 'fa-play'} mr-2`}></i> 
        {cameraEnabled ? 'Pausar' : 'Reanudar'}
      </button>
      
      <button 
        className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-medium disabled:opacity-50"
        onClick={onSwitchCamera}
        disabled={loading}
      >
        <i className="fas fa-sync mr-2"></i> 
        Cambiar Cámara
      </button>
    </div>
  );
};

export default CameraControls;