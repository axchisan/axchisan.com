# Brief de demo: Ferretería Doble Rosca

Primera demo del motor de gestión (`demos/motores/gestion/`): productos, existencias, ventas de
mostrador, kardex y reportes. Sirve igual para una miscelánea, una distribuidora, una tienda de
repuestos o una droguería; cambia el catálogo y la piel.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** ferretería de barrio en Kennedy Central, Bogotá. 49 referencias de
  tornillería, herramientas, eléctricos, plomería, pinturas y materiales; seis proveedores que pasan
  en días fijos. Se comprobó que no existe una "Ferretería Doble Rosca".
- **Quién usa la página:** maestros de obra y vecinos que preguntan "¿tienen…?" por WhatsApp.
- **Quién usa el panel:** el dueño en el mostrador. Su dolor: el inventario en un cuaderno, la caja
  que no cuadra, enterarse de que algo se acabó cuando lo piden y no saber cuánto gana.
- **Quién juzga la demo:** dueños de comercios con inventario.

## Niveles

| Nivel | Plan | Qué se ve |
|---|---|---|
| Catálogo + pedidos | Catálogo con pedidos por WhatsApp | Catálogo con precio y "Disponible/Agotado", lista por WhatsApp, pedidos web y precios en el panel |
| Inventario y caja | Sistema de gestión | Existencias exactas, caja, kardex, conteo físico, entradas, reportes y descarga para Excel |
| Sistema completo | Sistema completo | Pedido sugerido por proveedor con mensaje de WhatsApp y avisos automáticos cada mañana |

## Decisiones de diseño

- **Fachada de ferretería de barrio.** El verde con que se pintan muchas ferreterías en Colombia,
  el zinc galvanizado de fondo y el amarillo de la cinta métrica solo donde hay que mirar: lo que se
  está acabando, el cambio en la caja, el día en curso.
- Se descartó a propósito el negro con amarillo de seguridad, que es el uniforme de toda tienda de
  herramientas en internet.
- **La cinta métrica** es el elemento memorable: las existencias se dibujan como una cinta con
  marcas cada 10 % y una raya negra en el mínimo. Se lee de lejos si hay que pedir.
- **Archivo** en dos anchos: ensanchada para títulos, como las letras de los avisos de fachada; normal
  para las tablas, que tienen que ser densas y claras.
- La página habla de usted, como se habla en el mostrador de una ferretería en Bogotá.

## Lo que la hace creíble

- Las existencias no se guardan: se calculan desde el inventario inicial, las entradas, los ajustes y
  las ventas. Por eso el kardex de cada producto siempre cuadra.
- Tres semanas de ventas generadas alrededor de la hora del visitante, con precios y márgenes
  reales de ferretería en Bogotá, domingos a medio día y descuentos a clientes de obra.
- El inventario inicial se calcula al final para que hoy las existencias sean las previstas, con
  algunos productos por debajo del mínimo a propósito.
- La caja no deja vender más de lo que hay. Las ventas guardan el precio y el costo del momento.
- El pedido sugerido redondea a la cantidad de empaque del proveedor.
- La descarga para Excel es un CSV con punto y coma, coma decimal y BOM: así Excel en español lo
  abre con las tildes bien.
