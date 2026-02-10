import { useState, useEffect } from 'react';
import { useAuthStore } from '../context/authStore';
import { reservationService } from '../services/reservation';
import { Calendar, Clock, Users, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuthStore();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationService.getMyReservations();
      if (response.success) {
        setReservations(response.data.reservations || []);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="flex items-center text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3 mr-1" /> Confirmada
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3 mr-1" /> Cancelada
          </span>
        );
      default:
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock3 className="w-3 h-3 mr-1" /> Pendiente
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Mis Datos</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Nombre</label>
                  <p className="text-lg font-medium">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Teléfono</label>
                  <p className="text-lg font-medium">{user?.phone}</p>
                </div>
                {user?.email && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-500">Email</label>
                    <p className="text-lg font-medium">{user?.email}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                  <label className="block text-sm font-medium mb-1 text-gray-500">Puntos de Lealtad</label>
                  <p className="text-2xl text-parmesana-green font-bold">{user?.loyaltyPoints || 0} pts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservations List */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mis Reservaciones</h2>
              <Link to="/reservation" className="btn btn-primary text-sm">
                Nueva Reservación
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="spinner w-8 h-8 text-parmesana-green"></div>
              </div>
            ) : reservations.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">No tienes reservaciones</h3>
                <p className="text-gray-500 mb-6">¡Reserva una mesa y disfruta de la experiencia Parmesana!</p>
                <Link to="/reservation" className="text-parmesana-green font-semibold hover:underline">
                  Hacer una reservación
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div key={res.id} className="card p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg">
                            {new Date(res.date).toLocaleDateString()}
                          </span>
                          {getStatusBadge(res.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {res.time}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {res.guests} personas
                          </span>
                        </div>
                        {res.reservationNumber && (
                          <p className="text-xs text-gray-400 mt-2">Folio: {res.reservationNumber}</p>
                        )}
                      </div>

                      {res.status === 'pending' && (
                        <div className="text-right">
                          <p className="text-xs text-orange-500 italic">Pendiente de confirmación</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
