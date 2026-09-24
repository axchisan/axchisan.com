# Precios — cómo se calcula lo que cobra Axchi

> Investigación y modelo del 24 de septiembre de 2026. Las cifras de mercado y de terceros tienen
> fuente al final. **Revisar cada enero**: cambian el salario mínimo, la UVT y las tarifas de los
> proveedores, y con ellos este documento.

## 0. La regla que resuelve la duda de "¿esto es mucho?"

Un precio no se inventa ni se compara con lo que "parece" caro. Sale de tres números:

```
precio = jornadas de trabajo × tarifa por jornada × factor de riesgo
```

- **Jornadas:** cuánto trabajo real lleva, contado por módulos (sección 3).
- **Tarifa por jornada:** lo que necesitas cobrar por un día de trabajo para vivir de esto, calculado con tus costos reales (sección 1). No es negociable.
- **Factor de riesgo:** cuánto de lo pedido es desconocido.

Si un cliente dice que es caro, **no se baja la tarifa: se reduce el alcance**. Se quita un
módulo, no se regala un día. Esa es la única forma de no terminar trabajando a pérdida.

---

## 1. La tarifa por jornada

### 1.1 Lo que cuesta trabajar como independiente en Colombia (2026)

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

### 1.2 Los días que de verdad se facturan

Un mes tiene ~21 días hábiles, pero **no todos son de construir**. Hay que buscar clientes, hacer
reuniones y cotizaciones, construir demos, dar soporte a clientes anteriores, facturar y aprender.
En un estudio de una persona, un **60 %** de días facturables es realista: **12 jornadas al mes**.
Una jornada son 8 horas.

### 1.3 Tres escenarios

| | Conservador | **Recomendado** | Consolidado |
|---|---|---|---|
| Tarifa por jornada | $350.000 | **$450.000** | $600.000 |
| Equivale por hora | $43.750 | **$56.250** | $75.000 |
| Facturación con 12 jornadas | $4.200.000 | **$5.400.000** | $7.200.000 |
| Seguridad social | −$508.148 (piso) | **−$626.875** | −$835.834 |
| Herramientas | −$400.000 | **−$400.000** | −$400.000 |
| Reserva de renta (3 %) | −$126.000 | **−$162.000** | −$216.000 |
| 4×1000 | −$16.800 | **−$21.600** | −$28.800 |
| **Te queda al mes** | **$3.149.052** | **$4.189.525** | **$5.719.366** |
| En salarios mínimos | 1,8 | **2,4** | 3,3 |

**Recomendación: $450.000 por jornada.** Equivale a $56.250 la hora, en la franja de un
desarrollador de nivel intermedio en Colombia ($50.000–$80.000/h). No es cara para el mercado y te
deja un ingreso digno y sostenible. Por debajo de $350.000 trabajas más por menos que un empleo
con prestaciones. $600.000 es la meta cuando tengas casos que mostrar y demanda estable.

> **Tarifa interna: $450.000 por jornada. Tarifa por hora para trabajos sueltos: $60.000** (se
> redondea hacia arriba porque un trabajo corto trae el mismo costo de contexto que uno largo).

---

## 2. Qué cobra el mercado colombiano (2026)

| Tipo de proyecto | Freelancer / plantilla | Agencia / estudio | Plazo típico |
|---|---|---|---|
| Landing page | $500.000 – $1.200.000 | $1.800.000 – $3.500.000 | 1–3 semanas |
| Sitio corporativo (4–8 páginas) | $1.500.000 – $3.500.000 | $3.500.000 – $8.000.000 | 3–6 semanas |
| Web con sistema de reservas | $2.500.000 | hasta $7.000.000 | 4–8 semanas |
| Tienda en línea | $1.800.000 – $6.000.000 | $6.000.000 – $15.000.000+ | 4–12 semanas |
| Sistema o portal a medida | USD 3.000 – 8.000 (≈ $9,8 – $26 millones) para un MVP | desde $18.000.000, y desde $40.000.000 en agencias grandes | 1–6 meses |
| Mantenimiento mensual | $150.000 – $600.000 | $250.000 – $900.000 | — |
| SaaS veterinario (suscripción) | $50.000 – $300.000 al mes | — | — |

**Dónde se ubica Axchi:** en la parte baja del rango de estudio y alta del rango freelancer. La
razón para cobrar menos que una agencia no es trabajar más barato, sino que los **motores
reutilizables** reducen las jornadas. Eso es lo que se explica al cliente: *"no empezamos de cero"*.

---

## 3. Cómo estimar un proyecto

### 3.1 Jornadas por módulo

Valores base con motor reutilizable. Sin motor, multiplicar por 1,6.

| Módulo | Jornadas |
|---|---|
| Página de una sección desde plantilla | 0,75 |
| Sección adicional con diseño propio | 0,25 |
| Diseño visual a medida (identidad del cliente aplicada al sitio) | 1 |
| Panel para que el cliente edite contenido | 1,5 |
| Inicio de sesión con roles | 1 |
| Entidad simple con alta, edición y listado (p. ej. proveedores) | 0,75 |
| Entidad con relaciones e historial (p. ej. mascota con historia clínica) | 1,5 |
| Agenda con disponibilidad y reservas | 2 |
| Carrito y pedido armado a WhatsApp | 1,5 |
| Pasarela de pagos (Wompi, Bold, Mercado Pago) | 2 |
| Reportes con gráficas | 1 – 2 |
| Exportar a Excel | 0,5 |
| Correos automáticos | 0,5 |
| WhatsApp automático por API (recordatorios) | 2 |
| Facturación electrónica vía proveedor autorizado | 3 |
| Migrar datos desde Excel | 1 |
| Capacitación y manual | 0,5 |
| **Pruebas y despliegue** | +12 % del total |
| **Gestión (reuniones, ajustes, comunicación)** | +10 % del total |

### 3.2 Factor de riesgo

| Situación | Factor |
|---|---|
| Ya lo has hecho con el mismo motor | 1,0 |
| Una integración o tecnología nueva | 1,2 |
| El cliente no tiene claro qué quiere, o hay un sistema existente que no conoces | 1,5, o mejor: **cobrar un diagnóstico primero** |

### 3.3 Ejemplo: sistema para veterinaria

| Módulo | Jornadas |
|---|---|
| Inicio de sesión con roles (recepción, veterinario) | 1 |
| Propietarios | 0,75 |
| Mascotas con historia clínica | 1,5 |
| Consultas y notas clínicas | 1,5 |
| Vacunas y desparasitaciones con próximas fechas | 1 |
| Agenda de citas | 2 |
| Reportes | 1 |
| Exportar a Excel | 0,5 |
| Correos de confirmación | 0,5 |
| Capacitación | 0,5 |
| **Subtotal** | **10,25** |
| Pruebas y despliegue (+12 %) | 1,23 |
| Gestión (+10 %) | 1,03 |
| **Total** | **12,5 jornadas × $450.000 = $5.625.000** |

Redondeado: **desde $6.000.000**. Se redondea siempre hacia arriba, a múltiplos de $50.000 o de
$100.000.

---

## 4. Planes públicos

Todos los precios son **desde**: corresponden a la configuración mínima descrita. Son finales,
sin IVA (ver 1.1).

| Plan | Desde | Jornadas | Entrega | Incluye | No incluye |
|---|---|---|---|---|---|
| **Presencia** | **$300.000** | 0,75 | 3 días hábiles tras recibir el contenido | Página de una sección con plantilla de Axchi adaptada a tus colores: servicios, horario, ubicación con mapa, galería, botón de WhatsApp. SEO básico y publicación. 1 ronda de ajustes | Dominio, textos, fotos, panel, diseño a medida |
| **Página profesional** | $900.000 | 2 | 1–2 semanas | Diseño propio con tu marca, hasta 8 secciones, formulario que llega a tu correo, analítica, ficha de Google Business, 2 rondas de ajustes | Panel, tienda |
| **Sitio con panel** | $1.800.000 | 4 | 2–3 semanas | Varias páginas y un panel donde cambias textos, fotos y precios tú mismo | Ventas en línea |
| **Catálogo con pedidos por WhatsApp** | $2.200.000 | 5 | 2–3 semanas | Productos con variantes, carrito, pedido armado a WhatsApp, panel de productos. Carga de hasta 50 productos. Ejemplo real: Jabones Mari | Cobro en línea |
| **Citas en línea** | $2.500.000 | 5,5 | 3 semanas | Servicios, profesionales, horarios, reserva desde el celular, panel de agenda, confirmación por correo | Recordatorios automáticos por WhatsApp (módulo aparte) |
| **Tienda con pagos** | $3.500.000 | 8 | 3–5 semanas | Lo del catálogo más cobro en línea (PSE, Nequi, tarjeta), inventario, estados de pedido, correos al comprador | Comisión de la pasarela |
| **Sistema de gestión** | $6.000.000 | 13 | 5–7 semanas | Inventario y ventas, clínica, etc.: usuarios con roles, módulos del negocio, reportes, Excel, copias de seguridad, capacitación | Facturación electrónica, migración de datos (módulos aparte) |
| **App móvil** | $8.000.000 | 18 | 6–10 semanas | App instalable sobre un sistema existente o nuevo | Publicación en tiendas: cuentas de desarrollador a cargo del cliente |
| **A medida y automatización** | Por jornada | — | Según diagnóstico | Integraciones, automatizaciones, IA | — |

### 4.1 El plan de $300.000

Es la **puerta de entrada** y debe verse en todo el sitio: en la portada, en `/planes` y en cada
ficha. Quien no puede pagar un sistema entra por aquí, y quien entra por aquí es el cliente más
probable de un plan mayor dentro de seis meses.

Es viable solo porque sale de una plantilla: 0,75 jornadas equivalen a $400.000 por jornada, un
poco por debajo de la tarifa, y se acepta por su función comercial. Tiene tres límites que no se
negocian, porque sin ellos da pérdida:

1. **Una ronda de ajustes.** A partir de ahí, $60.000 la hora.
2. **El contenido lo entrega el cliente** (textos, fotos, logo) antes de empezar.
3. **La plantilla no se rediseña.** Si quiere diseño propio, es el plan de $900.000.

### 4.2 Módulos adicionales

| Módulo | Precio |
|---|---|
| Diagnóstico de un proyecto a medida (se descuenta si contrata) | $450.000 |
| Recordatorios automáticos por WhatsApp | $900.000 + consumo de mensajes |
| Pasarela de pagos en un plan que no la trae | $900.000 |
| Facturación electrónica con proveedor autorizado | $1.350.000 + suscripción del proveedor |
| Migración de datos desde Excel | desde $450.000 |
| Carga de productos por encima de los incluidos | $3.000 por producto (con foto y texto entregados) |
| Textos redactados para el sitio | $300.000 |
| Segundo idioma | +30 % del plan |
| Hora de cambios fuera de alcance | $60.000 |

---

## 5. Costos para el cliente después de la entrega

Se muestran siempre, en cada ficha y en cada cotización. Esconderlos es lo que genera
desconfianza cuando llega la primera factura.

| Concepto | Costo real 2026 | Quién lo paga |
|---|---|---|
| Dominio `.co` o `.com` | ~$60.000 al año | El cliente, a su nombre |
| Hosting de una página sin panel | $0: Cloudflare Pages permite uso comercial en su plan gratuito | — |
| Hosting de un sistema (servidor + base de datos) | $0 – $90.000 al mes según tráfico. Para un negocio pequeño, normalmente menos de $20.000 | El cliente, en su propia cuenta |
| Correo con el dominio (`ventas@tunegocio.co`) | $0 con reenvío; ~$25.000 por usuario al mes con Google Workspace | El cliente, opcional |
| Pasarela de pagos | 2,65 % + $700 + IVA por venta exitosa (Wompi) | El cliente, descontado de cada venta |
| WhatsApp automático (API) | ~$3 por mensaje de recordatorio; ~$46 por mensaje de promoción; las respuestas a clientes dentro de las 24 h no se cobran | El cliente |
| Facturación electrónica | Suscripción del proveedor que elija | El cliente |

### 5.1 Mantenimiento

| Plan | Mensual | Incluye |
|---|---|---|
| **Sin plan** | $0 | Cambios a $60.000 la hora, mínimo 1 hora. Garantía de 30 días sobre fallas en todos los planes |
| **Esencial** | $90.000 | Renovaciones y copias de seguridad, monitoreo, actualizaciones de seguridad, corrección de fallas y 30 minutos de cambios |
| **Crecimiento** | $250.000 | Lo del esencial más 3 horas de cambios y un reporte mensual de visitas y contactos |

Los costos de terceros (dominio, hosting, pasarela) no están incluidos en el mantenimiento: son
del cliente y quedan a su nombre.

---

## 6. Condiciones comerciales

| Tema | Regla |
|---|---|
| Forma de pago, hasta $2.000.000 | 50 % para empezar, 50 % contra entrega |
| Forma de pago, más de $2.000.000 | 40 % para empezar, 30 % en la entrega intermedia, 30 % al entregar |
| Validez de la cotización | 15 días |
| Rondas de ajustes | Las del plan. Las adicionales, por hora |
| Contenido | Lo entrega el cliente. Si tarda más de 15 días, el proyecto se reprograma |
| Propiedad | El código, el dominio y los datos son del cliente cuando termina de pagar |
| Retención en la fuente | Si el cliente es empresa y retiene, se indica en la cotización. El precio no cambia |
| Descuentos | No se descuenta la tarifa. Se reduce el alcance |

---

## 7. Cuándo NO conviene lo que vendes (y decirlo te da credibilidad)

- **Veterinaria que solo necesita historia clínica y agenda interna:** un SaaS de $50.000 – $90.000 al mes puede salirle más barato durante años. Lo propio conviene cuando quiere su marca, su página pública integrada con la agenda, sus datos sin cobro por usuario o un flujo que el SaaS no tiene. Recomendarle el plan *Página profesional* o *Citas en línea*, integrado con el SaaS que use, también es una venta.
- **Tienda estándar sin nada particular:** Shopify o una tienda de Instagram con catálogo puede bastar al principio. El plan de catálogo gana cuando el cliente quiere su marca y no pagar una comisión por venta a la plataforma.

---

## 8. Cómo se muestra en el sitio

- **Portada:** "Desde **$300.000**", con cifra grande y lo que incluye en una línea. Es el dato más visible después de la promesa.
- **`/planes`:** la tabla de la sección 4 en lenguaje de cliente, con los costos posteriores al lado de cada plan.
- **Cada ficha:** los 2–3 planes que aplican a ese sector, con precio desde, plazo y costo mensual.
- **Formato:** `$ 300.000`, sin decimales ni la palabra "COP" en el texto (la moneda se asume en Colombia). En los datos estructurados, `priceCurrency: "COP"`.
- En el código, **una sola fuente**: `lib/catalogo/planes.ts`. Cambiar un precio es cambiar una línea.

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
