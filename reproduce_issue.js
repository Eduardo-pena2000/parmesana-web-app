const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAuth() {
    try {
        console.log('1. Testing Health Check...');
        const health = await axios.get(`${API_URL.replace('/api', '')}/`); // Base URL
        console.log('Health check passed:', health.data.message);

        const testUser = {
            phone: '+1234567890',
            password: 'password123'
        };

        console.log('\n2. Attempting Login with test user...');
        try {
            const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
            console.log('Login successful:', loginResponse.data);
        } catch (error) {
            console.log('Login failed:', error.response?.data || error.message);

            if (error.response?.status === 401) {
                console.log('User might not exist or wrong password.');

                console.log('\n3. Attempting Registration...');
                const registerData = {
                    ...testUser,
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com'
                };

                try {
                    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
                    console.log('Registration successful:', registerResponse.data);

                    console.log('\n4. Retrying Login...');
                    const retryLogin = await axios.post(`${API_URL}/auth/login`, testUser);
                    console.log('Login after registration successful:', retryLogin.data);
                } catch (regError) {
                    console.log('Registration failed:', regError.response?.data || regError.message);
                }
            }
        }

    } catch (error) {
        console.error('Fatal Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('Backend server is not running on port 3000.');
        }
    }
}

testAuth();
