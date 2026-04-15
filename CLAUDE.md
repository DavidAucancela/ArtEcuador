# ArtEcuador — CLAUDE.md

Catálogo web de artesanías ecuatorianas. Proyecto estático: **un solo archivo** `index.html` con CSS y JS inline. Sin framework, sin build step, sin dependencias. Se abre directamente en el navegador o con `python3 -m http.server 8000`.

---

## Estructura del proyecto

```
ArtEcuador/
├── index.html          # Todo el proyecto: HTML + CSS + JS
├── index.backup.html   # Backup del MVP original (no tocar)
└── media/
    ├── logoFinal.png   # Logo principal (cover + footer)
    ├── iconoFinal.png  # Ícono cuadrado (nav brand)
    ├── logoV1.png      # Logos anteriores (no usar)
    └── products/       # Fotos reales de productos
        ├── mascaras-general.jpg
        ├── batea-tigua.jpg
        ├── nacimiento-mini.jpg
        ├── cruces-tigua.jpg
        └── mitad-del-mundo-marmol-oscuro.jpg
```

> **Nombres de imágenes:** siempre usar guiones, sin espacios ni caracteres especiales.

---

## Diseño — tokens CSS

```css
--red:    #D7262E   /* color principal, botones CTA */
--yellow: #F4C430   /* acentos, badges */
--green:  #4CAF50
--blue:   #2D9CDB
--purple: #6A1B9A
--gray-d: #4F4F4F
--gray-m: #BDBDBD
--bg:     #FAFAF8
```

**Tipografía:** `Playfair Display` (títulos, precios) · `Montserrat` (cuerpo, nav, etiquetas)

---

## Secciones del HTML (en orden)

| Sección | ID | Descripción |
|---|---|---|
| Nav | — | 4 items: Inicio, Origen, Categorías (dropdown), Contáctanos |
| Mobile nav overlay | `#mobileNav` | Hamburger ≤900px |
| Cover / Portada | `#portada` | Logo izq. (blanco) + mosaico animado der. |
| Color band | — | Franja tricolor |
| Stats bar | — | Cifras: artesanos, provincias, productos… |
| Featured strip | `#origen` | "Hecho a mano, con alma andina" |
| Andean bar | — | Íconos simbólicos + frase Kichwa |
| Joyería | `#joyeria` | 4 productos (SVG placeholders) |
| Textiles | `#textiles` | 4 productos (SVG placeholders) |
| Cerámica | `#ceramica` | 4 productos (SVG placeholders, 1 usa foto real) |
| Decoración | `#decoracion` | 4 productos — Máscara usa foto real |
| Arte Tigua | `#tigua` | 4 productos — todos con fotos reales |
| Contacto | `#contactar` | Formulario + datos de contacto + redes |
| Modal | `#productModal` | Detalle de producto (se llena desde el DOM) |
| Footer | — | Logo + Colecciones + Contacto |

> **Sección eliminada:** Nosotros — no recrear.

---

## Patrones de código

### Tarjeta de producto con foto real
```html
<div class="product-card">
  <div class="product-img-wrap">
    <img src="media/products/nombre-sin-espacios.jpg" alt="Nombre" class="product-img-real" />
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

### Tarjeta de producto sin foto (SVG placeholder)
Reemplazar el `<img>` por un `<div class="product-img-placeholder bg-XXX">` con SVG inline. Las clases de fondo disponibles son `bg-joy-1..4`, `bg-tex-1..4`, `bg-cer-1..4`, `bg-dec-1..4`.

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
Las secciones pares llevan `section-alt` (fondo gris claro). Al agregar una nueva categoría:
1. Añadir clase `.cat-NUEVA` con gradiente en el CSS
2. Añadir el link en el dropdown del nav y en `#mobileNav`
3. Añadir el link en el footer (columna Colecciones)

### Modal de producto
El modal (`#productModal`) lee automáticamente el DOM de la tarjeta al hacer click en `.product-detail-link`. No necesita atributos extra.

---

## JavaScript — funciones activas

- **Mosaico cover**: generación de la cuadrícula 14×12 con animación de entrada y ondas
- **Mosaico featured**: 9 celdas de color en el featured strip
- **Nav dropdown**: toggle de clase `.open` en `#navDropdown`, cierre al click fuera
- **Hamburger**: toggle de `#mobileNav`, bloqueo de scroll, cierre con Esc
- **Modal**: abre al click en `.product-detail-link`, cierra con Esc / click fuera / botón X

---

## Responsive breakpoints

| Breakpoint | Cambios principales |
|---|---|
| ≤1100px | Grid de productos pasa a 3 columnas |
| ≤900px | Grid de productos 2 col · Hamburger visible · Nav desktop oculto · Cover en 1 col |
| ≤640px | Modal en 1 columna |
| ≤560px | Grid de productos 1 col |
