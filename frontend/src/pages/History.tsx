import React, { useState, useEffect } from 'react';
import { getVerificationHistory } from '../services/plateService';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface VerificationRecord {
  id: string;
  plate_number: string;
  recognized_plate: string;
  confidence: number;
  is_match: boolean;
  timestamp: string;
  verified_by_name: string;
  verified_by_email: string;
  image_url?: string;
}

const History: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVerifications, setTotalVerifications] = useState(0);
  const [filterMatch, setFilterMatch] = useState<'all' | 'match' | 'no-match'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getVerificationHistory(currentPage, 20);
      setVerifications(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / (response.limit || 20)) || 1);
      setTotalVerifications(response.total || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = searchTerm === '' || 
      verification.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.recognized_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.verified_by_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterMatch === 'all' || 
      (filterMatch === 'match' && verification.is_match) ||
      (filterMatch === 'no-match' && !verification.is_match);

    return matchesSearch && matchesFilter;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const getMatchStats = () => {
    const matches = verifications.filter(v => v.is_match).length;
    const noMatches = verifications.filter(v => !v.is_match).length;
    const avgConfidence = verifications.reduce((acc, v) => acc + v.confidence, 0) / verifications.length;
    
    return { matches, noMatches, avgConfidence: avgConfidence || 0 };
  };

  const stats = getMatchStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <i className="fas fa-history mr-3 text-purple-600"></i>
          Historial de Verificaciones
        </h1>
        <p className="text-gray-600">
          Registro completo de todas las verificaciones de patentes realizadas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <i className="fas fa-search text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{totalVerifications}</h3>
              <p className="text-gray-600">Verificaciones Totales</p>
            </div>
          </div>
        </div>

        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.matches}</h3>
              <p className="text-gray-600">Patentes Encontradas</p>
            </div>
          </div>
        </div>

        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <i className="fas fa-times-circle text-red-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.noMatches}</h3>
              <p className="text-gray-600">No Registradas</p>
            </div>
          </div>
        </div>

        <div className="stat-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <i className="fas fa-percentage text-yellow-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.avgConfidence.toFixed(1)}%</h3>
              <p className="text-gray-600">Confianza Promedio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por patente o usuario..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterMatch}
              onChange={(e) => setFilterMatch(e.target.value as any)}
            >
              <option value="all">Todas</option>
              <option value="match">Solo Encontradas</option>
              <option value="no-match">Solo No Registradas</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredVerifications.length} de {verifications.length} verificaciones
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {/* History List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && verifications.length === 0 ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="large" text="Cargando historial..." />
          </div>
        ) : filteredVerifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confianza
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verificado por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVerifications.map((verification) => {
                  const { date, time } = formatDateTime(verification.timestamp);
                  return (
                    <tr key={verification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="plate-number">
                            {verification.recognized_plate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            verification.is_match
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {verification.is_match ? 'Registrada' : 'No registrada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="mr-2">{verification.confidence.toFixed(1)}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${verification.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{verification.verified_by_name}</div>
                          <div className="text-gray-500">{verification.verified_by_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{date}</div>
                          <div className="text-gray-500">{time}</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No se encontraron verificaciones
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterMatch !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay verificaciones registradas en el sistema'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="flex items-center px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-left mr-2"></i>
            Anterior
          </button>

          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="flex items-center px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
          >
            Siguiente
            <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      )}

      {loading && verifications.length > 0 && (
        <div className="text-center py-4">
          <LoadingSpinner size="small" text="Cargando más..." />
        </div>
      )}
    </div>
  );
};

export default History;