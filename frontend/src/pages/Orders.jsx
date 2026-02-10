import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orders';
import { Package, ChevronRight, Clock, MapPin, Calendar } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      if (response.success && response.data.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'on-delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'on-delivery': return 'En camino';
      case 'cancelled': return 'Cancelado';
      case 'pending': return 'Pendiente';
      case 'ready': return 'Listo para recoger';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex justify-center">
        <div className="spinner w-8 h-8 text-parmesana-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-parmesana-green" />
            Mis Pedidos
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¡Descubre nuestro delicioso menú y haz tu primer pedido!
            </p>
            <Link to="/menu" className="btn-primary">
              Ver Menú
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="card hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg">#{order.orderNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-parmesana-green">
                        ${parseFloat(order.total).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} artículo{order.items.length !== 1 && 's'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[70%]">
                        {order.type === 'delivery' && (
                          <>
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                              {order.deliveryAddress?.street} {order.deliveryAddress?.number}, {order.deliveryAddress?.colony}
                            </span>
                          </>
                        )}
                        {order.type === 'pickup' && (
                          <>
                            <MapPin className="w-4 h-4" />
                            Recoger en sucursal
                          </>
                        )}
                      </div>

                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-1 text-parmesana-orange font-semibold hover:gap-2 transition-all"
                      >
                        Ver Detalle <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
