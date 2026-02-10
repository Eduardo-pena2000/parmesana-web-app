const axios = require('axios');

const API_URL = 'https://parmesana-api.onrender.com/api';

async function testProduction() {
    try {
        console.log('1. Testing Health Check...');
        try {
            const health = await axios.get('https://parmesana-api.onrender.com/');
            console.log('Health:', health.data);
        } catch (e) {
            console.log('Health check failed:', e.message);
        }

        // Test 1: Try to register without data (Expect 400)
        console.log('\n2. Testing Empty Register...');
        try {
            await axios.post(`${API_URL}/auth/register`, {});
        } catch (error) {
            console.log('Status:', error.response?.status);
            console.log('Data:', error.response?.data);
        }

        // Test 2: Try to register with a likely existing user (Expect 400)
        console.log('\n3. Testing Existing User...');
        try {
            await axios.post(`${API_URL}/auth/register`, {
                phone: '+1234567890',
                firstName: 'Test',
                password: 'password'
            });
        } catch (error) {
            console.log('Status:', error.response?.status);
            console.log('Data:', error.response?.data);
        }

    } catch (error) {
        console.error('Fatal:', error.message);
    }
}

testProduction();
