import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { menuService } from '../services/menu';
import MenuItemCard from '../components/MenuItemCard';
import toast from 'react-hot-toast';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await menuService.getCategories(false);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (searchQuery) filters.search = searchQuery;

      const response = await menuService.getMenuItems(filters);
      setMenuItems(response.data.menuItems || []);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast.error('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMenuItems();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Nuestro Menú</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora nuestros deliciosos platillos
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pizzas, hamburguesas, bebidas..."
              className="input pl-12 pr-4"
            />
          </div>
        </form>

        {/* Filters Toggle (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn btn-secondary mb-4 w-full flex items-center justify-center"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="card p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Categorías</h2>
                {(selectedCategory || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-parmesana-green hover:underline flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-parmesana-green text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Todos
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${
                      selectedCategory === category.slug
                        ? 'bg-parmesana-green text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Menu Items Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner w-12 h-12"></div>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  No se encontraron productos
                </p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Ver todo el menú
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {menuItems.length} producto{menuItems.length !== 1 ? 's' : ''} encontrado{menuItems.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
