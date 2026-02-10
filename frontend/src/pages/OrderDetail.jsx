import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orders';
import {
  ArrowLeft, MapPin, Clock, Calendar, CreditCard,
  Banknote, Truck, Receipt, CheckCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrder(id);
      if (response.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Error sustrayendo la información del pedido');
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
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex justify-center">
        <div className="spinner w-8 h-8 text-parmesana-orange"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Pedido no encontrado</h2>
        <Link to="/orders" className="btn-primary">Volver a Mis Pedidos</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-parmesana-orange mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a Mis Pedidos
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Pedido #{order.orderNumber}</h1>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-center ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg mb-4">Detalle de Productos</h3>
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🍕</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{item.quantity}x {item.name}</p>
                          {item.size && <p className="text-sm text-gray-500">Tamaño: {item.size}</p>}
                        </div>
                        <p className="font-bold">${parseFloat(item.total).toFixed(2)}</p>
                      </div>

                      {item.extras && item.extras.length > 0 && (
                        <div className="mt-1 text-sm text-gray-500">
                          <p className="font-medium text-xs uppercase tracking-wide mb-1">Extras:</p>
                          <ul className="list-disc list-inside pl-1 space-y-0.5">
                            {item.extras.map((extra, idx) => (
                              <li key={idx}>{extra.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.notes && (
                        <p className="mt-2 text-sm bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-100 italic">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Timeline (Optional Enhancement) */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Estado del Pedido via WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Recibirás actualizaciones de tu pedido directamente en tu WhatsApp registrado.
              </p>
              <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Pedido enviado a cocina</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gray-400" /> Resumen de Pago
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (16%)</span>
                  <span>${parseFloat(order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span>${parseFloat(order.deliveryFee).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-parmesana-green">${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Método de Pago</p>
                <div className="flex items-center gap-2">
                  {order.paymentMethod === 'card' && <CreditCard className="w-5 h-5 text-blue-600" />}
                  {order.paymentMethod === 'cash' && <Banknote className="w-5 h-5 text-green-600" />}
                  <span className="capitalize">{order.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded ${order.paymentStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.paymentStatus === 'approved' ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" /> Entrega
              </h3>
              {order.type === 'delivery' ? (
                <div className="text-sm">
                  <p className="font-medium mb-1">Dirección de envío:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.deliveryAddress?.street} {order.deliveryAddress?.number}<br />
                    {order.deliveryAddress?.colony}<br />
                    {order.deliveryAddress?.city}, {order.deliveryAddress?.zipCode}
                  </p>
                  {order.deliveryAddress?.references && (
                    <p className="mt-2 text-xs text-gray-500 italic">
                      Ref: {order.deliveryAddress.references}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Recoger en sucursal</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
