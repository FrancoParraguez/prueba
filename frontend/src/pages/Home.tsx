import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <i className="fas fa-car text-6xl mb-6 text-white opacity-90"></i>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sistema de Verificación de Patentes
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Reconocimiento automático de patentes vehiculares mediante inteligencia artificial
            </p>
            <div className="space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary px-8 py-3 rounded-lg text-white font-semibold text-lg inline-block"
                >
                  <i className="fas fa-tachometer-alt mr-2"></i>
                  Ir al Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn-primary px-8 py-3 rounded-lg text-white font-semibold text-lg inline-block"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg inline-block hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro sistema utiliza tecnología de vanguardia para proporcionar 
              verificaciones rápidas y precisas de patentes vehiculares
            </p>
            </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="feature-card bg-white p-8 rounded-xl shadow-lg text-center">
             <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
               <i className="fas fa-camera text-blue-600 text-2xl"></i>
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-4">
               Reconocimiento por Cámara
             </h3>
             <p className="text-gray-600">
               Capture imágenes en tiempo real con su cámara y obtenga 
               resultados instantáneos de reconocimiento de patentes.
             </p>
           </div>

           <div className="feature-card bg-white p-8 rounded-xl shadow-lg text-center">
             <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
               <i className="fas fa-bolt text-green-600 text-2xl"></i>
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-4">
               Procesamiento Rápido
             </h3>
             <p className="text-gray-600">
               Algoritmos de IA optimizados que procesan imágenes en segundos 
               con una precisión superior al 98%.
             </p>
           </div>

           <div className="feature-card bg-white p-8 rounded-xl shadow-lg text-center">
             <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
               <i className="fas fa-database text-purple-600 text-2xl"></i>
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-4">
               Base de Datos Completa
             </h3>
             <p className="text-gray-600">
               Verificación contra una base de datos actualizada de patentes 
               registradas con información detallada de vehículos.
             </p>
           </div>
         </div>
       </div>
     </section>

     {/* Stats Section */}
     <section className="py-16 bg-white">
       <div className="container mx-auto px-4">
         <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
             Estadísticas del Sistema
           </h2>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           <div className="text-center">
             <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
               98.3%
             </div>
             <p className="text-gray-600">Precisión</p>
           </div>
           <div className="text-center">
             <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
               1,248
             </div>
             <p className="text-gray-600">Patentes Registradas</p>
           </div>
           <div className="text-center">
             <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
               15,672
             </div>
             <p className="text-gray-600">Verificaciones Realizadas</p>
           </div>
           <div className="text-center">
             <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">
               &lt;2s
             </div>
             <p className="text-gray-600">Tiempo de Respuesta</p>
           </div>
         </div>
       </div>
     </section>

     {/* How it Works Section */}
     <section className="py-16 bg-gray-50">
       <div className="container mx-auto px-4">
         <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
             ¿Cómo Funciona?
           </h2>
           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
             Proceso simple y eficiente en tres pasos
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="text-center">
             <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
               1
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-4">
               Capture la Imagen
             </h3>
             <p className="text-gray-600">
               Tome una foto de la patente vehicular usando su cámara 
               o suba una imagen existente.
             </p>
           </div>

           <div className="text-center">
             <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
               2
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-4">
               Procesamiento IA
             </h3>
             <p className="text-gray-600">
               Nuestros algoritmos de IA analizan la imagen y extraen 
               el número de patente automáticamente.
             </p>
           </div>

           <div className="text-center">
             <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
               3
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-4">
               Verificación Instantánea
             </h3>
             <p className="text-gray-600">
               Compare contra nuestra base de datos y obtenga 
               resultados detallados al instante.
             </p>
           </div>
         </div>
       </div>
     </section>

     {/* CTA Section */}
     {!user && (
       <section className="py-16 bg-blue-600 text-white">
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold mb-4">
             ¿Listo para Comenzar?
           </h2>
           <p className="text-xl mb-8 opacity-90">
             Únete a nuestro sistema y comienza a verificar patentes hoy mismo
           </p>
           <div className="space-x-4">
             <Link
               to="/register"
               className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg inline-block hover:bg-gray-100 transition-colors"
             >
               <i className="fas fa-user-plus mr-2"></i>
               Crear Cuenta Gratis
             </Link>
             <Link
               to="/login"
               className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg inline-block hover:bg-white hover:text-blue-600 transition-colors"
             >
               <i className="fas fa-sign-in-alt mr-2"></i>
               Iniciar Sesión
             </Link>
           </div>
         </div>
       </section>
     )}
   </div>
 );
};

export default Home;