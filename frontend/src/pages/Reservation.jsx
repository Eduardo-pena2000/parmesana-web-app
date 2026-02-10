import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { reservationService } from '../services/reservation';
import toast from 'react-hot-toast';
import { Users, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import DatePicker from '../components/ui/DatePicker';
import TimePicker from '../components/ui/TimePicker';
import { Calendar, Clock } from 'lucide-react';

export default function Reservation() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: 2,
        specialRequests: '',
        contactName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
        contactPhone: user?.phone || '',
        occasion: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, date }));
    };

    const handleTimeChange = (time) => {
        setFormData(prev => ({ ...prev, time }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para reservar');
            navigate('/login', { state: { from: '/reservation' } });
            return;
        }

        setLoading(true);
        try {
            await reservationService.create(formData);
            setSuccess(true);
            toast.success('¡Reservación creada exitosamente!');
        } catch (error) {
            console.error('Error creating reservation:', error);
            toast.error(error.response?.data?.message || 'Error al crear la reservación');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white dark:bg-parmesana-black flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-parmesana-dark rounded-xl shadow-2xl p-8 text-center animate-fade-in border border-gray-100 dark:border-border">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-parmesana-green" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Reservación Confirmada!</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Te esperamos el día <br />
                        <span className="font-semibold text-parmesana-green text-lg">{formData.date}</span> a las <span className="font-semibold text-parmesana-green text-lg">{formData.time}</span>.
                    </p>
                    <div className="space-y-3">
                        <a
                            href={`https://wa.me/528281005914?text=${encodeURIComponent(
                                `Hola! 🍕 Hice una reservación en la web:\n\n📅 Fecha: ${formData.date}\n⏰ Hora: ${formData.time}\n👥 Personas: ${formData.guests}\n👤 Nombre: ${formData.contactName}\n📝 Notas: ${formData.specialRequests || 'Ninguna'}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn bg-[#25D366] text-white hover:bg-[#128C7E] w-full flex items-center justify-center gap-2 text-lg font-bold shadow-lg shadow-green-500/20"
                        >
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            Enviar confirmación por WhatsApp
                        </a>
                        <button
                            onClick={() => navigate('/profile')}
                            className="btn btn-outline w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Ver mis reservaciones
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-ghost w-full text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-parmesana-black py-12">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Reserva tu Mesa</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Asegura tu lugar en La Parmesana y vive una experiencia inolvidable.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-parmesana-dark rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Image Side */}
                            <div className="bg-parmesana-green p-8 flex flex-col justify-center text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-6">Información Importante</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <Clock className="w-6 h-6 shrink-0" />
                                            <span>Tu mesa se guardará por 15 minutos después de la hora reservada.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Users className="w-6 h-6 shrink-0" />
                                            <span>Para grupos mayores a 10 personas, por favor contáctanos por teléfono.</span>
                                        </li>
                                    </ul>
                                </div>
                                {/* Decorative circles */}
                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            </div>

                            {/* Form Side */}
                            <div className="p-8 relative">
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {/* Date Section */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
                                            <Calendar className="w-4 h-4 inline mr-2 text-parmesana-green" />
                                            1. Elige la Fecha
                                        </label>
                                        <DatePicker
                                            selectedDate={formData.date}
                                            onChange={handleDateChange}
                                        />
                                    </div>

                                    {/* Time Section */}
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
                                            <Clock className="w-4 h-4 inline mr-2 text-parmesana-green" />
                                            2. Elige la Hora
                                        </label>
                                        <TimePicker
                                            selectedTime={formData.time}
                                            onChange={handleTimeChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Users className="w-4 h-4 inline mr-2" />
                                            Número de Personas
                                        </label>
                                        <input
                                            type="number"
                                            name="guests"
                                            required
                                            min="1"
                                            max="20"
                                            value={formData.guests}
                                            onChange={handleChange}
                                            className="input dark:bg-gray-800 dark:border-gray-700"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nombre de Contacto
                                            </label>
                                            <input
                                                type="text"
                                                name="contactName"
                                                required
                                                placeholder="Tu nombre completo"
                                                value={formData.contactName}
                                                onChange={handleChange}
                                                className="input dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                name="contactPhone"
                                                required
                                                placeholder="10 dígitos"
                                                value={formData.contactPhone}
                                                onChange={handleChange}
                                                className="input dark:bg-gray-800 dark:border-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <MessageSquare className="w-4 h-4 inline mr-2" />
                                            Peticiones Especiales (Opcional)
                                        </label>
                                        <textarea
                                            name="specialRequests"
                                            rows="3"
                                            placeholder="Alergias, silla para bebé, preferencia de mesa..."
                                            value={formData.specialRequests}
                                            onChange={handleChange}
                                            className="input dark:bg-gray-800 dark:border-gray-700 resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full py-3 text-lg shadow-lg shadow-parmesana-green/20"
                                    >
                                        {loading ? 'Confirmando...' : 'Confirmar Reservación'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
