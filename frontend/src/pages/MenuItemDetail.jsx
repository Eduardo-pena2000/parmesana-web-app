import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { menuService } from '../services/menu';
import { useCartStore } from '../context/cartStore';
import toast from 'react-hot-toast';

export default function MenuItemDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchItem();
  }, [slug]);

  const fetchItem = async () => {
    try {
      const response = await menuService.getMenuItem(slug);
      setItem(response.data.menuItem);
      if (response.data.menuItem.sizes && response.data.menuItem.sizes.length > 0) {
        setSelectedSize(response.data.menuItem.sizes[0]);
      }
    } catch (error) {
      console.error('Error loading item:', error);
      toast.error('Producto no encontrado');
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      basePrice: item.basePrice,
      size: selectedSize?.name || null,
      sizePrice: selectedSize?.price || null,
      extras: selectedExtras,
      quantity
    });
    toast.success('¡Agregado al carrito!');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!item) return null;

  const currentPrice = selectedSize ? selectedSize.price : item.basePrice;
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + parseFloat(extra.price), 0);
  const totalPrice = (parseFloat(currentPrice) + extrasTotal) * quantity;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <button onClick={() => navigate(-1)} className="btn btn-secondary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-96 object-cover" />
            ) : (
              <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-9xl">
                🍕
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{item.description}</p>

            {item.sizes && item.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block font-semibold mb-2">Tamaño</label>
                <div className="grid grid-cols-2 gap-2">
                  {item.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedSize === size
                          ? 'border-parmesana-green bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="font-semibold">{size.name}</div>
                      <div className="text-sm text-gray-600">${size.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.extras && item.extras.length > 0 && (
              <div className="mb-6">
                <label className="block font-semibold mb-2">Extras</label>
                <div className="space-y-2">
                  {item.extras.map((extra, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedExtras.some(e => e.name === extra.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExtras([...selectedExtras, extra]);
                          } else {
                            setSelectedExtras(selectedExtras.filter(e => e.name !== extra.name));
                          }
                        }}
                        className="w-5 h-5"
                      />
                      <span>{extra.name} (+${extra.price})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block font-semibold mb-2">Cantidad</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-secondary w-12 h-12"
                >
                  -
                </button>
                <span className="text-xl font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn btn-secondary w-12 h-12"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">Total:</span>
                <span className="text-3xl font-bold text-parmesana-green">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <button onClick={handleAddToCart} className="btn btn-primary w-full py-4 text-lg">
                <ShoppingCart className="w-5 h-5 mr-2 inline" />
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
