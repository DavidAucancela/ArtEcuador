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
│           │   ├── products.ts  # GET/POST — lee/escribe products.json
│           │   ├── images.ts    # GET — lista archivos de media/products y media/clients
│           │   └── upload.ts    # POST — sube imágenes desde cualquier dispositivo (requiere token)
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
| Docker | `docker build -t artecuador -f artecuador-v2/Dockerfile . && docker run -p 8080:8080 artecuador` (desde la raíz del repo) |
| Railway | Push a `main` — usa `artecuador-v2/Dockerfile` con contexto = raíz del repo |

> **Build context de Docker:** Railway usa la **raíz del repo** como contexto (no `artecuador-v2/`). El `Dockerfile` copia los archivos con el prefijo `artecuador-v2/` explícitamente y copia `media/` directamente para resolver el symlink `public/media → ../../media`.

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
| `Nav.astro` | Nav sticky con dropdown de categorías + hamburger móvil. Hold 5 s en el logo abre el login del admin. `-webkit-touch-callout:none` + `contextmenu preventDefault` para que el hold funcione en iOS |
| `FilterBar.astro` | Barra sticky con búsqueda en tiempo real + filtros por categoría + contador de resultados |
| `FeaturedStrip.astro` | Franja "Hecho a mano, con alma andina" — mosaico 3×3 con imágenes de `clientImages` ciclando (fade cada 4.5 s, máx 3 visibles) |
| `ProductCard.astro` | Tarjeta de producto: imagen `4:5` portrait, badge, nombre, precio, link a detalle. Sin overlay "Ver detalle" |
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
| `/api/images` | GET | No | Lista archivos de `media/products/` y `media/clients/` |
| `/api/upload` | POST | Sí (Bearer token) | Sube imagen a `media/products/` o `media/clients/` (máx 10 MB, formatos: jpg/png/webp/gif) |

Cambios guardados en el admin se reflejan automáticamente en el dev server (hot-reload de Astro).

### Panel — funcionalidades

| Área | Funcionalidad |
|---|---|
| **Layout** | Sidebar colapsable: 200px normal, 52px colapsada (solo iniciales). Botón ☰ en header. Estado persiste en `localStorage` |
| **Productos** | Grid `minmax(155px, 1fr)`, gap 8px — 5-6 columnas en desktop, 3 en tablet |
| **Productos** | Imagen cuadrada 1:1 `object-fit:cover` — thumbnails compactos y simétricos |
| **Productos** | Clic en imagen o tarjeta → abre side panel editor |
| **Productos** | Toggle visible/oculto en cada tarjeta (inactivos se ven semitransparentes) |
| **Productos** | Drag ⠿ para reordenar dentro de la colección |
| **Productos** | Campo slug oculto — se auto-genera del nombre (nuevo) o se preserva (edición) |
| **Editor** | Side panel deslizable desde la derecha (360px) — no tapa el contenido |
| **Editor** | Flechas ‹ › para navegar entre productos de la misma colección sin cerrar |
| **Editor** | Preview de foto full-width 4:3 con hint "Cambiar foto" al hover |
| **Fotos** | Galería modal al seleccionar foto — búsqueda en tiempo real |
| **Fotos** | Botón "📱 Subir foto" — sube desde cualquier dispositivo |
| **Colecciones** | Drag ⠿ en sidebar para reordenar colecciones |
| **Colecciones** | Sidebar colapsada muestra la inicial de cada colección en círculo |
| **Colecciones** | Botón "Eliminar colección" en modal con confirmación y conteo de productos |
| **Mosaico** | Botón "🖼 Fotos del mosaico (N)" en sidebar → modal para gestionar `clientImages` |
| **Labels** | Terminología no técnica: "Tipo de artesanía", "Etiqueta especial", "Colección", etc. |
| **Precio** | Validación numérica, normaliza a `XX.XX` al guardar |

---

## Agregar un producto nuevo

**Opción A — desde el panel admin (recomendada, para el cliente):**
1. Abrir `/admin` → seleccionar colección → clic en "+ Agregar producto"
2. Escribir el nombre, tipo, descripción y precio
3. Clic en "Foto del producto" → galería → seleccionar o subir foto desde el dispositivo
4. Guardar producto → clic en "Guardar cambios" (Ctrl+S)

**Opción B — directamente en JSON (para desarrollo):**
1. Copiar la imagen a `media/products/` (nombre en kebab-case, sin espacios)
2. Editar `src/data/products.json` y agregar el objeto en el array `products` de la sección

## Agregar una imagen al mosaico (FeaturedStrip)

**Desde el panel admin:**
1. Clic en "🖼 Fotos del mosaico" en la sidebar del admin
2. Clic en "+ Agregar foto al mosaico" → galería de `media/clients/` → seleccionar o subir
3. Reordenar con drag si es necesario → "Guardar mosaico"

**Directamente:**
1. Copiar la imagen a `media/clients/`
2. Agregar el nombre al array `clientImages` en `products.json`

## Agregar una sección (colección) nueva

**Desde el panel admin:**
1. Clic en "+ Nueva colección" en la sidebar
2. Escribir el título (el ID se genera automáticamente)
3. Guardar → agregar productos a la nueva colección

**Directamente en código:**
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
| ≤ 800px | Detalle de producto: hero 1 col · nav 3-columnas grid (logo centrado, CTA oculto) |
| ≤ 640px | Detalle: padding compacto · productos relacionados 2 col |
| ≤ 560px | Grid 2 col · padding sección reducido (44px/16px) · hero 240px |

---

## Arquitectura — decisiones clave

| Decisión | Razón |
|---|---|
| Astro v6 `output: static` + `@astrojs/node` | Páginas públicas pre-renderizadas (rápidas); `/admin` y `/api/*` son server-rendered para leer/escribir archivos |
| `products.json` como única fuente de verdad | Sin base de datos que mantener; el admin escribe directamente el JSON |
| Token en `sessionStorage` (no cookie) | Sin necesidad de manejo de sesiones en servidor; el token expira al cerrar la pestaña |
| Dockerfile Node.js (antes nginx) | Necesario para servir las rutas de servidor en producción |
| Build context = raíz del repo | Railway ignora `buildContext` en `railway.toml`; el Dockerfile usa `artecuador-v2/` como prefijo en COPY y copia `media/` directamente |
| `builder = "DOCKERFILE"` en `railway.toml` | Sin esta línea, Railway usa Nixpacks y sirve el sitio con nginx (muestra página por defecto) |
| `GET /api/images` sin auth | Las imágenes son activos públicos; listarlas no expone información sensible |
| `POST /api/upload` con Bearer token | Misma auth que `/api/products`; el CSRF de Astro acepta la subida porque el browser envía `Origin` correcto |
| Slug preservado en edición | Cambiar el slug de un producto existente rompería URLs externas y SEO |
| Grid de tarjetas 1:1 en admin | Thumbnails cuadrados compactos — más columnas visibles, simetría garantizada |
| Imagen de producto 4:5 (portrait) en catálogo | Más área visible por producto en el grid de 2 columnas mobile |
| Side panel en lugar de modal en admin | No tapa el contenido; permite ver otras tarjetas mientras se edita |
| `-webkit-touch-callout:none` en logo hold | iOS dispara `touchcancel` en long-press si no se bloquea el callout, cancelando el timer |

---

## Deuda técnica conocida

Ninguna deuda activa. Ítems anteriores resueltos:

| Ítem | Estado |
|---|---|
| FeaturedStrip sin imágenes | ✅ Resuelto — mosaico dinámico desde `clientImages` |
| Formulario sin validación | ✅ Ya tenía validación JS + mensaje de éxito 6 s |
| País no incluido en WhatsApp | ✅ Ya se incluía (`🌎 *País:*`) |
| Imágenes sin tarjeta asignada | ✅ Resuelto — 8 productos nuevos agregados |
| Admin — imágenes inconsistentes | ✅ Resuelto — grid 4:3 con object-fit:cover |
| Admin — no se podía subir fotos | ✅ Resuelto — `/api/upload` + botón en galería |
| Admin — terminología técnica | ✅ Resuelto — labels en español no técnico |
| Admin — sin gestión de mosaico | ✅ Resuelto — modal de clientImages en sidebar |
| Admin — no se podía eliminar/reordenar secciones | ✅ Resuelto — drag sidebar + botón eliminar |
| Railway mostraba "Welcome to nginx!" | ✅ Resuelto — `builder = "DOCKERFILE"` en `railway.toml` + build context = raíz |
| Docker build fallaba con `package-lock.json not found` | ✅ Resuelto — COPY explícito con prefijo `artecuador-v2/`, `npm install` en lugar de `npm ci` |
| Overlay "Ver detalle" en tarjetas | ✅ Eliminado — toda la tarjeta es clickeable |
| Grid mobile mostraba 1 columna | ✅ Resuelto — removido `aspect-ratio:3/5` del card, padding reducido |
| Nav de detalle asimétrico en mobile | ✅ Resuelto — grid 3-col, texto "Volver" en `<span>`, CTA `visibility:hidden` |
| Breadcrumb se montaba sobre el nav en iOS | ✅ Resuelto — `z-index:200` + `transform:translateZ(0)` fuerza capa GPU |
| Hold del logo no funcionaba en iOS | ✅ Resuelto — `-webkit-touch-callout:none` + `contextmenu preventDefault` |
| Productos relacionados 1 columna en mobile | ✅ Resuelto — `repeat(2,1fr)` en ≤640px |
| Logo del detalle sin colores ni ícono | ✅ Resuelto — mismo markup que Nav.astro |
| Admin — grid con cards enormes | ✅ Resuelto — `minmax(155px)`, gap 8px, imagen 1:1 |
| Admin — modal tapaba todo el contenido | ✅ Resuelto — side panel deslizable desde la derecha |
| Admin — sidebar demasiado ancha | ✅ Resuelto — 200px, colapsable a 52px con botón ☰ |

> **Nota Railway:** Los cambios guardados en el admin (productos, imágenes subidas) son efímeros en Railway — se pierden al redeploy porque el filesystem no persiste. Para persistencia real en producción habría que usar un bucket S3/R2 o una base de datos.
