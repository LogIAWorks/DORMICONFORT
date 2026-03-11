# DORMICONFORT - Guía para el Desarrollador

Este proyecto es 100% portable. Para que funcione correctamente (ya que utiliza Supabase para la base de datos), **no debe abrirse directamente el archivo `index.html` en el navegador**.

### Cómo ejecutar la web:
1. Descomprime el archivo en cualquier carpeta.
2. Haz doble clic en el archivo `iniciar_web.bat`.
3. Se abrirá una ventana negra que iniciará un servidor local en `http://localhost:3000`.
4. La web se abrirá automáticamente en tu navegador.

### Por qué usar el .bat:
Supabase (y la mayoría de bases de datos modernas) bloquean las conexiones si abres el archivo como `file://` por seguridad (CORS). El archivo `.bat` crea un entorno de servidor real en un segundo.

### Estructura:
- Todo el código de Supabase está **iniline** (es decir, dentro de cada HTML) para evitar problemas de caché.
- Las imágenes de productos se guardan como Base64 en la base de datos para que no dependan de rutas locales de archivos.
- Clave de Supabase: Es la clave `anon`, pública por diseño y segura gracias a las políticas RLS configuradas en el dashboard.

---
*Desarrollo completado con éxito.*
