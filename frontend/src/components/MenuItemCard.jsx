import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Clock } from 'lucide-react';
import { useCartStore } from '../context/cartStore';
import toast from 'react-hot-toast';

export default function MenuItemCard({ item }) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: item.id,
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      basePrice: item.basePrice,
      size: null,
      sizePrice: null,
      extras: [],
      quantity: 1
    });

    toast.success('¡Agregado al carrito!');
  };

  const finalPrice = item.discount > 0
    ? (item.basePrice * (1 - item.discount / 100)).toFixed(2)
    : item.basePrice;

  return (
    <Link
      to={`/menu/${item.slug}`}
      className="card card-hover block animate-fade-in bg-white dark:bg-parmesana-dark border border-transparent dark:border-border"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍕
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isNew && (
            <span className="badge badge-yellow">
              Nuevo
            </span>
          )}
          {item.discount > 0 && (
            <span className="badge bg-parmesana-red text-white">
              -{item.discount}%
            </span>
          )}
          {item.isPopular && (
            <span className="badge bg-parmesana-green text-white">
              Popular
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 bg-parmesana-green text-white p-2 rounded-full shadow-lg hover:bg-primary-600 transform hover:scale-110 transition-all duration-200"
          title="Agregar al carrito"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
          {item.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Rating & Time */}
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
          {item.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{item.rating}</span>
              <span className="text-xs">({item.reviewCount})</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{item.preparationTime} min</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {item.discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-parmesana-green">
                  ${finalPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${item.basePrice}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-parmesana-green">
                ${item.basePrice}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
