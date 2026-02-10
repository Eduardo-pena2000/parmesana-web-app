const https = require('https');

const options = {
    hostname: 'parmesana-web.onrender.com',
    port: 443,
    path: '/api/seed/menu',
    method: 'POST'
};

const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response:', data);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
console.log('Request sent...');
