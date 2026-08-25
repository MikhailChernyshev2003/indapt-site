<?php

header("Content-Type: text/plain");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const RESUME_MAX_SIZE = 5 * 1024 * 1024;
const RESUME_ALLOWED_EXTENSIONS = ['doc', 'docx', 'pdf'];
const RESUME_ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

if (empty($_POST['name'])) {
    http_response_code(400);
    echo 'Не указано имя';
    exit;
}
$name = $_POST['name'];

if (empty($_POST['phone'])) {
    http_response_code(400);
    echo 'Не указан телефон';
    exit;
}
$phone = $_POST['phone'];

if (empty($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Не указана почта';
    exit;
}
$email = $_POST['email'];

if (empty($_POST['vacancyName'])) {
    http_response_code(400);
    echo 'Не указано название вакансии';
    exit;
}
$vacancyName = $_POST['vacancyName'];

$resumeLink = isset($_POST['resumeLink']) ? trim($_POST['resumeLink']) : '';

if ($resumeLink !== '' && !filter_var($resumeLink, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo 'Некорректная ссылка на резюме';
    exit;
}

if (!isset($_FILES['resumeFile']) || $_FILES['resumeFile']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo "Файл не загружен";
    exit;
}

$file_tmp = $_FILES['resumeFile']['tmp_name'];
$file_name = basename($_FILES['resumeFile']['name']);
$file_size = (int) $_FILES['resumeFile']['size'];
$file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

if (!in_array($file_extension, RESUME_ALLOWED_EXTENSIONS, true)) {
    http_response_code(400);
    echo 'Недопустимый формат файла';
    exit;
}

if ($file_size <= 0 || $file_size > RESUME_MAX_SIZE) {
    http_response_code(400);
    echo 'Недопустимый размер файла';
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$detected_mime = $finfo ? finfo_file($finfo, $file_tmp) : '';
if ($finfo) {
    finfo_close($finfo);
}

if (!$detected_mime || !in_array($detected_mime, RESUME_ALLOWED_MIME_TYPES, true)) {
    http_response_code(400);
    echo 'Недопустимый тип файла';
    exit;
}

$file_type = $detected_mime;
$file_data = chunk_split(base64_encode(file_get_contents($file_tmp)));

$from = "hello@indapt.net";
$to = "hello@indapt.net";
$subject = "=?UTF-8?B?" . base64_encode("Отклик на вакансию") . "?=";
$resumeLinkDisplay = $resumeLink !== '' ? htmlspecialchars($resumeLink, ENT_QUOTES, 'UTF-8') : '—';

$bodyText = "
<p>Имя: $name</p>
<p>Телефон: $phone</p>
<p>Почта: $email</p>
<p>Название вакансии: $vacancyName</p>
<p>Ссылка на резюме: $resumeLinkDisplay</p>
";

$boundary = md5(time());

$headers = "From: $from\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

$message = "--{$boundary}\r\n";
$message .= "Content-Type: text/html; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$message .= $bodyText . "\r\n\r\n";

$message .= "--{$boundary}\r\n";
$message .= "Content-Type: {$file_type}; name=\"{$file_name}\"\r\n";
$message .= "Content-Disposition: attachment; filename=\"{$file_name}\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n\r\n";
$message .= $file_data . "\r\n\r\n";

$message .= "--{$boundary}--";

$result = mail($to, $subject, $message, $headers);

if ($result) {
    http_response_code(200);
    echo "Сообщение отправлено";
} else {
    http_response_code(400);
    echo "Сообщение не отправлено";
}
