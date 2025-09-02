import React, { useState, useEffect } from 'react';
import { getVerificationHistory } from '../../services/plateService';
import LoadingSpinner from '../common/LoadingSpinner';

interface VerificationRecord {
  id: string;
  plate_number: string;
  recognized_plate: string;
  confidence: number;
  is_match: boolean;
  timestamp: string;
  verified_by_name: string;
  image_url?: string;
}

const VerificationHistory: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getVerificationHistory(currentPage, 5);
      setVerifications(response.verifications || []);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  if (loading && verifications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          <i className="fas fa-history mr-2 text-purple-600"></i>
          Historial Reciente
        </h3>
        <LoadingSpinner size="medium" text="Cargando historial..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        <i className="fas fa-history mr-2 text-purple-600"></i>
        Historial Reciente
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {verifications.length > 0 ? (
          verifications.map((verification) => {
            const { date, time } = formatDateTime(verification.timestamp);
            return (
              <div
                key={verification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  verification.is_match
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className="plate-number text-sm mr-2">
                      {verification.recognized_plate}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        verification.is_match
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {verification.is_match ? 'Registrada' : 'No registrada'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {verification.confidence.toFixed(1)}%
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Por: {verification.verified_by_name}</span>
                    <span>{date} - {time}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-clock text-3xl mb-3 opacity-50"></i>
            <p>No hay verificaciones recientes</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-left mr-1"></i>
            Anterior
          </button>
          
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Siguiente
            <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      )}

      {loading && verifications.length > 0 && (
        <div className="text-center py-2">
          <LoadingSpinner size="small" />
        </div>
      )}
    </div>
  );
};

export default VerificationHistory;