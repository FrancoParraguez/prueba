import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-car text-2xl"></i>
          <span className="font-bold text-xl">Sistema de Patentes</span>
        </div>
        <div className="flex space-x-6 items-center">
          <a href="#" className="hover:text-blue-200 font-medium">
            <i className="fas fa-home mr-1"></i> Inicio
          </a>
          {user?.role === 'admin' && (
            <a href="#" className="hover:text-blue-200 font-medium">
              <i className="fas fa-cog mr-1"></i> Administración
            </a>
          )}
          <div className="flex items-center space-x-2 bg-blue-700 px-3 py-1 rounded-full">
            <i className="fas fa-user-circle"></i>
            <span>{user?.name}</span>
          </div>
          <button 
            onClick={logout}
            className="bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;