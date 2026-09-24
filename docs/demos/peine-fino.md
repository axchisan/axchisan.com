# Brief de demo — Peine Fino, salón y barbería

Segunda demo del motor de agenda (`demos/motores/agenda/`). Comparte con Canela la reserva por
horas libres; cambia todo lo demás.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** salón unisex en Galerías, Bogotá: barbería, cortes de mujer, color,
  peinados, uñas, cejas y pestañas. Cinco profesionales que cobran por comisión.
- **Quién usa la página:** clientes desde el celular, casi siempre desde Instagram. Quieren ver
  trabajos reales, saber el precio y reservar con **su** estilista.
- **Quién usa el panel:** la dueña o el administrador, en el mostrador. Su dolor no es la historia
  clínica: es cuadrar la caja al final del día, pagar las comisiones sin discusiones y que los
  clientes vuelvan.
- **Quién juzga la demo:** el dueño de un salón o una barbería.

## Qué la hace distinta de Canela (motor igual, producto distinto)

| Canela | Peine Fino |
|---|---|
| Un servicio por cita | **Varios servicios en una reserva** (corte + barba, color + peinado), con duración sumada |
| Cualquier veterinario libre | El cliente **elige a su estilista**, con sus trabajos a la vista |
| Historia clínica | **Ficha de cliente con la fórmula de color** y las fotos del último trabajo |
| Recordatorio de vacunas | **Clientes que no vuelven**: quién no viene hace más de 45 días |
| Resumen de citas | **Caja del día y comisiones por profesional** |

## Revisión contra los patrones por defecto

- Barbería evoca negro mate con dorado y tipografía con serifa de época: es el kit de toda barbería
  "vintage" de Instagram. **Descartado.**
- Salón de belleza evoca rosa pastel y serifa fina: igual de gastado, y además deja fuera a la mitad
  del público. **Descartado.**

La identidad sale de los objetos del oficio:

| Objeto | Qué aporta |
|---|---|
| **El cuero de la silla** | Vino cordobán, profundo y cálido: el color de las sillas de un buen salón |
| **Los herrajes de latón** | Un dorado apagado, solo para detalles y separadores |
| **El tablero de letras** | El elemento memorable, ver abajo |

## Fichas

| Nombre | Hex | Uso |
|---|---|---|
| Cordobán | `#5B1E26` | Titulares, bandas, botón principal |
| Latón | `#A8823F` | Detalles y separadores. Nunca texto sobre claro (no alcanza contraste) |
| Porcelana | `#F7F6F4` | Fondo |
| Blanco | `#FFFFFF` | Superficies |
| Tinta | `#221E1F` | Texto |
| Humo | `#5F585A` | Texto secundario |
| Fieltro | `#1E1B1C` | Fondo del tablero de letras |

## Tipografía

- **Big Shoulders** a tamaño de titular: condensada, de letrero, con la verticalidad de un aviso de
  barbería sin caer en la caligrafía de época.
- **Hanken Grotesk** para todo el texto y el panel: clara, neutra, buena con cifras.

## El elemento memorable: el tablero de letras

La carta de servicios es un **tablero de fieltro con letras blancas encajadas**, como el que cuelga
junto a la caja de cualquier salón. Fondo de fieltro con la trama de ranuras, precios alineados a
la derecha, secciones por categoría. Aparece solo en la portada, en la sección de servicios.

## Composición

- Portada: foto grande a sangre en celular con el titular encima; en escritorio, foto a la derecha.
- Equipo: cada profesional con su especialidad y tres trabajos, porque en un salón se elige a la
  persona, no al local.
- Todo alineado a la izquierda, salvo el tablero, que es un objeto y se centra como tal.

## Lo que no hace

Sin testimonios ni estrellas inventadas. Sin cuenta regresiva de promociones falsas.
