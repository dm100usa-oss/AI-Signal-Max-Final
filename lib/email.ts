// lib/email.ts
import { Resend } from "resend";

type SendReportEmailParams = {
  to: string;
  url: string;
  mode: string;
  lang?: "en" | "ru";
  ownerBuffer: Buffer;
  developerBuffer: Buffer;
  score?: number;
  results?: Record<string, string>;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(params: SendReportEmailParams) {
  const from = "AI Signal Max <reports@aivcheck.com>";
  const { to, url, mode, lang = "en", ownerBuffer, developerBuffer, score, results } = params;

  const isEn = lang === "en";

  const subject = isEn
    ? "Your AI Signal Max report is ready"
    : "Ваш отчёт AI Signal Max готов";

  const html = isEn ? `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#0F172A;line-height:1.7;max-width:600px">
      <p style="margin:0 0 12px">Hello,</p>
      <p style="margin:0 0 12px">Thank you for using our service.</p>
      <p style="margin:0 0 16px">We have completed the analysis of <strong>${escapeHtml(url)}</strong> and prepared two documents — they are attached to this email.</p>
      <p style="margin:0 0 6px"><strong>Owner Report</strong> — explains your site's current AI readiness level and the factors that influence its appearance in AI assistant answers.</p>
      <p style="margin:0 0 16px"><strong>Developer Brief</strong> — a structured list of technical tasks ready to hand off immediately.</p>
      <p style="margin:0 0 8px"><strong>What to do next:</strong></p>
      <ol style="margin:0 0 16px;padding-left:20px">
        <li style="margin-bottom:6px">Review the owner report</li>
        <li style="margin-bottom:6px">Pass the developer brief to your developer</li>
        <li style="margin-bottom:6px">After implementing the changes, run another check at <a href="https://aisignalmax.com" style="color:#2563EB">aisignalmax.com</a> to measure your improvement</li>
      </ol>
      <p style="margin:0 0 24px">If you don't have a developer or need help finding one — just reply to this email and we'll help you find a solution.</p>
      <p style="margin:0 0 4px">Best regards,</p>
      <p style="margin:0 0 24px"><strong>AI Signal Max</strong></p>
      <p style="font-size:11px;color:#9CA3AF;margin-top:16px;border-top:1px solid #E5E7EB;padding-top:12px">
        Visibility scores are estimated and based on publicly available data. Not legal or technical advice.
      </p>
    </div>
  ` : `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#0F172A;line-height:1.7;max-width:600px">
      <p style="margin:0 0 12px">Здравствуйте,</p>
      <p style="margin:0 0 12px">Спасибо, что воспользовались нашим сервисом.</p>
      <p style="margin:0 0 16px">Мы провели анализ сайта <strong>${escapeHtml(url)}</strong> и подготовили два документа — они прикреплены к этому письму.</p>
      <p style="margin:0 0 6px"><strong>Отчёт для владельца</strong> — объясняет текущий уровень готовности сайта и факторы, которые влияют на появление в ответах ИИ-ассистентов.</p>
      <p style="margin:0 0 16px"><strong>ТЗ для разработчика</strong> — структурированный список технических задач. Можно сразу передать в работу.</p>
      <p style="margin:0 0 8px"><strong>Что делать дальше:</strong></p>
      <ol style="margin:0 0 16px;padding-left:20px">
        <li style="margin-bottom:6px">Ознакомьтесь с отчётом</li>
        <li style="margin-bottom:6px">Передайте ТЗ разработчику</li>
        <li style="margin-bottom:6px">После внедрения повторите проверку на <a href="https://aisignalmax.com" style="color:#2563EB">aisignalmax.com</a> — чтобы оценить результат</li>
      </ol>
      <p style="margin:0 0 24px">Если по каким-либо причинам у Вас нет разработчика или связь с ним утрачена — просто ответьте на это письмо, поможем найти решение.</p>
      <p style="margin:0 0 4px">С уважением,</p>
      <p style="margin:0 0 24px"><strong>AI Signal Max</strong></p>
      <p style="font-size:11px;color:#9CA3AF;margin-top:16px;border-top:1px solid #E5E7EB;padding-top:12px">
        Показатели готовности рассчитаны приблизительно и основаны на общедоступных данных. Не являются юридической или технической консультацией.
      </p>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    subject,
    html,
    attachments: [
      { filename: isEn ? "AI_Signal_Max_Owner_Report.pdf" : "AI_Signal_Max_Otchet_Vladeltsa.pdf", content: ownerBuffer },
      { filename: isEn ? "AI_Signal_Max_Developer_Brief.pdf" : "AI_Signal_Max_TZ_Razrabotchika.pdf", content: developerBuffer },
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
