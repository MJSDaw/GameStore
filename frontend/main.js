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
            document.getElementById('form-juego').style.display = 'none';
        })
        .catch(error => console.error('Error al cargar los detalles del juego:', error));
}

// Función para mostrar nuevamente la lista de juegos
function mostrarLista() {
    document.getElementById('juegos').style.display = 'block';
    document.getElementById('detalles').style.display = 'none';
    document.getElementById('form-juego').style.display = 'block';
}

// Inicializar la lista de juegos al cargar la página
fetch('/gamestore/backend/juegos.php')
    .then(response => response.json())
    .then(juegos => mostrarListaJuegos(juegos))
    .catch(error => console.error('Error al cargar la lista de juegos:', error));

    document.getElementById('form-juego').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const nombre = document.getElementById('nombreJuego').value;
        const cat = document.getElementById('catJuego').value;
    
        fetch('/gamestore/backend/registrar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: nombre, cat: cat })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('mensaje').innerText = 'Juego añadido exitosamente.';
                document.getElementById('form-juego').reset();  // Esto funcionará si el ID es de un formulario
    
                // Actualizar la lista de juegos
                fetch('/gamestore/backend/juegos.php')
                    .then(response => response.json())
                    .then(data => {
                        const juegosDiv = document.getElementById('juegos');
                        juegosDiv.innerHTML = ''; // Limpiar juegos previos antes de agregar nuevos
                        data.forEach(juego => {
                            const juegoDiv = document.createElement('div');
                            juegoDiv.innerHTML = `<h2 class="juego" data-id="${juego.id}" onclick="obtenerDetallesJuego(${juego.id})">${juego.nombre}</h2>`;
                            juegosDiv.appendChild(juegoDiv);
                        });
                    })
                    .catch(error => console.error('Error al cargar los datos:', error));
            } else {
                document.getElementById('mensaje').innerText = 'Error al añadir el juego: ' + (data.message || 'Error desconocido.');
            }
        })
        .catch(error => {
            document.getElementById('mensaje').innerText = 'Error al procesar la solicitud: ' + error.message;
        });
    });
    let juegoIdActual = null; // Variable global para almacenar el ID del juego actual

    function obtenerDetallesJuego(juegoId) {
        juegoIdActual = juegoId; // Establecer el ID del juego actual
        console.log('ID del juego actual:', juegoIdActual);
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
    
                // Mostrar el formulario de comentarios
                document.getElementById('div-form-comentario').style.display = 'block';
    
                // Mostrar los detalles y ocultar la lista
                detallesDiv.style.display = 'block';
                document.getElementById('juegos').style.display = 'none';
                document.getElementById('form-juego').style.display = 'none';
    
                // Inicializar el formulario de comentarios
                inicializarFormularioComentarios();
            })
            .catch(error => console.error('Error al cargar los detalles del juego:', error));
    }
    function inicializarFormularioComentarios() {
        document.getElementById('form-comentario').addEventListener('submit', function(event) {
            event.preventDefault();
        
            const puntuacion = document.getElementById('puntuacionComentario').value;
            const comentario = document.getElementById('comentarioTexto').value;
        
            // Verifica si juegoIdActual tiene un valor válido
            if (!juegoIdActual) {
                console.error('Error: juegoIdActual no está definido');
                document.getElementById('mensajeComentario').innerText = 'Error: ID de juego no especificado.';
                return;
            }
        
            // Mostrar los datos que se van a enviar
            console.log({
                juego_id: juegoIdActual,
                puntuacion: puntuacion,
                comentario: comentario
            });
        
            fetch('/gamestore/backend/comentarios.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    juego_id: juegoIdActual,
                    puntuacion: puntuacion,
                    comentario: comentario
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.getElementById('mensajeComentario').innerText = 'Comentario añadido exitosamente.';
                    document.getElementById('form-comentario').reset();
                    obtenerComentarios(juegoIdActual);  // Actualizar la lista de comentarios
                } else {
                    document.getElementById('mensajeComentario').innerText = 'Error al añadir el comentario: ' + (data.message || 'Error desconocido.');
                }
            })
            .catch(error => {
                document.getElementById('mensajeComentario').innerText = 'Error al procesar la solicitud: ' + error.message;
            });
        });
        
    }
    
    
    
    function obtenerComentarios(juegoId) {
        fetch(`/gamestore/backend/comentarios.php?id=${juegoId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Añadir un log para ver qué se recibe
            const comentariosDiv = document.querySelector('#detalles div h3').parentElement;

            comentariosDiv.innerHTML = '<h3>Comentarios:</h3>'; // Limpiar comentarios existentes

            // Verifica si 'comentarios' existe en la respuesta
            if (Array.isArray(data.comentarios)) {
                data.comentarios.forEach(comentario => {
                    const comentarioDiv = document.createElement('div');
                    comentarioDiv.innerText = comentario;
                    comentarioDiv.className = 'comentario';
                    comentariosDiv.appendChild(comentarioDiv);
                });
            } else {
                console.error('No hay comentarios en la respuesta', data);
                comentariosDiv.innerHTML += '<p>No se encontraron comentarios.</p>';
            }
        })
        .catch(error => console.error('Error al cargar los comentarios:', error));

    }
    