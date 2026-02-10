import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Facebook, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-parmesana-green">LA</span> PARMESANA
            </h3>
            <p className="text-gray-400 mb-4">
              Las mejores pizzas, hamburguesas y más en Cadereyta Jiménez, Nuevo León.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/la.parmesana.cadereyta.2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-parmesana-green transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/la.parmesana.cadereyta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-parmesana-green transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-white transition-colors">
                  Menú
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-parmesana-green flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Joaquín Valle Ramírez 416<br />
                  Cadereyta Jiménez, NL
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-parmesana-green" />
                <a href="tel:+528281005914" className="text-gray-400 hover:text-white transition-colors">
                  828 100 5914
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-parmesana-green" />
                <span className="text-gray-400 text-sm">
                  info@laparmesana.com
                </span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Horario</h4>
            <div className="flex items-start space-x-2">
              <Clock className="w-5 h-5 text-parmesana-green flex-shrink-0 mt-0.5" />
              <div className="text-gray-400 text-sm">
                <p>Lunes - Domingo</p>
                <p className="font-semibold text-white">12:00 PM - 11:00 PM</p>
              </div>
            </div>
            <div className="mt-4">
              <a
                href="https://wa.me/528281005914"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-parmesana-green text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} La Parmesana. Todos los derechos reservados.</p>
          <p className="mt-2">
            Desarrollado con ❤️ en Cadereyta Jiménez, NL
          </p>
        </div>
      </div>
    </footer>
  );
}
