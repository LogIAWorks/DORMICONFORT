const { createClient } = require('@supabase/supabase-js');

const _URL = 'https://qjkgrtsepfqkixebktbv.supabase.co';
const _KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2dydHNlcGZxa2l4ZWJrdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM2MTUsImV4cCI6MjA4ODU2OTYxNX0.SmsQGDNo9GsPWLOFPI1hoaGQswEzhPEjC_9U7FKKLO4';

const supabase = createClient(_URL, _KEY);

async function listIds() {
    console.log("Consultando IDs existentes...");
    const { data, error } = await supabase
        .from('products')
        .select('id')
        .order('id', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error al consultar:", error);
    } else {
        console.log("IDs recientes:", data);
    }
}

listIds();
