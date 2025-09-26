# Axchi Portfolio - Portafolio Personal

Un portafolio personal moderno y futurista para Duvan Yair Arciniegas (Axchi), desarrollador de software especializado en soluciones web, móviles y automatización.

## 🚀 Características

- **Diseño Futurista**: Tema oscuro con acentos neón sutiles y animaciones fluidas
- **Completamente Responsivo**: Optimizado para móviles, tabletas y escritorios
- **Panel de Administración**: Sistema CMS completo para gestionar contenido
- **Autenticación**: Sistema de roles (Admin/Visitante) con NextAuth.js
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Funcionalidades Interactivas**: Likes, comentarios, formulario de contacto
- **Carga de Archivos**: Sistema de upload para imágenes y documentos
- **SEO Optimizado**: Metadatos y estructura optimizada para buscadores

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **UI Components**: shadcn/ui, Lucide React
- **Deployment**: Docker, Coolify (VPS)

## 📦 Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/axchisan/portfolio.git
cd portfolio
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
\`\`\`

Edita el archivo `.env` con tus configuraciones:
\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/axchi_portfolio"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
\`\`\`

4. **Configurar la base de datos**
\`\`\`bash
# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Poblar con datos iniciales
npm run db:seed
\`\`\`

5. **Ejecutar en desarrollo**
\`\`\`bash
npm run dev
\`\`\`

El sitio estará disponible en `http://localhost:3000`

## 🗃️ Estructura del Proyecto

\`\`\`
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticación
│   └── ...                # Páginas públicas
├── components/            # Componentes React
│   ├── admin/            # Componentes del admin
│   ├── auth/             # Componentes de auth
│   ├── sections/         # Secciones de páginas
│   └── ui/               # Componentes UI base
├── lib/                  # Utilidades y configuración
├── prisma/               # Esquema y migraciones
├── public/               # Archivos estáticos
└── types/                # Definiciones de tipos
\`\`\`

## 👤 Credenciales por Defecto

**Administrador:**
- Email: `admin@axchi.dev`
- Contraseña: `admin123`

## 🚀 Despliegue

### Con Docker

1. **Construir la imagen**
\`\`\`bash
docker build -t axchi-portfolio .
\`\`\`

2. **Ejecutar el contenedor**
\`\`\`bash
docker run -p 3000:3000 --env-file .env axchi-portfolio
\`\`\`

### Con Coolify (VPS)

1. Conecta tu repositorio a Coolify
2. Configura las variables de entorno
3. Despliega automáticamente

## 📝 Uso del Panel de Administración

1. **Acceder**: Visita `/admin` e inicia sesión
2. **Gestionar Perfil**: Edita información personal y habilidades
3. **Proyectos**: Crear, editar y eliminar proyectos
4. **Blog**: Escribir y publicar artículos
5. **Mensajes**: Ver y responder mensajes de contacto
6. **Configuración**: Ajustar configuraciones del sitio

## 🎨 Personalización

### Colores y Tema
Los colores se definen en `app/globals.css` usando variables CSS:
\`\`\`css
:root {
  --primary: oklch(0.488 0.243 264.376);
  --background: oklch(0.145 0 0);
  /* ... más variables */
}
\`\`\`

### Contenido Inicial
Modifica `prisma/seed.ts` para cambiar:
- Información personal
- Habilidades
- Servicios
- Configuraciones del sitio

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

**Duvan Yair Arciniegas (Axchi)**
- Email: contact@axchi.dev
- WhatsApp: +57 318 303 8190
- Instagram: [@axchisan](https://instagram.com/axchisan)
- GitHub: [@axchisan](https://github.com/axchisan)

---

Hecho con ❤️ en Colombia usando Next.js y Vercel
