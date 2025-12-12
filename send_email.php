<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get form data
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

// Validate inputs
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// ============================================
// EMAIL CONFIGURATION
// ============================================
// TODO: Replace these with your actual credentials
$smtp_host = 'smtp.gmail.com';
$smtp_port = 587; // or 465 for SSL
$smtp_username = 'aubalavignesh1010@gmail.com'; // Your Gmail address
$smtp_password = 'iquymljldpasnasl'; // Your Gmail App Password (16 characters) - NO SPACES!
$to_email = 'aubalavignesh1010@gmail.com'; // Where to send the form submissions
$from_email = 'aubalavignesh1010@gmail.com'; // Your Gmail address
$from_name = 'Portfolio Contact Form';
// ============================================

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Check if PHPMailer is available
if (!file_exists('PHPMailer/src/Exception.php')) {
    // PHPMailer not found, use basic PHP mail() function
    $email_subject = "New Contact Form Submission: $subject";
    $email_body = "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Subject: $subject\n\n";
    $email_body .= "Message:\n$message\n";
    
    $headers = "From: $from_name <$from_email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    if (mail($to_email, $email_subject, $email_body, $headers)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again.']);
    }
    exit();
}

// Load PHPMailer
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

try {
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = $smtp_host;
    $mail->SMTPAuth = true;
    $mail->Username = $smtp_username;
    $mail->Password = $smtp_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtp_port;
    
    // Recipients
    $mail->setFrom($from_email, $from_name);
    $mail->addAddress($to_email);
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Submission: $subject";
    $mail->Body = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                .content { background: #f4f4f4; padding: 20px; border-radius: 0 0 5px 5px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #667eea; }
                .value { margin-top: 5px; padding: 10px; background: white; border-radius: 3px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>📧 New Contact Form Submission</h2>
                </div>
                <div class='content'>
                    <div class='field'>
                        <div class='label'>👤 Name:</div>
                        <div class='value'>$name</div>
                    </div>
                    <div class='field'>
                        <div class='label'>📧 Email:</div>
                        <div class='value'>$email</div>
                    </div>
                    <div class='field'>
                        <div class='label'>📝 Subject:</div>
                        <div class='value'>$subject</div>
                    </div>
                    <div class='field'>
                        <div class='label'>💬 Message:</div>
                        <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    ";
    
    // Plain text version
    $mail->AltBody = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";
    
    $mail->send();
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send message: ' . $mail->ErrorInfo
    ]);
}
?>
