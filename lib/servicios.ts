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
      "Plataformas web con API, base de datos, panel de administración, autenticación y despliegue. " +
      "La implementación incorpora renderizado en servidor, indexación y pruebas automatizadas.",
    incluye: [
      "Next.js y React con TypeScript estricto",
      "Base de datos PostgreSQL y panel propio",
      "Autenticación y control de accesos",
      "SEO técnico, sitemap y datos estructurados",
      "Pruebas automatizadas de cada recorrido",
    ],
    prueba: { texto: "Ver proyectos web", href: "/trabajo" },
  },
  {
    id: "multiplataforma",
    icono: Smartphone,
    titulo: "Apps multiplataforma",
    gancho: "Un código, tres plataformas",
    descripcion:
      "Aplicaciones Flutter para web, Android y escritorio con backend propio. El alcance puede incluir " +
      "uso sin conexión, sincronización entre dispositivos e integración con sistemas existentes.",
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
    gancho: "Integrar sistemas y reducir tareas repetitivas",
    descripcion:
      "Orquestación de procesos, integración de APIs y uso de modelos de lenguaje cuando son adecuados " +
      "para el flujo. Los procesos se diseñan con estados, trazabilidad, reintentos y puntos de revisión.",
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
    gancho: "Arquitectura con criterios de operación y costo",
    descripcion:
      "Diseño de infraestructura serverless, automatización de despliegues e infraestructura como código. " +
      "Las decisiones consideran rendimiento, mantenibilidad, seguridad y costos operativos.",
    incluye: [
      "AWS Lambda, contenedores o serverless",
      "Infraestructura como código con Terraform",
      "Despliegue continuo con GitHub Actions",
      "Copias de seguridad verificadas, no solo programadas",
      "Desglose de costos antes de decidir",
    ],
    prueba: { texto: "Ver caso de estudio", href: "/trabajo/calculadora-de-gastos" },
  },
]

/** Las cuatro etapas de un encargo. Sirve para fijar expectativas antes de empezar. */
export const PROCESO = [
  {
    titulo: "Conversación",
    duracion: "Sin costo",
    detalle:
      "Revisión inicial del problema, los objetivos, las restricciones y la información técnica disponible.",
  },
  {
    titulo: "Propuesta con alcance y precio",
    duracion: "2 a 3 días",
    detalle:
      "Definición documentada de alcance, entregables, estimación y supuestos técnicos antes de iniciar la implementación.",
  },
  {
    titulo: "Construcción con entregas parciales",
    duracion: "Según alcance",
    detalle:
      "Entregas incrementales en entornos verificables para revisar funcionalidad, resolver dudas y ajustar el alcance de forma controlada.",
  },
  {
    titulo: "Entrega y traspaso",
    duracion: "Incluido",
    detalle:
      "Entrega de código, documentación operativa y acceso a los recursos necesarios para continuar la evolución del sistema.",
  },
]
