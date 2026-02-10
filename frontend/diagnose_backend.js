import https from 'https';

const checkUrl = (path) => {
    return new Promise((resolve) => {
        const options = { hostname: 'parmesana-api.onrender.com', port: 443, path, method: 'GET', headers: { 'Content-Type': 'application/json' } };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ path, status: res.statusCode, json });
                } catch {
                    resolve({ path, status: res.statusCode, raw: data.substring(0, 200) });
                }
            });
        });
        req.on('error', (e) => resolve({ path, error: e.message }));
        req.end();
    });
};

async function main() {
    console.log('🔍 Diagnosticando backend real...\n');

    const items = await checkUrl('/api/menu/items');
    console.log('--- /api/menu/items ---');
    console.log('Status:', items.status);
    if (items.json) {
        console.log('Success:', items.json.success);
        console.log('Count:', items.json.count);
        console.log('Items in data:', items.json.data?.menuItems?.length);
        if (items.json.data?.menuItems?.length > 0) {
            console.log('\nPrimeros 3 items:');
            items.json.data.menuItems.slice(0, 3).forEach(i => console.log(`  - ${i.name} ($${i.basePrice})`));
        }
    } else {
        console.log('Raw:', items.raw);
    }

    const cats = await checkUrl('/api/menu/categories');
    console.log('\n--- /api/menu/categories ---');
    console.log('Status:', cats.status);
    if (cats.json) {
        console.log('Success:', cats.json.success);
        console.log('Count:', cats.json.count);
        console.log('Categories:', cats.json.data?.categories?.map(c => `${c.icon} ${c.name}`).join(', '));
    }

    const popular = await checkUrl('/api/menu/popular');
    console.log('\n--- /api/menu/popular ---');
    console.log('Status:', popular.status);
    if (popular.json) {
        console.log('Count:', popular.json.count);
    }
}

main();
