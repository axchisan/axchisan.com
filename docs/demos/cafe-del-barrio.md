# Brief de demo: Café del Barrio, programa de puntos

Primera demo del motor de fidelización (`demos/motores/fidelizacion/`) y la última de la ola 2. Es
la única cuyo producto es una **app para los clientes del negocio**: por eso se ve dentro de un
teléfono en el computador y a pantalla completa en el celular, y se puede instalar.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** café de especialidad en el centro de Pereira, con tinto de Belén de
  Umbría, pandebono y almojábana. Se buscó el nombre: hay un "Café del Barrio" en Chile y nombres
  parecidos en México y Argentina, ninguno conocido en Colombia.
- **Quién usa la app:** los clientes fijos del café.
- **Quién usa la caja y el panel:** el cajero (suma puntos, inscribe, cobra cupones) y el dueño
  (mira si el programa funciona y manda campañas).
- **El trabajo:** que el cliente vuelva, y que el dueño sepa quién dejó de venir.

## Niveles

| Nivel | Plan | Qué se ve |
|---|---|---|
| App de puntos y caja | Sistema de gestión | App del cliente, caja, panel de clientes y métricas |
| Con campañas e invitaciones | Sistema completo | Además: campañas por grupo, invitaciones con bono y la instalación de la app |

## Cómo funciona

- **Saldo calculado, no guardado.** Como en el motor de gestión, los puntos salen de los
  movimientos (compras, canjes, bonos). Se gastan del más viejo al más nuevo y cada lote vence a
  los 12 meses: el aviso "40 puntos vencen el…" sale de ahí.
- **Nivel por puntos ganados en 12 meses** (no por el saldo): canjear no baja de nivel.
- **Sellos:** una compra desde $ 5.000 pone uno; con 8, el siguiente café es gratis.
- **Cupones de un solo uso** con código de 6 caracteres sin letras que se confunden (0/O, 1/I).
  La caja valida que exista, que no se haya usado y que no haya vencido.
- **La app y la caja se sincronizan entre pestañas** (evento `storage` del almacén): se puede
  mostrar la demo con las dos abiertas, como en el café real.
- **Instalable:** manifiesto en `/demo/cafe-del-barrio/manifest.webmanifest` con su propio ícono
  (`public/demos/cafe-del-barrio/`). En Chrome y Android aparece el botón de instalar; en iPhone,
  las instrucciones de "Agregar a inicio".
- Al abrir la demo otro día, `ponerAlDia` corre todas las fechas los días que pasaron: la demo no
  envejece y se conserva lo que hizo el visitante.

## Decisiones de diseño

- Un café lleva todo al crema con marrón. Se descartó: verde de cafeto como base y **rojo cereza de
  café** solo para los sellos y lo que se gana. El sello es un grano de café dibujado, no un ícono
  genérico.
- **Young Serif** para la marca y los títulos, con carácter de letrero de barrio; **Outfit** para
  leer, redonda y clara en pantallas pequeñas.
- La clienta de la demo está armada para que cada pantalla tenga algo: 6 de 8 sellos, 40 puntos por
  vencer, a 204 puntos del nivel siguiente y un cupón de campaña por usar.

## Pruebas

`e2e/demo-cafe-del-barrio.spec.ts` (20 en escritorio y celular): la compra en caja que aparece en
la app abierta en otra pestaña, el cupón que se cobra una sola vez, cupones vencidos e inventados,
la invitación con bono para los dos, las campañas, el manifiesto instalable, WCAG AA y 360 px.
