<?php
include_once 'db.php';

// Obtener datos JSON de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verifica si se han recibido todos los datos necesarios
if (isset($data['juego_id'], $data['puntuacion'], $data['comentario'])) {
    $juegoId = $data['juego_id'];
    $puntuacion = $data['puntuacion'];
    $comentario = $data['comentario'];

    try {
        // Consulta para insertar un nuevo comentario
        $query = 'INSERT INTO calificaciones (juego_id, puntuacion, comentario) VALUES (:juego_id, :puntuacion, :comentario)';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':juego_id', $juegoId, PDO::PARAM_INT);
        $stmt->bindParam(':puntuacion', $puntuacion, PDO::PARAM_INT);
        $stmt->bindParam(':comentario', $comentario, PDO::PARAM_STR);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al insertar el comentario.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    // Devuelve un mensaje de error si faltan datos
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
}
?>
