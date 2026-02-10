import { useState } from 'react';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MockCardForm({ onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        // Add spaces every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(value);
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setExpiry(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API processing time
        setTimeout(() => {
            setLoading(false);
            toast.success('¡Pago simulado exitoso!');
            // Return a fake payment intent ID
            onSuccess({ id: 'pi_mock_123456789' });
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 mb-4 flex items-start">
                <span className="mr-2">ℹ️</span>
                <span>Modo Demostración: No se procesará ningún cargo real. Usa cualquier dato para probar.</span>
            </div>

            <div>
                <label className="label text-xs uppercase text-gray-500">Número de Tarjeta</label>
                <div className="relative">
                    <input
                        type="text"
                        className="input pl-10"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        required
                        maxLength="19"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label text-xs uppercase text-gray-500">Vencimiento</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="input pl-10"
                            placeholder="MM/AA"
                            value={expiry}
                            onChange={handleExpiryChange}
                            required
                            maxLength="5"
                        />
                        <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    </div>
                </div>
                <div>
                    <label className="label text-xs uppercase text-gray-500">CVC</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="input pl-10"
                            placeholder="123"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            required
                            maxLength="4"
                        />
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary flex-1"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex-1 shadow-lg hover:shadow-xl"
                >
                    {loading ? 'Procesando...' : 'Pagar Ahora (Demo)'}
                </button>
            </div>
        </form>
    );
}
