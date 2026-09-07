<?php
/**
 * Vara Farm Haven — Enquiry Form Handler
 * Receives the #enquiry-form submission from index.html (see js/main.js) and
 * emails the enquiry details via PHPMailer.
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);

require __DIR__ . '/../PHPMailer/src/Exception.php';
require __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json');

// Convert any fatal error into a JSON response (and a log line) instead of
// letting the function crash with a raw 500 / FUNCTION_INVOCATION_FAILED.
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        error_log('Vara Farm Haven enquiry fatal error: ' . $error['message'] . ' in ' . $error['file'] . ':' . $error['line']);
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json');
        }
        echo json_encode(['success' => false, 'message' => 'Email could not be sent. Please try again later.']);
    }
});

// -------------------------------
// SMTP / recipient configuration
// -------------------------------
// SMTP password is read from the SMTP_PASS environment variable
// (set it in the Vercel project's Settings -> Environment Variables).
// Never hardcode real passwords here — this file is committed to a
// public git repository.
$smtpHost   = 'mail.privateemail.com';         // Changed from Hostinger to Namecheap
$smtpPort   = 587;                             // Keep 587 for TLS encryption
$smtpUser   = 'admin@vararealestates.com';      // Your actual Namecheap email address
$smtpPass   = getenv('SMTP_PASS') ?: '';       // Set SMTP_PASS in Vercel env vars

$fromName  = 'Vara Real Estates';              // Updated to match your current company name
$fromEmail = $smtpUser;                        // This will automatically be admin@vararealestates.com
$toEmail   = 'admin@vararealestates.com';      // The email address where you want to receive notifications
 // enquiry inbox that should receive leads

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
$userEmail      = trim($_POST['email'] ?? '');
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

if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}
$userEmail = htmlspecialchars($userEmail);

// -------------------------------
// Admin notification email
// -------------------------------
$adminSubject = 'New Visit Enquiry — Vara Farm Haven';
$adminHtmlContent = "
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
    <li><b>Email:</b> $userEmail</li>
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

// -------------------------------
// User confirmation email
// -------------------------------
$userSubject = 'We\'ve received your visit request — Vara Farm Haven';
$userHtmlContent = "
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<title>Visit Request Received</title>
</head>
<body>
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
<h2>Thank you, $fullName!</h2>
<p>We've received your visit request for Vara Farm Haven. Our team will reach out to you shortly to confirm your scheduled visit.</p>
<h3>Your submitted details</h3>
<ul>
    <li><b>Mobile Number:</b> $mobileNumber</li>
    <li><b>WhatsApp Number:</b> " . ($whatsappNumber !== '' ? $whatsappNumber : '—') . "</li>
    <li><b>Preferred Date:</b> " . ($preferredDate !== '' ? $preferredDate : '—') . "</li>
    <li><b>Preferred Time:</b> " . ($preferredTime !== '' ? $preferredTime : '—') . "</li>
    <li><b>Message:</b> " . ($message !== '' ? nl2br($message) : '—') . "</li>
</ul>
<p>If any of these details are incorrect, just reply to this email.</p>
</div>
</body>
</html>
";

function sendVaraFarmEmail($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName, $toAddress, $replyToEmail, $replyToName, $subject, $htmlBody)
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    $mail->Host = $smtpHost;
    $mail->Port = $smtpPort;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;

    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toAddress);
    $mail->addReplyTo($replyToEmail, $replyToName);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $htmlBody;

    $mail->send();
}

try {
    // 1. Notify the admin inbox of the new enquiry (reply-to set to the user).
    sendVaraFarmEmail($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName, $toEmail, $userEmail, $fullName, $adminSubject, $adminHtmlContent);

    // 2. Send a confirmation copy to the user who filled in the form.
    sendVaraFarmEmail($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName, $userEmail, $fromEmail, $fromName, $userSubject, $userHtmlContent);

    echo json_encode(['success' => true, 'message' => 'Your enquiry has been sent successfully.']);
} catch (\Throwable $e) {
    error_log('Vara Farm Haven enquiry mail failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Email could not be sent. Please try again later.']);
}
