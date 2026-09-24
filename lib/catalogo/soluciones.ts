/**
 * Catálogo de soluciones: una ficha por sector. Vive en código, no en la base,
 * porque cada ficha describe una demo que también vive en código: van juntas en
 * el mismo commit. Plantilla y razones en REESTRUCTURACION.md §4.3.
 */
import type { PlanId } from "./planes"

export type Muestra =
  | {
      tipo: "demo"
      /** Ruta de la demo dentro del sitio. */
      href: string
      nombre: string
      nota: string
    }
  | {
      tipo: "real"
      /** Sitio en producción de un cliente o proyecto real. */
      href: string
      nombre: string
      nota: string
    }

export type Captura = { src: string; alt: string; ancho: number; alto: number }

export type Solucion = {
  slug: string
  /** Nombre corto del sector: "Veterinarias". */
  sector: string
  /** Clave del icono del sector en `sectores.ts`. */
  icono: string
  /** H1 de la ficha. */
  titulo: string
  resumen: string
  seo: { title: string; description: string }
  muestra: Muestra
  capturas: { escritorio: Captura; movil: Captura }
  sintomas: string[]
  resultados: { titulo: string; texto: string }[]
  diaADia: { titulo: string; texto: string; captura?: Captura }[]
  incluye: string[]
  noIncluye: string[]
  planes: PlanId[]
  preguntas: { p: string; r: string }[]
  tecnico: string[]
}

const cap = (src: string, alt: string, movil = false): Captura => ({
  src,
  alt,
  ancho: movil ? 780 : 1440,
  alto: movil ? 1688 : 900,
})

export const SOLUCIONES: Solucion[] = [
  {
    slug: "veterinarias",
    sector: "Veterinarias",
    icono: "veterinarias",
    titulo: "Página, citas en línea y sistema clínico para veterinarias",
    resumen:
      "Tus clientes agendan desde el celular, tu equipo ve la agenda del día y cada mascota tiene su historia clínica y su carnet de vacunas.",
    seo: {
      title: "Página web y software para veterinarias en Bogotá",
      description:
        "Página web, citas en línea, historia clínica y recordatorios de vacunas para veterinarias. Pruébalo en una demo funcionando. Desde $ 300.000.",
    },
    muestra: {
      tipo: "demo",
      href: "/demo/canela",
      nombre: "Canela, clínica veterinaria",
      nota: "Clínica ficticia con página, reserva de citas y panel clínico funcionando.",
    },
    capturas: {
      escritorio: cap("/capturas/canela-portada-escritorio.webp", "Portada de la demo de Canela en un computador"),
      movil: cap("/capturas/canela-portada-movil.webp", "Portada de la demo de Canela en un celular", true),
    },
    sintomas: [
      "Las citas llegan por WhatsApp y se cuadran a mano, entre mensaje y mensaje.",
      "La historia clínica está en carpetas o en un Excel que solo entiende quien lo hizo.",
      "Nadie avisa cuándo le toca la vacuna a cada mascota, y el cliente vuelve cuando se acuerda.",
    ],
    resultados: [
      {
        titulo: "Tus clientes agendan solos",
        texto:
          "Eligen servicio, veterinario y una hora libre desde el celular. Tú ves la agenda del día sin contestar un solo mensaje.",
      },
      {
        titulo: "La historia completa en un clic",
        texto:
          "Consultas, peso, alergias, vacunas y fórmulas de cada paciente, desde cualquier computador de la clínica.",
      },
      {
        titulo: "Clientes que vuelven",
        texto:
          "La lista de vacunas por vencer se arma sola cada mañana, y el recordatorio sale por WhatsApp con un toque.",
      },
    ],
    diaADia: [
      {
        titulo: "El cliente agenda",
        texto: "Desde la página elige servicio, mascota y hora. Si ya es cliente, lo reconoce por el teléfono.",
        captura: cap("/capturas/canela-agendar-movil.webp", "Reserva de cita en el celular", true),
      },
      {
        titulo: "Recepción ve el día",
        texto: "Las citas de hoy con su estado: quién llegó, quién está en consulta y quién no vino.",
        captura: cap("/capturas/canela-panel-escritorio.webp", "Agenda del día en el panel de la clínica"),
      },
      {
        titulo: "El veterinario atiende",
        texto: "Abre la ficha, ve las alertas antes de empezar, registra la consulta e imprime la fórmula.",
        captura: cap("/capturas/canela-ficha-escritorio.webp", "Ficha clínica de una mascota"),
      },
      {
        titulo: "Nadie se queda sin vacuna",
        texto: "Cada mañana aparecen las vacunas por vencer, con el mensaje para el propietario ya escrito.",
        captura: cap("/capturas/canela-recordatorios-escritorio.webp", "Lista de recordatorios de vacunas"),
      },
    ],
    incluye: [
      "Página con servicios, precios de referencia, equipo, horario y mapa",
      "Reserva en línea con las horas reales de cada profesional",
      "Agenda del día y de la semana, con el origen de cada cita",
      "Historia clínica, carnet de vacunas y curva de peso por mascota",
      "Fórmula médica imprimible con los datos de la clínica",
      "Recordatorios de vacunas con el mensaje de WhatsApp listo",
      "Usuarios para recepción y para veterinarios, cada uno con sus permisos",
      "Capacitación y 30 días de garantía sobre fallas",
    ],
    noIncluye: [
      "Facturación electrónica (módulo aparte, con proveedor autorizado)",
      "Inventario de farmacia y hospitalización",
      "Recordatorios que salen solos, sin que nadie los envíe (vienen en el sistema completo)",
      "Fotografía profesional de la clínica",
    ],
    planes: ["presencia", "pagina-profesional", "citas-en-linea", "sistema-de-gestion", "sistema-completo"],
    preguntas: [
      {
        p: "¿Puedo empezar solo con la página?",
        r: "Sí. La página cuesta desde $ 300.000, o $ 39.900 al mes, y se construye de forma que después se le agreguen las citas o el sistema sin rehacer nada.",
      },
      {
        p: "Ya uso un software veterinario. ¿Tengo que cambiarlo?",
        r: "No necesariamente. Si tu historia clínica ya vive en un programa por suscripción que te funciona, puede convenirte más una página con citas en línea y seguir con él. Te lo decimos con números antes de cotizar.",
      },
      {
        p: "¿Cuánto cuesta mantenerlo en línea?",
        r: "El dominio ronda $ 60.000 al año. Una página sin panel se aloja gratis. Un sistema con base de datos, para una clínica pequeña, suele costar menos de $ 20.000 al mes. Todo queda a tu nombre.",
      },
      {
        p: "¿De quién son los datos de mis pacientes?",
        r: "Tuyos. La base de datos, el dominio y el código quedan a nombre de la clínica cuando terminas de pagar, con copias de seguridad automáticas.",
      },
      {
        p: "¿Cuánto tarda?",
        r: "La página, entre 3 días hábiles y 2 semanas según el plan. Las citas en línea, de 2 a 3 semanas. El sistema, de 4 a 6 semanas, con entregas parciales que puedes probar desde la primera.",
      },
    ],
    tecnico: [
      "Next.js y React, con renderizado en servidor para que Google lea la página",
      "Base de datos PostgreSQL con copias de seguridad automáticas cifradas",
      "Usuarios con roles y permisos por pantalla",
      "Funciona en computador, tablet y celular; instalable como app",
      "Accesibilidad WCAG AA verificada en cada pantalla",
    ],
  },
  {
    slug: "salones-y-barberias",
    sector: "Salones y barberías",
    icono: "salones",
    titulo: "Reservas en línea, caja y clientes para salones de belleza y barberías",
    resumen:
      "Tus clientes reservan con su estilista desde Instagram, la caja cuadra sola con las comisiones de cada quien y sabes qué clientes dejaron de venir.",
    seo: {
      title: "Página web y sistema de reservas para salones de belleza y barberías",
      description:
        "Reservas en línea por estilista, caja con comisiones, fórmulas de color y clientes que no vuelven. Pruébalo en una demo funcionando. Desde $ 300.000 o $ 39.900 al mes.",
    },
    muestra: {
      tipo: "demo",
      href: "/demo/peine-fino",
      nombre: "Peine Fino, salón y barbería",
      nota: "Salón ficticio con página, reservas de varios servicios y panel de caja y clientes funcionando.",
    },
    capturas: {
      escritorio: cap("/capturas/peine-fino-portada-escritorio.webp", "Portada de la demo de Peine Fino en un computador"),
      movil: cap("/capturas/peine-fino-portada-movil.webp", "Portada de la demo de Peine Fino en un celular", true),
    },
    sintomas: [
      "La mitad del día se va contestando por WhatsApp «¿tienes hora hoy?».",
      "Al cerrar, cuadrar la caja y las comisiones es una hora con la calculadora y alguna discusión.",
      "Clientes fijos dejan de venir y nadie se da cuenta hasta meses después.",
    ],
    resultados: [
      {
        titulo: "Reservan solos, con su estilista",
        texto: "Eligen uno o varios servicios, la persona y una hora donde todo cabe. Tú no contestas un mensaje para cuadrar la cita.",
      },
      {
        titulo: "La caja cuadra sola",
        texto: "Cobro por Nequi, Daviplata, efectivo o tarjeta, con la propina aparte y la comisión de cada profesional calculada.",
      },
      {
        titulo: "Clientes que vuelven",
        texto: "La lista de quienes no vienen hace más de 45 días se arma sola, ordenada por lo que gastaban, con el mensaje listo.",
      },
    ],
    diaADia: [
      {
        titulo: "El cliente reserva",
        texto: "Desde el enlace de Instagram elige corte y barba, a su barbero y una hora libre. Termina en un minuto.",
        captura: cap("/capturas/peine-fino-reservar-movil.webp", "Reserva de varios servicios en el celular", true),
      },
      {
        titulo: "El día, silla por silla",
        texto: "Una columna por profesional: quién está ocupado, quién tiene hueco y a qué hora termina cada uno.",
        captura: cap("/capturas/peine-fino-hoy-escritorio.webp", "Agenda del día por profesional"),
      },
      {
        titulo: "Se cobra y se reparte",
        texto: "Al terminar, el servicio pasa a la caja. El cierre del día y las comisiones salen sin hacer cuentas.",
        captura: cap("/capturas/peine-fino-caja-escritorio.webp", "Caja del día con comisiones"),
      },
      {
        titulo: "Nadie se pierde",
        texto: "Cada semana aparecen los clientes que dejaron de venir, con un mensaje personal listo para enviar.",
        captura: cap("/capturas/peine-fino-volver-escritorio.webp", "Lista de clientes que no vuelven"),
      },
    ],
    incluye: [
      "Página con la carta de servicios, precios, equipo con sus trabajos, horario y mapa",
      "Reservas en línea de uno o varios servicios, con la persona que elija el cliente",
      "Agenda del día por profesional, con los estados de cada cita",
      "Caja con medios de pago, propinas, descuentos y cierre del día",
      "Comisiones por profesional según su porcentaje",
      "Ficha de cada cliente con sus visitas y sus fórmulas de color",
      "Lista de clientes que no vuelven, con el mensaje de WhatsApp listo",
      "Capacitación y 30 días de garantía sobre fallas",
    ],
    noIncluye: [
      "Pago anticipado de la reserva (viene en el sistema completo)",
      "Mensajes automáticos sin que nadie los envíe (vienen en el sistema completo)",
      "Venta de productos con inventario",
      "Fotografía de los trabajos",
    ],
    planes: ["presencia", "pagina-profesional", "citas-en-linea", "sistema-de-gestion", "sistema-completo"],
    preguntas: [
      {
        p: "¿Puedo empezar solo con la página y las reservas?",
        r: "Sí. Las reservas en línea cuestan desde $ 1.400.000 o $ 79.900 al mes. La caja y los clientes se agregan después, sin rehacer nada.",
      },
      {
        p: "Ya uso una agenda por suscripción. ¿Por qué cambiar?",
        r: "Quizá no te convenga, y te lo decimos. Lo propio gana cuando quieres tu marca completa, no pagar por cada profesional y que la caja y las comisiones funcionen como en tu salón, no como decidió la aplicación.",
      },
      {
        p: "¿Cómo se calculan las comisiones?",
        r: "Cada profesional tiene su porcentaje. Se aplica sobre lo que de verdad se cobró, después de descuentos, y la propina le llega completa.",
      },
      {
        p: "¿Mis clientes tienen que instalar algo?",
        r: "No. Reservan desde el navegador del celular, con el enlace de tu Instagram o de tu perfil de WhatsApp Business.",
      },
    ],
    tecnico: [
      "Motor de agenda compartido con las demás soluciones de reservas, ya probado",
      "Next.js con renderizado en servidor para que Google lea la página",
      "Base de datos PostgreSQL con copias de seguridad automáticas cifradas",
      "Funciona en computador, tablet y celular; instalable como app",
    ],
  },
  {
    slug: "tiendas-de-cosmeticos",
    sector: "Cosméticos y cuidado personal",
    icono: "cosmeticos",
    titulo: "Tienda en línea para marcas de cosméticos y cuidado personal",
    resumen:
      "Un catálogo que vende por sí solo: fichas con ingredientes y beneficios, combos, carrito y pedidos que te llegan completos por WhatsApp.",
    seo: {
      title: "Tienda en línea para cosméticos y jabones artesanales",
      description:
        "Catálogo con carrito y pedidos por WhatsApp para marcas de cosméticos, con panel para manejar productos, pedidos y ventas. Ejemplo real en producción.",
    },
    muestra: {
      tipo: "real",
      href: "https://jabonesmari.shop",
      nombre: "Jabones Mari",
      nota: "Tienda real de jabones artesanales en Bogotá, en funcionamiento.",
    },
    capturas: {
      escritorio: cap("/capturas/jabones-mari-portada-escritorio.webp", "Portada de la tienda Jabones Mari en un computador"),
      movil: cap("/capturas/jabones-mari-portada-movil.webp", "Portada de la tienda Jabones Mari en un celular", true),
    },
    sintomas: [
      "Cuando alguien pregunta «¿qué productos tienes?», no hay a dónde mandarlo.",
      "Cada pedido es una conversación larga: precios, cantidades, dirección, total.",
      "Las fotos caseras hacen que un producto bueno parezca barato.",
    ],
    resultados: [
      {
        titulo: "Una vitrina que atiende sola",
        texto: "Catálogo con filtros, fichas con ingredientes, beneficios y modo de uso, y combos que suben el valor de cada pedido.",
      },
      {
        titulo: "El pedido llega armado",
        texto: "El cliente llena el carrito y sus datos; a ti te llega a WhatsApp con productos, total y dirección, y queda guardado.",
      },
      {
        titulo: "Tú manejas el catálogo",
        texto: "Cambias precios, subes fotos y marcas productos agotados desde el celular, sin llamar a nadie.",
      },
    ],
    diaADia: [
      {
        titulo: "El cliente arma su pedido",
        texto: "Recorre el catálogo, lee la ficha de cada producto y va llenando el carrito, que se conserva aunque cierre el navegador.",
      },
      {
        titulo: "Te llega por WhatsApp",
        texto: "Con nombre, dirección, productos y total. Solo confirmas y coordinas la entrega.",
      },
      {
        titulo: "Llevas el control",
        texto: "El panel guarda cada pedido y muestra las ventas, para que nada dependa de buscar entre chats.",
      },
    ],
    incluye: [
      "Portada con la historia de la marca",
      "Catálogo con filtros y fichas de producto completas",
      "Combos y carrito que se conserva",
      "Pedido que llega armado por WhatsApp y queda registrado",
      "Cuentas de cliente con su historial",
      "Panel de productos, pedidos, ventas y equipo",
      "Instalable como app en el celular",
      "Posicionamiento en Google para búsquedas locales",
    ],
    noIncluye: [
      "Cobro en línea (se agrega con el plan Tienda con pagos)",
      "Envíos nacionales con transportadora integrada",
      "Fotografía de producto (te orientamos con cómo hacerla o generarla)",
    ],
    planes: ["catalogo-whatsapp", "tienda-con-pagos"],
    preguntas: [
      {
        p: "¿Necesito pasarela de pagos desde el principio?",
        r: "No. Muchas marcas empiezan cerrando el pedido por WhatsApp y cobrando por Nequi o transferencia. La pasarela se agrega cuando el volumen lo justifica, sin rehacer la tienda.",
      },
      {
        p: "¿Por qué no usar Shopify o una tienda de Instagram?",
        r: "Pueden bastar al principio, y si es tu caso te lo decimos. Una tienda propia gana cuando quieres tu marca completa, no pagar una mensualidad ni una comisión por venta a la plataforma y que los datos de tus clientes sean tuyos.",
      },
      {
        p: "¿Cuánto cuesta mantenerla?",
        r: "El dominio ronda $ 60.000 al año. La tienda de Jabones Mari opera sin costo de hosting en su plan gratuito. Si agregas pagos, la pasarela cobra un porcentaje por venta.",
      },
    ],
    tecnico: [
      "Next.js con renderizado en servidor y datos estructurados de producto",
      "Base de datos PostgreSQL y fotos en almacenamiento en la nube",
      "Aplicación web instalable (PWA) para clientes y para el panel",
      "Inicio de sesión con Google para las cuentas de cliente",
    ],
  },
]

export function solucion(slug: string) {
  return SOLUCIONES.find((s) => s.slug === slug)
}
