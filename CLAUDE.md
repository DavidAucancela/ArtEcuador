# ArtEcuador — CLAUDE.md

Catálogo web de artesanías ecuatorianas. **El proyecto es `artecuador-v2/`**, construido con Astro v6 + TypeScript. La v1 (index.html monolítico) fue eliminada.

---

## Estructura del proyecto

```
ArtEcuador/
├── CLAUDE.md                    # Esta guía de desarrollo
├── artecuador-v2/               # ← TODO el código vive aquí
│   ├── astro.config.mjs         # output: static + @astrojs/node adapter
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile               # Node.js standalone, puerto 8080
│   ├── admin/                   # Legacy — ya no se usa en dev normal
│   │   ├── index.html
│   │   └── server.js
│   ├── public/
│   │   ├── favicon.ico / favicon.svg
│   │   ├── media → ../../media  # Symlink a imágenes compartidas
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
│       │   ├── products.json    # Fuente de verdad: secciones + productos + clientImages
│       │   └── products.ts      # Tipos y helpers de acceso a los datos
│       ├── layouts/
│       │   └── BaseLayout.astro # HTML base, meta OG, fuentes
│       └── pages/
│           ├── index.astro      # Página principal (catálogo)
│           ├── admin.astro      # Panel de administración (protegido)
│           ├── sitemap.xml.ts   # Sitemap auto-generado
│           ├── api/
│           │   └── products.ts  # GET/POST endpoint — lee/escribe products.json
│           └── productos/
│               └── [slug].astro # Página de detalle por producto
└── media/                       # Imágenes compartidas (servidas por public/media symlink)
    ├── logoFinal.png            # Logo horizontal (cover + footer)
    ├── iconoFinal.png           # Ícono cuadrado (nav + favicon)
    ├── clients/                 # Fotos clientes / testimonios (mosaico FeaturedStrip)
    └── products/                # Fotos de productos (nombres en kebab-case, sin espacios)
```

---

## Comandos de desarrollo

```bash
cd artecuador-v2

npm run dev       # Sitio + admin + API en http://localhost:4321
npm run build     # Build de producción en dist/
npm run preview   # Preview del build en local
```

| Entorno | Comando |
|---|---|
| Local dev | `npm run dev` (desde `artecuador-v2/`) |
| Docker | `docker build -t artecuador . && docker run -p 8080:8080 artecuador` (desde `artecuador-v2/`) |
| Railway | Push a `main` — auto-detecta `artecuador-v2/Dockerfile` |

> **Un solo proceso.** `npm run dev` levanta Astro en el 4321 y sirve el sitio, el admin y la API desde el mismo servidor. No hace falta ningún comando adicional.

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
  "clientImages": ["clientes-1.jpg", "clientes-2.jpg"]
}
```

- `badge`: `"feat"` | `"new"` | `"limit"` | omitido
- `active: false` oculta el producto sin borrarlo
- `clientImages`: nombres de archivo en `media/clients/` — alimentan el mosaico del FeaturedStrip automáticamente
- Editar directamente en JSON o via panel admin (`/admin`)

### Secciones actuales (42 productos activos)

| # | ID | Título | Productos |
|---|---|---|---|
| 01 | `cuadros` | Cuadros y Pinturas | 8 |
| 02 | `ceramica` | Cerámica Ancestral | 15 |
| 03 | `cuero` | Cuero Artesanal | 3 |
| 04 | `otros` | Otras Artesanías | 16 |

---

## Páginas

| Ruta | Archivo | Descripción |
|---|---|---|
| `/` | `pages/index.astro` | Catálogo completo: portada, featured strip, secciones, contacto |
| `/admin` | `pages/admin.astro` | Panel de administración (requiere login) |
| `/api/products` | `pages/api/products.ts` | GET: lee catálogo · POST: escribe catálogo (requiere token) |
| `/productos/[slug]` | `pages/productos/[slug].astro` | Detalle de producto: imagen, precio, descripción, WhatsApp, productos relacionados |
| `/sitemap.xml` | `pages/sitemap.xml.ts` | Sitemap auto-generado |

---

## Componentes

| Componente | Descripción |
|---|---|
| `Nav.astro` | Nav sticky con dropdown de categorías + hamburger móvil. Hold 5 s en el logo abre el login del admin |
| `FilterBar.astro` | Barra sticky con búsqueda en tiempo real + filtros por categoría + contador de resultados |
| `FeaturedStrip.astro` | Franja "Hecho a mano, con alma andina" — mosaico 3×3 con imágenes de `clientImages` ciclando (fade cada 4.5 s, máx 3 visibles) |
| `ProductCard.astro` | Tarjeta de producto: imagen, badge, nombre, precio, descripción, link a detalle |
| `ProductSection.astro` | Sección de categoría: header + cat-strip + grid de tarjetas |
| `ContactForm.astro` | Formulario con validación JS → WhatsApp pre-formateado (`wa.me/593999006925`), incluye país y tipo de consulta |
| `Footer.astro` | Logo + columnas Colecciones y Contacto |
| `BaseLayout.astro` | HTML base, meta OG/Twitter, canonical, Google Fonts |

---

## Panel de administración

Acceso: mantener presionado el logo del Nav **5 segundos** → modal de login → ingresar credenciales → redirige a `/admin`.

El panel corre en el **mismo servidor** que el sitio (no requiere proceso separado).

### Autenticación

- Las credenciales se verifican con SHA-256 en el navegador
- Hash esperado: `da5c8060d7f3de5fc7aba7fdd418ff11009f70aca445a5248701694e60fb3ba8` → `admin:artecuador2026`
- Al hacer login el hash se guarda en `sessionStorage` como `adminToken`
- Visitar `/admin` sin token redirige a `/`
- **Para cambiar la contraseña:** recalcular `SHA-256("usuario:nuevacontraseña")` y actualizar el valor de `HASH` en `Nav.astro` y `ADMIN_HASH` en `src/pages/api/products.ts`

### API

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/api/products` | GET | No | Lee `src/data/products.json` |
| `/api/products` | POST | Sí (Bearer token) | Escribe `src/data/products.json` |

Cambios guardados en el admin se reflejan automáticamente en el dev server (hot-reload de Astro).

---

## Agregar un producto nuevo

1. Copiar la imagen a `media/products/` (nombre en kebab-case, sin espacios)
2. Navegar a `/admin` (requiere login) o editar `src/data/products.json` directamente
3. Agregar el objeto en el array `products` de la sección correspondiente

## Agregar una imagen al mosaico (FeaturedStrip)

1. Copiar la imagen a `media/clients/`
2. Agregar el nombre del archivo al array `clientImages` en `products.json` (via admin o directamente)
3. El mosaico la incluye automáticamente — no requiere cambios en el código

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

## Arquitectura — decisiones clave

| Decisión | Razón |
|---|---|
| Astro v6 `output: static` + `@astrojs/node` | Páginas públicas pre-renderizadas (rápidas); `/admin` y `/api/products` son server-rendered para poder leer/escribir archivos |
| `products.json` como única fuente de verdad | Sin base de datos que mantener; el admin escribe directamente el JSON |
| Token en `sessionStorage` (no cookie) | Sin necesidad de manejo de sesiones en servidor; el token expira al cerrar la pestaña |
| Dockerfile Node.js (antes nginx) | Necesario para servir las rutas de servidor (`/admin`, `/api/products`) en producción |

---

## Deuda técnica conocida

Ninguna deuda activa. Ítems anteriores resueltos:

| Ítem | Estado |
|---|---|
| FeaturedStrip sin imágenes | ✅ Resuelto — mosaico dinámico desde `clientImages` |
| Formulario sin validación | ✅ Ya tenía validación JS + mensaje de éxito 6 s |
| País no incluido en WhatsApp | ✅ Ya se incluía (`🌎 *País:*`) |
| Imágenes sin tarjeta asignada | ✅ Resuelto — 8 productos nuevos agregados |
