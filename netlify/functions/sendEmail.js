const nodemailer = require('nodemailer');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    const data = JSON.parse(event.body);
    const { name, email, subject, message } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'All fields are required' 
        })
      };
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid email address' 
        })
      };
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name.trim());
    const sanitizedEmail = email.trim();
    const sanitizedSubject = sanitizeInput(subject.trim());
    const sanitizedMessage = sanitizeInput(message.trim());

    // Get environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      console.error('Missing environment variables: GMAIL_USER or GMAIL_APP_PASSWORD');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Server configuration error. Please contact the administrator.' 
        })
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword
      }
    });

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: 'Inter', 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 25px; 
            text-align: center;
          }
          .header h1 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: 600;
          }
          .content { 
            padding: 30px 25px; 
          }
          .field { 
            margin-bottom: 20px; 
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
          }
          .field:last-child {
            border-bottom: none;
          }
          .label { 
            font-weight: 600; 
            color: #667eea; 
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          .value { 
            color: #333;
            font-size: 15px;
            line-height: 1.6;
          }
          .message-content {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 From</div>
              <div class="value">${sanitizedName}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email Address</div>
              <div class="value"><a href="mailto:${sanitizedEmail}" style="color: #667eea; text-decoration: none;">${sanitizedEmail}</a></div>
            </div>
            <div class="field">
              <div class="label">📝 Subject</div>
              <div class="value">${sanitizedSubject}</div>
            </div>
            <div class="field">
              <div class="label">💬 Message</div>
              <div class="message-content">${sanitizedMessage.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            Sent from your portfolio contact form • ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textContent = `
New Contact Form Submission

From: ${sanitizedName}
Email: ${sanitizedEmail}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}

---
Sent from your portfolio contact form
${new Date().toLocaleString()}
    `;

    // Mail options
    const mailOptions = {
      from: `"Portfolio Contact Form" <${gmailUser}>`,
      to: gmailUser,
      replyTo: `"${sanitizedName}" <${sanitizedEmail}>`,
      subject: `Portfolio Contact: ${sanitizedSubject}`,
      text: textContent,
      html: htmlContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message! I\'ll get back to you soon.' 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to send message. Please try again or contact me directly via email.' 
      })
    };
  }
};
