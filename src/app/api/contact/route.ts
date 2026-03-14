import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, phone, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "We need your name, email, and message — otherwise we'd just be staring at a blank form." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "That email address doesn't look quite right. Typo, perhaps?" },
        { status: 400 }
      );
    }

    // Send notification to Swift Designz
    const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL ?? "keenan.husselmann39@gmail.com";
    await resend.emails.send({
      from: `${name} via Swift Designz <noreply@swiftdesignz.co.za>`,
      to: [notifyEmail],
      replyTo: email,
      subject: `New Project Enquiry from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #101010; color: #e0e0e0; padding: 40px; border-radius: 16px; border: 1px solid rgba(48, 176, 176, 0.2);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://swiftdesignz.co.za/images/logo.png" alt="Swift Designz" style="height: 60px; width: auto; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;" />
            <h1 style="color: #30B0B0; font-size: 24px; margin: 0;">New Project Enquiry</h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #30B0B0, transparent); margin: 12px auto;"></div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #30B0B0;">${escapeHtml(email)}</td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff;">${escapeHtml(phone)}</td>
            </tr>` : ""}
            ${service ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff;">${escapeHtml(service)}</td>
            </tr>` : ""}
            ${budget ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Budget</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff;">${escapeHtml(budget)}</td>
            </tr>` : ""}
          </table>
          
          <div style="margin-top: 24px; padding: 20px; background: rgba(48, 176, 176, 0.05); border-radius: 8px; border: 1px solid rgba(48, 176, 176, 0.1);">
            <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Message</p>
            <p style="color: #e0e0e0; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          
          <p style="color: #555; font-size: 11px; text-align: center; margin-top: 30px;">
            This message was sent via the Swift Designz website contact form.
          </p>
        </div>
      `,
    });

    // Send confirmation to the client
    await resend.emails.send({
      from: "Swift Designz <noreply@swiftdesignz.co.za>",
      to: [email],
      subject: "We've received your enquiry - Swift Designz",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #101010; color: #e0e0e0; padding: 40px; border-radius: 16px; border: 1px solid rgba(48, 176, 176, 0.2);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://swiftdesignz.co.za/images/logo.png" alt="Swift Designz" style="height: 60px; width: auto; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;" />
            <h1 style="color: #30B0B0; font-size: 24px; margin: 0;">Thank You, ${escapeHtml(name)}!</h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #30B0B0, transparent); margin: 12px auto;"></div>
          </div>
          
          <p style="color: #ccc; line-height: 1.7; font-size: 14px;">
            We've received your project enquiry and we're excited to learn more about what you have in mind.
          </p>
          <p style="color: #ccc; line-height: 1.7; font-size: 14px;">
            A member of our team will get back to you within <strong style="color: #30B0B0;">24 hours</strong> with a response.
          </p>
          <p style="color: #ccc; line-height: 1.7; font-size: 14px;">
            In the meantime, feel free to browse our <a href="https://swiftdesignz.co.za/portfolio" style="color: #30B0B0; text-decoration: none;">portfolio</a> or check out our <a href="https://swiftdesignz.co.za/packages" style="color: #30B0B0; text-decoration: none;">packages</a>.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">Swift Designz - Crafting Digital Excellence</p>
            <p style="color: #555; font-size: 11px; margin: 4px 0 0 0;">info@swiftdesignz.co.za</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Our messenger hit a bump on the way out. Take a breath and try again in a moment!" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
