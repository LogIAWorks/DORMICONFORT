const { createClient } = require('@supabase/supabase-js');
const _URL = 'https://qjkgrtsepfqkixebktbv.supabase.co';
const _KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2dydHNlcGZxa2l4ZWJrdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM2MTUsImV4cCI6MjA4ODU2OTYxNX0.SmsQGDNo9GsPWLOFPI1hoaGQswEzhPEjC_9U7FKKLO4';

const supabase = createClient(_URL, _KEY);

async function check() {
    console.log("Consultando ultimos productos...");
    const { data, error } = await supabase.from('products').select('id, name').order('id', { ascending: false }).limit(3);
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Ultimos productos:", JSON.stringify(data, null, 2));
    }
}
check();
