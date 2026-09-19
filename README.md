# Examen Parcial - Arquitectura Monorepo (Spring Boot + Next.js + PostgreSQL)

Sistema web integral desarrollado como monorepo con backend desacoplado en Java 21 (Spring Boot 3), frontend en Next.js (React 18), base de datos relacional PostgreSQL con migraciones automáticas en Liquibase, autenticación y autorización basada en JWT con roles diferenciados, y orquestación con Docker Compose.

---

## 🏛️ Arquitectura del Proyecto

El proyecto implementa una arquitectura limpia por capas tanto en el **Backend** como en el **Frontend**:

### Backend (Spring Boot 3.4 / Java 21)
- **Controller**: Expone los endpoints REST protegidos y documentados con Swagger/OpenAPI.
- **DTO**: Objetos de transferencia de datos separados en peticiones (`request`) y respuestas (`response`), con validaciones de entrada (`@NotBlank`, `@NotNull`, etc.).
- **Mapper**: Capa dedicada (`ProductMapper`, `UserMapper`) responsable de la transformación bidireccional entre Entidades JPA y DTOs.
- **Service & Service Impl**: Principio de inversión de dependencias con interfaces (`AuthService`, `ProductService`) e implementaciones concretas en `service.impl.*` (`AuthServiceImpl`, `ProductServiceImpl`).
- **Repository**: Patrón Repository mediante interfaces de Spring Data JPA (`UserRepository`, `RoleRepository`, `ProductRepository`).
- **Entity**: Entidades del modelo relacional mapeadas con JPA (`User`, `Role`, `Product`).
- **Security & JWT**: Filtro `OncePerRequestFilter`, generador y validador de tokens JWT con algoritmos HMAC-SHA256, y autenticación sin estado (*stateless*).
- **Liquibase**: Migraciones versionadas en `src/main/resources/db/changelog/` para creación de tablas e inserción de semillas (roles, usuarios, productos).

### Frontend (Next.js 14 / React 18 / Tailwind CSS / TypeScript)
- **DTOs (`src/dtos/`)**: Interfaces de TypeScript que definen exactamente los datos recibidos y enviados por la red (`AuthResponseDto`, `ProductRequestDto`, etc.).
- **Entities (`src/entities/`)**: Modelos limpios de dominio del cliente (`User`, `Product`, `AuthSession`) enriquecidos para la interfaz.
- **Mappers (`src/mappers/`)**: Funciones puras encargadas de mapear DTOs a Entidades y Entidades a DTOs de petición.
- **Services (`src/services/`)**: Servicios de red tipados (`AuthService`, `ProductService`, `ApiClient`) con inyección del token JWT en el encabezado `Authorization: Bearer <token>`.
- **Context (`src/context/`)**: Estado reactivo global de autenticación (`AuthContext`).
- **Components (`src/components/`)**:
  - `Carousel`: Carrusel dinámico de productos en la página principal con auto-avance, navegación por flechas e indicadores.
  - `Navbar` & `Sidebar`: Barras de navegación con control de estado y visualización de roles.
  - `DataTable`: Tabla con buscador en tiempo real sobre todos los campos (nombre, descripción, categoría, precio, stock).
  - `ProductModals`: Modales para "Ver Producto" (visualización en tamaño grande), "Crear/Editar Producto" y "Confirmación de Eliminación".

---

## 🔑 Credenciales de Acceso

Las cuentas iniciales se cargan automáticamente en la base de datos mediante los changelogs de Liquibase con contraseñas cifradas en **BCrypt**:

| Usuario | Contraseña | Rol | Permisos |
| :--- | :--- | :--- | :--- |
| **`admin`** | `admin123` | `ROLE_ADMIN` | Ver productos, crear nuevos productos, editar y eliminar productos. |
| **`user`** | `user123` | `ROLE_USER` | Ver catálogo y productos en detalle. No puede crear, editar ni eliminar. |

> **Nota:** La pantalla de inicio de sesión (`/login`) cuenta con botones de **autocompletado rápido** ("Rol Admin" y "Rol Usuario") para agilizar las pruebas y la revisión.

---

## 🚀 Despliegue con Docker Compose (Recomendado)

Todo el ecosistema se levanta mediante un solo comando, el cual compila los contenedores, ejecuta el motor de PostgreSQL, aplica las migraciones de Liquibase y despliega las aplicaciones:

```bash
docker compose up --build
```

### Servicios Levantados:
1. **Frontend**: [http://localhost:3000](http://localhost:3000)
2. **Backend API**: [http://localhost:8080](http://localhost:8080)
3. **Swagger UI (Documentación interactiva)**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
4. **PostgreSQL**: `localhost:5432` (Base de datos: `examen_db`)

Para detener los servicios:
```bash
docker compose down
```

---

## 🛠️ Ejecución en Desarrollo Local (Sin Docker)

### 1. Base de Datos PostgreSQL
Asegúrate de contar con una base de datos PostgreSQL local:
```sql
CREATE DATABASE examen_db;
```

### 2. Backend (Spring Boot)
Requiere **Java 21** y **Maven**:
```bash
cd backend
mvn clean spring-boot:run
```
*Las migraciones de Liquibase se ejecutarán automáticamente al iniciar la aplicación.*

### 3. Frontend (Next.js)
Requiere **Node.js 18+** (recomendado v20+ o v22+):
```bash
cd frontend
npm install
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📡 Resumen de Endpoints de la API REST

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener token JWT | Público |
| `GET` | `/api/auth/me` | Obtener perfil del usuario en sesión | Autenticado |
| `GET` | `/api/products` | Listar productos (con soporte `?query=`) | Público / Carrusel |
| `GET` | `/api/products/{id}` | Obtener detalle de un producto por ID | Público / Autenticado |
| `POST` | `/api/products` | Crear un nuevo producto | **ROLE_ADMIN** |
| `PUT` | `/api/products/{id}` | Modificar un producto existente | **ROLE_ADMIN** |
| `DELETE` | `/api/products/{id}` | Eliminar un producto | **ROLE_ADMIN** |

---

## 📂 Estructura de Archivos del Repositorio

```
app_segundo_parcial/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/umg/examen/
│       │   │   ├── ExamenApplication.java
│       │   │   ├── config/ (CorsConfig, OpenApiConfig, SecurityConfig, GlobalExceptionHandler)
│       │   │   ├── controller/ (AuthController, ProductController)
│       │   │   ├── dto/
│       │   │   │   ├── request/ (LoginRequest, ProductRequest)
│       │   │   │   └── response/ (ApiResponse, AuthResponse, ProductResponse, UserResponse)
│       │   │   ├── entity/ (Product, Role, User)
│       │   │   ├── mapper/ (ProductMapper, UserMapper)
│       │   │   ├── repository/ (ProductRepository, RoleRepository, UserRepository)
│       │   │   ├── security/ (CustomUserDetailsService, JwtAuthenticationEntryPoint, JwtAuthenticationFilter, JwtTokenProvider)
│       │   │   └── service/
│       │   │       ├── AuthService.java
│       │   │       ├── ProductService.java
│       │   │       └── impl/ (AuthServiceImpl.java, ProductServiceImpl.java)
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/changelog/
│       │           ├── db.changelog-master.xml
│       │           ├── 001-create-users-roles.xml
│       │           ├── 002-insert-roles-users.xml
│       │           ├── 003-create-products.xml
│       │           └── 004-insert-initial-products.xml
│       └── test/java/com/umg/examen/PasswordEncoderTest.java
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx (Página pública con Carrusel interactivo)
│       │   ├── login/page.tsx (Pantalla de login con presets)
│       │   └── dashboard/
│       │       ├── layout.tsx (Layout privado con Sidebar)
│       │       └── products/page.tsx (DataTable con CRUD y control de roles)
│       ├── components/ (Navbar, Carousel, Sidebar, DataTable, ProductModals)
│       ├── context/ (AuthContext)
│       ├── dtos/ (auth.dto.ts, product.dto.ts)
│       ├── entities/ (user.entity.ts, product.entity.ts)
│       ├── mappers/ (auth.mapper.ts, product.mapper.ts)
│       └── services/ (api.client.ts, auth.service.ts, product.service.ts)
├── docker-compose.yml
├── .gitignore
└── README.md
```
