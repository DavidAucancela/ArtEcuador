# ArtEcuador — CLAUDE.md

Catálogo web de artesanías ecuatorianas. Proyecto estático: **un solo archivo** `index.html` con CSS y JS inline (~2 100 líneas). Sin framework, sin build step, sin dependencias. Se abre directamente en el navegador o con `python3 -m http.server 8000`.

---

## Estructura del proyecto

```
ArtEcuador/
├── index.html              # Todo el proyecto: HTML + CSS + JS (~2 100 líneas)
├── index.backup.html       # Backup del MVP original — no tocar
├── CLAUDE.md               # Esta guía de desarrollo
├── README.md               # Instrucciones de despliegue (local, Docker, Railway)
├── Dockerfile              # Imagen nginx:alpine, puerto 8080
├── nginx.conf              # Routing para SPA en puerto 8080
└── media/
    ├── logoFinal.png        # Logo principal (cover + footer)
    ├── iconoFinal.png       # Ícono cuadrado (nav brand + footer)
    ├── logoV1.png … logoV4.png   # Versiones anteriores — no usar
    ├── clients/             # Imágenes de clientes / testimonios
    │   ├── clientes 1.jpg … clientes 4.png
    │   ├── dueño.png, dueño 2.png
    │   └── recomendacion.png, trabajpos.png
    └── products/            # 57 fotos de productos (40 en uso)
        ├── cuadros Guayasamin barro medianos.png
        ├── cuadros guaysamin 2.png
        ├── cuadro acrilico de la ronda de quito.png
        ├── cuadro la ronda 2.png
        ├── cuadro san francisco quito.png
        ├── cuando cotopaxi animado.png
        ├── cuado con base de de tronco.png
        ├── bateas madera tigua.png
        ├── ceramica otavalena tradicional.png
        ├── ceramica Cuencana de vasijas.png
        ├── ceramica imbabura.png
        ├── ceramica hombre saraguro.png
        ├── ceramica hombre riobambeno.png
        ├── posillos pequenos de barro.png
        ├── vasos barro grande.png
        ├── carteras y billetaras tigua cuero.png
        ├── portallaves cuero 2.png
        ├── portallavaes cuero.png
        ├── mascaras varias Ecuatorianas madera.png
        ├── animales Galapagos madera.png
        ├── sol luna madera cedro.png
        ├── carros tradicionales madera.png
        ├── casas fachada tradicionales.png
        ├── avion madera.png
        ├── nacimiento mini.png
        ├── mital del mundo grande marmol oscura.png
        └── … (31 imágenes adicionales no mostradas aún)
```

> **Nombres de imágenes:** idealmente usar guiones sin espacios (varios archivos actuales tienen espacios; se acceden con `%20` en la URL — refactoring pendiente para v2).

---

## Despliegue

| Entorno | Comando |
|---|---|
| Local dev | `python3 -m http.server 8000` o `npx serve .` |
| Docker | `docker build -t artecuador . && docker run -p 8080:8080 artecuador` |
| Railway | Push a `main` — auto-detecta Dockerfile, expone puerto 8080 |

---

## Diseño — tokens CSS

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

## Secciones del HTML (en orden real)

| Sección | ID | Estado | Descripción |
|---|---|---|---|
| Nav | — | ✅ | 4 items: Inicio, Origen, Categorías (dropdown), Contáctanos |
| Mobile nav overlay | `#mobileNav` | ✅ | Hamburger ≤900px |
| Cover / Portada | `#portada` | ✅ | Texto izq. + mosaico animado 14×12 der. |
| Color band | — | ✅ | Franja tricolor rojo/amarillo/verde |
| Featured strip | `#origen` | ⚠️ | "Hecho a mano, con alma andina" — 9 celdas sin imagen (`src` vacío) |
| Cuadros y Pinturas | `#cuadros` | ✅ | 8 productos, todos con foto real |
| Cerámica Ancestral | `#ceramica` | ✅ | 8 productos, todos con foto real |
| Cuero Artesanal | `#cuero` | ✅ | 3 productos, todos con foto real |
| Otras Artesanías | `#otros` | ✅ | 8 productos, todos con foto real |
| Contacto | `#contactar` | ✅ | Formulario → WhatsApp + datos + redes |
| Modal | `#productModal` | ✅ | Detalle de producto (se llena desde el DOM) |
| Footer | — | ✅ | Logo + Colecciones + Contacto |

> **Secciones eliminadas:** Nosotros, Stats bar, Andean bar, Joyería, Textiles, Arte Tigua — no recrear sin consenso.
>
> **⚠️ Pendiente:** Las 9 celdas de `#origen` tienen `<img>` sin `src`. Hay fotos disponibles en `media/clients/`. Ver v2.

---

## Patrones de código

### Tarjeta de producto con foto real
```html
<div class="product-card">
  <div class="product-img-wrap">
    <img src="media/products/nombre-imagen.png" alt="Nombre" class="product-img-real" loading="lazy" />
    <span class="product-badge feat">Destacado</span>  <!-- feat | new | limit -->
    <button class="add-btn" aria-label="Añadir al carrito">
      <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" stroke-width="2.2" stroke-linecap="round"/></svg>
    </button>
  </div>
  <div class="product-body">
    <p class="product-category">Categoría · Subcategoría</p>
    <h3 class="product-name">Nombre del producto</h3>
    <p class="product-desc">Descripción corta del producto.</p>
    <div class="product-footer">
      <div class="product-price"><span class="currency">$</span>00.00</div>
      <a href="#" class="product-detail-link">Ver</a>
    </div>
  </div>
</div>
```

> **Precios:** El div `.product-price` existe en todas las tarjetas pero actualmente sin valor visible. Pendiente para v2.

### Nueva sección de categoría
```html
<section class="section [section-alt]" id="CATEGORIA">
  <div class="section-header">
    <div>
      <p class="section-label">0N — Colección</p>
      <h2 class="section-title">Nombre <em>Subtítulo</em></h2>
    </div>
    <span class="section-count">N productos</span>
  </div>
  <div class="cat-strip cat-CATEGORIA"></div>
  <div class="product-grid">
    <!-- tarjetas aquí -->
  </div>
</section>
```

Las secciones pares llevan `section-alt` (fondo `#F5F5F0`). Al agregar una nueva categoría:
1. Añadir clase `.cat-NUEVA` con gradiente en el CSS (ver `.cat-cuadros`, `.cat-ceramica`…)
2. Añadir el link en el dropdown `#navDropdown` y en `#mobileNav`
3. Añadir el link en el footer (columna Colecciones)

### Modal de producto
El modal (`#productModal`) lee automáticamente el DOM de la tarjeta al hacer click en `.product-detail-link`. No necesita atributos `data-*` extra.

---

## JavaScript — funciones activas

| Módulo | Líneas aprox. | Descripción |
|---|---|---|
| Mosaico cover | 1843–1917 | Cuadrícula 14×12 con animación de entrada diagonal + ondas aleatorias |
| Nav dropdown | 1919–1946 | Toggle `.open` en `#navDropdown`, cierre al click fuera, `aria-expanded` |
| Hamburger | 1948–1971 | Toggle `#mobileNav`, bloqueo de scroll, cierre con Esc |
| Modal | 1973–2050 | Abre al click en `.product-detail-link`, clona imagen/placeholder del DOM, cierra con Esc / click fuera / botón X |
| Mosaico featured | 2053–2098 | Rota imágenes en 9 celdas del featured strip (2 celdas cada 2s) |
| Formulario contacto | 2100–2123 | Codifica campos y abre `wa.me/593999006925` con mensaje pre-formateado |

---

## Responsive breakpoints

| Breakpoint | Cambios principales |
|---|---|
| > 1100px | Grid 4 col, nav desktop, cover 2 col |
| ≤ 1100px | Grid 3 col |
| ≤ 900px | Grid 2 col · Hamburger visible · Nav desktop oculto · Cover 1 col |
| ≤ 640px | Modal 1 col |
| ≤ 560px | Grid 1 col |

---

## Inventario de imágenes de productos

### En uso (27 de producto, 40 tarjetas — algunas imágenes se reutilizan)

**Cuadros y Pinturas** (8 tarjetas):
`cuadros Guayasamin barro medianos.png`, `cuadros guaysamin 2.png`, `cuadro acrilico de la ronda de quito.png`, `cuadro la ronda 2.png`, `cuadro san francisco quito.png`, `cuando cotopaxi animado.png`, `cuado con base de de tronco.png`, `bateas madera tigua.png`

**Cerámica Ancestral** (8 tarjetas):
`ceramica otavalena tradicional.png`, `ceramica Cuencana de vasijas.png`, `ceramica imbabura.png`, `ceramica hombre saraguro.png`, `ceramica hombre riobambeno.png`, `posillos pequenos de barro.png`, `vasos barro grande.png` + reutiliza `cuadros Guayasamin barro medianos.png`

**Cuero Artesanal** (3 tarjetas):
`carteras y billetaras tigua cuero.png`, `portallaves cuero 2.png`, `portallavaes cuero.png`

**Otras Artesanías** (8 tarjetas):
`mascaras varias Ecuatorianas madera.png`, `animales Galapagos madera.png`, `sol luna madera cedro.png`, `carros tradicionales madera.png`, `casas fachada tradicionales.png`, `avion madera.png`, `nacimiento mini.png`, `mital del mundo grande marmol oscura.png`

### No mostradas aún (disponibles en `media/products/`)
`avion madera 2.png`, `nacimiento mini 2–5.png`, `nacimiento caja de fosforo.png`, `nacimiento chimborazo.png`, `vasos barro 2–4 y 6.png`, `cruces tigua madera pequenas.png`, `ceramica ponchos otavalo grande.png`, `ceramica saragura.png`

---

## Deuda técnica conocida

| # | Área | Detalle |
|---|---|---|
| 1 | Featured strip | 9 `<img>` sin `src` — imágenes disponibles en `media/clients/` |
| 2 | Precios | `.product-price` vacío en todas las tarjetas |
| 3 | Nombres de archivo | Varios con espacios (acceden vía `%20`), erratas: "cuado", "posillos", "vasoso", "mital", "portallavaes" |
| 4 | Imágenes sin usar | 17+ fotos de producto sin tarjeta asignada |
| 5 | Formulario | Sin validación client-side, sin mensaje de confirmación en pantalla |
| 6 | País en formulario | Select de país capturado pero no incluido en el mensaje de WhatsApp |
