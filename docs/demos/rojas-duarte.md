# Brief de demo: Rojas & Duarte, abogados y contadores

Primera demo del motor de presencia (`demos/motores/presencia/`). Es la del
nivel **navegable**: todas las páginas, enlaces y formularios funcionan con validación, y el envío
se simula. No tiene panel porque lo que vende es la página profesional, no un sistema.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** firma de abogados y contadores en Chapinero, Bogotá, desde 2008. Tres
  personas: una abogada socia (laboral y familia), un contador socio (impuestos) y un abogado
  asociado (empresas). Se buscó el nombre antes de usarlo: hay firmas "Rojas & Ortega" y otras con
  uno de los dos apellidos, ninguna "Rojas & Duarte".
- **Quién usa la página:** personas con un despido, un divorcio, una sucesión o una declaración de
  renta, y dueños de pequeñas empresas. Casi todos llegan buscando en Google o por una recomendación
  que quieren comprobar.
- **El trabajo de la página:** que confíen antes de la primera llamada, que lleguen con los
  documentos y que la consulta le llegue a la firma ordenada.

## Niveles

| Nivel | Plan | Qué se ve |
|---|---|---|
| Página de presencia | Presencia | La portada completa: áreas, equipo, preguntas, horario, mapa. El contacto es por WhatsApp |
| Página profesional | Página profesional | Una página por área, las dos calculadoras y el formulario de consulta con radicado |

El botón principal cambia con el nivel: en la presencia abre WhatsApp, en la profesional lleva al
formulario. Así se ve de un vistazo qué agrega el segundo plan.

## Decisiones de diseño

- Es la única demo con una **serif** en los títulos (Newsreader), porque en un despacho la
  autoridad la da la letra, no el color. El texto va en **Instrument Sans**.
- Papel casi blanco, tinta y un vino sobrio como único acento. Nada de azul corporativo ni dorado.
- La composición es editorial, distinta a las demás: titular a la izquierda con la foto en vertical,
  una franja de tres datos que deciden (años, valor de la primera consulta, tiempo de respuesta) y
  las áreas como un índice numerado, no como tarjetas.
- El ampersand en cursiva y en vino hace de logo. No hay isotipo.
- El plano de Chapinero está orientado como lo lee un bogotano: norte arriba, la Caracas a la
  izquierda y la Séptima a la derecha, porque las carreras crecen hacia el occidente.

## Lo que la hace creíble

- **Honorarios de referencia** en cada área y el valor de la primera consulta arriba: es lo primero
  que pregunta la gente y lo que menos publican las firmas.
- **Qué traer a la consulta**, como lista que se marca en el celular y se imprime.
- **Calculadora de liquidación** (`laboral.ts`): cesantías e intereses del año en curso, prima del
  semestre, vacaciones desde el último aniversario y la indemnización del artículo 64 del Código
  Sustantivo del Trabajo. Cuenta en días de 360, como se hace en nómina, con el salario mínimo
  ($ 1.750.905) y el auxilio de transporte ($ 249.095) de 2026, decretos 1469 y 1470 de 2025.
- **¿Tengo que declarar renta?** (`renta.ts`): los cinco topes del año gravable 2025 en UVT de 2025
  ($ 49.799). El de ingresos obliga desde el tope mismo; los demás, cuando lo superan.
- **Formulario de consulta** con celular colombiano (acepta +57, espacios y guiones), resumen de
  errores con enlaces a cada campo, autorización de la Ley 1581 de 2012 y número de radicado. Al
  enviar muestra el correo tal como le llega a la firma, asignado a quien atiende esa área.
- "Abierto ahora" con la hora del visitante.

## Mantenimiento

Las cifras legales viven en `laboral.ts` y `renta.ts`. Cada enero cambian el salario mínimo, el
auxilio de transporte y la UVT; la calculadora de liquidación solo acepta retiros del año de sus
cifras para no dar un resultado con valores viejos.

## Pruebas

`e2e/demo-rojas-duarte.spec.ts`: horario abierto y cerrado con el reloj fijo, lista de documentos,
liquidación con y sin indemnización contra un caso calculado a mano, topes de renta en el límite,
validación y envío de la consulta, el cambio de botón por nivel, WCAG AA con errores y resultados a
la vista, y 360 px sin desplazamiento lateral.
