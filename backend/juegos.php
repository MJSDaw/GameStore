<?php 
    include_once 'db.php';

    $query = 'select id, nombre from juegos';

    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $juegos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($juegos);
?>