/** Frases por sector para la publicidad: las usan los prompts de Gemini y los impresos. */
/** Cómo se le habla a cada sector. Sin precios: la pieza lleva a la web. */
export const SECTORES: Record<string, { corto: string; tu: string; frase: string; apoyo: string }> = {
  restaurantes: { corto: "Restaurantes", tu: "tu restaurante", frase: "¿Tus pedidos llegan por WhatsApp y se pierden?", apoyo: "Carta con QR, pedidos a domicilio y pantalla de cocina." },
  veterinarias: { corto: "Veterinarias", tu: "tu veterinaria", frase: "Citas, vacunas y recordatorios, sin cuaderno", apoyo: "Tus clientes agendan desde el celular y tú ves la agenda del día." },
  "salones-y-barberias": { corto: "Peluquerías y barberías", tu: "tu peluquería", frase: "Que te reserven a las 11 de la noche, sin contestar", apoyo: "Reservas en línea con el profesional y la hora que quieren." },
  "consultorios-odontologicos": { corto: "Consultorios", tu: "tu consultorio", frase: "Tus pacientes agendan solos desde el celular", apoyo: "Agenda, odontograma y presupuestos en un solo lugar." },
  "inventario-y-ventas": { corto: "Ferreterías y comercios", tu: "tu negocio", frase: "¿Cuánto te queda en bodega? Míralo en un segundo", apoyo: "Inventario, caja y reportes para Excel." },
  "tiendas-de-ropa": { corto: "Tiendas de ropa", tu: "tu tienda de ropa", frase: "Vende tallas y colores con PSE y Nequi", apoyo: "Tu colección en línea, con inventario por talla." },
  inmobiliarias: { corto: "Inmobiliarias", tu: "tu inmobiliaria", frase: "Tus inmuebles con mapa, filtros y visitas agendadas", apoyo: "Una página propia, sin depender solo de los portales." },
  "gimnasios-y-estudios": { corto: "Gimnasios", tu: "tu gimnasio", frase: "Clases con cupo y membresías que avisan antes de vencer", apoyo: "Tus socios reservan su puesto desde el celular." },
  "panaderias-y-cafeterias": { corto: "Panaderías", tu: "tu panadería", frase: "Que sepan a qué hora sale el pan caliente", apoyo: "Pedidos para recoger y tortas por encargo." },
  "abogados-y-contadores": { corto: "Abogados y contadores", tu: "tu oficina", frase: "Clientes que llegan con los documentos listos", apoyo: "Una página que da confianza antes de la primera llamada." },
  "hoteles-y-turismo": { corto: "Hoteles", tu: "tu hotel", frase: "Que recorran tu hotel antes de reservar", apoyo: "Una página con video que avanza con el scroll." },
  "programa-de-puntos": { corto: "Programa de puntos", tu: "tu negocio", frase: "Que tus clientes vuelvan por el café gratis", apoyo: "Puntos, sellos y cupones en el celular de tus clientes." },
  "tiendas-de-cosmeticos": { corto: "Cosméticos", tu: "tu tienda", frase: "Tu tienda de cosméticos, vendiendo por internet", apoyo: "Catálogo, carrito y pagos en línea." },
}
