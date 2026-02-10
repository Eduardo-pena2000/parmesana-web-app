import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-parmesana-green mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Página no encontrada</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <Home className="w-5 h-5 mr-2" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
