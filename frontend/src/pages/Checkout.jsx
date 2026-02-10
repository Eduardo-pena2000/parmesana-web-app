import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';
import { orderService } from '../services/orders';
import { MapPin, CreditCard, Banknote, Truck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import api from '../services/api';
import MockCardForm from '../components/MockCardForm';

// ... (existing imports)



// Replace with your actual Stripe publishable key
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    colony: '',
    city: 'Cadereyta Jiménez',
    zipCode: '',
    references: '',
    paymentMethod: 'cash', // cash, card, transfer
    notes: ''
  });

  // Calculate totals
  const subtotal = getTotal();
  const tax = 0;
  const deliveryFee = subtotal < 300 ? 30 : 0;
  const total = parseFloat(subtotal) + deliveryFee;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/menu');
    }
  }, [items, navigate]);

  // Load Stripe PaymentIntent when card is selected
  useEffect(() => {
    if (formData.paymentMethod === 'card' && total > 0) {
      setLoading(true); // Reuse loading state or create a new one 'initializingPayment'
      // Create PaymentIntent as soon as the page loads
      api.post('/payments/create-payment-intent', {
        amount: total,
        currency: 'mxn'
      })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error creating payment intent:', err);
          setLoading(false);
          // Instead of error, notify about Demo Mode
          toast('Activando Modo Demostración (Clave Stripe Vencida)', {
            icon: '⚠️',
            duration: 4000
          });
        });
    } else {
      setClientSecret('');
    }
  }, [formData.paymentMethod, total]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOrderSuccess = async (paymentIntent) => {
    await createOrder('confirmed', paymentIntent.id); // 'confirmed' matches the backend ENUM for paid orders
  };

  const createOrder = async (status = 'pending', transactionId = null) => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          menuItemId: item._id || item.id,
          quantity: item.quantity,
          size: item.size,
          extras: item.extras,
          price: item.price || item.total / item.quantity
        })),
        shippingAddress: {
          street: formData.street,
          number: formData.number,
          colony: formData.colony,
          city: formData.city,
          zipCode: formData.zipCode,
          references: formData.references
        },
        type: 'delivery', // Specify order type
        paymentMethod: formData.paymentMethod,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        deliveryFee: parseFloat(deliveryFee),
        total: parseFloat(total),
        notes: formData.notes,
        status: status, // potentially 'paid' if coming from Stripe
        transactionId: transactionId,
        guestInfo: !user ? {
          firstName: formData.guestName,
          lastName: '',
          phone: formData.guestPhone,
          email: 'guest@checkout.com' // Placeholder or add email field
        } : null
      };

      await orderService.createOrder(orderData);

      clearCart();
      toast.success('¡Pedido realizado con éxito!');
      navigate('/orders');

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'card') {
      // Logic handled by PaymentForm
      return;
    }
    await createOrder();
  };

  if (items.length === 0) return null;

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#00a650',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Info */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-parmesana-green" />
                Información de Envío
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {user ? (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <span className="text-xs text-gray-500 uppercase">Nombre</span>
                      <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <span className="text-xs text-gray-500 uppercase">Teléfono</span>
                      <p className="font-medium truncate">{user.phone}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-2 text-sm text-blue-800 dark:text-blue-200">
                      📝 Estás comprando como <strong>Invitado</strong>.
                    </div>
                    <div className="col-span-1">
                      <label className="label">Nombre *</label>
                      <input
                        type="text"
                        name="guestName"
                        required
                        className="input"
                        placeholder="Tu Nombre"
                        value={formData.guestName || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="label">Teléfono *</label>
                      <input
                        type="tel"
                        name="guestPhone"
                        required
                        className="input"
                        placeholder="Tu Teléfono"
                        value={formData.guestPhone || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="label">Calle *</label>
                    <input
                      type="text"
                      name="street"
                      required
                      className="input"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Av. Principal"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="label">Número *</label>
                    <input
                      type="text"
                      name="number"
                      required
                      className="input"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="label">Colonia *</label>
                    <input
                      type="text"
                      name="colony"
                      required
                      className="input"
                      value={formData.colony}
                      onChange={handleChange}
                      placeholder="Centro"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="label">Código Postal *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      className="input"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="67480"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Ciudad</label>
                  <input
                    type="text"
                    name="city"
                    disabled
                    className="input bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    value={formData.city}
                  />
                </div>

                <div>
                  <label className="label">Referencias de Envío</label>
                  <textarea
                    name="references"
                    rows="2"
                    className="input"
                    value={formData.references}
                    onChange={handleChange}
                    placeholder="Entre call X y Y, casa color azul..."
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-parmesana-green" />
                Método de Pago
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <label className={`
                  border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center h-full
                  ${formData.paymentMethod === 'cash'
                    ? 'border-parmesana-green bg-green-50 dark:bg-green-900/20 text-parmesana-green'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}
                `}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Banknote className="w-8 h-8" />
                  <span className="font-semibold text-sm">Efectivo</span>
                </label>

                <label className={`
                  border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center h-full
                  ${formData.paymentMethod === 'card'
                    ? 'border-parmesana-green bg-green-50 dark:bg-green-900/20 text-parmesana-green'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}
                `}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <CreditCard className="w-8 h-8" />
                  <span className="font-semibold text-sm">Tarjeta</span>
                </label>

                <label className={`
                  border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center h-full
                  ${formData.paymentMethod === 'transfer'
                    ? 'border-parmesana-green bg-green-50 dark:bg-green-900/20 text-parmesana-green'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}
                `}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <AlertCircle className="w-8 h-8" />
                  <span className="font-semibold text-sm">Transferencia</span>
                </label>
              </div>

              {formData.paymentMethod === 'transfer' && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
                  ⚠️ Deberás enviar el comprobante de pago por WhatsApp antes de que tu pedido sea preparado.
                </div>
              )}

              {/* Stripe Payment Form */}
              {formData.paymentMethod === 'card' && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Introducir datos de tarjeta</h3>
                  {loading && !clientSecret ? (
                    <div className="flex justify-center py-8">
                      <div className="spinner w-8 h-8"></div>
                    </div>
                  ) : clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                      <PaymentForm
                        clientSecret={clientSecret}
                        onSuccess={handleOrderSuccess}
                        onCancel={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                      />
                    </Elements>
                  ) : (
                    <div className="animate-fadeIn">
                      <p className="text-sm text-yellow-600 mb-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                        ⚠️ No se pudo conectar con Stripe (API Key vencida).
                        <br />
                        <strong>Mostrando formulario de demostración.</strong>
                      </p>
                      <MockCardForm
                        onSuccess={(mockPayment) => handleOrderSuccess(mockPayment)}
                        onCancel={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="card p-6">
              <label className="label">Notas Adicionales</label>
              <textarea
                name="notes"
                rows="2"
                className="input"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Sin cebolla, salsa extra, etc..."
              />
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumen</h2>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm group">
                    <div className="flex-1 pr-2">
                      <p className="font-medium truncate group-hover:whitespace-normal transition-all">
                        {item.quantity}x {item.name}
                      </p>
                      {item.size && <p className="text-xs text-gray-500">{item.size}</p>}
                    </div>
                    <span className="font-medium whitespace-nowrap">${item.total}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Envío</span>
                  <span className={deliveryFee === 0 ? 'text-parmesana-green' : ''}>
                    {deliveryFee === 0 ? 'GRATIS' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-parmesana-green">${total.toFixed(2)}</span>
                </div>
              </div>

              {formData.paymentMethod !== 'card' && (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="btn btn-primary w-full mt-6 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              )}

              <p className="text-xs text-center text-gray-500 mt-4">
                Al confirmar, aceptas nuestros términos de servicio.
              </p>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
