import https from 'https';

const probes = [
    { host: 'parmesana-api.onrender.com', path: '/' },
    { host: 'parmesana-api.onrender.com', path: '/api/menu/items' },
    { host: 'parmesana-api.onrender.com', path: '/api/menu/categories' },
];

const checkUrl = ({ host, path }) => {
    return new Promise((resolve) => {
        const options = { hostname: host, port: 443, path, method: 'GET', headers: { 'Content-Type': 'application/json' } };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ url: `${host}${path}`, status: res.statusCode, body: data.substring(0, 150) }));
        });
        req.on('error', (e) => resolve({ url: `${host}${path}`, error: e.message }));
        req.end();
    });
};

console.log('🔍 Probando Backend API en parmesana-api.onrender.com...\n');
Promise.all(probes.map(checkUrl)).then(results => {
    results.forEach(r => {
        console.log(`URL: ${r.url}`);
        console.log(`Status: ${r.status}`);
        console.log(`Body: ${r.body}`);
        console.log('---');
    });
});
