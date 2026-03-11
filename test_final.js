const { createClient } = require('@supabase/supabase-js');

const _URL = 'https://qjkgrtsepfqkixebktbv.supabase.co';
const _KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2dydHNlcGZxa2l4ZWJrdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM2MTUsImV4cCI6MjA4ODU2OTYxNX0.SmsQGDNo9GsPWLOFPI1hoaGQswEzhPEjC_9U7FKKLO4';

const supabase = createClient(_URL, _KEY);

async function testFinal() {
    console.log("Iniciando prueba final de inserción...");

    // 1. Obtener el siguiente ID manualmente (emulando dashboard.html)
    const { data: maxIdData } = await supabase.from('products').select('id').order('id', { ascending: false }).limit(1);
    const nextId = (maxIdData && maxIdData.length > 0) ? maxIdData[0].id + 1 : 1;
    console.log(`Siguiente ID calculado: ${nextId}`);

    const productData = {
        id: nextId,
        name: "Producto Final Test",
        category: "colchones",
        price: 999,
        offerPrice: 888,
        isFlexFeatured: false,
        image: "assets/placeholder.jpg",
        desc: "Prueba definitiva del sistema de IDs manuales."
    };

    // 2. Insertar
    const { data, error } = await supabase.from('products').insert([productData]).select();

    if (error) {
        console.error("Fallo la inserción final:", error);
    } else {
        console.log("¡Inserción final exitosa!", data);

        // 3. Borrar
        const { error: delError } = await supabase.from('products').delete().eq('id', nextId);
        if (delError) console.error("Error borrar:", delError);
        else console.log("Limpieza completada.");
    }
}

testFinal();
