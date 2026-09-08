import { config as loadEnv } from "dotenv"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

loadEnv({ path: ".env.local" })
loadEnv({ path: ".env" })

/**
 * Contenido real del portafolio.
 *
 * La base de datos anterior se perdió con el VPS y no había copia. Estos
 * proyectos se reconstruyeron leyendo los repositorios de github.com/axchisan:
 * cada cifra sale de su README o de su código, ninguna está inventada.
 *
 * Es idempotente: se puede volver a ejecutar sin duplicar nada. Solo crea; si
 * el proyecto ya existe no lo pisa, para no borrar ediciones hechas desde el
 * panel.
 */

let prisma: PrismaClient

const PROYECTOS = [
  {
    title: "Tecnobichos",
    category: "Automatización",
    shortDesc:
      "Un canal de YouTube e Instagram que se produce y se publica solo. Queda un único paso manual: aprobar por WhatsApp.",
    description:
      "Sistema de producción de contenido en video de punta a punta. Descubre temas, escribe el guion, " +
      "genera las imágenes, sintetiza la voz, monta el video y lo publica en YouTube e Instagram sin " +
      "intervención, coordinado por diez workflows de n8n sobre una máquina de estados en Supabase.",
    content: `## El problema

Producir un short educativo a mano cuesta entre dos y tres horas: buscar el tema, escribir el guion,
generar el arte, grabar la voz, montar y publicar. A ese ritmo un canal de publicación diaria es
inviable para una sola persona.

## La arquitectura

El sistema está partido en tres piezas que se comunican por estado, no por llamadas directas:

- **Orquestación (n8n)** — diez workflows que mueven cada pieza de contenido por la máquina de estados.
- **media-worker** — microservicio de render: FFmpeg para el montaje y síntesis de voz para la narración.
- **cc-browser** — microservicio con Playwright que conduce un navegador para generar las imágenes.

El estado vive en Supabase y define el recorrido completo:

\`\`\`
pendiente → produciendo → en_revision → en_aprobacion → aprobado → publicado
                                                      ↘ rechazado
\`\`\`

Cada transición es idempotente. Si el render falla a mitad, la pieza vuelve a \`pendiente\` y se
reintenta sin duplicar nada.

## La decisión que más ahorró

El render corre en una instancia EC2 **bajo demanda**: se levanta cuando hay cola, monta, y se apaga.
Un servidor encendido todo el día para trabajo que ocupa minutos es el error de costo más común en
este tipo de sistema.

## El paso humano que se dejó a propósito

Todo está automatizado salvo la aprobación, que llega por WhatsApp. Publicar contenido generado sin
que nadie lo mire es la forma más rápida de arruinar un canal. El sistema pide un sí antes de
publicar, y eso cuesta diez segundos.

## Publicación

La subida a YouTube usa la Data API v3 con OAuth2 y \`videos.insert\`, gestionando la cuota diaria;
Instagram va por la Graph API como Reel. Ambas están documentadas en el repositorio.`,
    technologies: ["n8n", "Python", "FFmpeg", "Playwright", "Supabase", "YouTube Data API", "Instagram Graph API", "AWS EC2"],
    githubUrl: "https://github.com/axchisan/tecnobichos",
    liveUrl: "https://www.instagram.com/tecnobichos94/",
    featured: true,
    order: 1,
  },
  {
    title: "Calculadora de Gastos",
    category: "Multiplataforma",
    shortDesc:
      "Presupuesto, deudas y ahorro en web, Android y macOS. Opera por unos 0,01 USD al mes.",
    description:
      "Aplicación de finanzas personales para planificar el mes: sueldo, gastos fijos, control de pagos, " +
      "deudas externas y metas de ahorro, con un motor de transporte que descuenta festivos colombianos. " +
      "Un solo código Flutter para tres plataformas y una API Spring Boot sobre AWS Lambda.",
    content: `## Qué resuelve

Planificar el mes con precisión: registrar el sueldo y los gastos fijos, marcar cada gasto como
pendiente o pagado, llevar deudas externas con sus abonos, y repartir el excedente en metas de ahorro.

La pieza menos obvia es el **cálculo de transporte**: cuenta los días que realmente se viaja a la
oficina descontando festivos colombianos —incluida la Ley Emiliani, que corre varios festivos al
lunes siguiente—, fines de semana y días remotos.

## Arquitectura

| Capa | Tecnología | Por qué |
|---|---|---|
| Cliente | Flutter 3 | Un solo código para web, Android y macOS |
| API | Spring Boot 3 · Java 21 | Corre en Lambda con SnapStart |
| Cómputo | AWS Lambda + Function URL | Un millón de peticiones al mes sin costo |
| Base de datos | PostgreSQL (Neon) | Relacional, con JPA y migraciones Flyway |
| Frontend | S3 + CloudFront | Un terabyte de salida mensual sin costo |
| Autenticación | Spring Security + JWT | Sin infraestructura adicional |

La infraestructura está en Terraform y las decisiones quedaron escritas como ADRs en el repositorio.

## Sobre el costo

Java en Lambda arrastra un problema conocido: el arranque en frío de la JVM. **SnapStart** lo
resuelve tomando una instantánea de la máquina virtual ya inicializada y restaurándola en cada
invocación.

El resultado es una aplicación completa —API, base de datos y tres clientes— operando por alrededor
de **0,01 USD al mes**. El desglose está en \`docs/COSTOS.md\`.

Esa cifra no es una anécdota: elegir arquitectura sin mirar la factura es la diferencia entre un
proyecto que sobrevive y uno que se apaga cuando se acaban los créditos.`,
    technologies: ["Flutter", "Dart", "Spring Boot", "Java 21", "AWS Lambda", "Terraform", "PostgreSQL", "CloudFront"],
    githubUrl: "https://github.com/axchisan/calculadora-gastos",
    featured: true,
    order: 2,
  },
  {
    title: "Quanta",
    category: "Juego educativo",
    shortDesc:
      "Juego de física y química con IA generativa, multijugador autoritativo y editor de retos. Monorepo de ocho paquetes.",
    description:
      "Plataforma educativa interactiva donde se aprende física y química jugando. Incluye generación de " +
      "contenido con IA, partidas multijugador con servidor autoritativo y una herramienta para que los " +
      "docentes creen sus propios retos.",
    content: `## Estructura

Monorepo con pnpm y Turborepo, TypeScript estricto en todo el árbol:

| Paquete | Contenido |
|---|---|
| \`apps/web\` | Next.js como PWA |
| \`apps/game-server\` | Colyseus, salas autoritativas |
| \`packages/game-engine\` | Phaser 3 |
| \`packages/ai-gateway\` | Proveedores de LLM, imagen y voz |
| \`packages/db\` | Esquema y migraciones de Supabase |

## Por qué el servidor es autoritativo

En un juego educativo con puntaje, el cliente no puede ser la fuente de verdad: bastaría abrir las
herramientas del navegador para inventarse un resultado. Colyseus mantiene el estado de cada sala en
el servidor y los clientes solo envían intenciones.

## El gateway de IA

En lugar de llamar a un proveedor desde la aplicación, hay un paquete que abstrae LLM, generación de
imagen y síntesis de voz tras una interfaz común. Cambiar de proveedor —o mezclarlos según costo— no
toca el código del juego.`,
    technologies: ["TypeScript", "Next.js", "Phaser 3", "Colyseus", "Supabase", "Turborepo", "pnpm"],
    githubUrl: "https://github.com/axchisan/quanta2",
    featured: true,
    order: 3,
  },
  {
    title: "Gestión de inventario para ambientes de formación",
    category: "Sistema institucional",
    shortDesc:
      "Control de equipos y préstamos en los ambientes de formación del SENA, con app móvil y API propia.",
    description:
      "Sistema integral para registrar el inventario de cada ambiente de formación, gestionar préstamos y " +
      "verificar existencias desde el móvil. Desarrollado durante la etapa lectiva del programa de " +
      "Análisis y Desarrollo de Software.",
    content: `## Contexto

Cada ambiente de formación tiene equipos que entran, salen y se prestan entre instructores. El
control se llevaba en papel y en hojas de cálculo sueltas, con el resultado previsible: nadie sabía
con certeza qué había en cada sala.

## Solución

- **Móvil (Flutter)** — registro y verificación desde el propio ambiente, sin volver a un escritorio.
- **API (FastAPI)** — capa de dominio con validación por esquemas y documentación automática.
- **PostgreSQL** — inventario, préstamos y trazabilidad de movimientos.

## Lo que dejó

Fue el primer sistema que llevé de la base de datos a la aplicación en manos de alguien más. La
lección que más pesó después: modelar bien los estados de un préstamo —solicitado, entregado,
devuelto, vencido— evita la mitad de los problemas que aparecen luego en la interfaz.`,
    technologies: ["Flutter", "FastAPI", "Python", "PostgreSQL"],
    githubUrl: "https://github.com/axchisan/GestionInventarioSENA",
    featured: false,
    order: 4,
  },
  {
    title: "Beat 'em up 3D para Android en Godot",
    category: "Videojuego",
    shortDesc:
      "Juego de acción 3D con cel shading para móvil, con controles táctiles diseñados para una niña de ocho años.",
    description:
      "Proyecto personal de desarrollo de videojuegos en Godot 4.7: arenas de combate en 3D, estética " +
      "anime con cel shading y controles táctiles pensados para que una niña de ocho años pueda jugarlo " +
      "sola en un teléfono.",
    content: `## El encargo

Un regalo, no un producto. Y con un requisito que ordena todas las decisiones técnicas: tiene que
poder jugarlo sin ayuda una niña de ocho años, en un teléfono, con los dedos.

## Decisiones técnicas

- **Renderizador Mobile (Vulkan / Metal)** — el renderizador de escritorio de Godot da mejor imagen y
  no cabe en el presupuesto de un móvil de gama media.
- **Cel shading con MToon** — la estética anime se sostiene con pocos polígonos, que es exactamente
  lo que conviene en móvil.
- **Controles táctiles** — zonas grandes y perdonar el error de precisión. Un control pensado para
  manos adultas es injugable a esa edad.

## Qué enseña

Un juego obliga a razonar sobre presupuesto de fotogramas de una forma que una aplicación de negocio
no exige: cada decisión se paga en milisegundos y el límite es duro.`,
    technologies: ["Godot 4.7", "GDScript", "Vulkan", "Android", "Blender"],
    featured: false,
    order: 5,
  },
]

const ARTICULOS = [
  {
    title: "Una aplicación completa por un centavo al mes",
    slug: "aplicacion-completa-por-un-centavo-al-mes",
    excerpt:
      "API, base de datos y tres clientes corriendo por 0,01 USD mensuales. No es un truco: es elegir cada pieza mirando la factura.",
    tags: ["AWS", "Arquitectura", "Costos"],
    readTime: 8,
    content: `> Borrador pendiente de revisión.

La conversación sobre arquitectura casi siempre empieza por el rendimiento y casi nunca por el
costo. Y sin embargo, para un proyecto personal el costo es la restricción que decide si el proyecto
sigue vivo en un año o se apaga cuando se acaban los créditos.

Este es el desglose de cómo la Calculadora de Gastos —una API, una base de datos relacional y
clientes para web, Android y macOS— opera por alrededor de un centavo de dólar al mes.

## El principio

Cada pieza se eligió por su comportamiento en el tramo gratuito **permanente**, no en el de prueba.
La diferencia importa: un tramo de prueba con fecha de caducidad no es una arquitectura, es una
cuenta atrás.

## Las piezas

**Cómputo: AWS Lambda con Function URL.** Un millón de peticiones al mes de forma permanente. Sin
API Gateway delante, que cobra aparte y no aporta nada en este caso.

**El problema de Java en Lambda.** La JVM arranca lenta y en una función que escala a cero eso se
paga en cada invocación fría. SnapStart lo resuelve con una instantánea de la máquina virtual ya
inicializada.

**Base de datos: Neon.** Postgres serverless que escala a cero tras cinco minutos de inactividad.

**Frontend: S3 con CloudFront.** Un terabyte de salida al mes, permanente.

## Lo que no se hizo

No hay Kubernetes, no hay malla de servicios y no hay contenedores. Para una aplicación de un solo
usuario, cada una de esas piezas habría multiplicado el costo y la superficie de mantenimiento sin
resolver ningún problema real.`,
  },
  {
    title: "Automatizar un canal de contenido y dejar un solo paso humano",
    slug: "automatizar-canal-contenido-un-solo-paso-humano",
    excerpt:
      "Diez workflows, dos microservicios y una máquina de estados. Lo interesante no es lo que se automatizó, sino lo que se decidió no automatizar.",
    tags: ["Automatización", "n8n", "Arquitectura"],
    readTime: 7,
    content: `> Borrador pendiente de revisión.

Producir un short educativo a mano cuesta entre dos y tres horas. Tecnobichos lo hace solo: descubre
el tema, escribe el guion, genera las imágenes, sintetiza la voz, monta el video y lo publica en
YouTube e Instagram.

Queda un paso manual, y es a propósito.

## Estado antes que llamadas

La tentación al automatizar es encadenar llamadas: este servicio llama a aquel, aquel al siguiente.
Funciona hasta el primer fallo, y entonces no hay forma de saber dónde se quedó.

El sistema guarda el estado de cada pieza en la base y los workflows solo hacen transiciones:

\`\`\`
pendiente → produciendo → en_revision → en_aprobacion → aprobado → publicado
\`\`\`

Si el render falla a mitad, la pieza vuelve a \`pendiente\` y se reintenta. Sin duplicados y sin
tener que reconstruir a mano en qué punto estaba.

## Cómputo bajo demanda

El montaje con FFmpeg corre en una instancia que se levanta cuando hay cola y se apaga al terminar.
Un servidor encendido veinticuatro horas para trabajo que ocupa minutos es el desperdicio más común
en este tipo de sistema.

## El paso que se dejó a un humano

La aprobación llega por WhatsApp antes de publicar. Publicar contenido generado sin que nadie lo
mire es la forma más rápida de arruinar un canal: basta un dato mal citado.

Automatizar bien no es automatizar todo. Es saber cuál es el paso donde el criterio de una persona
vale más que los diez segundos que cuesta.`,
  },
]

async function main() {
  prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

  for (const p of PROYECTOS) {
    const existe = await prisma.project.findUnique({ where: { title: p.title }, select: { id: true } })
    if (existe) {
      console.log(`· ya existe, se respeta: ${p.title}`)
      continue
    }
    await prisma.project.create({ data: { ...p, status: "COMPLETED" } })
    console.log(`✓ proyecto: ${p.title}`)
  }

  for (const a of ARTICULOS) {
    const existe = await prisma.blogPost.findUnique({ where: { slug: a.slug }, select: { id: true } })
    if (existe) {
      console.log(`· ya existe, se respeta: ${a.slug}`)
      continue
    }
    // Sin publicar a propósito: son borradores redactados a partir de los
    // repositorios y tienen que pasar por revisión antes de salir con su firma.
    await prisma.blogPost.create({ data: { ...a, published: false } })
    console.log(`✓ borrador: ${a.title}`)
  }

  console.log("\nContenido sembrado.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma?.$disconnect()
  })
