# ArtEcuador — CLAUDE.md

Catálogo web de artesanías ecuatorianas. **El proyecto es `artecuador-v2/`**, construido con Astro v6 + TypeScript. La v1 (index.html monolítico) fue eliminada.

---

## Estructura del proyecto

```
ArtEcuador/
├── CLAUDE.md                    # Esta guía de desarrollo
├── artecuador-v2/               # ← TODO el código vive aquí
│   ├── astro.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile               # Imagen nginx:alpine, puerto 8080
│   ├── nginx.conf               # Routing SPA en puerto 8080
│   ├── README.md                # Instrucciones de despliegue
│   ├── admin/
│   │   ├── index.html           # UI del panel de administración
│   │   └── server.js            # Servidor Node.js puro (puerto 4000)
│   ├── public/
│   │   ├── favicon.ico / favicon.svg
│   │   └── styles/global.css    # CSS global con tokens de diseño
│   └── src/
│       ├── components/
│       │   ├── Nav.astro
│       │   ├── FilterBar.astro
│       │   ├── FeaturedStrip.astro
│       │   ├── ProductCard.astro
│       │   ├── ProductSection.astro
│       │   ├── ContactForm.astro
│       │   └── Footer.astro
│       ├── data/
│       │   ├── products.json    # Fuente de verdad: secciones + productos
│       │   └── products.ts      # Tipos y helpers de acceso a los datos
│       ├── layouts/
│       │   └── BaseLayout.astro # HTML base, meta OG, fuentes
│       └── pages/
│           ├── index.astro      # Página principal (catálogo)
│           ├── sitemap.xml.ts   # Sitemap auto-generado
│           └── productos/
│               └── [slug].astro # Página de detalle por producto
└── media/                       # Imágenes compartidas (servidas por public/media symlink)
    ├── logoFinal.png            # Logo horizontal (cover + footer)
    ├── iconoFinal.png           # Ícono cuadrado (nav + favicon)
    ├── logo ArtEcuador Final.png
    ├── frontal tarjetaPresentacion.png
    ├── reverso tarjetaPresentacion .png
    ├── reverso2 tarjetaPresentacion .png
    ├── tarjetaPresentacionV1/
    ├── clients/                 # Fotos clientes / testimonios
    └── products/                # Fotos de productos (nombres normalizados, sin espacios)
```

---

## Comandos de desarrollo

```bash
cd artecuador-v2

npm run dev       # Servidor dev Astro en http://localhost:4321
npm run build     # Build de producción en dist/
npm run preview   # Preview del build en local
npm run admin     # Panel admin en http://localhost:4000
```

| Entorno | Comando |
|---|---|
| Local dev | `npm run dev` (desde `artecuador-v2/`) |
| Admin panel | `npm run admin` (desde `artecuador-v2/`) |
| Docker | `docker build -t artecuador . && docker run -p 8080:8080 artecuador` (desde `artecuador-v2/`) |
| Railway | Push a `main` — auto-detecta `artecuador-v2/Dockerfile` |

---

## Diseño — tokens CSS

Definidos en `public/styles/global.css`:

```css
:root {
  --red:    #D7262E;   /* color principal, botones CTA */
  --yellow: #F4C430;   /* acentos, badges */
  --green:  #4CAF50;   /* badge "Nuevo", ícono teléfono */
  --blue:   #2D9CDB;   /* badge "Destacado" */
  --purple: #6A1B9A;   /* badge "Limitado" */
  --gray-d: #4F4F4F;
  --gray-m: #BDBDBD;
  --white:  #FFFFFF;
  --bg:     #FAFAF8;
  --shadow: 0 4px 24px rgba(0,0,0,0.08);
  --shadow-hover: 0 12px 40px rgba(0,0,0,0.14);
}
```

**Tipografía:** `Playfair Display` (títulos, precios) · `Montserrat` (cuerpo, nav, etiquetas)

---

## Datos de productos — `src/data/products.json`

Es la **única fuente de verdad** para el catálogo. Estructura:

```json
{
  "sections": [
    {
      "id": "cuadros",
      "label": "01 — Colección",
      "title": "Cuadros",
      "titleEm": "y Pinturas",
      "alt": false,
      "products": [
        {
          "slug": "cuadros-guayasamin-en-barro",
          "img": "cuadros-guayasamin-barro.png",
          "alt": "Cuadros Guayasamín en Barro",
          "badge": "feat",
          "category": "Cuadros · Guayasamín",
          "name": "Cuadros Guayasamín en Barro",
          "desc": "Descripción corta.",
          "price": "45.00",
          "active": true
        }
      ]
    }
  ],
  "clientImages": ["clientes-1.jpg", "..."]
}
```

- `badge`: `"feat"` | `"new"` | `"limit"` | omitido
- `active: false` oculta el producto sin borrarlo
- Editar directamente en JSON o via panel admin (`npm run admin`)

### Secciones actuales (34 productos activos)

| # | ID | Título | Productos |
|---|---|---|---|
| 01 | `cuadros` | Cuadros y Pinturas | 8 |
| 02 | `ceramica` | Cerámica Ancestral | 10 |
| 03 | `cuero` | Cuero Artesanal | 3 |
| 04 | `otros` | Otras Artesanías | 13 |

---

## Páginas

| Ruta | Archivo | Descripción |
|---|---|---|
| `/` | `pages/index.astro` | Catálogo completo: portada, featured strip, secciones, contacto |
| `/productos/[slug]` | `pages/productos/[slug].astro` | Detalle de producto: imagen, precio, descripción, WhatsApp, productos relacionados |
| `/sitemap.xml` | `pages/sitemap.xml.ts` | Sitemap auto-generado |

---

## Componentes

| Componente | Descripción |
|---|---|
| `Nav.astro` | Nav sticky con dropdown de categorías (se genera desde `sections`) + hamburger móvil |
| `FilterBar.astro` | Barra sticky con búsqueda en tiempo real + filtros por categoría + contador de resultados |
| `FeaturedStrip.astro` | Franja "Hecho a mano, con alma andina" con 9 celdas de imágenes |
| `ProductCard.astro` | Tarjeta de producto: imagen, badge, nombre, precio, descripción, link a detalle |
| `ProductSection.astro` | Sección de categoría: header + cat-strip + grid de tarjetas |
| `ContactForm.astro` | Formulario → WhatsApp pre-formateado (`wa.me/593999006925`) |
| `Footer.astro` | Logo + columnas Colecciones y Contacto |
| `BaseLayout.astro` | HTML base, meta OG/Twitter, canonical, Google Fonts |

---

## Panel de administración

`npm run admin` levanta un servidor Node.js puro (sin deps) en **http://localhost:4000**.

- **GET /api/products** → lee `src/data/products.json`
- **POST /api/products** → escribe `src/data/products.json` (valida JSON)
- **GET /media/*** → sirve imágenes desde `../../media/`

Cambios guardados en el admin se reflejan automáticamente en el dev server (hot-reload de Astro).

---

## Agregar un producto nuevo

1. Copiar la imagen a `media/products/` (nombre en kebab-case, sin espacios)
2. Abrir el panel admin (`npm run admin`) o editar `src/data/products.json` directamente
3. Agregar el objeto en el array `products` de la sección correspondiente

## Agregar una sección nueva

1. Agregar objeto en `sections` de `products.json` (nuevo `id`, `label`, `title`, `titleEm`, `alt`, `products: []`)
2. Añadir clase `.cat-NUEVA` con gradiente en `global.css` (ver `.cat-cuadros`, `.cat-ceramica`…)
3. El Nav, FilterBar y Footer se actualizan automáticamente desde `sections`

---

## Responsive breakpoints

| Breakpoint | Cambios principales |
|---|---|
| > 1100px | Grid 4 col, nav desktop, portada 2 col |
| ≤ 1100px | Grid 3 col |
| ≤ 900px | Grid 2 col · Hamburger · Nav desktop oculto · Portada 1 col |
| ≤ 640px | Detalle de producto 1 col |
| ≤ 560px | Grid 1 col |

---

## Deuda técnica conocida

| # | Área | Detalle |
|---|---|---|
| 1 | Featured strip | Imágenes de celdas pendientes de asignar desde `media/clients/` |
| 2 | Formulario | Sin validación client-side ni mensaje de confirmación en pantalla |
| 3 | País en formulario | Select capturado pero no incluido en mensaje WhatsApp |
| 4 | Imágenes sin usar | Varias fotos en `media/products/` sin tarjeta asignada |
