import https from 'https';

const options = {
    hostname: 'parmesana-api.onrender.com',
    port: 443,
    path: '/api/seed/menu',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

console.log('🌱 Sembrando menú completo en parmesana-api.onrender.com...');

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log('RESPUESTA:', data);
        if (res.statusCode === 200) {
            console.log('\n✅ ¡Menú completo importado! Recarga tu página.');
        } else {
            console.log('\n❌ Algo falló, revisa la respuesta.');
        }
    });
});

req.on('error', (e) => console.error(`❌ Error: ${e.message}`));
req.end();
