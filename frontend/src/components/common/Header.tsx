import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 hover:text-blue-200"
        >
          <i className="fas fa-car text-2xl"></i>
          <span className="font-bold text-xl">Sistema de Patentes</span>
        </Link>
        <div className="flex space-x-6 items-center">
          <Link to="/dashboard" className="hover:text-blue-200 font-medium">
            <i className="fas fa-home mr-1"></i> Dashboard
          </Link>
          {user && (
            <Link to="/history" className="hover:text-blue-200 font-medium">
              <i className="fas fa-history mr-1"></i> Historial
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-blue-200 font-medium">
              <i className="fas fa-cog mr-1"></i> Administración
            </Link>
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
