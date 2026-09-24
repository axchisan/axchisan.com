# Brief de demo — Canela, clínica veterinaria

Especificación funcional: `REESTRUCTURACION.md` §4.8. Este documento fija el diseño.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** clínica veterinaria de barrio en Chapinero, Bogotá. Perros y gatos.
- **Quién usa la página:** dueños de mascotas, desde el celular, a menudo preocupados. Quieren saber tres cosas: si está abierto, cuánto cuesta y cómo pedir cita.
- **Quién usa el panel:** recepción y veterinarios, en un computador de mostrador o en una tablet en el consultorio.
- **Quién juzga la demo:** el dueño de una veterinaria real que decide si contratar. Tiene que reconocer su día a día en el panel.

## Revisión contra los patrones por defecto

La primera idea fue la obvia: *Canela* → canela → fondo crema y acento terracota con serif de
titular. Es exactamente el patrón número uno de página generada, y además confunde el nombre del
negocio con una paleta. **Descartada.** La segunda idea, verde menta clínico, es el color de
cualquier veterinaria del mundo. **Descartada.**

La identidad sale de los objetos del mundo de las mascotas, no del nombre:

| Objeto | Qué aporta |
|---|---|
| **El collar** | Azul índigo profundo, sobrio: confianza médica sin frialdad de hospital |
| **La pelota de tenis** | El amarillo verdoso de la acción principal. Nadie más usa ese color en salud, y cualquier dueño de perro lo reconoce |
| **La placa de identificación** | El elemento memorable, ver abajo |

## Fichas

| Nombre | Hex | Uso |
|---|---|---|
| Collar | `#1C3552` | Titulares, bandas, barra lateral del panel |
| Pelota | `#DCE85A` | Botón principal y la placa. Siempre con texto collar encima |
| Nube | `#F4F6F3` | Fondo |
| Blanco | `#FFFFFF` | Superficies |
| Pizarra | `#4B5968` | Texto secundario |
| Pino / Ámbar / Coral | `#276D4D` / `#8F5808` / `#B93A2A` | Estados de vacuna: al día, próxima, vencida. Solo para estado, nunca decoración |

## Tipografía

Dos familias, una por cara del negocio:

- **Bricolage Grotesque**, toda la cara pública (portada y reserva): grotesca con carácter, algo irregular, cercana sin ser infantil. Titulares a peso 800 y ancho reducido; texto a 400.
- **Atkinson Hyperlegible Next**, el panel clínico. Fue diseñada para personas con baja visión y dibuja el cero tachado. En una ficha clínica, donde confundir `0` con `O` o `1` con `l` en una dosis es un error real, eso es una virtud que se le puede contar al cliente. En un precio de la portada (`$ 70.000`) el cero tachado se lee raro, y por eso la cara pública no la usa.

Escala 1,25 sobre 16 px: 13 · 16 · 20 · 25 · 31 · 39 · 49.

## El elemento memorable: la placa

Una placa redonda de identificación, colgada de su argolla, en amarillo pelota. En la portada
dice en tiempo real si la clínica está abierta y hasta qué hora. En el panel, cada mascota lleva
su placa con la inicial y la especie. Se usa en esos dos sitios y en ninguno más.

## Composición

Todo alineado a la izquierda. La portada abre con lo que un dueño preocupado necesita:

```
Celular                              Escritorio
┌──────────────────────┐             ┌───────────────────────┬────────────────┐
│ Canela    [Agendar]  │             │ Consulta, vacunas y   │   foto         │
│ foto          (placa)│             │ urgencias en          │           placa│
│ Consulta, vacunas y  │             │ Chapinero.            │                │
│ urgencias en         │             │ [Agendar] [WhatsApp]  │                │
│ Chapinero.           │             └───────────────────────┴────────────────┘
│ [Agendar cita]       │             Qué atendemos: filas con precio y duración
│ [WhatsApp]           │             El primer año del cachorro: línea de tiempo
└──────────────────────┘             Quién los atiende · Horario y mapa · Preguntas
```

- Los servicios **no** van en tarjetas iguales: van como el tablero de precios de un mostrador, en filas, con el precio alineado.
- El calendario de vacunas del cachorro sí es una secuencia real: ahí la numeración informa.
- El panel es denso y claro, con barra lateral índigo en escritorio y barra inferior en celular.

## Movimiento

Uno solo: la placa se balancea una vez al cargar, como si la acabaran de colgar. Nada más se mueve
si no lo pide una acción. Con `prefers-reduced-motion`, quieta.

## Lo que no hace

No usa testimonios inventados ni reseñas con estrellas: un negocio ficticio no puede tener
opiniones reales, y fingirlas enseñaría al cliente un mal hábito. En su lugar, preguntas frecuentes.
