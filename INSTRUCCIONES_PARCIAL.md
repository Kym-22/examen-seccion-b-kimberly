# 📋 Universidad Mariano Gálvez de Guatemala
## Facultad de Ingeniería en Sistemas de Información y Ciencias de la Computación
### Curso: Desarrollo Web / Ingeniería de Software
### Evaluación de Segundo Parcial - Sección B

---

## 🎯 Objetivo de la Evaluación
Evaluar la capacidad del estudiante para trabajar sobre un proyecto preexistente tipo **monorepo**, aplicando patrones de arquitectura empresarial, seguridad con tokens, patrones de pasarela (BFF / Proxy inverso), políticas de ciclo de vida de sesión y personalización de interfaces de usuario modernas.

---

## 🔗 Repositorio Base
El estudiante debe partir del siguiente repositorio oficial:
```text
https://github.com/ing-kelvin-castillo-umg/examen_seccion_b.git
```

---

## 🚀 Fase Inicial: Preparación del Entorno y Ramificación

1. **Clonación del Repositorio:**
   Clone el proyecto en su máquina local:
   ```bash
   git clone https://github.com/ing-kelvin-castillo-umg/examen_seccion_b.git
   cd examen_seccion_a
   ```

2. **Creación de la Rama de Trabajo (Feature Branch):**
   A partir de la rama `main`, cree una nueva rama cuyo nombre contenga su nombre, apellido y número de carné (en minúsculas y separado por guiones):
   ```bash
   # Formato: feature/<nombre>-<apellido>-<carne>
   git checkout -b feature/juan-perez-0901-20-12345
   ```
   > ⚠️ **Importante:** Todo el trabajo del examen debe desarrollarse y subirse sobre esta rama.

3. **Verificación Inicial:**
   Asegúrese de que el proyecto levanta correctamente con Docker Compose antes de realizar cambios:
   ```bash
   docker compose up --build
   ```
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Swagger Backend: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - Usuarios iniciales:
     - Administrador: `admin` / `admin123`
     - Usuario estándar: `user` / `user123`

---

## 🛠️ Requerimientos a Implementar (Fases del Examen)

El examen consta de **4 mejoras obligatorias**. Cada una debe ser realizada y confirmada con un **commit individual e independiente**, asegurándose de que la aplicación compile y no se rompa en ninguna fase.

---

### 1️⃣ Fase 1: Pasarela / Proxy Inverso en Next.js (BFF - Backend For Frontend)
* **Problema actual:** El cliente frontend (`browser`) realiza peticiones HTTP directas a la URL del backend (`http://localhost:8080`).
* **Requerimiento:**
  1. Oculte la dirección directa del backend hacia el cliente creando rutas controladoras internas en Next.js mediante **Route Handlers** (`src/app/api/...`) que funcionen como proxy/pasarela.
  2. Todas las llamadas desde los componentes de React o los servicios del cliente (`auth.service.ts`, `product.service.ts`, etc.) deben apuntar a las rutas locales de Next.js (por ejemplo: `/api/auth/login`, `/api/products`), y será este controlador de Next.js quien se encargue de reenviar la petición hacia el backend de Spring Boot, reenviar encabezados y devolver la respuesta.
  3. De esta forma, el navegador del cliente nunca conocerá la URL real del backend, protegiendo la infraestructura interna.
* **Commit requerido:**
  ```bash
  git add .
  git commit -m "feat(bff): implementación de proxy inverso en Next.js para ocultar URL del backend"
  ```

---

### 2️⃣ Fase 2: Implementación de Política de Refresh Token
* **Problema actual:** Se maneja únicamente un token JWT de acceso simple de larga duración.
* **Requerimiento:**
  1. Diseñar e implementar un flujo de **Refresh Token** para la renovación de credenciales.
  2. La política queda a criterio técnico del estudiante:
     - El backend debe generar un `refreshToken` al momento del login (o contar con un endpoint dedicado como `/api/auth/refresh`).
     - El frontend debe detectar cuando el token de acceso expiró o está próximo a expirar (o interceptar respuestas HTTP `401 Unauthorized`) y solicitar un nuevo access token de manera transparente sin desconectar al usuario intempestivamente.
     - Si el refresh token también expira o es revocado, debe redireccionar al login.
* **Commit requerido:**
  ```bash
  git add .
  git commit -m "feat(auth): implementación de política de refresh token en backend y frontend"
  ```

---

### 3️⃣ Fase 3: Detección de Inactividad y Logout Centralizado
* **Problema actual:** La sesión se mantiene abierta indefinidamente en el navegador mientras el token exista.
* **Requerimiento:**
  1. Implementar en el frontend un detector de actividad del usuario (escuchando eventos como `mousemove`, `keydown`, `click`, `scroll`, etc.).
  2. Si el usuario permanece inactivo durante un tiempo límite establecido (por ejemplo: entre 2 y 5 minutos para fines de prueba y evaluación):
     - El frontend debe cerrar la sesión automáticamente (`logout`).
     - Debe notificar al backend para registrar el cierre de sesión e invalidar/matar el token o la sesión activa.
     - Debe limpiar el almacenamiento local (`localStorage` / cookies) y redirigir inmediatamente a la pantalla de login con un mensaje informativo: *"Sesión cerrada por inactividad"*.
* **Commit requerido:**
  ```bash
  git add .
  git commit -m "feat(security): control de inactividad de usuario y cierre de sesión sincronizado con backend"
  ```

---

### 4️⃣ Fase 4: Personalización Visual y Nueva Paleta de Colores
* **Problema actual:** El sistema cuenta con la paleta de colores base predeterminada.
* **Requerimiento:**
  1. Diseñar y aplicar una **nueva paleta de colores distintiva** a través de Tailwind CSS (`tailwind.config.ts` o variables CSS).
  2. Realizar mejoras visuales a criterio personal tanto en:
     - La **página pública** (Landing page, Hero, Carrusel de productos).
     - La **página privada** (Dashboard, Sidebar, tarjetas de métricas, estilos del DataTable y modales).
  3. Se evaluará el criterio estético, la usabilidad (UX), la coherencia cromática y la respuesta responsiva en dispositivos móviles.
* **Commit requerido:**
  ```bash
  git add .
  git commit -m "feat(ui): renovación de paleta de colores y mejoras visuales en landing y dashboard"
  ```

---

## 📌 Resumen del Historial de Commits Obligatorio

En su rama de examen, el historial de Git (`git log --oneline`) debe reflejar claramente los commits separados:

```text
* [hash] feat(ui): renovación de paleta de colores y mejoras visuales en landing y dashboard
* [hash] feat(security): control de inactividad de usuario y cierre de sesión sincronizado con backend
* [hash] feat(auth): implementación de política de refresh token en backend y frontend
* [hash] feat(bff): implementación de proxy inverso en Next.js para ocultar URL del backend
* 4b13f4e feat: inicialización de monorepo con Backend Spring Boot 3 (Java 21), Frontend Next.js, PostgreSQL, Liquibase y Docker Compose
```

---

## 📤 Instrucciones de Entrega

Para la entrega final en la plataforma educativa, debe adjuntar:

1. **Enlace a la Rama Creada en GitHub:**
   - Asegúrese de haber realizado `git push -u origin feature/<nombre>-<apellido>-<carne>`.
   - Ejemplo: `https://github.com/ing-kelvin-castillo-umg/examen_seccion_b/tree/feature/juan-perez-0901-20-12345`

2. **Documento en Formato PDF:**
   El archivo PDF debe incluir una carátula formal y la evidencia visual de cada una de las 4 fases:
   - **Evidencia Fase 1 (BFF):** Captura de la pestaña *Red (Network)* de las herramientas de desarrollo del navegador mostrando que las peticiones se dirigen a Next.js (ej: `http://localhost:3000/api/...`) y que la dirección directa del backend (`:8080`) no aparece expuesta.
   - **Evidencia Fase 2 (Refresh Token):** Captura de la consola o pestaña de red evidenciando la petición de refresco de token y la obtención del nuevo token sin interrupción del usuario.
   - **Evidencia Fase 3 (Inactividad):** Captura del temporizador o momento en que se activa el cierre por inactividad, la redirección al login y la petición de invalidación enviada al backend.
   - **Evidencia Fase 4 (Diseño y Colores):** Capturas del antes y después de la nueva paleta de colores aplicada a la página pública (carrusel) y a la vista privada (DataTable y Dashboard).

---

## ⚖️ Rúbrica de Evaluación

| Criterio | Descripción | Ponderación |
| :--- | :--- | :---: |
| **Fase 1: BFF / Proxy en Next.js** | Ocultamiento efectivo de la API del backend mediante rutas controladoras en Next.js. | **25%** |
| **Fase 2: Refresh Token** | Renovación de token de sesión según política definida y validada con el backend. | **25%** |
| **Fase 3: Logout por Inactividad** | Detección de inactividad del usuario, cierre de sesión y llamada de invalidación al backend. | **25%** |
| **Fase 4: UI & Paleta de Colores** | Cambio sustancial y profesional de colores y mejoras visuales en vistas públicas y privadas. | **15%** |
| **Control de Versiones y Entrega** | Commits separados por fase, rama con nomenclatura correcta y PDF con capturas requeridas. | **10%** |
| **Total** | | **100%** |
