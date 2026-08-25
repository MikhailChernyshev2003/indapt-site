<?php

header("Content-Type: text/plain");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!array_key_exists('message', $_POST) || empty($_POST['message'])) {
    http_response_code(400);
    echo 'Не указано сообщение';
    exit;
}
$message = $_POST['message'];

if (!array_key_exists('name', $_POST) || empty($_POST['name'])) {
    http_response_code(400);
    echo 'Не указано имя';
    exit;
}
$name = $_POST['name'];

if (!array_key_exists('position', $_POST) || empty($_POST['position'])) {
    http_response_code(400);
    echo 'Не указана должность';
    exit;
}
$position = $_POST['position'];

if (!array_key_exists('phone', $_POST) || empty($_POST['phone'])) {
    http_response_code(400);
    echo 'Не указан телефон';
    exit;
}
$phone = $_POST['phone'];

if (!array_key_exists('email', $_POST) || empty($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Не указана почта';
    exit;
}
$email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8');

$from = "hello@indapt.net";
$to = "hello@indapt.net";
$subject = "Новая заявка с сайта";


$message =
    <<<HTML
    <p>Имя: $name </p>
    <p>Должность: $position </p>
    <p>Телефон: $phone </p>
    <p>Почта: $email </p>
    <p>Сообщение: $message </p>
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
