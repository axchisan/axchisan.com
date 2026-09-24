# Precios — cómo se calcula lo que cobra Axchi

> **Revisado el 24 de septiembre de 2026** con precios de entrada al mercado: ningún plan pasa de
> **$ 3.000.000**, y todo se puede pagar también por **suscripción mensual sin pago inicial**. La
> primera versión (tarifa de $ 450.000 por jornada, planes hasta $ 8.000.000) queda en el historial
> de git. **Revisar cada enero**: cambian el salario mínimo, la UVT y las tarifas de los proveedores.
>
> Fuente única en código: `lib/catalogo/planes.ts`. Si cambia una cifra aquí, cambia allí.

## 0. La decisión y por qué funciona

El cliente de Axchi es el negocio pequeño que **no contrata una agencia precisamente porque cobra
de más**. Compite con el sobrino que hace páginas, con Wix y con los programas por suscripción, no
con las agencias. Por eso:

1. **Techo de $ 3.000.000.** Ese es el sistema completo, con pagos en línea, automatizaciones y app
   instalable. Un proyecto más grande se divide en etapas de hasta ese valor, cada una entregada
   funcionando.
2. **Suscripción mensual.** Para quien no tiene el dinero de una vez: sin pago inicial, con dominio,
   alojamiento y soporte incluidos, y 12 meses de permanencia mínima.

Estos precios **solo son viables sobre motores ya construidos** (ver `REESTRUCTURACION.md` §4.1). La
demo de un sector no es solo marketing: es la pieza que después se entrega a cada cliente de ese
sector en una fracción del tiempo. Un sector sin demo todavía no tiene precio de catálogo: primero
se construye el motor, y esa inversión se recupera con las ventas siguientes.

**La regla que no cambia:** si un cliente dice que es caro, se quita un módulo, no se baja la
tarifa. Y lo que se cotiza, se cotiza por escrito.

---

## 1. De dónde salen los precios

Con el motor hecho, cada plan cuesta estas jornadas (8 horas) de trabajo real:

| Plan | Precio | Jornadas con motor | Equivale por jornada |
|---|---|---|---|
| Presencia | $ 300.000 | 0,5 | $ 600.000 |
| Página profesional | $ 600.000 | 1,5 | $ 400.000 |
| Sitio con panel | $ 900.000 | 2,5 | $ 360.000 |
| Catálogo con pedidos por WhatsApp | $ 1.200.000 | 3 | $ 400.000 |
| Citas en línea | $ 1.400.000 | 3 | $ 467.000 |
| Tienda con pagos | $ 1.800.000 | 4,5 | $ 400.000 |
| Sistema de gestión | $ 2.400.000 | 6 | $ 400.000 |
| Sistema completo | $ 3.000.000 | 7 | $ 429.000 |

Todos quedan cerca de **$ 400.000 por jornada**, que es una tarifa sana para un desarrollador en
Colombia (ver §2). La diferencia con la primera versión no es cobrar menos por día: es **trabajar
menos días por proyecto** gracias a los motores. Sin motor, las mismas cifras darían menos de
$ 200.000 por jornada, y ahí sí se estaría trabajando a pérdida.

Para lo que no sale de un motor:

- **Hora de cambios o trabajo suelto:** $ 40.000.
- **Desarrollo a medida:** por etapas de hasta $ 3.000.000, con un diagnóstico de $ 150.000 que se
  descuenta si el cliente contrata.

## 2. Lo que cuesta trabajar como independiente en Colombia (2026)

| Concepto | Valor 2026 | Cómo afecta |
|---|---|---|
| Salario mínimo (SMMLV) | $1.750.905 | Piso del ingreso base de cotización |
| Seguridad social de independiente | Salud 12,5 % + pensión 16 % + ARL riesgo I 0,522 % = **29,02 %** sobre el 40 % de lo facturado | ≈ **11,6 % de cada peso facturado**. Si el 40 % no alcanza un mínimo, se cotiza sobre el mínimo: **$508.148 al mes como piso** |
| Retención en la fuente | 10 % u 11 % (honorarios) sobre pagos mayores a 27 UVT ($1.414.098) cuando el cliente es agente retenedor | No es un costo: es un anticipo del impuesto de renta que se recupera al declarar. Pero **sí te quita caja** el mes del pago |
| IVA | No lo cobras mientras seas **no responsable**: ingresos anuales menores a 3.500 UVT ($183.309.000) y ningún contrato individual de ese monto o mayor | Tus precios son finales, sin IVA. En la cuenta de cobro se declara que eres no responsable |
| Impuesto 4×1000 | 0,4 % de lo que sacas del banco | Pequeño pero real |
| Renta | Depende del año completo. Con ingresos moderados suele ser baja, pero se reserva | Guardar ~3 % de lo facturado |
| Herramientas | Suscripciones de IA, dominio propio, hosting, equipo | ~$400.000 al mes |

> Si te inscribes en el **Régimen Simple de Tributación**, los clientes no te practican retención
> y pagas un solo impuesto consolidado. Con un contador conviene evaluarlo cuando pases de 3–4
> clientes empresa al mes. Este documento no sustituye esa asesoría.

### Los días que de verdad se facturan

Un mes tiene ~21 días hábiles, pero no todos son de construir: hay que buscar clientes, construir
demos, dar soporte y facturar. Con un 60 % facturable salen **12 jornadas al mes**.

## 3. Qué cobra el mercado colombiano (2026)

| Tipo de proyecto | Freelancer / plantilla | Agencia / estudio | Plazo típico |
|---|---|---|---|
| Landing page | $500.000 – $1.200.000 | $1.800.000 – $3.500.000 | 1–3 semanas |
| Sitio corporativo (4–8 páginas) | $1.500.000 – $3.500.000 | $3.500.000 – $8.000.000 | 3–6 semanas |
| Web con sistema de reservas | $2.500.000 | hasta $7.000.000 | 4–8 semanas |
| Tienda en línea | $1.800.000 – $6.000.000 | $6.000.000 – $15.000.000+ | 4–12 semanas |
| Sistema o portal a medida | USD 3.000 – 8.000 (≈ $9,8 – $26 millones) para un MVP | desde $18.000.000, y desde $40.000.000 en agencias grandes | 1–6 meses |
| Mantenimiento mensual | $150.000 – $600.000 | $250.000 – $900.000 | — |
| SaaS veterinario (suscripción) | $50.000 – $300.000 al mes | — | — |
| Agenda de citas por suscripción (AgendaPro, plan más usado) | — | ~$150.000 al mes | — |
| Tienda por suscripción (Shopify Basic) | — | ~29 USD al mes (≈ $95.000) más aplicaciones | — |

**Dónde se ubica Axchi:** en el rango del freelancer, con la calidad y las pruebas de un estudio.
Por debajo de las suscripciones conocidas: la suscripción de citas de Axchi cuesta la mitad que la
de AgendaPro y es el sistema propio del negocio, con su página y su marca.

---

## 4. Qué significa para tus ingresos

**Pagos únicos.** Con un precio promedio de $ 1.200.000 y unas 3,5 jornadas por venta, 12 jornadas
alcanzan para 3 ventas al mes: **$ 3.600.000 facturados**. Después de seguridad social (piso de
$ 508.148), herramientas ($ 400.000), reserva de renta y 4×1000, quedan unos **$ 2.570.000 netos**.

**Suscripciones.** Son la parte que crece sola. El costo de mantener a un suscriptor en línea es
casi cero (alojamiento gratuito o de pocos miles de pesos, dominio de $ 5.000 al mes), así que casi
toda la mensualidad es margen:

| Suscriptores (promedio $ 70.000) | Ingreso mensual recurrente |
|---|---|
| 10 | $ 700.000 |
| 25 | $ 1.750.000 |
| 50 | $ 3.500.000 |

Con 25 suscriptores y tres ventas al mes, el ingreso neto supera los **$ 4.000.000** y ya no depende
de vender cada mes. Por eso conviene ofrecer la suscripción primero a quien duda por el precio.

---

## 5. Planes de pago único

Precios desde, finales y sin IVA.

| Plan | Desde | Entrega | Qué es |
|---|---|---|---|
| **Presencia** | **$ 300.000** | 3 días hábiles | Una página con servicios, horario, mapa y WhatsApp, sobre plantilla |
| Página profesional | $ 600.000 | 1 a 2 semanas | Diseño propio, formulario, analítica, ficha de Google |
| Sitio con panel | $ 900.000 | 2 semanas | Varias páginas y panel para editar |
| Catálogo con pedidos por WhatsApp | $ 1.200.000 | 2 a 3 semanas | Productos, carrito y pedido armado por WhatsApp (como Jabones Mari) |
| Citas en línea | $ 1.400.000 | 2 a 3 semanas | Reserva desde el celular y agenda del día |
| Tienda con pagos | $ 1.800.000 | 3 a 4 semanas | Catálogo con cobro en línea e inventario |
| Sistema de gestión | $ 2.400.000 | 4 a 5 semanas | Usuarios, módulos del negocio, reportes, Excel |
| **Sistema completo** | **$ 3.000.000** | 5 a 6 semanas | El sistema con pagos, automatizaciones y app instalable. **Es el techo** |

El plan de $ 300.000 sigue siendo la puerta de entrada, con sus tres límites: una ronda de
ajustes, el contenido lo entrega el cliente y la plantilla no se rediseña.

### Módulos adicionales

| Módulo | Precio |
|---|---|
| Diagnóstico de un proyecto a medida (se descuenta si contrata) | $ 150.000 |
| Recordatorios automáticos por WhatsApp | $ 400.000 + consumo |
| Pasarela de pagos en un plan que no la trae | $ 400.000 |
| Facturación electrónica con proveedor autorizado | $ 600.000 + suscripción del proveedor |
| Migración de datos desde Excel | desde $ 200.000 |
| Productos por encima de los incluidos | $ 2.000 cada uno |
| Textos redactados | $ 150.000 |
| Segundo idioma | +25 % del plan |
| Hora de cambios | $ 40.000 |

---

## 6. Suscripciones

| Suscripción | Por mes | Equivale a | Incluye además |
|---|---|---|---|
| Página mensual | **$ 39.900** | Presencia | Dominio, alojamiento, un cambio al mes, soporte |
| Negocio en línea | $ 79.900 | Catálogo, citas en línea o sitio con panel | Dominio, alojamiento, copias, una hora de cambios, soporte |
| Sistema mensual | $ 129.900 | Sistema de gestión | Dominio, alojamiento, base de datos, copias, una hora de cambios, soporte prioritario |

Pagos en línea o automatizaciones se suman a cualquier suscripción por **$ 20.000 al mes** cada
uno, más su consumo.

### Reglas

| Tema | Regla | Por qué |
|---|---|---|
| Pago inicial | Ninguno | Es lo que hace atractiva la suscripción |
| Permanencia mínima | 12 meses | En un año la suscripción cubre la mayor parte de lo que cuesta construir sobre el motor |
| Si se cancela antes | Se paga el 50 % de las mensualidades que faltan para el año | Protege el trabajo hecho sin castigar al cliente |
| Cobro | Mes anticipado, por transferencia, Nequi o Daviplata | — |
| Dominio | Siempre a nombre del cliente | El cliente nunca pierde su dirección |
| Datos | Del cliente, exportables en cualquier momento | Nadie queda secuestrado |
| Código | Licencia de uso mientras dure la suscripción | El motor se reutiliza con otros clientes: si alguien se va, el trabajo no se pierde |
| Pasar a pago único | Se abona el 50 % de lo pagado en mensualidades | Premia al cliente que se queda y quiere ser dueño |

**Para el cliente:** el primer año paga menos que el pago único más el mantenimiento. **Para Axchi:**
el punto de equilibrio llega entre el mes 12 (página) y el 19 (sistema), y todo lo que sigue es ingreso recurrente
sobre un producto ya construido.

---

## 7. Después de un pago único

| Concepto | Costo real 2026 | Quién lo paga |
|---|---|---|
| Dominio `.co` o `.com` | ~$ 60.000 al año | El cliente, a su nombre |
| Página sin panel | $ 0 (Cloudflare Pages permite uso comercial gratis) | — |
| Sistema con base de datos | $ 0 – $ 90.000 al mes; en un negocio pequeño, casi siempre menos de $ 20.000 | El cliente |
| Correo con el dominio | $ 0 con reenvío o plan gratuito; ~$ 25.000 por persona al mes con Google Workspace | El cliente, opcional |
| Pasarela de pagos | 2,65 % + $ 700 + IVA por venta (Wompi) | El cliente |
| WhatsApp automático | ~$ 3 por recordatorio, ~$ 46 por promoción | El cliente |

### Mantenimiento

| Plan | Mensual | Incluye |
|---|---|---|
| Sin plan | $ 0 | Cambios a $ 40.000 la hora. Garantía de 30 días sobre fallas |
| Esencial | $ 40.000 | Renovaciones, copias, monitoreo, seguridad y corrección de fallas |
| Crecimiento | $ 90.000 | Lo anterior, 2 horas de cambios y reporte mensual |

---

## 8. Condiciones de pago único

| Tema | Regla |
|---|---|
| Hasta $ 1.000.000 | 50 % para empezar, 50 % al entregar |
| Más de $ 1.000.000 | 40 % para empezar, 30 % en la entrega intermedia, 30 % al final |
| Validez de la cotización | 15 días |
| Ajustes | Los del plan; los adicionales, por hora |
| Contenido | Lo entrega el cliente; si tarda más de 15 días, el proyecto se reprograma |
| Propiedad | Código, dominio y datos del cliente cuando termina de pagar |
| Retención en la fuente | Si el cliente es empresa y retiene, se indica en la cotización; el precio no cambia |

---

## 9. Cuándo no conviene lo que vendes (y decirlo da credibilidad)

- **Veterinaria que solo necesita historia clínica:** un programa por suscripción de $ 50.000 a
  $ 90.000 al mes puede bastarle. Lo de Axchi gana cuando quiere su página, su marca y la agenda
  conectadas, o cuando el programa no hace lo que ella necesita.
- **Tienda estándar sin nada particular:** una tienda de Instagram puede bastar al principio. El
  catálogo propio gana cuando quiere su marca completa y no pagar comisión por venta.

---

## 10. Cómo se muestra en el sitio

- **Portada:** "Desde $ 300.000" y, al lado, "o desde $ 39.900 al mes".
- **`/planes`:** pago único y suscripciones en la misma página, con los costos posteriores al lado.
- **Cada ficha:** los planes del sector con precio único y su equivalente mensual.
- **Formato:** `$ 300.000`, sin decimales ni "COP" en el texto; en datos estructurados, `priceCurrency: "COP"`.

---

## Fuentes

- Salario mínimo 2026 ($1.750.905) y auxilio de transporte: [Buk](https://www.buk.co/blog/salario-minimo-colombia), [La República](https://www.larepublica.co/economia/todo-lo-que-debe-saber-sobre-el-salario-minimo-de-2026-que-decreto-el-gobierno-4331996)
- Retención en la fuente de honorarios 2026 y UVT ($52.374): [Alegra](https://blog.alegra.com/colombia/retencion-en-la-fuente-por-servicios/), [aportesindependientes.co](https://www.aportesindependientes.co/calculadora-retencion-honorarios/)
- Seguridad social de independientes: [tuliqui.com.co](https://tuliqui.com.co/seguridad-social-contratista-independiente-colombia/), [siaseguros.co](https://siaseguros.co/guia-seguridad-social-independientes-colombia)
- No responsables de IVA 2026: [Actualícese](https://actualicese.com/montos-para-ser-no-responsables-de-iva-en-2026/), [Gerencie](https://www.gerencie.com/responsables-y-no-responsables-del-iva.html)
- Precios de páginas web 2026: [Novux Studio](https://novuxstudio.com/diseno-y-desarrollo-web/cuanto-cuesta-una-pagina-web/), [Cangrejo Digital](https://cangrejodigital.com/diseno-web/cuanto-cuesta-pagina-web-colombia/), [Vokko](https://vokkoagency.com/blog/cuanto-cuesta-una-landing-page-en-colombia/)
- Software a medida: [ToGrow](https://togrowagencia.com/software-a-medida-costo-colombia/), [TotalSys](https://totalsys.co/blog/cuanto-cuesta-desarrollar-software-medida-colombia-2026)
- Tarifas por hora: [andredesignmarketing.com](https://andredesignmarketing.com/cuanto-cobra-un-desarrollador-web/), [TripleTen](https://tripleten.co/blog/cuanto-gana-desarrollador-web-colombia/)
- SaaS veterinario: [MisterVet](https://www.mistervet.co/software), [Okvet](https://okvet.co/)
- Wompi: [planes y tarifas](https://wompi.com/es/co/planes-tarifas/)
- WhatsApp Business API: [Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/?locale=es_LA), [Simla](https://www.simla.com/blog/precios-whatsapp-business-api)
- Dominios: [MI.COM.CO](https://mi.com.co/precios)
- TRM de referencia: $3.264,39 el 24 de septiembre de 2026, [CapitalColombia](https://www.capitalcolombia.com/sec-trm_precio_dolar_en_colombia)
- Suscripciones y mantenimiento: [AgendaPro](https://agendapro.com/co/planes), [BytechHub](https://bytechhub.com/blog/cuanto-cuesta-una-pagina-web-en-colombia-precios-reales-2026/), [Cangrejo Digital: Shopify vs WooCommerce](https://cangrejodigital.com/diseno-web/shopify-vs-woocommerce-colombia/)
