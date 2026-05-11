import { Resend } from "resend";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kiv.samkiel.tech";
const FROM_EMAIL = process.env.REMINDER_FROM_EMAIL || "kiv@samkiel.tech";

let resendClient: Resend | null = null;

function getClient(): Resend {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");
  resendClient = new Resend(apiKey);
  return resendClient;
}

function buildReminderHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Time to check in — Kiv</title>
</head>
<body style="margin:0;padding:0;background-color:#0F0E0D;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F0E0D;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;background-color:#0F0E0D;">
          <tr>
            <td style="padding:0 8px 32px 8px;">
              <p style="margin:0;font-size:14px;font-weight:700;letter-spacing:2px;color:#C4956A;text-transform:uppercase;">Kiv</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 8px 16px 8px;">
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:800;color:#F0EDE8;letter-spacing:-0.5px;">How are you feeling today?</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 8px 32px 8px;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#F0EDE8;opacity:0.75;">Your daily check-in is waiting. It only takes a minute.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 8px 48px 8px;">
              <a href="${APP_URL}/app" style="display:inline-block;background-color:#C4956A;color:#0F0E0D;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;letter-spacing:0.3px;">Check in now</a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0 8px;border-top:1px solid rgba(240,237,232,0.1);">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#F0EDE8;opacity:0.5;">You're receiving this because you enabled email reminders in Kiv. To turn them off, visit your <a href="${APP_URL}/app/settings" style="color:#C4956A;text-decoration:none;">settings</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendReminderEmail(to: string): Promise<void> {
  const client = getClient();
  const { error } = await client.emails.send({
    from: `Kiv <${FROM_EMAIL}>`,
    to,
    subject: "Time to check in — Kiv",
    html: buildReminderHtml(),
  });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
