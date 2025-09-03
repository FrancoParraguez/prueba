import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-car text-2xl text-blue-400 mr-2"></i>
              <h3 className="text-xl font-bold">Sistema de Patentes</h3>
            </div>
            <p className="text-gray-400">
              Sistema de reconocimiento de patentes vehiculares mediante 
              inteligencia artificial para una verificación rápida y precisa.
            </p>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Útiles</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  <i className="fas fa-home mr-2"></i>Inicio
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">
                  <i className="fas fa-history mr-2"></i>Historial
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  <i className="fas fa-cog mr-2"></i>Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="text-gray-400 space-y-2">
              <p>
                <i className="fas fa-envelope mr-2"></i>
                info@sistemapatentes.com
              </p>
              <p>
                <i className="fas fa-phone mr-2"></i>
                +1 (555) 123-4567
              </p>
              <p>
                <i className="fas fa-map-marker-alt mr-2"></i>
                123 Tech Street, Ciudad
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Sistema de Patentes. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-github text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;