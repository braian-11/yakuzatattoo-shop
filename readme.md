# Yakuza Tattoo | Shop Profesional de Insumos

Este proyecto es un simulador interactivo de e-commerce diseñado específicamente para la industria del tatuaje (Yakuza Tattoo Supply). La aplicación gestiona un catálogo dinámico optimizado para dos perfiles de clientes (Minorista y Mayorista), permitiendo la administración de stock en tiempo real y la consolidación de pedidos listos para su envío.

---

## 🚀 Características Principales

* **Asincronismo y API Simulada:** Carga de catálogo dinámico desde un entorno local mediante solicitudes HTTP asincrónicas.
* **Persistencia de Datos:** Almacenamiento local del estado del carrito y la preferencia del modo de facturación (Mayorista/Minorista) para evitar la pérdida de información tras la recarga de la página.
* **Manejo Funcional de Datos:** Filtrado por categorías y buscador semántico en tiempo real utilizando métodos declarativos de arrays.
* **Validación de Reglas de Negocio:** Control estricto de stock por artículo individual, impidiendo la sobrecompra mediante flujos lógicos de control.
* **Experiencia de Usuario (UX) No Bloqueante:** Reemplazo absoluto de los cuadros de diálogo nativos del navegador por alertas dinámicas y notificaciones estilizadas.
* **Integración de Canales de Venta:** Generación automatizada de hilos de texto optimizados para la API externa de WhatsApp.

---

## 🛠️ Tecnologías y Herramientas Utilizadas

* **HTML5:** Estructuración semántica avanzada para accesibilidad de componentes.
* **CSS3:** Diseño responsivo basado en CSS Grid (`auto-fit`/`minmax`) y Flexbox para la alineación estructural de elementos dinámicos.
* **JavaScript (ECMAScript 6):** * Manipulación avanzada y delegación de eventos del DOM.
  * Flujos asincrónicos con `async/await` y control de excepciones mediante bloques `try/catch`.
  * Modularización lógica mediante desestructuración de objetos (`...spread operator`).
  * Métodos de arrays (`filter`, `find`, `reduce`, `forEach`).
* **SweetAlert2:** Gestión de ventanas modales interactivas para el control de errores y vaciado de datos.
* **Toastify JS:** Notificaciones emergentes ligeras para la confirmación de operaciones exitosas en segundo plano.

---

## 💻 Instrucciones de Ejecución

Para garantizar el correcto funcionamiento de las solicitudes asincrónicas (`Fetch`), el proyecto debe ser ejecutado en un entorno de servidor local:

1. Clonar o descargar el repositorio.
2. Abrir la carpeta raíz con **Visual Studio Code**.
3. Ejecutar el proyecto utilizando la extensión **Live Server** (botón *Go Live*). 
   * *Nota: La ejecución directa por protocolo de archivos (`file://`) generará bloqueos de seguridad de tipo CORS en el navegador.*