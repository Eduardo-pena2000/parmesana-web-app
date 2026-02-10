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



      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-parmesana-green to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2 font-display">5k+</div>
              <div className="text-sm md:text-base opacity-90 font-medium">Pizzas Entregadas</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2 font-display">45m</div>
              <div className="text-sm md:text-base opacity-90 font-medium">Tiempo Promedio</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2 font-display">4.9</div>
              <div className="text-sm md:text-base opacity-90 font-medium">Calificación</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2 font-display">100%</div>
              <div className="text-sm md:text-base opacity-90 font-medium">Sabor Casero</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 hover:-translate-y-2 transition-transform duration-300 border-t-4 border-parmesana-green">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "¡La pizza de boneless es una locura! Súper recomendada, llegaron rapidísimo y calientita."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  CR
                </div>
                <div className="ml-3">
                  <h4 className="font-bold">Carlos Ruiz</h4>
                  <span className="text-xs text-gray-500">Cliente Frecuente</span>
                </div>
              </div>
            </div>

            <div className="card p-8 hover:-translate-y-2 transition-transform duration-300 border-t-4 border-parmesana-green">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Me encanta que pueda pedir por la página y pagar con tarjeta. Súper fácil y las hamburguesas 10/10."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  AG
                </div>
                <div className="ml-3">
                  <h4 className="font-bold">Ana González</h4>
                  <span className="text-xs text-gray-500">Foodie</span>
                </div>
              </div>
            </div>

            <div className="card p-8 hover:-translate-y-2 transition-transform duration-300 border-t-4 border-parmesana-green">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Las costillas BBQ se deshacen de lo suaves que están. Definitivamente pediré de nuevo."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  JL
                </div>
                <div className="ml-3">
                  <h4 className="font-bold">Jorge López</h4>
                  <span className="text-xs text-gray-500">Local Guide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Food Gallery */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Nuestros Mejores Momentos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* 1. Large Main Item (Pizza) - 2x2 */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop"
                alt="Pizza Artesanal"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="bg-parmesana-orange text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Bestseller</span>
                <h3 className="text-2xl font-bold">Pizzas Artesanales</h3>
              </div>
            </div>

            {/* 2. Burger - 1x1 */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer h-48 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
                alt="Hamburguesa Gourmet"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>

            {/* 3. Pasta - 1x1 */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer h-48 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop"
                alt="Pastas"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>

            {/* 4. Wings/BBQ - 1x1 */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer h-48 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop"
                alt="Costillas BBQ"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>

            {/* 5. Drinks/Dessert - 1x1 */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer h-48 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop"
                alt="Bebidas y Postres"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/90 text-gray-900 font-bold px-4 py-2 rounded-full shadow-lg">Ver Más</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
