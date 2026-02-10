import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Clock, Truck, Shield } from 'lucide-react';
import { menuService } from '../services/menu';
import MenuItemCard from '../components/MenuItemCard';
import toast from 'react-hot-toast';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, popular, cats] = await Promise.all([
          menuService.getFeaturedItems(4),
          menuService.getPopularItems(6),
          menuService.getCategories(false)
        ]);

        setFeaturedItems(featured.data.menuItems || []);
        setPopularItems(popular.data.menuItems || []);
        setCategories(cats.data.categories || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar el menú');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-parmesana-black text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop"
            alt="Pizza de Carnes Frías"
            className="w-full h-full object-cover opacity-100"
          />
          {/* Lighter Gradient Overlays - Reduced opacity for visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-parmesana-black via-transparent to-transparent opacity-80"></div>
        </div>

        <div className="container-custom py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up leading-tight drop-shadow-xl">
              Sabor y Calidad <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-parmesana-green to-parmesana-yellow drop-shadow-sm">
                Que Distingue
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-100 animate-slide-up max-w-2xl drop-shadow-md font-medium" style={{ animationDelay: '0.1s' }}>
              Experimenta las mejores pizzas artesanales y hamburguesas gourmet de Cadereyta.
              Ingredientes premium, sabor inigualable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/menu"
                className="btn bg-parmesana-green text-white hover:bg-green-600 px-8 py-4 text-lg font-semibold shadow-lg shadow-parmesana-green/30"
              >
                Ver Menú Completo
                <ChevronRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <a
                href="https://wa.me/528281005914"
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-gray-700 bg-gray-800/50 backdrop-blur text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold"
              >
                Pedir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      < section className="py-12 bg-white dark:bg-parmesana-black border-y border-gray-100 dark:border-gray-800" >
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-parmesana-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Entrega Rápida</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recibe tu pedido en 45 minutos o menos
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-parmesana-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Calidad Premium</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ingredientes frescos y de la más alta calidad
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-parmesana-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pago Seguro</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tarjeta, efectivo o transferencia
              </p>
            </div>
          </div>
        </div>
      </section >

      {/* Categories */}
      {
        categories.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-parmesana-black">
            <div className="container-custom">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Categorías
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/menu?category=${category.slug}`}
                    className="card card-hover text-center p-6 group"
                  >
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-sm group-hover:text-parmesana-green transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* Featured Items */}
      {
        featuredItems.length > 0 && (
          <section className="py-16">
            <div className="container-custom">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">
                  Destacados
                </h2>
                <Link to="/menu" className="text-parmesana-green hover:underline flex items-center">
                  Ver todos
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* Popular Items */}
      {
        popularItems.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-parmesana-black">
            <div className="container-custom">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">
                  Los Más Populares
                </h2>
                <Link to="/menu?filter=popular" className="text-parmesana-green hover:underline flex items-center">
                  Ver todos
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* CTA Section */}
      <section className="py-20 bg-parmesana-green text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para ordenar?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Descubre nuestro menú completo y haz tu pedido ahora
          </p>
          <Link
            to="/menu"
            className="btn bg-white text-parmesana-green hover:bg-gray-100 px-8 py-4 text-lg font-semibold inline-flex items-center"
          >
            Ver Menú Completo
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div >
  );
}
