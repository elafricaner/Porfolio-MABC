# Guía Completa del Proyecto, Arquitectura y Machete de Defensa Oral
**Portfolio Web Full-Stack - Máximo Augusto Closs**  
*Materia: Programación Web / Práctica Integradora (Unidades 3, 4, 5 y 6)*

---

## 📌 1. Visión General del Proyecto

Este proyecto es una aplicación web **Full-Stack** compuesta por dos capas desacopladas:
1. **Frontend (Cliente):** Sitio web responsivo y accesible que muestra el perfil profesional, habilidades, formulario de contacto y una galería dinámica de proyectos. Incluye un modal de administración protegido por **DNI** para gestionar el CRUD.
2. **Backend (Servidor API REST):** Servidor desarrollado en **Node.js** con **Express**, conectado a **MongoDB** (mediante **Mongoose**) para la persistencia permanente de los datos, con tipado estático modelado en **TypeScript**.

```
┌────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (HTML5 + CSS3 + Vanilla JS)                                   │
│  - Modo Claro / Modo Oscuro con localStorage                           │
│  - Galería dinámica con Carrusel inteligente (> 3 proyectos)           │
│  - Modal CRUD con selector de imágenes locales de la PC                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Peticiones fetch() en JSON (HTTP)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BACKEND (Node.js + Express API REST)                                   │
│  - Endpoints: GET, POST, PUT, DELETE en /api/proyectos                 │
│  - Autenticación rápida por DNI en /api/auth/verificar-dni             │
│  - TypeScript en src/types/proyecto.ts (IProyecto, EstadoPublicacion)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Consultas asíncronas Mongoose
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BASE DE DATOS (MongoDB NoSQL)                                          │
│  - Colección: "proyectos"                                              │
│  - Persistencia permanente en disco (no se borra al reiniciar)         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 2. Tecnologías Utilizadas y su Rol

| Tecnología | Rol en el Proyecto | ¿Por qué se utilizó? |
| :--- | :--- | :--- |
| **HTML5 Semántico** | Estructura visual | Uso de etiquetas estándar (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) que mejoran el SEO y la accesibilidad. |
| **CSS3 Moderno** | Diseño y experiencia | Variables CSS custom properties, diseño fluido con Flexbox y CSS Grid, efectos de Glassmorphism y animaciones suaves. |
| **JavaScript (ES6+)** | Interactividad en el cliente | Peticiones asíncronas con `fetch()`, lectura de archivos locales en Base64 con `FileReader`, y lógica del carrusel con scroll-snap. |
| **Node.js** | Entorno de ejecución de servidor | Permite ejecutar JavaScript fuera del navegador con arquitectura no bloqueante orientada a eventos. |
| **Express.js** | Framework web de Backend | Simplifica la definición de rutas/endpoints REST, middlewares de `cors` y procesamiento de cuerpos JSON. |
| **MongoDB & Mongoose** | Base de datos NoSQL y ODM | Almacena los proyectos en documentos BSON/JSON flexibles y persistentes. Mongoose valida los datos según el esquema antes de guardarlos. |
| **TypeScript** | Tipado estático | Garantiza la integridad de los datos mediante contratos (`interface IProyecto`), validado con `tsc --noEmit`. |
| **dotenv** | Seguridad de configuración | Mantiene contraseñas, DNI y cadenas de conexión en el archivo `.env`, fuera del repositorio público. |

---

## 🛠️ 3. Dónde Modificar Cada Parte del Proyecto («Manual de Cambios Rápidos»)

Si necesitás cambiar configuraciones, datos o diseño, acá tenés la referencia exacta:

### A. Cambiar el DNI de acceso al Panel de Administración
* 📁 **Archivo:** `backend/.env`
* 🔍 **Línea a modificar:**
  ```env
  ADMIN_DNI=12345678
  ```
  *(Cambiá `12345678` por tu DNI real. Al guardar el archivo, ese será el nuevo DNI exigido en la ventana modal).*

### B. Cambiar el Puerto o la Conexión a MongoDB (Local o Atlas en la nube)
* 📁 **Archivo:** `backend/.env`
* 🔍 **Línea a modificar:**
  ```env
  PORT=3000
  MONGO_URI=mongodb://127.0.0.1:27017/portfolio_mabc
  ```
  *(Si usás MongoDB Atlas, reemplazás `MONGO_URI` por tu cadena `mongodb+srv://...`)*.

### C. Cambiar la Velocidad o Comportamiento del Carrusel
* 📁 **Archivo:** `frontend/js/script.js`
* 🔍 **Línea:**
  ```javascript
  const CARRUSEL_TIEMPO_PASO = 5500; // Milisegundos entre cada avance (5.5s)
  ```
  *(Podés bajarlo a `4000` si querés que vaya más rápido o subirlo a `7000` para que sea aún más pausado)*.

### D. Cambiar la Paleta de Colores (Modo Claro / Modo Oscuro)
* 📁 **Archivo:** `frontend/css/style.css`
* 🔍 **Líneas 4 a 60:**
  En `:root` podés cambiar los colores del modo claro (`--color-primario`, `--color-fondo`).  
  En `body.dark-mode` podés cambiar la paleta nocturna (`--color-fondo`, `--color-superficie`).

### E. Modificar los Proyectos Semilla Iniciales
* 📁 **Archivo:** `backend/src/server.js`
* 🔍 **Función:** `sembrarDatosIniciales()`  
  Contiene los datos predeterminados (*Yerbatera*, *YaPark*, *Robot Bluetooth*) que se cargan automáticamente si la base de datos está vacía.

---

## 📋 4. Cumplimiento Punto por Punto de la Consigna (PDF)

| Requerimiento del PDF | ¿Cómo está implementado? | Archivos de Referencia |
| :--- | :--- | :--- |
| **A. Gestión de Proyectos (CRUD)** | Obtiene los proyectos de MongoDB con `fetch()`. Permite Crear, Modificar, Consultar y Eliminar desde el modal. Posee nombre, descripción, tecnologías, imagen y estado de publicación. | `backend/src/routes/proyectos.js`<br>`frontend/js/script.js` |
| **B. Backend con Node.js y Express** | Servidor intermediario con endpoints REST (`GET`, `POST`, `PUT`, `DELETE`), validación de datos recibidos y respuestas con códigos HTTP (`200`, `201`, `400`, `404`). | `backend/src/server.js`<br>`backend/src/routes/proyectos.js` |
| **C. Base de Datos & Persistencia** | Conexión a MongoDB con Mongoose. Los datos permanecen guardados en disco aunque se apague la computadora o se reinicie el servidor. | `backend/src/config/db.js`<br>`backend/src/models/Proyecto.js` |
| **D. TypeScript Acotado** | Archivo de tipos con la interfaz `IProyecto` y el tipo unión `EstadoPublicacion = 'publicado' \| 'borrador'`. Verificado con `npm run check-types`. | `backend/src/types/proyecto.ts`<br>`backend/tsconfig.json` |
| **Organización de Carpetas** | Separación clara entre `frontend/` y `backend/`. Archivo `.gitignore` configurado para no subir `.env` ni `node_modules`. | Estructura de carpetas raíz y `.gitignore` |
| **UX & Carrusel Dinámico** | Al superar los 3 proyectos, el sitio no desborda verticalmente sino que activa un carrusel con flechas laterales, indicadores y auto-avance lento. | `frontend/css/style.css`<br>`frontend/js/script.js` |

---

## 🗣️ 5. Machete para la Defensa Oral (Preguntas Clave de los Profesores)

### Pregunta 1: «¿Cómo circula la información desde que el usuario guarda un proyecto hasta que se ve en la pantalla?»
> **Respuesta sugerida:**  
> *"El usuario completa el formulario y elige una imagen. El archivo `frontend/js/script.js` captura el evento `submit`, lee la imagen en Base64 con `FileReader` y emite una petición `fetch()` con método `POST` enviando un objeto JSON a la ruta `/api/proyectos` de nuestro backend.  
> El servidor Express recibe la petición, la procesa mediante `express.json()`, valida que los campos requeridos estén presentes y se la envía a Mongoose. Mongoose valida los tipos contra el esquema y ejecuta la inserción asíncrona en MongoDB.  
> MongoDB confirma la persistencia y Express devuelve una respuesta HTTP `201 Created` con el proyecto guardado. Al recibir la confirmación, el frontend ejecuta inmediatamente `cargarProyectos()`, re-renderizando dinámicamente la galería sin necesidad de recargar la página."*

### Pregunta 2: «¿Por qué eligieron una base de datos NoSQL como MongoDB en lugar de una Relacional (SQL)?»
> **Respuesta sugerida:**  
> *"Elegimos MongoDB porque su modelo orientado a documentos BSON/JSON encaja de forma nativa con el ecosistema de JavaScript y Node.js. En nuestro caso, cada proyecto posee atributos como un arreglo dinámico de tecnologías y enlaces opcionales, lo cual en un documento NoSQL se almacena como una estructura unificada y flexible sin necesidad de crear tablas intermedias ni costosas operaciones de `JOIN`. Además, permite escalar y modificar campos en el futuro sin requerir migraciones complejas de esquemas."*

### Pregunta 3: «¿Para qué incorporaron TypeScript y qué ventajas aporta frente a JavaScript?»
> **Respuesta sugerida:**  
> *"Incorporamos TypeScript en una parte acotada del proyecto (`backend/src/types/proyecto.ts`) para definir formalmente los contratos del modelo de datos mediante la interfaz `IProyecto` y un tipo unión para el estado de publicación (`'publicado' | 'borrador'`).  
> La gran diferencia es que JavaScript es de tipado dinámico y débil (los errores de tipo saltan recién cuando el código corre), mientras que TypeScript agrega tipado estático, permitiéndonos detectar errores en tiempo de compilación/desarrollo mediante `tsc --noEmit`, además de servir como documentación viva y permitir autocompletado inteligente."*

### Pregunta 4: «¿Cómo funciona el carrusel cuando hay más de 3 proyectos?»
> **Respuesta sugerida:**  
> *"La función `renderizarGaleriaProyectos()` evalúa la cantidad de proyectos publicados. Si hay 3 o menos, los muestra en la cuadrícula CSS Grid tradicional. Pero si se agregan más de 3 proyectos, el contenedor cambia a clase `.modo-carrusel` con `scroll-snap`, muestra las flechas flotantes de avance/retroceso y activa un temporizador que desplaza suavemente las tarjetas cada 5.5 segundos. Para asegurar una buena experiencia de usuario (UX), si el usuario pasa el mouse por encima para leer, el temporizador se pausa automáticamente."*

---

## ⚡ 6. Comandos Rápidos de Terminal

```bash
# Para iniciar el backend en modo desarrollo (con auto-recarga)
cd backend
npm run dev

# Para verificar que los tipos de TypeScript compilen sin errores
cd backend
npm run check-types
```
