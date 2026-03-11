const { createClient } = require('@supabase/supabase-js');

const _URL = 'https://qjkgrtsepfqkixebktbv.supabase.co';
const _KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2dydHNlcGZxa2l4ZWJrdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM2MTUsImV4cCI6MjA4ODU2OTYxNX0.SmsQGDNo9GsPWLOFPI1hoaGQswEzhPEjC_9U7FKKLO4';

const supabase = createClient(_URL, _KEY);

async function listProducts() {
    console.log("Consultando productos existentes...");
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error al consultar:", error);
    } else {
        console.log("Ejemplo de producto:", JSON.stringify(data[0], null, 2));
    }
}

listProducts();
