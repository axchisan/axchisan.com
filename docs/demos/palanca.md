# Brief de demo: Palanca, entrenamiento funcional

Primera demo del motor de clases (`demos/motores/clases/`): horario semanal que se repite, sesiones
con cupo, reservas, lista de espera y membresías con vencimiento. Es distinto del motor de agenda,
donde una cita ocupa a un profesional: aquí muchas personas comparten la misma hora hasta llenarla.
Sirve igual para estudios de yoga o pilates, academias de baile o escuelas de natación.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** centro de entrenamiento funcional en San Fernando, Cali, con clases de
  máximo 12 personas y cuatro coaches. Se comprobó que no existe un gimnasio "Palanca".
- **Quién usa la página:** socios que reservan desde el celular, y gente que quiere probar.
- **Quién usa el panel:** recepción (socios, renovaciones) y los coaches (asistencia).
- **Quién juzga la demo:** dueños de gimnasios pequeños, boxes y estudios.

## Niveles

| Nivel | Plan | Qué se ve |
|---|---|---|
| Página | Presencia, Página profesional | Clases, horario, planes y coaches; reserva por WhatsApp |
| Página + reservas | Citas en línea | Reservas con cupo y lista de espera, clase gratis, mis clases, asistencia |
| Sistema del gimnasio | Sistema de gestión, Sistema completo | Socios, vencimientos, renovaciones con pago y resumen de ocupación |

## Decisiones de diseño

- Se descartó el negro con verde neón de todos los gimnasios. Tiza y hierro de base, y los colores
  de los discos olímpicos (rojo, azul, amarillo y verde) solo para distinguir los tipos de clase.
  El rojo del disco de 25 kg es la marca.
- **Anybody** ensanchada para títulos, como la letra de las camisetas de competencia; **Public
  Sans** para leer.
- El mapa de ocupación evita los tonos entre 53 % y 61 %, donde ni el texto claro ni el oscuro
  alcanzan contraste AA.

## Lo que la hace creíble

- Cupos distintos por tipo de clase y lista de espera en orden de llegada: al cancelar, sube el
  primero de la lista.
- Cancelar solo hasta dos horas antes.
- La tiquetera descuenta una clase con cada asistencia, y la devuelve si se corrige.
- Renovar antes de tiempo suma los días desde el vencimiento, no desde hoy.
- La clase de las 6:30 p. m. de los próximos días siempre está llena en los datos de ejemplo, para
  que se vea la lista de espera.
