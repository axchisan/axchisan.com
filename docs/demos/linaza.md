# Brief de demo: Linaza, lino y algodón

Primera demo del motor de catálogo (`demos/motores/catalogo/`): productos con variantes de color y
talla, cada una con su inventario, bolsa y envío por ciudad. Sirve igual para calzado, accesorios
o cosméticos con tonos. Reemplaza a "Trama" del plan original: el nombre era demasiado común para
asegurar que no existiera una marca así. "Linaza" es la semilla del lino y no aparece como marca de
ropa en Colombia.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** marca pequeña de ropa de lino y algodón con taller en Provenza, Medellín.
  Diez prendas, tandas cortas, envíos a todo el país.
- **Quién compra:** mujeres y hombres que llegan desde Instagram, casi siempre en el celular. Su
  duda es la talla y el costo del envío.
- **Quién usa el panel:** la dueña, que empaca y despacha. Su dolor: vender por mensajes, cobrar
  tallas que ya no hay y no saber qué queda.
- **Quién juzga la demo:** marcas de ropa y tiendas que venden por Instagram.

## Niveles

| Nivel | Plan | Qué se ve |
|---|---|---|
| Catálogo + WhatsApp | Catálogo con pedidos por WhatsApp | Colección, tallas, bolsa y pedido que llega por WhatsApp para confirmar; panel de pedidos |
| Tienda con pagos | Tienda con pagos | Pago con PSE, Nequi o tarjeta en una pasarela simulada, prenda apartada al pagar, inventario por talla |

## Decisiones de diseño

- Una tienda de lino es exactamente el lugar donde todo lleva a crema, serifa y terracota, que es el
  cliché número uno. Se descartó a propósito: fondo blanco, tinta casi negra y un solo acento, el
  azul de la flor del lino (`#3552b8`), que también es la marca.
- **Familjen Grotesk** en todo: grande y apretada en los títulos, normal en lo demás. Sin bordes
  redondeados: la ropa se ve en fotos grandes y el resto se aparta.
- Las fotos de producto vienen de dos series coherentes (camisas colgadas de una rama sobre fondo
  arena y prendas puestas sobre fondo blanco), para que la colección se vea como una sola marca.
- Los medios de pago no piden datos de tarjeta en la página: la demo simula la pasarela en un
  diálogo con los colores de Axchi, que dice que no se cobra nada.

## Lo que la hace creíble

- Cada combinación de color y talla tiene su inventario. Algunas tallas amanecen agotadas o con una
  sola unidad, a propósito.
- Un pago aprobado descuenta del inventario; un pedido por WhatsApp espera a que la tienda confirme
  el pago en el panel.
- Envío por ciudad con días hábiles y envío gratis desde $ 250.000.
- La guía de tallas está en centímetros y dice la talla que usa la modelo.
- Al marcar un pedido como enviado se le asigna un número de guía.
