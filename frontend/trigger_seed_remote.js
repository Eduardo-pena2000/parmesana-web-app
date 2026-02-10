import https from 'https';

const options = {
    hostname: 'parmesana-web.onrender.com',
    port: 443,
    path: '/api/seed/menu',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log('🌱 Enviando señal de "Sembrado" a Render...');

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('RESPUESTA:', data);
        console.log('\n✅ ¡Listo! La base de datos debería tener el menú ahora.');
    });
});

req.on('error', (e) => {
    console.error(`❌ Error al conectar con Render: ${e.message}`);
});

req.end();
