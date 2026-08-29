<?php
/**
 * Vara Farm Haven — Enquiry Form Handler
 * Receives the #enquiry-form submission from index.html (see js/main.js) and
 * emails the enquiry details via PHPMailer.
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

// -------------------------------
// SMTP / recipient configuration
// -------------------------------
// TODO: fill in the real mailbox credentials before going live.
// Never commit real passwords to git — move these into environment
// variables or a git-ignored config file once you have them.
$smtpHost   = 'smtp.hostinger.com';
$smtpPort   = 587;
$smtpUser   = 'CHANGE_ME@varafarmhaven.com';
$smtpPass   = 'CHANGE_ME';

$fromName  = 'Vara Farm Haven';
$fromEmail = $smtpUser;
$toEmail   = 'CHANGE_ME@varafarmhaven.com'; // enquiry inbox that should receive leads

// -------------------------------
// reCAPTCHA configuration
// -------------------------------
// This is Google's published test secret key (pairs with the test site key
// in index.html) — it always verifies successfully. Swap both keys for a
// real pair registered at google.com/recaptcha for your production domain
// before going live.
$recaptchaSecret = '6LctZ54tAAAAAIe_B0g4pd1G2YcMiJmw1Z5DC9bZ';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$captchaResponse = $_POST['g-recaptcha-response'] ?? '';
if ($captchaResponse === '') {
    echo json_encode(['success' => false, 'message' => 'Please verify that you are not a robot.']);
    exit;
}

$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($recaptchaSecret)
    . '&response=' . urlencode($captchaResponse) . '&remoteip=' . urlencode($_SERVER['REMOTE_ADDR'] ?? '');
$verifyResponse = json_decode(file_get_contents($verifyUrl), true);

if (empty($verifyResponse['success'])) {
    echo json_encode(['success' => false, 'message' => 'Captcha verification failed. Please try again.']);
    exit;
}

$fullName       = htmlspecialchars(trim($_POST['fullName'] ?? ''));
$mobileNumber   = htmlspecialchars(trim($_POST['mobileNumber'] ?? ''));
$whatsappNumber = htmlspecialchars(trim($_POST['whatsappNumber'] ?? ''));
$preferredDate  = htmlspecialchars(trim($_POST['preferredDate'] ?? ''));
$preferredTime  = htmlspecialchars(trim($_POST['preferredTime'] ?? ''));
$message        = htmlspecialchars(trim($_POST['message'] ?? ''));

$mobileRegex = '/^[6-9]\d{9}$/';

if ($fullName === '' || !preg_match($mobileRegex, $mobileNumber)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields correctly.']);
    exit;
}

if ($whatsappNumber !== '' && !preg_match($mobileRegex, $whatsappNumber)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid WhatsApp number.']);
    exit;
}

$subject = 'New Visit Enquiry — Vara Farm Haven';
$htmlContent = "
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<title>New Visit Enquiry</title>
</head>
<body>
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
<h2>New Visit Enquiry — Vara Farm Haven</h2>
<ul>
    <li><b>Full Name:</b> $fullName</li>
    <li><b>Mobile Number:</b> $mobileNumber</li>
    <li><b>WhatsApp Number:</b> " . ($whatsappNumber !== '' ? $whatsappNumber : '—') . "</li>
    <li><b>Preferred Date:</b> " . ($preferredDate !== '' ? $preferredDate : '—') . "</li>
    <li><b>Preferred Time:</b> " . ($preferredTime !== '' ? $preferredTime : '—') . "</li>
    <li><b>Message:</b> " . ($message !== '' ? nl2br($message) : '—') . "</li>
</ul>
</div>
</body>
</html>
";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    $mail->Host = $smtpHost;
    $mail->Port = $smtpPort;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;

    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail);
    $mail->addReplyTo($fromEmail, $fromName);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $htmlContent;

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Your enquiry has been sent successfully.']);
} catch (Exception $e) {
    error_log('Vara Farm Haven enquiry mail failed: ' . $mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => 'Email could not be sent. Please try again later.']);
}
