const { createClient } = require('@supabase/supabase-js');

const URL = 'https://qjkgrtsepfqkixebktbv.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2dydHNlcGZxa2l4ZWJrdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM2MTUsImV4cCI6MjA4ODU2OTYxNX0.SmsQGDNo9GsPWLOFPI1hoaGQswEzhPEjC_9U7FKKLO4';

const sb = createClient(URL, KEY);

async function run() {
    // Fetch all products and normalize their category_tags to lowercase
    const { data, error } = await sb.from('products').select('id, name, category_tags');
    if (error) { console.error('Error fetching:', error.message); return; }

    console.log(`Found ${data.length} products. Normalizing tags...`);

    for (const p of data) {
        if (!p.category_tags) continue;

        const normalizedTags = p.category_tags
            .split('|')
            .map(t => t.trim().toLowerCase())
            // Remove duplicates
            .filter((t, i, arr) => t && arr.indexOf(t) === i)
            .join('|');

        if (normalizedTags !== p.category_tags) {
            console.log(`  [ID ${p.id}] "${p.category_tags}" → "${normalizedTags}"`);
            const { error: updateErr } = await sb.from('products').update({ category_tags: normalizedTags }).eq('id', p.id);
            if (updateErr) {
                console.error(`  ERROR updating ID ${p.id}:`, updateErr.message);
            } else {
                console.log(`  ✓ Updated successfully`);
            }
        } else {
            console.log(`  [ID ${p.id}] "${p.category_tags}" — OK (no change needed)`);
        }
    }

    console.log('\nDone. All tags normalized to lowercase.');
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
