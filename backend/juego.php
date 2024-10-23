<?php 
include_once 'db.php'; // Incluir archivo de conexión a la base de datos

error_reporting(E_ALL);
ini_set('display_errors', 1); // Mostrar errores para depuración

if (isset($_GET['id'])) {
    $juegoId = intval($_GET['id']); // Obtiene el ID del juego

    // Consulta para obtener detalles del juego y comentarios individuales
    $query = 'SELECT juegos.nombre, juegos.genero, 
                     AVG(calificaciones.puntuacion) AS puntuacion_media 
              FROM juegos
              LEFT JOIN calificaciones ON juegos.id = calificaciones.juego_id
              WHERE juegos.id = :juegoId
              GROUP BY juegos.id';

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':juegoId', $juegoId, PDO::PARAM_INT);
    $stmt->execute();

    $juego = $stmt->fetch(PDO::FETCH_ASSOC); // Obtiene el juego

    // Consulta para obtener comentarios individuales
    $comentariosQuery = 'SELECT comentario FROM calificaciones WHERE juego_id = :juegoId';
    $stmtComentarios = $pdo->prepare($comentariosQuery);
    $stmtComentarios->bindParam(':juegoId', $juegoId, PDO::PARAM_INT);
    $stmtComentarios->execute();
    
    $comentarios = $stmtComentarios->fetchAll(PDO::FETCH_ASSOC); // Obtiene todos los comentarios

    header('Content-Type: application/json');

    // Agregar los comentarios al array de respuesta
    $juego['comentarios'] = array_column($comentarios, 'comentario'); // Obtiene solo el campo comentario
    
    // Puedes usar var_dump para depuración
    // var_dump($juego);

    echo json_encode($juego); // Devuelve el juego y sus comentarios en formato JSON
} else {
    // Manejo de error si no se proporciona un ID
    header('Content-Type: application/json');
    echo json_encode(['error' => 'ID del juego no proporcionado']);
}
?>
