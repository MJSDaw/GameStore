fetch('/gamestore/backend/juegos.php')
    .then(response => response.json())
    .then(data => {
        const juegosDiv = document.getElementById('juegos');
        data.forEach(juego => {
            const juegoDiv = document.createElement('div');
            juegoDiv.innerHTML = `<h2 class="juego" data-id="${juego.id}" onclick="obtenerDetallesJuego(${juego.id})">${juego.nombre}</h2>`;
            juegosDiv.appendChild(juegoDiv);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));

// Función para mostrar la lista de juegos
function mostrarListaJuegos(juegos) {
    const juegosDiv = document.getElementById('juegos');
    juegosDiv.innerHTML = ''; // Limpiar contenido previo

    juegos.forEach(juego => {
        const juegoDiv = document.createElement('div');
        juegoDiv.innerHTML = `<h2>${juego.nombre}</h2>`;
        juegoDiv.onclick = () => obtenerDetallesJuego(juego.id); // Asignar evento de clic
        juegosDiv.appendChild(juegoDiv);
    });
}

// Función para obtener los detalles del juego
function obtenerDetallesJuego(juegoId) {
    fetch(`/gamestore/backend/juego.php?id=${juegoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            const detallesDiv = document.getElementById('detalles');
            detallesDiv.innerHTML = ''; // Limpiar contenido previo

            if (data.error) {
                detallesDiv.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            // Mostrar nombre y género del juego
            const juegoDiv = document.createElement('div');
            juegoDiv.innerHTML = `<h2>${data.nombre}</h2><p>Género: ${data.genero}</p><p>Puntuación Media: ${data.puntuacion_media || 'N/A'}</p>`;
            detallesDiv.appendChild(juegoDiv);

            // Crear contenedor para los comentarios
            const comentariosDiv = document.createElement('div');
            comentariosDiv.innerHTML = '<h3>Comentarios:</h3>';
            detallesDiv.appendChild(comentariosDiv);

            // Mostrar comentarios
            data.comentarios.forEach(comentario => {
                const comentarioDiv = document.createElement('div');
                comentarioDiv.innerText = comentario;
                comentarioDiv.className = 'comentario';
                comentariosDiv.appendChild(comentarioDiv);
            });

            // Botón para volver a la lista de juegos
            const volverBtn = document.createElement('button');
            volverBtn.innerText = 'Volver a la lista de juegos';
            volverBtn.onclick = mostrarLista; // Asigna la función para mostrar la lista de juegos
            detallesDiv.appendChild(volverBtn);

            // Mostrar los detalles y ocultar la lista
            detallesDiv.style.display = 'block';
            document.getElementById('juegos').style.display = 'none';
        })
        .catch(error => console.error('Error al cargar los detalles del juego:', error));
}

// Función para mostrar nuevamente la lista de juegos
function mostrarLista() {
    document.getElementById('juegos').style.display = 'block';
    document.getElementById('detalles').style.display = 'none';
}

// Inicializar la lista de juegos al cargar la página
fetch('/gamestore/backend/juegos.php')
    .then(response => response.json())
    .then(juegos => mostrarListaJuegos(juegos))
    .catch(error => console.error('Error al cargar la lista de juegos:', error));
