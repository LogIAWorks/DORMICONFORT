const { createClient } = require('@supabase/supabase-js');

const _URL = 'https://qjkgrtsepfqkixebktbv.supabase.co';
const _KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2dydHNlcGZxa2l4ZWJrdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM2MTUsImV4cCI6MjA4ODU2OTYxNX0.SmsQGDNo9GsPWLOFPI1hoaGQswEzhPEjC_9U7FKKLO4';

const supabase = createClient(_URL, _KEY);

async function testInsert() {
    console.log("Intentando añadir producto de prueba...");

    const testProduct = {
        id: 100,
        name: "Producto de Prueba (IA)",
        category: "colchones",
        price: 99.99,
        offerPrice: 79.99,
        isFlexFeatured: true,
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        desc: "Este es un producto de prueba añadido por el asistente."
    };

    const { data, error } = await supabase
        .from('products')
        .insert([testProduct])
        .select();

    if (error) {
        console.error("Error al insertar:", error);
        process.exit(1);
    } else {
        console.log("¡Éxito! Producto añadido:", data);

        // Ahora borrarlo para no ensuciar
        const id = data[0].id;
        console.log(`Borrando producto de prueba con ID: ${id}...`);
        const { error: delError } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (delError) {
            console.error("Error al borrar:", delError);
        } else {
            console.log("Producto de prueba borrado correctamente.");
        }
    }
}

testInsert();
