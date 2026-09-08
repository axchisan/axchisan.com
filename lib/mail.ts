/**
 * Correo transaccional con Resend.
 *
 * Se habla con la API REST directamente: es un único endpoint y evita arrastrar
 * un SDK que hay que mantener al día.
 */

const ENDPOINT = "https://api.resend.com/emails"

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL)
}

interface SendOptions {
  to: string
  subject: string
  text: string
  html?: string
  /** Responder al remitente original en lugar de a la dirección del sitio. */
  replyTo?: string
}

async function send({ to, subject, text, html, replyTo }: SendOptions): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [to],
      subject,
      text,
      ...(html ? { html } : {}),
      ...(replyTo ? { reply_to: [replyTo] } : {}),
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend respondió ${res.status}: ${await res.text()}`)
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Avisa de un mensaje nuevo del formulario de contacto.
 *
 * Nunca lanza: el mensaje ya está guardado en la base, así que un fallo del
 * correo no puede convertirse en un error para quien acaba de escribir.
 */
export async function notifyContactMessage(message: {
  name: string
  email: string
  subject?: string | null
  message: string
}): Promise<void> {
  if (!isMailConfigured()) {
    console.warn("Resend no está configurado: el mensaje quedó solo en el panel")
    return
  }

  const asunto = message.subject?.trim() || "Sin asunto"
  const cuerpo = [
    `De: ${message.name} <${message.email}>`,
    `Asunto: ${asunto}`,
    "",
    message.message,
  ].join("\n")

  try {
    await send({
      to: process.env.CONTACT_TO_EMAIL!,
      // El asunto identifica el remitente en la bandeja sin tener que abrirlo.
      subject: `Contacto web — ${message.name}: ${asunto}`,
      text: cuerpo,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.6">
  <p><strong>${escapeHtml(message.name)}</strong> &lt;${escapeHtml(message.email)}&gt;</p>
  <p style="color:#666">${escapeHtml(asunto)}</p>
  <hr style="border:none;border-top:1px solid #ddd">
  <p style="white-space:pre-wrap">${escapeHtml(message.message)}</p>
</div>`,
      // Responder desde el cliente de correo contesta a quien escribió.
      replyTo: message.email,
    })
  } catch (error) {
    console.error("No se pudo enviar el aviso de contacto:", error)
  }
}
