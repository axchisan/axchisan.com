# Brief de demo: Nomenclatura, finca raíz

Primera demo del motor de listados (`demos/motores/listados/`): fichas con filtros que viven en la
dirección de la página, orden y simulador de crédito. Las visitas usan el motor de agenda con la
disponibilidad de cada asesor. El mismo motor sirve para un concesionario de usados o un directorio
de fincas para alquilar.

## Sujeto, audiencia, trabajo

- **Negocio (ficticio):** inmobiliaria del sur del Valle de Aburrá (Laureles, El Poblado, Envigado,
  Sabaneta, Belén y El Retiro), con tres asesores. "Nomenclatura" es como se llama la dirección de
  un inmueble en Colombia; se comprobó que no existe una inmobiliaria así. "Zaguán" y "Alféizar" sí.
- **Quién usa la página:** quien busca comprar o arrendar, casi siempre desde el celular y después de
  haber visto el inmueble en un portal.
- **Quién usa el panel:** la gerente (inmuebles) y los asesores (interesados y visitas).

## Niveles

| Nivel | Plan | Qué se ve |
|---|---|---|
| Página con inmuebles | Página profesional | Buscador, listado, mapa, ficha con simulador; contacto por WhatsApp |
| Sitio con panel | Sitio con panel | Panel para cambiar precio, estado y destacados; formulario de interés |
| Sistema de la inmobiliaria | Sistema de gestión, Sistema completo | Visita agendada en línea, interesados por etapa, agenda de visitas por asesor |

## Decisiones de diseño

- El ladrillo de los edificios de Medellín aparece en la foto de portada y en los pines del mapa, no
  como color de toda la página: el terracota sobre crema es el cliché de cualquier sitio "cálido".
  La marca es azul petróleo.
- Mapa esquemático propio en lugar de Google Maps: no muestra la dirección exacta antes de la visita
  (así trabajan las inmobiliarias) y no tiene costo por uso. El río va de sur a norte entre las
  zonas del occidente y las del oriente, como en el valle.
- La marca es la placa de nomenclatura de una casa, con su «#».
- Schibsted Grotesk en todo.

## Lo que la hace creíble

- Datos que deciden una visita: área, estrato, administración, parqueaderos, piso y antigüedad.
- Simulador con tasa efectiva anual, que es como la publican los bancos, y los ingresos que pide el
  banco (la cuota hasta el 30 % de los ingresos).
- En arriendo, lo que realmente se pide en Medellín: póliza o fiador con finca raíz, ingresos de tres
  veces el total y contrato a doce meses.
- Un inmueble reservado, vendido o arrendado deja de ofrecer visitas.
- Visitas en la agenda del asesor de la zona, con dos horas de margen.
