const nodemailer = require('nodemailer');

// Configure standard Nodemailer transporter for fallback / local SMTP
const smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' ? true : false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000
});

/**
 * Robust sendMail implementation:
 * 1. Uses Resend HTTP API (Port 443 over HTTPS) if RESEND_API_KEY is defined.
 * 2. Uses Brevo HTTP API (Port 443 over HTTPS) if BREVO_API_KEY is defined.
 * 3. Falls back to Nodemailer SMTP.
 */
const sendMail = async (options) => {
    // 1. Resend HTTP API (Recommended for Render)
    if (process.env.RESEND_API_KEY) {
        const fromAddress = process.env.RESEND_FROM_EMAIL || 'Intervue <onboarding@resend.dev>';
        const toAddress = Array.isArray(options.to) ? options.to : [options.to];

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromAddress,
                to: toAddress,
                subject: options.subject,
                html: options.html
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Resend API error:", data);
            throw new Error(`Resend API Error: ${data.message || JSON.stringify(data)}`);
        }
        return data;
    }

    // 2. Brevo (Sendinblue) HTTP API
    if (process.env.BREVO_API_KEY) {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: { email: process.env.EMAIL_USER || 'noreply@intervue.com', name: 'Intervue Team' },
                to: Array.isArray(options.to) ? options.to.map(e => ({ email: e })) : [{ email: options.to }],
                subject: options.subject,
                htmlContent: options.html
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Brevo API error:", data);
            throw new Error(`Brevo API Error: ${data.message || JSON.stringify(data)}`);
        }
        return data;
    }

    // 3. Fallback to standard Nodemailer SMTP
    return smtpTransporter.sendMail(options);
};

const transporter = {
    sendMail,
    verify: (...args) => smtpTransporter.verify(...args)
};

module.exports = transporter;