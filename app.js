// URL de API gratuita y abierta (devuelve noticias reales en JSON sin requerir API Key)
const API_URL = "https://spaceflightnewsapi.net";

// Nota: Si deseas usar GNews con tu propia API Key, comenta la línea de arriba y descomenta la siguiente:
// const API_URL = "https://gnews.io";

const contenedorNoticias = document.getElementById("contenedor-noticias");
const mensajeEstado = document.getElementById("mensaje-estado");

// Función asíncrona principal que realiza la petición AJAX con Fetch
async function obtenerNoticias() {
    mostrarMensaje("Cargando noticias más recientes...", "mensaje-carga");
    contenedorNoticias.innerHTML = "";

    try {
        // 1. Petición HTTP mediante Fetch
        const respuesta = await fetch(API_URL);

        // 2. Validación del estado de la respuesta del servidor
        if (!respuesta.ok) {
            throw new Error(`Error en la respuesta de la API (Código: ${respuesta.status})`);
        }

        // 3. Conversión de la respuesta a formato JSON
        const datos = await respuesta.json();

        // Extraer el arreglo de noticias (Spaceflight usa 'results', GNews/NewsAPI usan 'articles')
        const listaNoticias = datos.results || datos.articles;

        // 4. Validar que existan noticias disponibles
        if (!listaNoticias || listaNoticias.length === 0) {
            mostrarMensaje("No hay noticias disponibles en este momento.", "mensaje-alerta");
            return;
        }

        // Ocultar mensaje de carga y renderizar las noticias
        ocultarMensaje();
        mostrarNoticias(listaNoticias);

    } catch (error) {
        // 5. Manejo de errores de red o fallos de la API
        console.error("Error al obtener las noticias:", error);
        mostrarMensaje("No se pudieron cargar las noticias. Verifica tu conexión o intenta más tarde.", "mensaje-alerta");
    }
}

// Función para procesar el JSON y construir los elementos HTML en el DOM
function mostrarNoticias(noticias) {
    noticias.forEach(noticia => {
        // Compatibilidad de campos entre distintas APIs
        const titulo = noticia.title;
        const resumen = noticia.summary || noticia.description || "Haz clic en el título para leer la nota completa.";
        const enlace = noticia.url;
        const imagen = noticia.image_url || noticia.image || "https://placeholder.com";
        const fuente = noticia.news_site || (noticia.source && noticia.source.name) || "Fuente externa";
        const fecha = new Date(noticia.published_at || noticia.publishedAt).toLocaleDateString("es-MX");

        // Creación de la tarjeta de noticia
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-noticia");

        tarjeta.innerHTML = `
            <img src="${imagen}" alt="Imagen de la noticia">
            <div class="contenido-noticia">
                <a href="${enlace}" target="_blank" rel="noopener noreferrer" class="titulo-noticia">
                    ${titulo}
                </a>
                <p class="resumen-noticia">${resumen.substring(0, 140)}...</p>
                <span class="fecha-noticia">Fuente: ${fuente} | Publicado: ${fecha}</span>
            </div>
        `;

        contenedorNoticias.appendChild(tarjeta);
    });
}

// Funciones auxiliares para mostrar u ocultar alertas al usuario
function mostrarMensaje(texto, claseCSS) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = claseCSS;
}

function ocultarMensaje() {
    mensajeEstado.className = "estado-oculto";
}

// Cargar noticias automáticamente al abrir la página
document.addEventListener("DOMContentLoaded", obtenerNoticias);
