import { Bot, Layers, Server, Smartphone } from "lucide-react"
import type { Servicio } from "@/components/site/service-card"

/**
 * La oferta, escrita para quien decide una contratación.
 *
 * Cada servicio termina en un proyecto real que lo demuestra. Una oferta sin
 * prueba es una promesa; con el caso al lado deja de serlo. Y ninguna cifra
 * aparece aquí si no se puede sostener: todas salen de un repositorio público.
 */
export const SERVICIOS: Servicio[] = [
  {
    id: "web",
    icono: Layers,
    titulo: "Aplicaciones web",
    gancho: "Del modelo de datos al despliegue",
    descripcion:
      "Plataformas completas con su panel de administración, para que el equipo cambie el contenido " +
      "sin llamar al programador. Renderizado en servidor, así que Google indexa lo que hay dentro.",
    incluye: [
      "Next.js y React con TypeScript estricto",
      "Base de datos PostgreSQL y panel propio",
      "Autenticación y control de accesos",
      "SEO técnico, sitemap y datos estructurados",
      "Pruebas automatizadas de cada recorrido",
    ],
    prueba: { texto: "este mismo sitio, con su código público", href: "/trabajo" },
  },
  {
    id: "multiplataforma",
    icono: Smartphone,
    titulo: "Apps multiplataforma",
    gancho: "Un código, tres plataformas",
    descripcion:
      "Flutter para web, Android y escritorio a la vez, con backend propio. Incluye los casos " +
      "incómodos que suelen quedarse fuera del presupuesto: funcionar sin conexión, sincronizar " +
      "entre dispositivos e integrarse con sistemas que ya están en producción.",
    incluye: [
      "Flutter para web, Android y macOS",
      "Modo sin conexión y sincronización",
      "Integración con sistemas existentes",
      "Publicación en tiendas",
    ],
    prueba: { texto: "Calculadora de Gastos", href: "/trabajo/calculadora-de-gastos" },
  },
  {
    id: "automatizacion",
    icono: Bot,
    titulo: "Automatización e IA",
    gancho: "Quitar el paso que hace una persona a mano",
    descripcion:
      "Casi siempre hay alguien haciendo de traductor entre dos sistemas que no se hablan. Ese paso " +
      "se puede quitar. Orquestación, integración de APIs y modelos de lenguaje donde de verdad " +
      "aportan, con las máquinas de estado necesarias para que un fallo a mitad no deje todo roto.",
    incluye: [
      "Orquestación con n8n y flujos propios",
      "Integración de APIs y agentes de IA",
      "Máquinas de estado con reintentos",
      "Un paso de aprobación humana donde hace falta",
    ],
    prueba: { texto: "Tecnobichos", href: "/trabajo/tecnobichos" },
  },
  {
    id: "infraestructura",
    icono: Server,
    titulo: "Infraestructura y costos",
    gancho: "Elegir arquitectura mirando la factura",
    descripcion:
      "La conversación sobre arquitectura empieza casi siempre por el rendimiento y casi nunca por " +
      "el costo, que es lo que decide si un proyecto sigue vivo en un año. Serverless, " +
      "infraestructura como código y despliegue continuo, con el desglose de gastos por escrito.",
    incluye: [
      "AWS Lambda, contenedores o serverless",
      "Infraestructura como código con Terraform",
      "Despliegue continuo con GitHub Actions",
      "Copias de seguridad verificadas, no solo programadas",
      "Desglose de costos antes de decidir",
    ],
    prueba: { texto: "una app que opera por 0,01 USD al mes", href: "/trabajo/calculadora-de-gastos" },
  },
]

/** Las cuatro etapas de un encargo. Sirve para fijar expectativas antes de empezar. */
export const PROCESO = [
  {
    titulo: "Conversación",
    duracion: "Sin costo",
    detalle:
      "Media hora para entender qué problema hay que resolver. Si no soy la persona indicada, te lo digo ahí mismo y te ahorro el presupuesto.",
  },
  {
    titulo: "Propuesta con alcance y precio",
    duracion: "2 a 3 días",
    detalle:
      "Qué entra, qué no entra, cuánto cuesta y cuánto tarda. Por escrito y cerrado. Si algo cambia después, se habla antes de tocarlo.",
  },
  {
    titulo: "Construcción con entregas parciales",
    duracion: "Según alcance",
    detalle:
      "Ves avances funcionando desde la primera semana, no una presentación al final. Cada entrega se despliega en un enlace que puedes abrir y probar.",
  },
  {
    titulo: "Entrega y traspaso",
    duracion: "Incluido",
    detalle:
      "El código queda en tu repositorio, la documentación explica cómo operarlo y te enseño a hacerlo. Sin dependencia de mí para el día a día.",
  },
]
