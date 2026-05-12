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

export interface WeeklySummaryData {
  rangeLabel: string;
  checkIns: number;
  averageMood: number;
  averageMoodEmoji: string;
  currentStreak: number;
  bestDayLabel: string | null;
  featuredText: string | null;
  missedDays: number;
  perfectWeek: boolean;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildWeeklySummaryHtml(data: WeeklySummaryData): string {
  const featuredBlock = data.featuredText
    ? `
          <tr>
            <td style="padding:0 8px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1C1A18;border-left:3px solid #C4956A;border-radius:8px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:1.2px;color:#C4956A;text-transform:uppercase;">A moment from your week</p>
                    <p style="margin:0;font-size:15px;line-height:1.65;color:#F0EDE8;font-style:italic;">&ldquo;${escapeHtml(data.featuredText)}&rdquo;</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  let nudgeHtml = "";
  if (data.perfectWeek) {
    nudgeHtml = `
          <tr>
            <td style="padding:0 8px 28px 8px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#C4956A;font-weight:600;">Perfect week. You showed up every single day.</p>
            </td>
          </tr>`;
  } else if (data.missedDays > 0) {
    nudgeHtml = `
          <tr>
            <td style="padding:0 8px 28px 8px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#F0EDE8;opacity:0.75;">You missed ${data.missedDays} day${data.missedDays === 1 ? "" : "s"} this week. That&#39;s okay — a new week starts tomorrow.</p>
            </td>
          </tr>`;
  }

  const bestDayHtml = data.bestDayLabel
    ? `<p style="margin:6px 0 0 0;font-size:12px;color:#F0EDE8;opacity:0.65;">Best day: ${escapeHtml(data.bestDayLabel)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your week in Kiv</title>
  <style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');</style>
</head>
<body style="margin:0;padding:0;background-color:#0F0E0D;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F0E0D;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#0F0E0D;">
          <tr>
            <td style="padding:0 8px 32px 8px;">
              <p style="margin:0;font-size:14px;font-weight:700;letter-spacing:2px;color:#C4956A;text-transform:uppercase;">Kiv · Weekly</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 8px 8px 8px;">
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:800;color:#F0EDE8;letter-spacing:-0.5px;">Here&#39;s your week at a glance</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 8px 32px 8px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#F0EDE8;opacity:0.6;">${escapeHtml(data.rangeLabel)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 8px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33%" valign="top" style="padding:16px;background-color:#1C1A18;border-radius:10px;">
                    <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1px;color:#F0EDE8;opacity:0.5;text-transform:uppercase;">Check-ins</p>
                    <p style="margin:0;font-size:22px;font-weight:800;color:#F0EDE8;letter-spacing:-0.3px;">${data.checkIns} <span style="font-size:13px;font-weight:500;color:#F0EDE8;opacity:0.55;">/ 7</span></p>
                  </td>
                  <td width="8" style="font-size:0;line-height:0;">&nbsp;</td>
                  <td width="33%" valign="top" style="padding:16px;background-color:#1C1A18;border-radius:10px;">
                    <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1px;color:#F0EDE8;opacity:0.5;text-transform:uppercase;">Avg mood</p>
                    <p style="margin:0;font-size:22px;font-weight:800;color:#F0EDE8;letter-spacing:-0.3px;">${data.averageMood.toFixed(1)} <span style="font-size:18px;">${data.averageMoodEmoji}</span></p>
                    ${bestDayHtml}
                  </td>
                  <td width="8" style="font-size:0;line-height:0;">&nbsp;</td>
                  <td width="33%" valign="top" style="padding:16px;background-color:#1C1A18;border-radius:10px;">
                    <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1px;color:#F0EDE8;opacity:0.5;text-transform:uppercase;">Streak</p>
                    <p style="margin:0;font-size:22px;font-weight:800;color:#F0EDE8;letter-spacing:-0.3px;">${data.currentStreak} <span style="font-size:13px;font-weight:500;color:#F0EDE8;opacity:0.55;">days</span></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${featuredBlock}
          ${nudgeHtml}
          <tr>
            <td style="padding:0 8px 48px 8px;">
              <a href="${APP_URL}/app" style="display:inline-block;background-color:#C4956A;color:#0F0E0D;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;letter-spacing:0.3px;">Start this week fresh</a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0 8px;border-top:1px solid rgba(240,237,232,0.1);">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#F0EDE8;opacity:0.5;">Weekly summaries are sent every Sunday. They can&#39;t be turned off — we think reflection is worth it.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendWeeklySummaryEmail(
  to: string,
  data: WeeklySummaryData
): Promise<void> {
  const client = getClient();
  const { error } = await client.emails.send({
    from: `Kiv <${FROM_EMAIL}>`,
    to,
    subject: `Your week in Kiv — ${data.rangeLabel}`,
    html: buildWeeklySummaryHtml(data),
  });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
