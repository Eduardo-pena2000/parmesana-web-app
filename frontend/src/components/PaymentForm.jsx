import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

export default function PaymentForm({ clientSecret, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/orders',
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            toast.error(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success('¡Pago realizado con éxito!');
            onSuccess(paymentIntent);
        } else {
            setMessage('Algo salió mal con el pago.');
            toast.error('Algo salió mal con el pago.');
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement id="payment-element" />

            {message && <div className="text-red-500 text-sm">{message}</div>}

            <div className="flex gap-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary flex-1"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                    className="btn btn-primary flex-1"
                >
                    {isLoading ? 'Procesando...' : 'Pagar Ahora'}
                </button>
            </div>
        </form>
    );
}
