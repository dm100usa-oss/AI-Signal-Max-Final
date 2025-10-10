// lib/email.ts
import { Resend } from "resend";

type SendReportEmailParams = {
  to: string;
  url: string;
  mode: string;
  ownerBuffer: Buffer;
  developerBuffer: Buffer;
  score?: number;
  results?: Record<string, string>;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(params: SendReportEmailParams) {
  const from = "AI Signal Max <reports@aivcheck.com>";

  const { to, url, mode, ownerBuffer, developerBuffer, score, results } = params;

  const subject = `AI Signal Max — Reports for ${url} (${mode})`;
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#0F172A;line-height:1.6">
      <h2 style="margin:0 0 6px">AI Signal Max</h2>
      <p style="margin:0 0 12px">Attached are your Owner Report and Developer’s Checklist.</p>
      <p style="margin:0 0 12px">
        Website: <strong>${escapeHtml(url)}</strong><br/>
        Mode: <strong>${escapeHtml(mode)}</strong>
      </p>
      <p style="font-size:12px;color:#6B7280;margin-top:18px">
        Disclaimer: visibility scores are estimates based on publicly available data.<br/>
        <a href="https://aivcheck.com/disclaimer">https://aivcheck.com/disclaimer</a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    subject,
    html,
    attachments: [
      { filename: "AI_Signal_Max_Owner.pdf", content: ownerBuffer },
      { filename: "AI_Signal_Max_Developer.pdf", content: developerBuffer },
    ],
  });

  if (score && results) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://ai-signal-max-final.vercel.app"}/api/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode, score, results }),
      });
    } catch (e) {
      console.error("Failed to store result", e);
    }
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return ch;
    }
  });
}
