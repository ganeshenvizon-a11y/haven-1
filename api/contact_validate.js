// Vara Farm Haven — Enquiry Form Handler
// Receives the #enquiry-form submission from index.html (see js/main.js) and
// emails the enquiry details via Nodemailer.

const nodemailer = require('nodemailer');

// -------------------------------
// SMTP / recipient configuration
// -------------------------------
const smtpHost = 'mail.privateemail.com';
const smtpPort = 587;
const smtpUser = 'admin@vararealestates.com';
const smtpPass = process.env.SMTP_PASS || ''; // set in Vercel project env vars

const fromName = 'Vara Real Estates';
const fromEmail = smtpUser;
const toEmail = 'admin@vararealestates.com'; // enquiry inbox that should receive leads

// -------------------------------
// reCAPTCHA configuration
// -------------------------------
// This is Google's published test secret key (pairs with the test site key
// in index.html) — it always verifies successfully. Swap both keys for a
// real pair registered at google.com/recaptcha for your production domain
// before going live.
const recaptchaSecret = '6LctZ54tAAAAAIe_B0g4pd1G2YcMiJmw1Z5DC9bZ';

const mobileRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function nl2br(value) {
    return value.replace(/\n/g, '<br>');
}

async function sendVaraFarmEmail(transporter, { toAddress, replyToEmail, replyToName, subject, html }) {
    await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: toAddress,
        replyTo: `"${replyToName}" <${replyToEmail}>`,
        subject,
        html
    });
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Invalid request method.' });
        return;
    }

    const body = req.body || {};

    const captchaResponse = body['g-recaptcha-response'] || '';
    if (!captchaResponse) {
        res.status(200).json({ success: false, message: 'Please verify that you are not a robot.' });
        return;
    }

    try {
        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + encodeURIComponent(recaptchaSecret)
            + '&response=' + encodeURIComponent(captchaResponse) + '&remoteip=' + encodeURIComponent(req.headers['x-forwarded-for'] || '');
        const verifyRes = await fetch(verifyUrl);
        const verifyData = await verifyRes.json();

        if (!verifyData || !verifyData.success) {
            res.status(200).json({ success: false, message: 'Captcha verification failed. Please try again.' });
            return;
        }
    } catch (e) {
        console.error('Vara Farm Haven recaptcha verify failed: ' + e.message);
        res.status(200).json({ success: false, message: 'Captcha verification failed. Please try again.' });
        return;
    }

    const fullName = escapeHtml(String(body.fullName || '').trim());
    const mobileNumber = escapeHtml(String(body.mobileNumber || '').trim());
    const whatsappNumber = escapeHtml(String(body.whatsappNumber || '').trim());
    const userEmail = String(body.email || '').trim();
    const preferredDate = escapeHtml(String(body.preferredDate || '').trim());
    const preferredTime = escapeHtml(String(body.preferredTime || '').trim());
    const message = escapeHtml(String(body.message || '').trim());

    if (fullName === '' || !mobileRegex.test(mobileNumber)) {
        res.status(200).json({ success: false, message: 'Please fill in all required fields correctly.' });
        return;
    }

    if (whatsappNumber !== '' && !mobileRegex.test(whatsappNumber)) {
        res.status(200).json({ success: false, message: 'Please enter a valid WhatsApp number.' });
        return;
    }

    if (!emailRegex.test(userEmail)) {
        res.status(200).json({ success: false, message: 'Please enter a valid email address.' });
        return;
    }
    const userEmailSafe = escapeHtml(userEmail);

    const adminSubject = 'New Visit Enquiry — Vara Farm Haven';
    const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Visit Enquiry</title></head>
<body>
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2>New Visit Enquiry — Vara Farm Haven</h2>
<ul>
    <li><b>Full Name:</b> ${fullName}</li>
    <li><b>Email:</b> ${userEmailSafe}</li>
    <li><b>Mobile Number:</b> ${mobileNumber}</li>
    <li><b>WhatsApp Number:</b> ${whatsappNumber !== '' ? whatsappNumber : '—'}</li>
    <li><b>Preferred Date:</b> ${preferredDate !== '' ? preferredDate : '—'}</li>
    <li><b>Preferred Time:</b> ${preferredTime !== '' ? preferredTime : '—'}</li>
    <li><b>Message:</b> ${message !== '' ? nl2br(message) : '—'}</li>
</ul>
</div>
</body>
</html>`;

    const userSubject = "We've received your visit request — Vara Farm Haven";
    const userHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Visit Request Received</title></head>
<body>
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2>Thank you, ${fullName}!</h2>
<p>We've received your visit request for Vara Farm Haven. Our team will reach out to you shortly to confirm your scheduled visit.</p>
<h3>Your submitted details</h3>
<ul>
    <li><b>Mobile Number:</b> ${mobileNumber}</li>
    <li><b>WhatsApp Number:</b> ${whatsappNumber !== '' ? whatsappNumber : '—'}</li>
    <li><b>Preferred Date:</b> ${preferredDate !== '' ? preferredDate : '—'}</li>
    <li><b>Preferred Time:</b> ${preferredTime !== '' ? preferredTime : '—'}</li>
    <li><b>Message:</b> ${message !== '' ? nl2br(message) : '—'}</li>
</ul>
<p>If any of these details are incorrect, just reply to this email.</p>
</div>
</body>
</html>`;

    try {
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: false,
            requireTLS: true,
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });

        // 1. Notify the admin inbox of the new enquiry (reply-to set to the user).
        await sendVaraFarmEmail(transporter, {
            toAddress: toEmail,
            replyToEmail: userEmail,
            replyToName: fullName,
            subject: adminSubject,
            html: adminHtml
        });

        // 2. Send a confirmation copy to the user who filled in the form.
        await sendVaraFarmEmail(transporter, {
            toAddress: userEmail,
            replyToEmail: fromEmail,
            replyToName: fromName,
            subject: userSubject,
            html: userHtml
        });

        res.status(200).json({ success: true, message: 'Your enquiry has been sent successfully.' });
    } catch (e) {
        console.error('Vara Farm Haven enquiry mail failed: ' + e.message);
        res.status(200).json({ success: false, message: 'Email could not be sent. Please try again later.' });
    }
};
