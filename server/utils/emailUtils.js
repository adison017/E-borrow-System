import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, text, html }) {
  // ปรับ config ตามจริง
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // สร้าง HTML template สวยงามสำหรับ Gmail
  const prettyHtml = html || `
    <div style="background:#f4f6fb;padding:32px 0;min-height:100vh;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:420px;margin:40px auto;background:#fff;border-radius:18px;box-shadow:0 4px 24px #0001;padding:32px 28px 24px 28px;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src='https://cdn-icons-png.flaticon.com/512/561/561127.png' alt='OTP' width='64' height='64' style='margin-bottom:12px;'/>
          <h2 style="color:#2563eb;font-size:2rem;margin:0 0 8px 0;letter-spacing:0.01em;">${subject || 'แจ้งเตือนระบบ E-borrow'}</h2>
        </div>
        <div style="color:#222;font-size:1.1rem;line-height:1.7;margin-bottom:24px;text-align:center;">
          ${text ? `<div style='margin-bottom:12px;'>${text.replace(/\n/g,'<br>')}</div>` : ''}
          ${html || ''}
        </div>
        <div style="text-align:center;margin:24px 0 0 0;">
          <a href="https://mail.google.com" style="display:inline-block;padding:12px 32px;background:#2563eb;color:#fff;border-radius:8px;font-weight:bold;text-decoration:none;font-size:1.1rem;box-shadow:0 2px 8px #2563eb22;">เข้าสู่ระบบ E-borrow</a>
        </div>
        <div style="margin-top:32px;color:#888;font-size:0.95rem;text-align:center;">หากคุณไม่ได้ร้องขอ สามารถละเว้นอีเมลนี้ได้</div>
      </div>
      <div style="text-align:center;color:#bbb;font-size:0.9rem;margin-top:24px;">&copy; ${new Date().getFullYear()} E-borrow System</div>
    </div>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html: prettyHtml
  };

  return transporter.sendMail(mailOptions);
}
