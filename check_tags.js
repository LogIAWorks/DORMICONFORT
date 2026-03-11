const { createClient } = require('@supabase/supabase-js');

const URL = 'https://qjkgrtsepfqkixebktbv.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2dydHNlcGZxa2l4ZWJrdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM2MTUsImV4cCI6MjA4ODU2OTYxNX0.SmsQGDNo9GsPWLOFPI1hoaGQswEzhPEjC_9U7FKKLO4';

const sb = createClient(URL, KEY);

async function run() {
    const { data, error } = await sb.from('products').select('id, name, category_tags, price');
    if (error) {
        console.error('ERROR:', error.message);
        return;
    }
    console.log('\n=== PRODUCTOS EN LA BASE DE DATOS ===\n');
    if (!data || data.length === 0) {
        console.log('No hay productos en la base de datos.');
        return;
    }
    data.forEach(p => {
        console.log(`ID: ${p.id}`);
        console.log(`  Nombre: ${p.name}`);
        console.log(`  Precio: ${p.price}€`);
        console.log(`  category_tags: "${p.category_tags || '(vacío/null)'}"`);
        if (p.category_tags) {
            const tags = p.category_tags.split('|').map(t => t.trim());
            console.log(`  Tags individuales: [${tags.map(t => `"${t}"`).join(', ')}]`);
        }
        console.log('');
    });
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
