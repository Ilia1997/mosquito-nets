// lib/telegram.ts
export type TelegramSendResult = { ok: true } | { ok: false; error: string };

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function postToTelegram({
  token,
  chatId,
  textHtml,
}: {
  token: string;
  chatId: string | number;
  textHtml: string;
}): Promise<TelegramSendResult> {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: textHtml,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // таймаут через AbortController (Railway інколи любить «висіти»)
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.ok === false) {
      return { ok: false, error: data?.description || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "NETWORK_ERROR" };
  }
}

export async function sendTelegramLead({
  name,
  phone,
  message,
  total, // опційно: сума з калькулятора
}: {
  name: string;
  phone: string;
  message?: string;
  total?: number;
}): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (
    process.env.TELEGRAM_CHAT_IDS ??
    process.env.TELEGRAM_CHAT_ID ??
    ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    return { ok: false, error: "TELEGRAM_ENV_MISSING" };
  }

  const safe = {
    name: escapeHtml(name || "-"),
    phone: escapeHtml(phone || "-"),
    message: escapeHtml(message || "-"),
    total: typeof total === "number" ? total : undefined,
  };

  const text =
    `<b>🆕 Нова заявка (Mosquito)</b>\n` +
    `<b>Імʼя:</b> ${safe.name}\n` +
    `<b>Телефон:</b> ${safe.phone}\n` +
    (safe.message ? `<b>Повідомлення:</b> ${safe.message}\n` : "") +
    (safe.total !== undefined
      ? `<b>Сума (MDL):</b> ${Math.round(safe.total)}\n`
      : "") +
    `<i>Час:</i> ${new Date().toLocaleString("uk-UA")}`;

  // відправляємо всім отримувачам, не падаємо якщо один із них фейлиться
  const results = await Promise.allSettled(
    chatIds.map((id) => postToTelegram({ token, chatId: id, textHtml: text }))
  );

  const hasOk = results.some((r) => r.status === "fulfilled" && r.value.ok);
  if (hasOk) return { ok: true };

  const firstErr = results.find(
    (r) => r.status === "fulfilled" && !r.value.ok
  ) as PromiseFulfilledResult<TelegramSendResult> | undefined;
  return {
    ok: false,
    error: firstErr?.value.ok === false ? firstErr.value.error : "SEND_FAILED",
  };
}
