import { PLANES, pesos } from "./planes"

/**
 * Lo que pregunta casi todo el que va a contratar. Se muestran en la portada y
 * en planes, y se publican como FAQPage para buscadores.
 */
export const PREGUNTAS_GENERALES = [
  {
    p: "¿Cuánto cuesta una página para mi negocio?",
    r: `Desde ${pesos(PLANES.presencia.desde)} una página con tus servicios, horario, ubicación y botón de WhatsApp, lista en ${PLANES.presencia.entrega}. Con diseño propio y más secciones, desde ${pesos(PLANES["pagina-profesional"].desde)}. Todos los precios están en la página de planes.`,
  },
  {
    p: "¿Qué tengo que pagar cada mes después?",
    r: "El dominio ronda $ 60.000 al año. Una página sin panel se aloja gratis. Un sistema con base de datos, para un negocio pequeño, suele costar menos de $ 20.000 al mes. El mantenimiento es opcional, desde $ 90.000 al mes.",
  },
  {
    p: "¿Puedo cambiar precios y fotos yo mismo?",
    r: "Sí, desde el plan Sitio con panel. En la página básica los cambios los hacemos nosotros, a $ 60.000 la hora.",
  },
  {
    p: "¿De quién es la página cuando termina?",
    r: "Tuya. El dominio, el código y los datos quedan a tu nombre cuando terminas de pagar. No dependes de Axchi para seguir funcionando.",
  },
  {
    p: "¿Cómo se paga?",
    r: "Hasta $ 2.000.000, la mitad para empezar y la otra mitad al entregar. En proyectos más grandes, 40 % al empezar, 30 % en la entrega intermedia y 30 % al final. Transferencia, Nequi o Daviplata.",
  },
  {
    p: "¿Y si lo que necesito ya lo resuelve otra herramienta?",
    r: "Te lo decimos. Si una tienda de Instagram o un programa por suscripción te sirve mejor, sale más barato recomendártelo que construirte algo que no necesitas.",
  },
]
