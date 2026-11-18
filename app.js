const API_URL = "https://dev.to";

const contenedorNoticias = document.getElementById("contenedor-noticias");
const mensajeEstado = document.getElementById("mensaje-estado");

async function obtenerNoticias() {
    mostrarMensaje("Cargando noticias más recientes...", "mensaje-carga");
    contenedorNoticias.innerHTML = "";

    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const listaNoticias = await respuesta.json();

        if (!listaNoticias || listaNoticias.length === 0) {
            mostrarMensaje("No hay noticias disponibles en este momento.", "mensaje-alerta");
            return;
        }

        ocultarMensaje();
        mostrarNoticias(listaNoticias);

    } catch (error) {
        console.error("Error al obtener las noticias:", error);
        mostrarMensaje("No se pudieron cargar las noticias. Verifica tu conexión o intenta más tarde.", "mensaje-alerta");
    }
}

function mostrarNoticias(noticias) {
    noticias.forEach(noticia => {
        const titulo = noticia.title;
        const resumen = noticia.description || "Haz clic en el título para leer la nota completa.";
        const enlace = noticia.url;
        const imagen = noticia.cover_image || noticia.social_image || "https://placeholder.com";
        const fuente = noticia.user ? noticia.user.name : "DEV Community";
        const fecha = new Date(noticia.published_at).toLocaleDateString("es-MX");

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-noticia");

        tarjeta.innerHTML = `
            <img src="${imagen}" alt="Imagen de la noticia">
            <div class="contenido-noticia">
                <a href="${enlace}" target="_blank" rel="noopener noreferrer" class="titulo-noticia">
                    ${titulo}
                </a>
                <p class="resumen-noticia">${resumen}</p>
                <span class="fecha-noticia">Fuente: ${fuente} | Publicado: ${fecha}</span>
            </div>
        `;

        contenedorNoticias.appendChild(tarjeta);
    });
}

function mostrarMensaje(texto, claseCSS) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = claseCSS;
}

function ocultarMensaje() {
    mensajeEstado.className = "estado-oculto";
}

document.addEventListener("DOMContentLoaded", obtenerNoticias);
