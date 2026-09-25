# Brief de demo: Fogón 45, cocina colombiana

Primera demo del motor de pedidos (`demos/motores/pedidos/`): carta con opciones, carrito, estados
del pedido y mensaje a WhatsApp. El mismo motor sirve para una cafetería, una panadería o unas
comidas rápidas; lo que cambia es la carta y la piel.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** restaurante de cocina colombiana en la calle 45 con carrera 13, Chapinero
  (Bogotá). Ajiaco, bandeja y carnes al carbón; sancocho los fines de semana. Doce mesas y
  domicilios a los barrios vecinos. Se comprobó que no existe un "Fogón 45" en Colombia.
- **Quién usa la página:** comensales en la mesa, con el QR, y clientes del barrio que piden desde
  Instagram o Google Maps.
- **Quién usa el panel:** la administradora y la cocina, en una tablet. Su dolor: pedidos de
  WhatsApp que se pierden, comandas de papel, una carta en PDF que no se puede cambiar y reservas
  por teléfono en la hora del almuerzo.
- **Quién juzga la demo:** el dueño de un restaurante o una cafetería.

## Niveles

| Nivel | Plan | Qué se ve |
|---|---|---|
| Carta digital | Página profesional, Sitio con panel | Carta con fotos y QR por mesa; panel de carta (precios y agotados) y de QR. Se pide por WhatsApp |
| Carta + pedidos | Catálogo con pedidos por WhatsApp | Carrito con opciones, pedido a la mesa, para recoger o a domicilio, seguimiento y lista de pedidos |
| Sistema con cocina | Sistema de gestión, Sistema completo | Pantalla de cocina con tiempos, reservas con cupos por franja y ventas del día |

## Decisiones de diseño

- **Peltre.** El blanco frío y el borde azul cobalto de las ollas y los platos esmaltados de las
  cocinas colombianas. Cada foto de plato es un plato de peltre visto desde arriba (`.fg-plato`), y
  la portada es una mesa con tres platos. Es el único elemento memorable; el resto se calla.
- Se descartó a propósito el crema con serifa y terracota, que es lo que se le hace a todo
  restaurante "de autor", y el negro con dorado de las parrillas.
- **Alfa Slab One** para títulos: la letra gruesa de los avisos pintados de los restaurantes de
  barrio. **Figtree** para leer: clara en tamaños pequeños, en la cocina y en el celular.
- Ají (`#b0261c`) solo para lo picante, lo agotado y las demoras. Maíz solo sobre cobalto.
- Contraste calculado: cobalto 8,9:1 sobre peltre, ceniza 6,1:1, niebla 6,3:1 sobre cobalto.

## Lo que la hace creíble

- Opciones de verdad: término de la carne, acompañamiento, sabor del jugo, notas para la cocina.
  Dos churrascos con distinto término son dos líneas en la comanda.
- Domicilio con costo por barrio; efectivo con "¿con cuánto pagas?"; Nequi y Daviplata.
- El tiempo estimado suma lo que tarda el plato más lento y la fila que ya tiene la cocina.
- El pedido guarda el precio del momento: si el panel cambia un precio, los pedidos anteriores no
  cambian.
- El sancocho es de fin de semana: entre semana amanece agotado, y los pedidos de ejemplo no lo
  llevan.
- Los datos de ejemplo se generan alrededor de la hora del visitante: siempre hay pedidos nuevos,
  en el fogón y listos. Al día siguiente se regeneran; se conservan los precios que cambió.
- La página de seguimiento cambia sola cuando el pedido se mueve en la cocina, aunque esté en otra
  pestaña (evento `storage`).
