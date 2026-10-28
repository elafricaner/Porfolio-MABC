# Portfolio Web Full-Stack - Máximo Augusto Closs
**Actividad Integradora: Unidades 3, 4, 5 y 6**  
*Backend, Persistencia de Datos en Base de Datos NoSQL y Tipado Estático con TypeScript*

---

## 📋 Descripción del Proyecto
Este proyecto corresponde a la segunda etapa integradora del Portfolio Web Personal. El sitio fue transformado en una aplicación web full-stack que consulta y gestiona proyectos en tiempo real conectados a una base de datos **MongoDB**, procesando las operaciones a través de un servidor intermediario desarrollado con **Node.js y Express**, e incorporando tipado estático con **TypeScript**.

Cuenta además con un panel emergente de administración con control de acceso por **DNI** para realizar las operaciones CRUD (Crear, Consultar, Modificar y Eliminar) sobre los proyectos del portfolio.

---

## 🚀 Tecnologías Utilizadas

### Frontend
* **HTML5**: Estructura semántica moderna (`<header>`, `<main>`, `<section>`, modal accesible).
* **CSS3**: Variables CSS (Modo Claro / Modo Oscuro con `localStorage`), Flexbox, CSS Grid contemporáneo, Glassmorphism y diseño responsive.
* **JavaScript (Vanilla JS)**: Consumo de la API REST mediante `fetch()`, manipulación del DOM en tiempo real y modal interactivo con validación de DNI.

### Backend & Persistencia
* **Node.js**: Entorno de ejecución asíncrono del lado del servidor.
* **Express.js**: Framework para la creación de la API REST y enrutamiento de endpoints.
* **MongoDB**: Base de datos NoSQL documental para la persistencia permanente de los datos.
* **Mongoose**: Modelado de objetos (ODM) para definir esquemas, validaciones y consultas a MongoDB.
* **TypeScript**: Modelado de tipos e interfaces (`IProyecto`, tipo unión `EstadoPublicacion`) garantizando tipado estático.
* **dotenv & cors**: Manejo seguro de variables de entorno y habilitación de peticiones cruzadas.

---

## 📁 Estructura del Proyecto

El repositorio respeta la separación de capas requerida por la consigna:

```text
Porfolio-MABC/
├── frontend/                     # Capa de presentación (Cliente)
│   ├── index.html                # Estructura del portfolio y modal de administración
│   ├── css/
│   │   └── style.css             # Estilos, variables y modo oscuro
│   ├── js/
│   │   └── script.js             # Lógica cliente, fetch() a la API y validaciones
│   └── img/                      # Activos gráficos optimizados (PNG/JPG)
│
├── backend/                      # Capa de servidor y datos (Servidor)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Conexión asíncrona a MongoDB
│   │   ├── models/
│   │   │   └── Proyecto.js       # Esquema Mongoose de Proyectos
│   │   ├── routes/
│   │   │   └── proyectos.js      # Endpoints CRUD (GET, POST, PUT, DELETE)
│   │   ├── types/
│   │   │   └── proyecto.ts       # Interfaces y tipos en TypeScript
│   │   └── server.js             # Servidor Express, CORS, sembrado inicial
│   ├── .env                      # Variables de entorno (Ignorado en Git)
│   ├── .env.example              # Plantilla de variables para la entrega
│   ├── package.json              # Dependencias y scripts de ejecución
│   └── tsconfig.json             # Configuración del compilador TypeScript
│
├── .gitignore                    # Exclusión de node_modules y archivos confidenciales
└── README.md                     # Documentación técnica y guía de defensa
```

---

## 🛠️ Instrucciones de Instalación y Ejecución

### Prerrequisitos
* Tener instalado **Node.js** (v18 o superior).
* Tener iniciado el servicio de **MongoDB** localmente (`mongodb://127.0.0.1:27017`) o contar con una cadena de conexión a **MongoDB Atlas**.

### Paso 1: Configurar el Backend
1. Abrir una terminal y navegar a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Verificar el archivo de configuración `.env`:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/portfolio_mabc
   ADMIN_DNI=12345678
   ```

### Paso 2: Iniciar el Servidor Backend
Ejecutar en la carpeta `backend`:
```bash
npm run dev
```
*(Al iniciar por primera vez, el servidor sembrará automáticamente los proyectos predeterminados en MongoDB para que la galería nunca arranque vacía).*

### Paso 3: Visualizar el Portfolio
Podés ver el proyecto de dos formas:
1. **Directo desde el servidor Node.js (Recomendado):** Abrir en el navegador [http://localhost:3000](http://localhost:3000).
2. **Abriendo el archivo HTML:** Abrir `frontend/index.html` con doble clic o con la extensión Live Server de VS Code.

---

## 🔐 Panel de Gestión de Proyectos (CRUD con DNI)

Para demostrar el funcionamiento del CRUD durante la defensa:
1. En la barra superior o en la sección de proyectos, hacer clic en el botón de engranaje **⚙️ Administrar**.
2. Se abrirá la ventana emergente solicitando el **DNI de Administrador**.
   * **¿Dónde cambiar el DNI?:** En el archivo `backend/.env`, en la variable `ADMIN_DNI=tu_dni`. Por defecto está en `12345678`.
3. Una vez autenticado, se habilita el panel para:
   * **Crear:** Completar el formulario, hacer clic en **«📁 Elegir imagen desde tu PC»** para seleccionar cualquier imagen local de tu computadora (se convertirá a Base64 con previsualización) y pulsar *"Guardar Proyecto"*.
   * **Consultar:** Ver la lista de proyectos cargados desde MongoDB en tiempo real. Soporta 10 o más proyectos sin límite de capacidad.
   * **Modificar:** Hacer clic en *"Editar"* sobre cualquier proyecto, modificar sus campos y pulsar *"Actualizar Cambios"*.
   * **Eliminar:** Hacer clic en *"Eliminar"* y confirmar la acción.

---

## 🎓 Machete Teórico para la Defensa Oral

### 1. Justificación de la Base de Datos (No Relacional vs Relacional)
* **¿Por qué MongoDB (NoSQL)?**  
  Se seleccionó MongoDB por ser una base de datos **orientada a documentos (formato BSON/JSON)**. Resulta idónea para este tipo de aplicación porque la estructura de un proyecto (que incluye arrays de tecnologías, estados y metadatos) se almacena y transporta de forma natural hacia el frontend sin requerir complejas transformaciones relacionales. Permite flexibilidad ante futuros cambios sin necesidad de migraciones de tablas.
* **Diferencia con Bases Relacionales (SQL):**  
  En una base SQL (como MySQL o PostgreSQL), los datos se estructuran en tablas rígidas con filas y columnas fuertemente tipadas, requiriendo claves foráneas y uniones (`JOIN`) para relacionar entidades. En MongoDB, los datos se almacenan en colecciones de documentos autocontenidos y flexibles.

### 2. Incorporación de TypeScript
* **Ventajas del Tipado Estático:**
  1. **Prevención de Errores:** Detecta inconsistencias de tipos durante el desarrollo antes de ejecutar el código en producción.
  2. **Contratos Claros:** La interfaz `IProyecto` y el tipo unión `type EstadoPublicacion = 'publicado' | 'borrador'` garantizan que ningún proyecto se guarde sin sus propiedades obligatorias ni con estados inventados.
  3. **Mantenibilidad y Autocompletado:** Facilita la colaboración y refactorización asistida por el editor.
* **Diferencia entre TypeScript y JavaScript:**  
  JavaScript es un lenguaje interpretado de tipado dinámico y débil (los tipos se evalúan en tiempo de ejecución). TypeScript es un superconjunto de JavaScript que introduce tipado estático y chequeo en tiempo de compilación.

### 3. Circulación del Flujo de Datos (De Punta a Punta)
1. **Frontend:** El usuario interactúa con la interfaz o el modal y el archivo `script.js` emite una petición asíncrona mediante `fetch()` (`GET`, `POST`, `PUT` o `DELETE`) enviando datos en formato JSON.
2. **Backend (Express):** El servidor recibe la petición en la ruta `/api/proyectos`, pasa por los middlewares de `cors` y `express.json()`, y ejecuta el controlador correspondiente validando la información recibida.
3. **Persistencia (Mongoose & MongoDB):** Mongoose valida el esquema y ejecuta la consulta asíncrona contra la base de datos MongoDB (por ejemplo `Proyecto.find()` o `Proyecto.create()`).
4. **Respuesta:** MongoDB responde a Mongoose, Express formatea la respuesta en un código de estado HTTP (`200 OK`, `201 Created`) con payload JSON y la envía de vuelta al cliente.
5. **Renderizado:** El frontend recibe el JSON, manipula el DOM de manera reactiva y actualiza la galería de proyectos instantáneamente sin necesidad de recargar la página.

---

## 👤 Autor
* **Estudiante:** Máximo Augusto Closs
* **Carrera:** Tecnicatura en Gestión de Software e Innovación Tecnológica / Software y Análisis de Sistemas
* **Año:** 2026
