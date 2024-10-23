<?php
include_once 'db.php';

// Verifica si es una solicitud POST (insertar un comentario)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
}

// Verifica si es una solicitud GET (obtener comentarios de un juego)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $juegoId = $_GET['id'];

    try {
        // Consulta para obtener comentarios de un juego
        $query = 'SELECT * FROM calificaciones WHERE juego_id = :juego_id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':juego_id', $juegoId, PDO::PARAM_INT);
        $stmt->execute();
        $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($comentarios) {
            echo json_encode(['success' => true, 'comentarios' => $comentarios]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se encontraron comentarios para este juego.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
