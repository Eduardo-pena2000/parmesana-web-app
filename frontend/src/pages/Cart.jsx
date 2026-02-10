import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const subtotal = getTotal();
  const deliveryFee = subtotal < 300 ? 30 : 0;
  const total = (parseFloat(subtotal) + deliveryFee).toFixed(2);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Agrega algunos productos deliciosos
          </p>
          <Link to="/menu" className="btn btn-primary">
            Ver Menú
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mi Carrito</h1>
          <button
            onClick={clearCart}
            className="text-parmesana-red hover:underline text-sm"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div key={index} className="card p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🍕
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  {item.size && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tamaño: {item.size}
                    </p>
                  )}
                  {item.extras && item.extras.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Extras: {item.extras.map(e => e.name).join(', ')}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-parmesana-green">
                        ${item.total}
                      </span>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-parmesana-red hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Envío</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? 'GRATIS' : `$${deliveryFee}`}
                  </span>
                </div>
                {subtotal < 300 && (
                  <p className="text-xs text-gray-500">
                    Envío gratis en pedidos mayores a $300
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-parmesana-green">${total}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                {isAuthenticated ? (
                  <Link to="/checkout" className="btn btn-primary w-full py-3 block text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                    Continuar al Pago
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="btn btn-primary w-full py-3 block text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                      Inicia Sesión
                    </Link>
                    <Link to="/checkout" className="btn btn-outline w-full py-3 block text-center border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      Continuar como Invitado
                    </Link>
                  </div>
                )}

                <Link to="/menu" className="btn btn-secondary w-full py-3 block text-center">
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
