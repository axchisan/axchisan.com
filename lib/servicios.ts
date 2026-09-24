import { Bot, Layers, Server, Smartphone } from "lucide-react"
import type { Servicio } from "@/components/site/service-card"

/**
 * Desarrollo a medida, para empresas con un proyecto que no encaja en un plan
 * del catálogo. Se muestra en /a-medida; la oferta principal para negocios
 * está en lib/catalogo.
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
  },
]

/** Las cuatro etapas de un encargo, contadas desde el lado del cliente. */
export const PROCESO = [
  {
    titulo: "Nos cuentas qué necesitas",
    duracion: "Sin costo",
    detalle:
      "Por WhatsApp o en una llamada corta. Si ya viste una demo parecida a lo que buscas, empezamos por ahí.",
  },
  {
    titulo: "Recibes la propuesta por escrito",
    duracion: "1 a 3 días",
    detalle:
      "Qué entra, qué no, cuánto cuesta, cuánto tarda y cuánto cuesta mantenerlo al mes. El precio queda cerrado antes de empezar.",
  },
  {
    titulo: "Pruebas los avances",
    duracion: "Según el plan",
    detalle:
      "Cada entrega queda en un enlace que abres desde el celular. Los ajustes se hacen sobre algo que ya funciona, no sobre un dibujo.",
  },
  {
    titulo: "Es tuyo y sabes usarlo",
    duracion: "Incluido",
    detalle:
      "Dominio, código y datos a tu nombre, una capacitación para tu equipo y 30 días de garantía sobre cualquier falla.",
  },
]
