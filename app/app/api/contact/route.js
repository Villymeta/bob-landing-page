import nodemailer from "nodemailer";

// POST /api/contact
export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // ✅ Basic field validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields." }),
        { status: 400 }
      );
    }

    // ✅ Prevent accidental email injection
    const safeName = String(name).replace(/[\r\n]/g, "");
    const safeEmail = String(email).replace(/[\r\n]/g, "");

    // ✅ Check environment variables
    const fromEmail = process.env.EMAIL_USER;
    const toEmail = process.env.TO_EMAIL;
    const emailPass = process.env.EMAIL_PASS;

    if (!fromEmail || !emailPass || !toEmail) {
      console.error("❌ Missing environment variables for email config");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server email configuration error.",
        }),
        { status: 500 }
      );
    }

    // ✅ Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: fromEmail,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: safeEmail,
      to: toEmail,
      subject: `New Contact Form Submission from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${message}`,
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Email send error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send email." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}