import { config as loadEnv } from "dotenv"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

loadEnv({ path: process.env.ENV_FILE ?? ".env.local" })
loadEnv({ path: ".env" })

/**
 * Segunda tanda de contenido, tras revisar los 49 repositorios de la cuenta.
 *
 * Los cuatro proyectos que faltaban son los que más peso tienen ante quien
 * contrata: un cliente real, un sistema institucional con usuarios, una
 * automatización con IA en un flujo de trabajo real y un proyecto en equipo.
 *
 * Idempotente: no toca lo que ya existe.
 */

let prisma: PrismaClient

const PROYECTOS = [
  {
    title: "Bitácoras SENA",
    category: "Automatización con IA",
    shortDesc:
      "Convierte las tareas cerradas en Azure DevOps en el Excel oficial de seguimiento del SENA, redactado por IA. De una tarde de trabajo a un clic.",
    description:
      "Sistema web que consulta los work items de Azure DevOps en un rango de fechas, genera con IA las " +
      "descripciones y competencias en el lenguaje que exige el formato institucional, y produce el Excel " +
      "listo para entregar. Se apoya en Microsoft Graph para dejarlo en OneDrive.",
    content: `## El problema

La etapa productiva del SENA exige entregar bitácoras periódicas describiendo el trabajo hecho, en el
formato y el vocabulario de competencias de la institución. El trabajo ya está registrado —en el
tablero de Azure DevOps de la empresa—, pero traducirlo al formato oficial es transcripción manual:
abrir cada tarea, reescribirla en lenguaje de competencias, pegarla en la plantilla de Excel.

## Cómo funciona

1. Consulta a la API de Azure DevOps con **WIQL** para traer los work items del rango de fechas.
2. La **API de Claude** reescribe cada tarea en el registro que pide el formato y la asocia a las
   competencias correspondientes.
3. **openpyxl** rellena la plantilla oficial respetando su estructura exacta.
4. **Microsoft Graph** deja el archivo en OneDrive.

| Capa | Tecnología |
|---|---|
| Backend | Python · FastAPI · SQLAlchemy async |
| Base de datos | PostgreSQL 16 |
| IA | API de Anthropic |
| Frontend | React · Vite · Tailwind · React Query |
| Integraciones | Azure DevOps REST, Microsoft Graph |

## Lo interesante

No es "una IA que escribe textos". El valor está en que **los datos ya existían** y solo faltaba el
puente entre dos sistemas que no se hablan. El modelo hace la parte más aburrida —cambiar el registro
del lenguaje—, no la parte que requiere criterio.

Es el patrón que más veces se repite en automatización útil: encontrar dónde una persona está
haciendo de traductor entre dos máquinas.`,
    technologies: ["Python", "FastAPI", "React", "PostgreSQL", "Azure DevOps API", "Microsoft Graph", "API de Claude", "Docker"],
    githubUrl: "https://github.com/axchisan/bitacoras-sena",
    featured: true,
    order: 3,
  },
  {
    title: "Fudoshin Ryu",
    category: "Cliente",
    shortDesc:
      "Sitio oficial de una escuela de Shotokan Karate-Do afiliada a la JKA, con tres sedes en Santander.",
    description:
      "Sitio web del dojo Fudoshin Ryu, escuela tradicional de Shotokan Karate-Do dirigida por el Sensei " +
      "Leonardo Vanegas Martínez y afiliada a la Japan Karate Association. Presenta la escuela, su linaje, " +
      "su filosofía y sus tres sedes en Vélez, Barbosa y Guavatá.",
    content: `## El encargo

Una escuela de karate tradicional con tres sedes en Santander necesitaba presencia propia en internet.
No un folleto: un sitio que transmitiera por qué una escuela afiliada a la **Japan Karate Association**
no es lo mismo que un gimnasio con clases de artes marciales.

## Lo que pedía el proyecto

El karate tradicional tiene un vocabulario visual que no se puede improvisar: el linaje importa, la
jerarquía importa, y la sobriedad forma parte del mensaje. Un diseño recargado habría contradicho
exactamente lo que la escuela enseña.

El lema del dojo —**fuerza, honor, disciplina**— ordenó las decisiones de diseño mejor que cualquier
brief: tipografía firme, mucho espacio, cero adorno.

## Qué incluye

- Presentación del dojo, el Sensei y el linaje de la escuela
- Filosofía y valores del Fudoshin Ryu
- Las tres sedes con su información de contacto
- Información para quien quiere empezar a entrenar

## Lo que dejó

Trabajar con un cliente real cambia el problema. No se trata de elegir el stack más interesante, sino
de que alguien que no es técnico pueda mantener la información al día y de que el sitio siga en pie
sin que nadie lo vigile.`,
    technologies: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    githubUrl: "https://github.com/axchisan/Fudoshin-Ryu",
    featured: true,
    order: 5,
  },
  {
    title: "Carnets virtuales para el SENA",
    category: "Sistema institucional",
    shortDesc:
      "Carnet digital con código de barras y modo sin conexión, interoperando con la aplicación de escritorio que usan instructores y guardias.",
    description:
      "Aplicación móvil en Flutter que permite a los aprendices del centro de formación generar su carnet " +
      "virtual, registrar los equipos que ingresan y validarse en el acceso. Comparte base de datos con una " +
      "aplicación de escritorio en Java usada por instructores y personal de seguridad.",
    content: `## El sistema completo

El carnet no es una pantalla bonita: es una pieza dentro de un sistema de control de acceso que ya
existía. La aplicación de escritorio en **Java** que usan los guardias escanea códigos de barras;
la app móvil tenía que producir uno que ese lector entendiera, sobre la misma base de datos
PostgreSQL institucional.

## Las decisiones que importaron

**Modo sin conexión.** Un carnet que necesita datos móviles para mostrarse no sirve en una portería.
Una vez generado, el carnet se guarda en el dispositivo y funciona sin red.

**Registro validado contra la base institucional.** Nadie puede crearse una cuenta: el número de
identificación tiene que existir previamente en los registros del centro. La app no es la fuente de
verdad de quién es aprendiz, solo la interfaz.

**Registro de equipos.** Los aprendices entran con portátiles y accesorios que hay que poder
verificar a la salida. Cada equipo queda vinculado al perfil.

## Lo que enseñó

Integrarse con un sistema que ya está en producción y no puedes cambiar impone una disciplina
distinta a la de empezar de cero: el formato del código de barras, el esquema de la base y el flujo
de la portería eran restricciones, no decisiones.`,
    technologies: ["Flutter", "Dart", "PostgreSQL", "Java", "Códigos de barras"],
    githubUrl: "https://github.com/axchisan/AppGestionCarnetsSENA",
    featured: false,
    order: 7,
  },
  {
    title: "El Rincón de ADSO",
    category: "Proyecto en equipo",
    shortDesc:
      "Biblioteca digital de recursos de programación, construida entre nueve aprendices. PHP, PostgreSQL y Docker.",
    description:
      "Plataforma web que centraliza recursos educativos de programación e informática, desarrollada por un " +
      "equipo de nueve aprendices del programa de Análisis y Desarrollo de Software del SENA.",
    content: `## El proyecto

Centralizar el material de estudio que estaba disperso —apuntes, guías, enlaces— en una biblioteca
digital con búsqueda, categorías y control de acceso.

## Lo verdaderamente difícil

No fue el código. Fue **coordinar a nueve personas** con niveles distintos sobre un mismo repositorio:
acordar convenciones, repartir el trabajo sin pisarse, revisar lo que entra y mantener el proyecto
desplegable en cualquier momento.

Es la primera vez que el cuello de botella de un proyecto mío no fue técnico sino de organización, y
la lección se quedó: en un equipo, el tiempo se va en los bordes entre las piezas, no dentro de
ellas. Definir bien la interfaz entre dos módulos ahorra más que optimizar cualquiera de los dos.

## Stack

PHP y PostgreSQL para el núcleo, JavaScript en el cliente y Docker para que el entorno fuera idéntico
en las nueve máquinas del equipo —que resultó ser la decisión que más discusiones evitó.`,
    technologies: ["PHP", "PostgreSQL", "JavaScript", "Docker"],
    githubUrl: "https://github.com/axchisan/El-rincon-de-ADSO",
    featured: false,
    order: 8,
  },
  {
    title: "AgroBot",
    category: "IA aplicada",
    shortDesc:
      "Asistente conversacional que aconseja a pequeños agricultores sobre siembra, plagas y planificación según el clima.",
    description:
      "Chatbot en Python y Flask con procesamiento de lenguaje natural, pensado para pequeños agricultores: " +
      "recomendaciones de siembra, manejo de plagas, uso de agroquímicos y planificación de cultivos según " +
      "las condiciones climáticas.",
    content: `## A quién va dirigido

No a un agrónomo con formación técnica, sino a un pequeño agricultor con un teléfono. Eso condiciona
todo: las respuestas tienen que ser accionables y en lenguaje llano, y la interfaz tiene que
funcionar con una conexión mala.

## Qué resuelve

- Cuándo sembrar según las condiciones del momento
- Identificación y manejo de plagas
- Uso de agroquímicos, que es donde un mal consejo cuesta una cosecha
- Planificación del ciclo de cultivo

## La restricción que ordenó el diseño

En un dominio donde equivocarse tiene costo económico real, un asistente que responde con seguridad a
todo es peor que uno que reconoce sus límites. El sistema está pensado para acompañar la decisión del
agricultor, no para sustituirla.`,
    technologies: ["Python", "Flask", "NLP", "Anaconda"],
    githubUrl: "https://github.com/axchisan/ProyectoAgroBot",
    featured: false,
    order: 9,
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
    console.log(`✓ ${p.title}`)
  }

  const total = await prisma.project.count()
  console.log(`\nProyectos en el sitio: ${total}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma?.$disconnect()
  })
