# Guía de Despliegue con Docker y Coolify

## Configuración del Servidor VPS

### 1. Preparar el entorno

\`\`\`bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
\`\`\`

### 2. Configurar Coolify

\`\`\`bash
# Instalar Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
\`\`\`

### 3. Variables de Entorno

Crear archivo `.env` en el servidor:

\`\`\`env
# Base de datos
DATABASE_URL="postgresql://axchi:password@postgres:5432/axchi_portfolio"
POSTGRES_DB=axchi_portfolio
POSTGRES_USER=axchi
POSTGRES_PASSWORD=your_secure_password

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=https://tu-dominio.com

# Opcional: Para desarrollo local
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
\`\`\`

### 4. Configuración de Volúmenes

El sistema de archivos está configurado para usar volúmenes de Docker:

- **Uploads**: `/app/public/uploads` - Para archivos subidos (imágenes, videos, documentos)
- **Database**: `/var/lib/postgresql/data` - Para datos de PostgreSQL

### 5. Despliegue con Coolify

1. **Crear nuevo proyecto en Coolify**
2. **Conectar repositorio Git**
3. **Configurar variables de entorno**
4. **Configurar dominio personalizado**
5. **Habilitar SSL automático**

### 6. Comandos útiles

\`\`\`bash
# Ver logs de la aplicación
docker-compose logs -f app

# Ejecutar migraciones de Prisma
docker-compose exec app npx prisma migrate deploy

# Ejecutar seed de la base de datos
docker-compose exec app npm run db:seed

# Backup de la base de datos
docker-compose exec postgres pg_dump -U axchi axchi_portfolio > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U axchi axchi_portfolio < backup.sql
\`\`\`

### 7. Configuración de Nginx (si es necesario)

\`\`\`nginx
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /var/lib/docker/volumes/axchi-portfolio_uploads/_data/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
\`\`\`

### 8. Monitoreo y Mantenimiento

- **Logs**: Usar `docker-compose logs` para monitorear
- **Backups**: Configurar backups automáticos de la base de datos
- **Updates**: Usar Coolify para actualizaciones automáticas desde Git
- **SSL**: Coolify maneja SSL automáticamente con Let's Encrypt

### 9. Solución de Problemas

\`\`\`bash
# Reiniciar servicios
docker-compose restart

# Limpiar volúmenes (¡CUIDADO! Elimina datos)
docker-compose down -v

# Ver uso de espacio
docker system df

# Limpiar imágenes no utilizadas
docker system prune -a
\`\`\`

## Estructura de Archivos en el Servidor

\`\`\`
/app/
├── public/
│   └── uploads/
│       ├── images/
│       ├── videos/
│       └── documents/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
\`\`\`

Esta configuración te permite tener un sistema completo de gestión de archivos en tu propio servidor VPS con Docker y Coolify.
