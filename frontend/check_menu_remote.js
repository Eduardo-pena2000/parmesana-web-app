import https from 'https';

const options = {
    hostname: 'parmesana-web.onrender.com',
    port: 443,
    path: '/api/menu/items',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log('🔍 Checkeando API de menú en producción...');

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY:', data);
    });
});

req.on('error', (e) => {
    console.error(`❌ Error al conectar: ${e.message}`);
});

req.end();
