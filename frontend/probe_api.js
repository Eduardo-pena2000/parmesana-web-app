import https from 'https';

const probes = [
    '/',
    '/api/menu/categories',
    '/api/menu/items',
    '/api/seed/menu',
    '/api/test-menu'
];

const checkUrl = (path) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'parmesana-web.onrender.com',
            port: 443,
            path: path,
            method: path.includes('seed') ? 'POST' : 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ path, status: res.statusCode, body: data.substring(0, 100) }));
        });

        req.on('error', (e) => resolve({ path, error: e.message }));
        req.end();
    });
};

console.log('🕵️‍♂️ Iniciando Muestreo de API...');
Promise.all(probes.map(checkUrl)).then(results => {
    results.forEach(r => {
        console.log(`Ruta: ${r.path.padEnd(25)} | Status: ${r.status} | Body: ${r.body}`);
    });
});
