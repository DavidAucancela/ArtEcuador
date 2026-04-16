# ArtEcuador — Catálogo de Artesanías

Catálogo web estático de artesanías ecuatorianas. Un único archivo `index.html` con CSS y JS inline, sin frameworks ni dependencias de build.

---

## Estructura del proyecto

```
ArtEcuador/
├── index.html              # Todo el proyecto: HTML + CSS + JS
├── index.backup.html       # Backup del MVP original (no modificar)
├── Dockerfile              # Imagen nginx:alpine para producción
├── nginx.conf              # Configuración nginx en puerto 8080
└── media/
    ├── logoFinal.png       # Logo principal (cover + footer)
    ├── iconoFinal.png      # Ícono cuadrado (navbar)
    └── products/           # Fotos reales de productos
        ├── mascaras-general.jpg
        ├── batea-tigua.jpg
        ├── nacimiento-mini.jpg
        ├── cruces-tigua.jpg
        └── mitad-del-mundo-marmol-oscuro.jpg
```

---

## Desarrollo local

### Opción 1 — Python (sin instalación)

```bash
python3 -m http.server 8000
```

Abre el navegador en `http://localhost:8000`

### Opción 2 — Node (npx)

```bash
npx serve .
```

### Opción 3 — Abrir directamente

```bash
open index.html
```

> Las fuentes de Google Fonts requieren conexión a internet. Sin ella, el sitio usa la fuente del sistema.

---

## Docker

### Construir la imagen

```bash
docker build -t artecuador .
```

### Ejecutar el contenedor

```bash
docker run -p 8080:8080 artecuador
```

Abre el navegador en `http://localhost:8080`

### Detener el contenedor

```bash
docker ps                          # obtener el CONTAINER_ID
docker stop <CONTAINER_ID>
```

---

## Despliegue en Railway

El proyecto está configurado para desplegarse en [Railway](https://railway.app) usando el `Dockerfile` incluido.

- **Puerto expuesto:** `8080` (requerido por Railway)
- **Servidor:** nginx:alpine
- El archivo `nginx.conf` redirige todas las rutas a `index.html`

### Pasos para desplegar

1. Conecta el repositorio en Railway
2. Railway detecta el `Dockerfile` automáticamente
3. El despliegue inicia en cada push a `main`

---

## Secciones del catálogo

| ID | Sección | Contenido |
|---|---|---|
| `#portada` | Cover / Hero | Logo, bajada y llamada a acción |
| `#origen` | Hecho a mano | Historia + grid de stats andinos |
| `#joyeria` | Joyería Artesanal | 4 productos |
| `#textiles` | Textiles Andinos | 4 productos |
| `#ceramica` | Cerámica | 4 productos |
| `#decoracion` | Decoración | 4 productos |
| `#tigua` | Arte Tigua | 4 productos con fotos reales |
| `#contactar` | Contacto | Formulario + datos + redes sociales |

---

## Tokens de diseño

| Token | Valor | Uso |
|---|---|---|
| `--red` | `#D7262E` | Color principal, botones CTA |
| `--yellow` | `#F4C430` | Acentos, badges |
| `--green` | `#4CAF50` | Badges "Nuevo" |
| `--blue` | `#2D9CDB` | Badges "Destacado" |
| `--purple` | `#6A1B9A` | Badges "Limitado" |
| `--bg` | `#FAFAF8` | Fondo general |

**Tipografía:** `Playfair Display` (títulos, precios) · `Montserrat` (cuerpo, nav, etiquetas)

---

## Agregar un producto con foto real

1. Copia la imagen a `media/products/nombre-sin-espacios.jpg`
2. Usa el patrón de tarjeta con `class="product-img-real"` en el HTML:

```html
<div class="product-card">
  <div class="product-img-wrap">
    <img src="media/products/nombre-sin-espacios.jpg" alt="Nombre" class="product-img-real" />
    <span class="product-badge feat">Destacado</span>
    <button class="add-btn" aria-label="Añadir al carrito">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M8 3v10M3 8h10" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
  <div class="product-body">
    <p class="product-category">Categoría · Subcategoría</p>
    <h3 class="product-name">Nombre del producto</h3>
    <p class="product-desc">Descripción corta.</p>
    <div class="product-footer">
      <a href="#" class="product-detail-link">Ver</a>
    </div>
  </div>
</div>
```

---

## Responsive

| Breakpoint | Comportamiento |
|---|---|
| > 1100px | Grid 4 columnas |
| ≤ 1100px | Grid 3 columnas |
| ≤ 900px | Grid 2 columnas · Hamburger visible · Cover en 1 columna |
| ≤ 640px | Modal en 1 columna |
| ≤ 560px | Grid 1 columna |
