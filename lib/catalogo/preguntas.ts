import { MENSUAL_ENTRADA, PERMANENCIA_MESES, PLANES, TECHO, pesos } from "./planes"

/**
 * Lo que pregunta casi todo el que va a contratar. Se muestran en la portada y
 * en planes, y se publican como FAQPage para buscadores.
 */
export const PREGUNTAS_GENERALES = [
  {
    p: "¿Cuánto cuesta una página para mi negocio?",
    r: `Desde ${pesos(PLANES.presencia.desde)} una página con tus servicios, horario, ubicación y botón de WhatsApp, lista en ${PLANES.presencia.entrega}. Con diseño propio y más secciones, desde ${pesos(PLANES["pagina-profesional"].desde)}. Ningún plan pasa de ${pesos(TECHO)}, y ese ya incluye pagos en línea y automatizaciones.`,
  },
  {
    p: "¿Puedo pagar por mes en lugar de todo de una vez?",
    r: `Sí. Con la suscripción no hay pago inicial: desde ${pesos(MENSUAL_ENTRADA)} al mes tienes tu página con dominio, alojamiento y soporte incluidos. La permanencia mínima es de ${PERMANENCIA_MESES} meses, y si después quieres quedarte con todo, se abona la mitad de lo que ya pagaste.`,
  },
  {
    p: "¿Qué tengo que pagar cada mes después?",
    r: "Con pago único, el dominio ronda $ 60.000 al año, una página sin panel se aloja gratis y un sistema con base de datos, para un negocio pequeño, suele costar menos de $ 20.000 al mes. El mantenimiento es opcional, desde $ 40.000 al mes. Con suscripción, todo eso ya está incluido.",
  },
  {
    p: "¿Puedo cambiar precios y fotos yo mismo?",
    r: "Sí, desde el plan Sitio con panel. En la página básica los cambios los hacemos nosotros, a $ 40.000 la hora.",
  },
  {
    p: "¿De quién es la página cuando termina?",
    r: "Con pago único, todo: dominio, código y datos quedan a tu nombre cuando terminas de pagar. Con suscripción, el dominio y los datos son tuyos siempre y puedes llevártelos cuando quieras; el código se usa mientras dure la suscripción.",
  },
  {
    p: "¿Cómo se paga?",
    r: "Hasta $ 1.000.000, la mitad para empezar y la otra mitad al entregar. Por encima, 40 % al empezar, 30 % en la entrega intermedia y 30 % al final. Las suscripciones se pagan mes anticipado. Transferencia, Nequi o Daviplata.",
  },
  {
    p: "¿Y si lo que necesito ya lo resuelve otra herramienta?",
    r: "Te lo decimos. Si una tienda de Instagram o un programa por suscripción te sirve mejor, sale más barato recomendártelo que construirte algo que no necesitas.",
  },
]
