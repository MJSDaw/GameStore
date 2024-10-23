<?php 
include_once 'db.php'; // Incluir archivo de conexión a la base de datos

// Obtener los datos JSON enviados
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['nombre']) && isset($data['cat'])) {
    try {
        $nombreJuego = $data['nombre']; // Obtener el nombre del juego
        $catJuego = $data['cat']; // Obtener la categoría del juego

        // Consulta para insertar un nuevo juego
        $query = 'INSERT INTO juegos (nombre, genero) VALUES (:nombreJuego, :catJuego)';

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':nombreJuego', $nombreJuego, PDO::PARAM_STR);
        $stmt->bindParam(':catJuego', $catJuego, PDO::PARAM_STR);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al insertar el juego.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Faltan datos necesarios.']);
}
?>
