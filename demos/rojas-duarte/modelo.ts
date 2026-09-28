/**
 * Rojas & Duarte, firma ficticia de abogados y contadores en Chapinero,
 * Bogotá. Todo lo que muestra la página sale de aquí: con un cliente real se
 * cambian estos datos y la página queda hecha.
 */
import type { Horario } from "@/demos/motores/presencia/horario"

const u = (id: string, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`

export type Foto = { src: string; alt: string; autor: string }

export const FOTOS = {
  portada: { src: u("photo-1551836022-b06985bceb24", 1100), alt: "Una abogada conversa con un cliente en una mesa de la oficina", autor: "Amy Hirschi" },
} satisfies Record<string, Foto>

export const EMPRESA = {
  nombre: "Rojas & Duarte",
  subtitulo: "Abogados y contadores",
  direccion: "Carrera 13 # 63-40, oficina 502, Chapinero, Bogotá",
  nota: "dirección de ejemplo",
  whatsappVisible: "300 000 0000",
  correo: "consultas@rojasduarte.example",
  desde: 2008,
  consulta: 150_000,
  consultaMin: 45,
}

export const HORARIO: Horario = {
  1: { abre: 8, cierra: 18 },
  2: { abre: 8, cierra: 18 },
  3: { abre: 8, cierra: 18 },
  4: { abre: 8, cierra: 18 },
  5: { abre: 8, cierra: 18 },
  6: { abre: 9, cierra: 12 },
}

export type Persona = {
  id: string
  nombre: string
  cargo: string
  formacion: string
  foto: Foto
}

export const EQUIPO: Persona[] = [
  {
    id: "laura",
    nombre: "Laura Rojas Pineda",
    cargo: "Abogada, socia fundadora",
    formacion: "Especialista en derecho laboral y de familia. Diecisiete años llevando despidos, divorcios y sucesiones.",
    foto: { src: u("photo-1758518729459-235dcaadc611", 700), alt: "Laura Rojas Pineda, sonriente, con gafas y saco azul", autor: "Vitaly Gariev" },
  },
  {
    id: "andres",
    nombre: "Andrés Duarte Molina",
    cargo: "Contador público, socio",
    formacion: "Especialista en impuestos. Declaraciones de renta, respuestas a la DIAN y contabilidad de pequeñas empresas.",
    foto: { src: u("photo-1787724779241-cb5c250ed70b", 700), alt: "Andrés Duarte Molina, con barba y gafas, de traje", autor: "Vitaly Gariev" },
  },
  {
    id: "camilo",
    nombre: "Camilo Bernal Ortiz",
    cargo: "Abogado asociado",
    formacion: "Derecho comercial. Constitución de sociedades, contratos y cobro de cartera para empresas.",
    foto: { src: u("photo-1758518729286-e8d94cc231f5", 700), alt: "Camilo Bernal Ortiz, sonriente, de traje y gafas", autor: "Vitaly Gariev" },
  },
]

export type Herramienta = "liquidacion" | "renta"

export type Area = {
  id: string
  nombre: string
  profesion: "Derecho" | "Contabilidad"
  resumen: string
  foto: Foto
  casos: string[]
  pasos: { titulo: string; texto: string }[]
  documentos: string[]
  honorarios: string
  responsable: string
  herramienta?: Herramienta
}

export const AREAS: Area[] = [
  {
    id: "laboral",
    nombre: "Derecho laboral",
    profesion: "Derecho",
    resumen: "Despidos, liquidaciones mal pagadas, acoso laboral y contratos. Para trabajadores y para empleadores.",
    foto: { src: u("photo-1551836022-d5d88e9218df"), alt: "Dos mujeres revisan un caso frente a un computador portátil", autor: "Amy Hirschi" },
    casos: [
      "Lo despidieron y no sabe si le pagaron lo que le correspondía",
      "Le deben cesantías, prima o vacaciones",
      "Tiene una empresa y necesita despedir a alguien sin que le salga una demanda",
      "Contratos, reglamento interno y descargos para su empresa",
    ],
    pasos: [
      { titulo: "Revisamos su liquidación", texto: "Con el contrato y los desprendibles de pago calculamos lo que le deben, rubro por rubro." },
      { titulo: "Reclamamos por escrito", texto: "Una carta al empleador suele bastar. Muchos casos se resuelven aquí, en semanas." },
      { titulo: "Conciliación o demanda", texto: "Si no pagan, vamos a conciliación ante el Ministerio del Trabajo y, si hace falta, a juicio." },
    ],
    documentos: ["Cédula", "Contrato de trabajo", "Carta de despido o de renuncia", "Los últimos tres desprendibles de pago", "La liquidación que le entregaron, si la hay"],
    honorarios: "Primera consulta de 45 minutos: $ 150.000, que se descuentan si lleva el caso con nosotros. Reclamaciones: un porcentaje de lo que se recupere, acordado por escrito antes de empezar.",
    responsable: "laura",
    herramienta: "liquidacion",
  },
  {
    id: "familia",
    nombre: "Familia y sucesiones",
    profesion: "Derecho",
    resumen: "Divorcios, custodia, cuota de alimentos y sucesiones. Por notaría cuando se puede, que es más rápido.",
    foto: { src: u("photo-1551836022-4c4c79ecde51"), alt: "Dos mujeres conversan sentadas frente a una mesa de reuniones", autor: "Amy Hirschi" },
    casos: [
      "Divorcio o separación de bienes de mutuo acuerdo",
      "Fijar o revisar la cuota de alimentos de los hijos",
      "Custodia y régimen de visitas",
      "Sucesión de un familiar que dejó una casa o una cuenta",
    ],
    pasos: [
      { titulo: "Escuchamos a las partes", texto: "Si hay acuerdo, el trámite va por notaría. Si no, le explicamos el proceso judicial y cuánto tarda." },
      { titulo: "Preparamos los documentos", texto: "Escritura, acuerdo de alimentos o inventario de bienes, listos para firmar." },
      { titulo: "Lo acompañamos hasta el final", texto: "Registro de la escritura, cambio de propietario de los bienes y lo que falte." },
    ],
    documentos: ["Cédulas", "Registro civil de matrimonio", "Registros civiles de los hijos", "Certificados de libertad de los inmuebles", "Registro civil de defunción, en una sucesión"],
    honorarios: "Divorcio de mutuo acuerdo por notaría: desde $ 2.200.000 más los gastos notariales. Sucesiones: según el valor de los bienes, cotizado por escrito.",
    responsable: "laura",
  },
  {
    id: "empresas",
    nombre: "Empresas y contratos",
    profesion: "Derecho",
    resumen: "Constituir una SAS, redactar contratos que protejan y cobrar a quien no paga.",
    foto: { src: u("photo-1763729805496-b5dbf7f00c79"), alt: "Un hombre firma un documento con un bolígrafo", autor: "Jakub Żerdzicki" },
    casos: [
      "Formalizar su negocio como SAS",
      "Contratos con clientes, proveedores o socios",
      "Clientes que no pagan: cobro prejurídico y ejecutivo",
      "Política de tratamiento de datos personales (Ley 1581 de 2012)",
    ],
    pasos: [
      { titulo: "Entendemos el negocio", texto: "Qué vende, con quién y dónde se le puede complicar." },
      { titulo: "Redactamos", texto: "Estatutos, contratos o cartas de cobro, en un lenguaje que usted entiende." },
      { titulo: "Registramos y hacemos seguimiento", texto: "Cámara de Comercio, RUT y los recordatorios de lo que se vence." },
    ],
    documentos: ["Cédula de los socios", "Nombre que quiere para la empresa y actividad", "Facturas o contratos del cliente que no paga"],
    honorarios: "Constitución de SAS con RUT: $ 1.300.000 más los derechos de la Cámara de Comercio. Contratos: desde $ 450.000 cada uno.",
    responsable: "camilo",
  },
  {
    id: "contabilidad",
    nombre: "Contabilidad y nómina",
    profesion: "Contabilidad",
    resumen: "La contabilidad del mes, la nómina electrónica y la seguridad social de su empresa, al día.",
    foto: { src: u("photo-1626266061368-46a8f578ddd6"), alt: "Una persona hace cuentas con una calculadora sobre el escritorio", autor: "Towfiqu barbhuiya" },
    casos: [
      "Pequeñas empresas y negocios que necesitan contador",
      "Nómina electrónica y planilla de seguridad social",
      "Estados financieros para el banco o para una licitación",
      "Poner al día una contabilidad atrasada",
    ],
    pasos: [
      { titulo: "Diagnóstico", texto: "Revisamos cómo están los libros, las declaraciones y la nómina." },
      { titulo: "Ponemos al día", texto: "Lo atrasado primero, con un plan para no pagar sanciones de más." },
      { titulo: "Cada mes", texto: "Le mandamos un resumen corto: cuánto vendió, cuánto ganó y qué impuestos vienen." },
    ],
    documentos: ["RUT de la empresa", "Extractos bancarios de los últimos tres meses", "Facturas de compra y de venta", "Listado de empleados con su salario"],
    honorarios: "Contabilidad mensual para una empresa pequeña: desde $ 650.000 al mes, según el número de facturas y empleados.",
    responsable: "andres",
  },
  {
    id: "impuestos",
    nombre: "Impuestos y renta",
    profesion: "Contabilidad",
    resumen: "Declaración de renta de personas y empresas, IVA, régimen simple y respuestas a la DIAN.",
    foto: { src: u("photo-1562564055-71e051d33c19"), alt: "Dos personas revisan y firman documentos sobre una mesa", autor: "Gabrielle Henderson" },
    casos: [
      "Saber si tiene que declarar renta este año",
      "Declaración de renta de asalariados, independientes y pensionados",
      "Le llegó un requerimiento o un emplazamiento de la DIAN",
      "Pasar su negocio al régimen simple de tributación",
    ],
    pasos: [
      { titulo: "Revisamos su información", texto: "Con la información exógena de la DIAN y sus certificados, sin sorpresas." },
      { titulo: "Buscamos lo que le baja el impuesto", texto: "Dependientes, intereses de vivienda, medicina prepagada y aportes voluntarios." },
      { titulo: "Presentamos a tiempo", texto: "Antes de su fecha, según los dos últimos dígitos de la cédula. Le dejamos copia firmada." },
    ],
    documentos: ["Certificado de ingresos y retenciones", "Certificados bancarios a 31 de diciembre", "Certificado de intereses del crédito de vivienda", "Facturas de medicina prepagada", "La declaración del año anterior"],
    honorarios: "Declaración de renta de un asalariado: desde $ 380.000. Independientes y pensionados, según los soportes.",
    responsable: "andres",
    herramienta: "renta",
  },
]

export const area = (id: string) => AREAS.find((a) => a.id === id)
export const persona = (id: string) => EQUIPO.find((p) => p.id === id)!

export const PREGUNTAS = [
  {
    p: "¿Cuánto cuesta la primera consulta?",
    r: "$ 150.000 por 45 minutos, en la oficina o por videollamada. Si nos encarga el caso, se descuentan de los honorarios.",
  },
  {
    p: "¿Me dicen el precio antes de empezar?",
    r: "Siempre. Después de la consulta le mandamos una propuesta escrita con lo que haremos, cuánto cuesta y cuánto tarda. No hay cobros que no estén ahí.",
  },
  {
    p: "¿Atienden fuera de Bogotá?",
    r: "Sí, por videollamada. Los documentos se firman con firma electrónica o se envían por correo certificado.",
  },
  {
    p: "¿Por qué abogados y contadores en la misma firma?",
    r: "Porque muchos problemas son las dos cosas: un despido tiene una liquidación que calcular, una sucesión tiene impuestos, una empresa nueva necesita estatutos y contador. Aquí lo resuelve una sola oficina.",
  },
]
