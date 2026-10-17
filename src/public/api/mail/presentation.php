<?php

header("Content-Type: text/plain");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!array_key_exists('name', $_POST) || empty($_POST['name'])) {
    http_response_code(400);
    echo 'Не указано ФИО';
    exit;
}
$name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');

if (!array_key_exists('email', $_POST) || empty($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Не указана почта';
    exit;
}
$email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8');

$from = "hello@indapt.net";
$to = "hello@indapt.net";
$subject = "Запрос презентации с сайта";

$message =
    <<<HTML
    <p>Запрос презентации INDAPT</p>
    <p>ФИО: $name </p>
    <p>Почта: $email </p>
    HTML;

$header = "From:$from\r\n";
$header .= "Cc:$from\r\n";
$header .= "MIME-Version: 1.0\r\n";
$header .= "Content-type: text/html; charset=UTF-8\r\n";

$result = mail($to,$subject,$message,$header);

if($result) {
    http_response_code(200);
    echo "Сообщение отправлено";
}else {
    http_response_code(400);
    echo "Сообщение не отправлено";
}

?>
