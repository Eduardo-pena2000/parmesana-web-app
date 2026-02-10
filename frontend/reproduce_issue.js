import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testAuth() {
    try {
        console.log('1. Testing Health Check...');
        try {
            const health = await axios.get(`http://localhost:3000/`);
            console.log('Health check passed:', health.data.message);
        } catch (e) {
            console.log('Health check failed:', e.message);
            if (e.code === 'ECONNREFUSED') {
                console.error('CRITICAL: Backend server is not running on port 3000');
                return;
            }
        }

        const testUser = {
            phone: '+1234567890',
            password: 'password123'
        };

        // Test user data
        const registerData = {
            phone: '+1234567890',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com'
        };

        console.log('\n2. Attempting Login with test user...');
        try {
            const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
            console.log('Login successful:', loginResponse.data);
        } catch (error) {
            console.log('Login failed:', error.response?.data?.message || error.message);

            if (error.response?.status === 401 || error.response?.status === 404) {
                console.log('User might not exist or wrong password.');

                console.log('\n3. Attempting Registration...');
                try {
                    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
                    console.log('Registration successful:', registerResponse.data);

                    console.log('\n4. Retrying Login...');
                    const retryLogin = await axios.post(`${API_URL}/auth/login`, testUser);
                    console.log('Login after registration successful:', retryLogin.data);
                } catch (regError) {
                    console.log('Registration failed:', regError.response?.data?.message || regError.message);
                }
            }
        }

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('Backend server is not running on port 3000.');
        } else {
            console.error('Fatal Error:', error.message);
        }
    }
}

testAuth();
