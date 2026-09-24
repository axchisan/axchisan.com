# Correo con el dominio: `hola@axchisan.com`

Plan del 24 de septiembre de 2026. Hoy el sitio publica `axchisan923@gmail.com`; una dirección con
el dominio propio es lo mínimo que espera un negocio que va a pagar.

## Estado actual del DNS (verificado con `dig`)

| Registro | Valor | Qué significa |
|---|---|---|
| MX en `axchisan.com` | **ninguno** | Hoy nadie puede recibir correo en `@axchisan.com` |
| TXT en `axchisan.com` | verificación de Google Search Console | No se toca |
| SPF en `axchisan.com` | ninguno | Hay que crearlo |
| DMARC `_dmarc` | ninguno | Hay que crearlo |
| `send.axchisan.com` (MX y SPF) | Resend | Envío de los avisos del formulario. No se toca |
| `resend._domainkey` | DKIM de Resend | No se toca |
| `api`, `gastos` | CloudFront | Calculadora de Gastos. **No se tocan** |

La raíz del dominio está libre para el correo: no hay choque con Resend, que usa el subdominio `send`.

## Opciones evaluadas

| Opción | Costo | Por qué sí o no |
|---|---|---|
| Reenvío gratuito (ImprovMX) + Gmail "Enviar como" | $ 0 | **Descartada.** Google anunció que desde enero de 2027 Gmail deja de admitir "Enviar como" con direcciones de terceros: funcionaría tres meses |
| Cloudflare Email Routing | $ 0 | **Descartada por ahora.** Exige mover los nameservers de Hostinger a Cloudflare y recrear todos los registros, incluidos los de la calculadora. Demasiado riesgo por solo recibir correo |
| **Zoho Mail, plan gratuito** | **$ 0** | **Recomendada.** Buzón real para enviar y recibir, hasta 5 usuarios de 5 GB, app para celular. Sin IMAP: se usa la web o la app de Zoho, no Outlook ni la app de Gmail |
| Google Workspace Business Starter | ~7 USD por usuario al mes (≈ $ 23.000) | La mejor experiencia. Tiene sentido cuando el correo sea el centro del trabajo o entre una segunda persona |

**Decisión propuesta:** Zoho Mail gratuito ahora. Migrar a Google Workspace el día que se justifique:
el cambio es solo de registros DNS y no afecta al sitio.

## Direcciones

| Dirección | Uso |
|---|---|
| `hola@axchisan.com` | La pública: sitio, cotizaciones, firma, redes |
| `duvan@axchisan.com` | Personal, para contratos y proveedores (alias o segundo usuario) |
| `avisos@axchisan.com` | Solo remitente de los avisos automáticos, vía Resend. No recibe |

## Pasos

### 1. Crear la cuenta de Zoho (te toca a ti, 10 minutos)

1. Entrar a [zoho.com/mail](https://www.zoho.com/mail/zohomail-pricing.html) y elegir **Forever Free**.
   Si no aparece a primera vista, está al final de la tabla de planes.
2. Registrar el dominio `axchisan.com` y crear el usuario `hola`.
3. Zoho muestra un registro **TXT de verificación** (`zoho-verification=…`). Copiarlo.

### 2. Registros DNS en Hostinger (te toca a ti; los valores exactos los da Zoho)

Hostinger → Domains → `axchisan.com` → DNS / Nameservers → *Manage DNS records*. El nombre `@`
significa la raíz del dominio.

| Tipo | Nombre | Valor | Prioridad |
|---|---|---|---|
| TXT | `@` | `zoho-verification=…` (el que dio Zoho) | — |
| MX | `@` | `mx.zoho.com` | 10 |
| MX | `@` | `mx2.zoho.com` | 20 |
| MX | `@` | `mx3.zoho.com` | 50 |
| TXT | `@` | `v=spf1 include:zohomail.com ~all` | — |
| TXT | `zmail._domainkey` | la clave DKIM que genera Zoho (el nombre exacto lo da Zoho) | — |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:hola@axchisan.com` | — |

Advertencias:

- **No borres nada de lo que ya existe.** El TXT de Google y el de Zoho conviven en `@`.
- **Solo un registro SPF en `@`.** Si Hostinger crea uno por defecto, se reemplaza por este.
- El SPF de la raíz no afecta a los avisos del sitio: Resend firma desde `send.axchisan.com`.
- `p=none` en DMARC solo observa. En un mes, con los reportes limpios, se sube a `p=quarantine`.

### 3. Verificar (lo hago yo)

```bash
dig +short axchisan.com MX          # los tres de Zoho
dig +short axchisan.com TXT         # Google, Zoho y el SPF
dig +short _dmarc.axchisan.com TXT
```

Y una prueba real: un correo desde Gmail a `hola@axchisan.com` y una respuesta de vuelta.

### 4. Cambiar el sitio (lo hago yo, cuando el paso 3 esté bien)

| Qué | Dónde | Cambio |
|---|---|---|
| Correo público | `PROFILE.email` en `lib/site.ts` | `hola@axchisan.com`. Lo usan el pie, `/cotizar`, `/empresa`, `/privacidad` y los datos estructurados |
| Destino de los avisos | `CONTACT_TO_EMAIL` en Vercel | `hola@axchisan.com` |
| Remitente de los avisos | `CONTACT_FROM_EMAIL` en Vercel | `Axchi <avisos@axchisan.com>` |
| Perfil del panel | tabla `profiles` | correo nuevo, desde el panel |

**Por qué el sitio no cambia antes:** publicar `hola@axchisan.com` sin buzón detrás haría rebotar los
correos de los primeros clientes.

### 5. Fuera del sitio (te toca a ti)

Firma de correo, perfil de WhatsApp Business, Instagram, LinkedIn, ficha de Google Business y
Search Console. Los accesos de las cuentas técnicas (Neon, Resend, Vercel) no se cambian: siguen con
sus correos actuales.
