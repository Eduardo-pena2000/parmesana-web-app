const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        console.log('💰 Payment Intent Request:', req.body);
        const { amount, currency = 'mxn' } = req.body;

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('❌ STRIPE_SECRET_KEY is missing');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('✅ Payment Intent Created:', paymentIntent.id);

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('❌ Stripe error:', error);
        res.status(500).send({ error: error.message });
    }
};
