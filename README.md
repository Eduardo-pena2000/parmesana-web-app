# 🍕 La Parmesana - Sistema Web Completo

Sistema completo de pedidos en línea para **La Parmesana**, incluyendo:
- ✅ **Backend API REST** (Node.js + Express + PostgreSQL)
- ✅ **Frontend Web App** (React + Vite + Tailwind CSS)
- ✅ **PWA** (instalable como app nativa)
- ✅ **Integración con Chatbot de WhatsApp** (compartiendo la misma base de datos)

---

## 📋 Características

### Backend
- Autenticación JWT con refresh tokens
- Gestión completa de usuarios con roles
- Sistema de pedidos con múltiples estados
- Menú digital con categorías y precios dinámicos
- Sistema de puntos de lealtad
- Integración con Mercado Pago
- Compatible con chatbot de WhatsApp existente

### Frontend
- Diseño moderno y responsive (mobile-first)
- Carrito de compras persistente
- Búsqueda y filtros avanzados
- Sistema de autenticación completo
- Historial de pedidos
- Perfil de usuario
- PWA instalable (funciona offline)
- Dark mode

---

## 🚀 Instalación Rápida

### Requisitos Previos
- Node.js v16+
- PostgreSQL 13+
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd parmesana-webapp
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Crear base de datos
createdb parmesana_db

# Poblar base de datos con datos de ejemplo
npm run seed

# Iniciar servidor
npm run dev
```

El backend estará en: `http://localhost:3000`

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Por defecto: VITE_API_URL=http://localhost:3000/api

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará en: `http://localhost:5173`

---

## 📊 Estructura del Proyecto

```
parmesana-webapp/
├── backend/                    # API REST
│   ├── src/
│   │   ├── config/            # Configuraciones (DB, etc.)
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── middleware/        # Auth, validación
│   │   ├── models/            # Modelos de Sequelize
│   │   └── routes/            # Rutas de la API
│   ├── server.js              # Servidor Express
│   ├── seed.js                # Seed de base de datos
│   └── package.json
│
├── frontend/                   # Web App React
│   ├── public/
│   │   └── icons/             # Iconos PWA
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/           # Zustand stores
│   │   ├── pages/             # Páginas de la app
│   │   ├── services/          # Servicios API
│   │   ├── App.jsx            # App principal
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
└── README.md                   # Este archivo
```

---

## 🔧 Uso

### Credenciales de Prueba

Después de ejecutar `npm run seed`, puedes usar:

```
Email: admin@laparmesana.com
Password: admin123
```

### API Endpoints

#### Autenticación
```bash
POST /api/auth/register    # Registrar usuario
POST /api/auth/login       # Login
POST /api/auth/refresh     # Refresh token
GET  /api/auth/me          # Usuario actual
```

#### Menú
```bash
GET /api/menu/categories         # Listar categorías
GET /api/menu/categories/:slug   # Categoría por slug
GET /api/menu/items              # Listar items (con filtros)
GET /api/menu/items/:slug        # Item por slug
GET /api/menu/popular            # Items populares
GET /api/menu/featured           # Items destacados
GET /api/menu/search?q=pizza     # Buscar
```

#### Pedidos (requieren autenticación)
```bash
POST /api/orders                 # Crear pedido
GET  /api/orders                 # Listar pedidos del usuario
GET  /api/orders/:id             # Obtener pedido
PUT  /api/orders/:id/cancel      # Cancelar pedido
PUT  /api/orders/:id/rate        # Calificar pedido
GET  /api/orders/stats           # Estadísticas
```

---

## 🎨 Colores de Marca

La app usa los colores oficiales de **La Parmesana**:

- **Verde**: `#00A650` (Primario)
- **Rojo**: `#CE2B37` (Acentos)
- **Amarillo**: `#FFD700` (Detalles)
- **Negro**: `#000000` (Fondos)
- **Blanco**: `#FFFFFF` (Texto)

---

## 🔗 Integración con Chatbot de WhatsApp

Este sistema comparte la **misma base de datos** con tu chatbot de WhatsApp existente. Los pedidos pueden crearse desde:

1. **Web App** → Este sistema
2. **WhatsApp** → Tu chatbot existente

Ambos sistemas leen y escriben en las mismas tablas:
- `users` - Usuarios
- `orders` - Pedidos
- `menu_items` - Items del menú
- `categories` - Categorías

---

## 📦 Despliegue en Producción

### Backend (Railway)

```bash
cd backend

# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Agregar PostgreSQL
railway add

# Deploy
railway up

# Configurar variables de entorno en Railway Dashboard
```

### Frontend (Vercel/Netlify)

**Vercel:**
```bash
cd frontend

# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configurar VITE_API_URL en Vercel Dashboard
```

**Netlify:**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Configurar VITE_API_URL en Netlify Dashboard
```

---

## 🛠️ Scripts Disponibles

### Backend
```bash
npm start          # Iniciar en producción
npm run dev        # Desarrollo con nodemon
npm run seed       # Poblar base de datos
```

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
```

---

## 📱 PWA (Progressive Web App)

La web app es una PWA completa, lo que significa que:

- ✅ Se puede **instalar** en el teléfono como app nativa
- ✅ Funciona **offline** (caché)
- ✅ **Push notifications** (futuro)
- ✅ **App icon** en pantalla de inicio

Para instalar:
1. Abre la web en tu móvil
2. Toca el botón "Agregar a pantalla de inicio"
3. ¡Listo! Ahora tienes la app instalada

---

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Refresh tokens
- ✅ Bcrypt para passwords
- ✅ Helmet.js para seguridad HTTP
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Validación de entrada
- ✅ Prepared statements (SQL injection protection)

---

## 📞 Soporte

Para dudas o problemas:

- **Teléfono**: 828 100 5914
- **WhatsApp**: https://wa.me/528281005914
- **Dirección**: Joaquín Valle Ramírez 416, Cadereyta Jiménez, NL

---

## 📄 Licencia

© 2026 La Parmesana. Todos los derechos reservados.

---

## 🙏 Desarrollado con ❤️ en Cadereyta Jiménez, NL

**Stack Tecnológico:**
- Node.js + Express
- React + Vite
- PostgreSQL + Sequelize
- Tailwind CSS
- Zustand
- Axios
- JWT
- Bcrypt

---

¡Tu sistema está listo para recibir pedidos! 🎉🍕
