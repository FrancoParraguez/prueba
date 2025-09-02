import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { processVerification } from '../../services/plateService';

interface CameraCaptureProps {
  onVerificationResult: (result: any) => void;
  onLoading: (loading: boolean) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onVerificationResult, onLoading }) => {
  const webcamRef = useRef<Webcam>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<string>('environment');

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      onLoading(true);
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        try {
          // Convertir base64 a blob
          const response = await fetch(imageSrc);
          const blob = await response.blob();
          
          // Crear FormData y enviar
          const formData = new FormData();
          formData.append('image', blob, 'capture.jpg');
          
          const result = await processVerification(formData);
          onVerificationResult(result);
        } catch (error) {
          console.error('Error processing image:', error);
          onVerificationResult({ error: 'Failed to process image' });
        } finally {
          onLoading(false);
        }
      }
    }
  }, [webcamRef, onVerificationResult, onLoading]);

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  const switchCamera = () => {
    setSelectedCamera(selectedCamera === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-camera mr-3 text-blue-600"></i> Captura de Imagen
      </h2>
      
      <div className="camera-container bg-gray-800 mb-6 rounded-lg overflow-hidden">
        {cameraEnabled ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: selectedCamera
            }}
            className="w-full h-auto"
          />
        ) : (
          <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-white">
            <i className="fas fa-camera-slash text-4xl"></i>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <select 
          className="border rounded-lg px-4 py-2 w-full md:w-auto"
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
        >
          <option value="environment">Cámara Trasera</option>
          <option value="user">Cámara Frontal</option>
        </select>
        <button 
          className="btn-success px-6 py-2 rounded-lg text-white font-medium"
          onClick={capture}
          disabled={!cameraEnabled}
        >
          <i className="fas fa-camera mr-2"></i> Capturar
        </button>
        <button 
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg text-white font-medium"
          onClick={toggleCamera}
        >
          <i className={`fas ${cameraEnabled ? 'fa-pause' : 'fa-play'} mr-2`}></i> 
          {cameraEnabled ? 'Pausar' : 'Reanudar'}
        </button>
        <button 
          className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-medium"
          onClick={switchCamera}
        >
          <i className="fas fa-sync mr-2"></i> Cambiar Cámara
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <i className="fas fa-info-circle text-blue-500 text-xl mr-3 mt-1"></i>
          <p className="text-blue-800">
            Asegúrese de que la patente esté completamente visible y bien iluminada para una mejor precisión en el reconocimiento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;