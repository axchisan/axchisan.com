/**
 * Modelo de Fogón 45, cocina colombiana (negocio ficticio). Carrito y pedido
 * vienen del motor de pedidos; aquí vive lo que es de este restaurante.
 */
import type { Franja } from "@/demos/motores/agenda/tiempo"
import type { Canal, EstadoPedido, Pedido } from "@/demos/motores/pedidos/pedido"
import type { GrupoOpciones, Producto } from "@/demos/motores/pedidos/carrito"

export type Categoria = "Para empezar" | "Sopas" | "Del fogón" | "Bebidas" | "Postres"

export const CATEGORIAS: { id: string; nombre: Categoria }[] = [
  { id: "empezar", nombre: "Para empezar" },
  { id: "sopas", nombre: "Sopas" },
  { id: "fogon", nombre: "Del fogón" },
  { id: "bebidas", nombre: "Bebidas" },
  { id: "postres", nombre: "Postres" },
]

export type Etiqueta = "picante" | "vegetariano" | "para-compartir"

export const ETIQUETA: Record<Etiqueta, string> = {
  picante: "Picante",
  vegetariano: "Vegetariano",
  "para-compartir": "Para compartir",
}

export type Foto = { src: string; alt: string; autor: string }

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`

export const FOTOS = {
  punta: { src: u("photo-1614119068601-483274e9dcb7"), alt: "Carne sobre la parrilla de carbón, con llamas", autor: "Matt Connor" },
  bandeja: { src: u("photo-1723693407562-bb4fcae76797"), alt: "Cazuela con carne asada, huevo frito, arepa y maduro", autor: "WILLIAN REIS" },
  churrasco: { src: u("photo-1624234763734-c9629a2777c1"), alt: "Churrasco tajado sobre tabla de madera", autor: "CHUTTERSNAP" },
  chicharron: { src: u("photo-1785735011447-9942c0ba0b13"), alt: "Chicharrón tajado y crocante", autor: "Zion C" },
  mojarra: { src: u("photo-1548704087-b11dab0fbec0"), alt: "Mojarra frita con patacón y limón", autor: "lalo Hernandez" },
  picada: { src: u("photo-1702827496392-abe9bcadcd07"), alt: "Tabla con carnes, chorizo, patacones y papas", autor: "Alfredo Burgos" },
  empanadas: { src: u("photo-1624128082323-beb6b8b508db"), alt: "Empanadas doradas en un plato", autor: "Anton" },
  arepa: { src: u("photo-1644753787071-8933b5daed2d"), alt: "Arepas con hogao en un plato blanco", autor: "Alexandra Tran" },
  papas: { src: u("photo-1721942893905-3de47ae22b88"), alt: "Papas criollas doradas con cebollín", autor: "Maggi Paraguay" },
  mazorca: { src: u("photo-1653886764100-60e01f57bd1d"), alt: "Mazorcas asadas sobre la parrilla", autor: "Tim Mossholder" },
  ajiaco: { src: u("photo-1665593998976-d957f2827fe7"), alt: "Plato hondo de ajiaco con mazorca y pollo", autor: "Keesha's Kitchen" },
  limonada: { src: u("photo-1623084921164-4a8c5c37a912"), alt: "Vaso de limonada con limones", autor: "Laura Chouette" },
  jugos: { src: u("photo-1622597467821-df79dcb4f94d"), alt: "Jugos naturales de frutas tropicales", autor: "Jugoslocos" },
  cerveza: { src: u("photo-1632173517757-1e87c79de596"), alt: "Copa de cerveza artesanal rubia", autor: "Josh Olalde" },
  chocolate: { src: u("photo-1702165639524-252a1c1b1ab5"), alt: "Taza de chocolate caliente sobre tabla", autor: "Melody Zimmerman" },
  flan: { src: u("photo-1752245055475-8b7c3b4756ac"), alt: "Flan de caramelo con crema", autor: "Jay" },
  arepasParrilla: { src: u("photo-1587603366933-aa6947174c65"), alt: "Arepas asándose sobre la parrilla", autor: "Leila Issa" },
  salon: { src: u("photo-1667388969250-1c7220bf3f37"), alt: "Salón del restaurante con mesas de madera y luz cálida", autor: "Glenov Brankovic" },
} satisfies Record<string, Foto>

export type Plato = Producto & {
  categoria: string
  descripcion: string
  foto?: Foto
  etiquetas?: Etiqueta[]
  /** Minutos de cocina, para el tiempo estimado del pedido. */
  coccion: number
}

const TERMINO: GrupoOpciones = {
  id: "termino",
  nombre: "Término",
  tipo: "uno",
  opciones: [
    { id: "medio", nombre: "Término medio" },
    { id: "tres-cuartos", nombre: "Tres cuartos" },
    { id: "bien-asado", nombre: "Bien asado" },
  ],
}

const ACOMPANAMIENTO: GrupoOpciones = {
  id: "acompanamiento",
  nombre: "Acompañamiento",
  tipo: "uno",
  opciones: [
    { id: "papa", nombre: "Papa salada con ají" },
    { id: "yuca", nombre: "Yuca frita" },
    { id: "patacon", nombre: "Patacones" },
  ],
}

export const PLATOS: Plato[] = [
  // Para empezar
  {
    id: "empanadas",
    categoria: "empezar",
    nombre: "Empanadas de pipián",
    descripcion: "Tres empanadas de maíz rellenas de papa y maní, con ají de maní de la casa.",
    precio: 12_000,
    foto: FOTOS.empanadas,
    coccion: 8,
  },
  {
    id: "arepa-hogao",
    categoria: "empezar",
    nombre: "Arepas con hogao",
    descripcion: "Arepas de maíz blanco asadas en la parrilla, con hogao de tomate y cebolla larga.",
    precio: 9_000,
    foto: FOTOS.arepa,
    etiquetas: ["vegetariano"],
    coccion: 8,
    opciones: [{ id: "adicion", nombre: "Adiciones", tipo: "varios", opciones: [{ id: "queso", nombre: "Queso campesino", extra: 3_000 }] }],
  },
  {
    id: "papas-criollas",
    categoria: "empezar",
    nombre: "Papas criollas con ají",
    descripcion: "Doradas en la sartén, con sal gruesa, cebollín y ají de la casa.",
    precio: 10_000,
    foto: FOTOS.papas,
    etiquetas: ["vegetariano", "picante"],
    coccion: 10,
  },
  {
    id: "mazorca",
    categoria: "empezar",
    nombre: "Mazorca asada",
    descripcion: "Al carbón, con mantequilla y queso costeño rallado.",
    precio: 11_000,
    foto: FOTOS.mazorca,
    etiquetas: ["vegetariano"],
    coccion: 12,
  },
  // Sopas
  {
    id: "ajiaco",
    categoria: "sopas",
    nombre: "Ajiaco santafereño",
    descripcion: "Tres papas, pollo desmechado, mazorca y guascas. Con crema, alcaparras, aguacate y arroz.",
    precio: 32_000,
    foto: FOTOS.ajiaco,
    coccion: 10,
    opciones: [{ id: "adicion", nombre: "Adiciones", tipo: "varios", opciones: [{ id: "aguacate", nombre: "Aguacate extra", extra: 4_000 }] }],
  },
  {
    id: "sancocho",
    categoria: "sopas",
    nombre: "Sancocho de gallina",
    descripcion: "Sábados y domingos. Gallina criolla, yuca, plátano y mazorca, con arroz y aguacate.",
    precio: 34_000,
    coccion: 10,
  },
  // Del fogón
  {
    id: "punta-anca",
    categoria: "fogon",
    nombre: "Punta de anca al carbón",
    descripcion: "350 gramos con su grasa, sellada a la leña. Con chimichurri y el acompañamiento que elijas.",
    precio: 46_000,
    foto: FOTOS.punta,
    coccion: 22,
    opciones: [TERMINO, ACOMPANAMIENTO],
  },
  {
    id: "bandeja",
    categoria: "fogon",
    nombre: "Bandeja 45",
    descripcion: "Frijol, arroz, carne asada, chicharrón, huevo, maduro, arepa y aguacate. Pesada, como debe ser.",
    precio: 39_000,
    foto: FOTOS.bandeja,
    coccion: 15,
    opciones: [{ id: "adicion", nombre: "Adiciones", tipo: "varios", opciones: [{ id: "huevo", nombre: "Huevo extra", extra: 3_000 }] }],
  },
  {
    id: "churrasco",
    categoria: "fogon",
    nombre: "Churrasco de 400 gramos",
    descripcion: "Mariposa de lomo ancho al carbón, con ensalada de la huerta y el acompañamiento que elijas.",
    precio: 52_000,
    foto: FOTOS.churrasco,
    coccion: 24,
    opciones: [TERMINO, ACOMPANAMIENTO],
  },
  {
    id: "chicharron",
    categoria: "fogon",
    nombre: "Chicharrón carnudo",
    descripcion: "Tocino de cerdo en su punto de carocha, con arepa, limón y ají.",
    precio: 28_000,
    foto: FOTOS.chicharron,
    etiquetas: ["para-compartir"],
    coccion: 18,
  },
  {
    id: "mojarra",
    categoria: "fogon",
    nombre: "Mojarra frita",
    descripcion: "Entera y crocante, con arroz con coco, patacón y ensalada.",
    precio: 38_000,
    foto: FOTOS.mojarra,
    coccion: 20,
  },
  {
    id: "picada",
    categoria: "fogon",
    nombre: "Picada para dos",
    descripcion: "Carne, chorizo, chicharrón, morcilla, papa criolla, patacón y guacamole con ají.",
    precio: 64_000,
    foto: FOTOS.picada,
    etiquetas: ["para-compartir", "picante"],
    coccion: 25,
  },
  // Bebidas
  {
    id: "limonada",
    categoria: "bebidas",
    nombre: "Limonada",
    descripcion: "Grande, bien fría.",
    precio: 9_000,
    foto: FOTOS.limonada,
    coccion: 3,
    opciones: [
      {
        id: "sabor",
        nombre: "Sabor",
        tipo: "uno",
        opciones: [
          { id: "natural", nombre: "Natural" },
          { id: "hierbabuena", nombre: "De hierbabuena", extra: 1_000 },
          { id: "coco", nombre: "De coco", extra: 3_000 },
        ],
      },
    ],
  },
  {
    id: "jugo",
    categoria: "bebidas",
    nombre: "Jugo natural",
    descripcion: "De fruta fresca, en agua o en leche.",
    precio: 8_000,
    foto: FOTOS.jugos,
    coccion: 4,
    opciones: [
      {
        id: "fruta",
        nombre: "Fruta",
        tipo: "uno",
        opciones: [
          { id: "lulo", nombre: "Lulo" },
          { id: "mora", nombre: "Mora" },
          { id: "maracuya", nombre: "Maracuyá" },
          { id: "guanabana", nombre: "Guanábana", extra: 1_500 },
        ],
      },
      {
        id: "base",
        nombre: "Preparado",
        tipo: "uno",
        opciones: [
          { id: "agua", nombre: "En agua" },
          { id: "leche", nombre: "En leche", extra: 1_000 },
        ],
      },
    ],
  },
  {
    id: "cerveza",
    categoria: "bebidas",
    nombre: "Cerveza artesanal",
    descripcion: "De una cervecería de Chapinero. Solo para mayores de 18 años.",
    precio: 14_000,
    foto: FOTOS.cerveza,
    coccion: 2,
    opciones: [
      {
        id: "estilo",
        nombre: "Estilo",
        tipo: "uno",
        opciones: [
          { id: "rubia", nombre: "Rubia" },
          { id: "roja", nombre: "Roja" },
          { id: "negra", nombre: "Negra" },
        ],
      },
    ],
  },
  {
    id: "chocolate",
    categoria: "bebidas",
    nombre: "Chocolate santafereño",
    descripcion: "En jarra de peltre, con queso campesino y almojábana.",
    precio: 11_000,
    foto: FOTOS.chocolate,
    coccion: 6,
  },
  // Postres
  {
    id: "flan",
    categoria: "postres",
    nombre: "Flan de caramelo",
    descripcion: "De la receta de la abuela, con crema.",
    precio: 10_000,
    foto: FOTOS.flan,
    coccion: 2,
  },
  {
    id: "brevas",
    categoria: "postres",
    nombre: "Brevas con arequipe",
    descripcion: "Brevas caladas en almíbar, con arequipe y queso.",
    precio: 12_000,
    coccion: 2,
  },
  {
    id: "natas",
    categoria: "postres",
    nombre: "Postre de natas",
    descripcion: "El de siempre en Bogotá, con uvas pasas.",
    precio: 11_000,
    coccion: 2,
  },
]

export const platoPorId = (id: string) => PLATOS.find((p) => p.id === id)

// ─── Datos fijos del negocio ──────────────────────────────────────────────

export const RESTAURANTE = {
  nombre: "Fogón 45",
  zona: "Chapinero, Bogotá",
  direccion: "Calle 45 con carrera 13, Chapinero, Bogotá (dirección de ejemplo)",
  telefono: "(601) 000 0000",
  whatsappVisible: "300 000 0000",
  instagram: "@fogon45 (ejemplo)",
  mesas: 12,
}

/** Horario de cocina, en horas decimales. 0 = domingo. */
export const HORARIO: Record<number, { abre: number; cierra: number } | null> = {
  0: { abre: 12, cierra: 17 },
  1: null,
  2: { abre: 12, cierra: 22 },
  3: { abre: 12, cierra: 22 },
  4: { abre: 12, cierra: 22 },
  5: { abre: 12, cierra: 23 },
  6: { abre: 12, cierra: 23 },
}

/** Franjas en que se reservan mesas (la última reserva, una hora antes de cerrar). */
export const FRANJAS_RESERVA: Record<number, Franja> = Object.fromEntries(
  Object.entries(HORARIO).map(([d, h]) => [d, h ? { desde: h.abre, hasta: h.cierra - 1.5 } : null]),
)

/** Mesas que se pueden reservar por franja de media hora. El resto queda para quien llega. */
export const CUPO_RESERVAS = 5

export type Zona = { id: string; barrio: string; costo: number; minutos: [number, number] }

export const ZONAS: Zona[] = [
  { id: "marly", barrio: "Marly y Chapinero Central", costo: 4_000, minutos: [30, 40] },
  { id: "chapinero-alto", barrio: "Chapinero Alto", costo: 6_000, minutos: [35, 45] },
  { id: "palermo", barrio: "Palermo y Galerías", costo: 6_000, minutos: [35, 50] },
  { id: "teusaquillo", barrio: "Teusaquillo", costo: 5_000, minutos: [35, 45] },
  { id: "quinta-camacho", barrio: "Quinta Camacho y El Nogal", costo: 7_000, minutos: [40, 55] },
]

// ─── Estado de la demo ────────────────────────────────────────────────────

export type Reserva = {
  id: string
  nombre: string
  telefono: string
  personas: number
  inicio: string
  nota?: string
  estado: "confirmada" | "llego" | "cancelada"
  origen: "web" | "telefono"
}

/** Cambios hechos desde el panel sobre la carta: precios y platos agotados hoy. */
export type AjustesCarta = { precios: Record<string, number>; agotados: string[] }

export type EstadoRestaurante = {
  /** Día en que se generaron los datos de ejemplo. */
  referencia: string
  carta: AjustesCarta
  pedidos: Pedido[]
  reservas: Reserva[]
  siguienteNumero: number
}

export type { Canal, EstadoPedido, Pedido }
