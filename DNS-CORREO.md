# Registros DNS para el correo del sitio

Dominio: **axchisan.com** · Estado en Resend: **verificado** (8 de septiembre de 2026)

> Ya está hecho. Este documento queda como referencia por si alguna vez hay que
> recrear los registros o depurar un problema de entrega.

Estos tres registros autorizan a Resend a enviar correo en nombre de `axchisan.com`.
Sin ellos, el aviso del formulario de contacto no sale (Resend devuelve 403).

> Generado desde la API de Resend, no transcrito a mano: el valor de DKIM pasa de los
> 200 caracteres y un solo carácter mal deja el dominio sin verificar.

---

## Dónde ponerlos

Hostinger → **Domains** → `axchisan.com` → **DNS / Nameservers** → *Manage DNS records*.

Tres advertencias, que es donde suele fallar:

1. **El nombre va sin el dominio.** Escribe `resend._domainkey`, no
   `resend._domainkey.axchisan.com`. Hostinger completa el resto solo.
2. **Copia el valor entero**, incluido el `p=` inicial. Si el campo lo corta, el registro
   queda inválido y la verificación falla sin decir por qué.
3. **No toques nada de lo que ya hay.** Estos son nuevos y no chocan con `api`, `gastos`,
   el TXT de Google ni el registro A del sitio.

---

## 1. TXT · `resend._domainkey`

*DKIM — firma criptográfica que prueba que el correo salió de tu dominio*

**Tipo**

```
TXT
```

**Nombre**

```
resend._domainkey
```

**Valor**

```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuzF0vuJ4s//rGSgnSb21qzNKzytnyPn6ZoSNUGx4vkQVxpAUt2lWLszgoHwcBHv5B5ZFDMD+fyM+IT2piUGksjFGD8i1iEENr2sc/QpNgvlXbOhHTGVaojx43mQ+lHbn/jOvH5Bcw05LZVv6n/0uc5sz6XMu4pQ6yYzdD22+aqQIDAQAB
```

**TTL**: `Auto` (o el que Hostinger ponga por defecto)

---

## 2. MX · `send`

*Ruta de retorno — por donde llegan los rebotes y las quejas de spam*

**Tipo**

```
MX
```

**Nombre**

```
send
```

**Valor**

```
feedback-smtp.us-east-1.amazonses.com
```

**Prioridad**

```
10
```

**TTL**: `Auto` (o el que Hostinger ponga por defecto)

---

## 3. TXT · `send`

*SPF — declara que Amazon SES está autorizado a enviar por ti*

**Tipo**

```
TXT
```

**Nombre**

```
send
```

**Valor**

```
v=spf1 include:amazonses.com ~all
```

**TTL**: `Auto` (o el que Hostinger ponga por defecto)

---

## Estado

Verificado y en funcionamiento. El remitente es `web@axchisan.com` y una prueba real de
punta a punta devolvió `delivered`.

Para comprobar que los registros siguen publicados:

```bash
dig +short TXT resend._domainkey.axchisan.com
dig +short TXT send.axchisan.com
dig +short MX  send.axchisan.com
```

## Opcional, pero recomendable después

Una vez verificado el dominio, añadir un registro DMARC mejora la entregabilidad y evita
que tus correos caigan en spam:

| Tipo | Nombre | Valor |
|---|---|---|
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:axchisan923@gmail.com` |

`p=none` solo observa y reporta, no bloquea nada. Es el punto de partida seguro.
