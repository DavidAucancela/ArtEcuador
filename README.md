# ArtEcuador — Catálogo de Artesanías

Catálogo web de artesanías ecuatorianas construido con Astro v6 + TypeScript.

## Estructura

```
ArtEcuador/
├── artecuador-v2/   # Código fuente (Astro) — incluye el Dockerfile de producción
├── media/           # Imágenes compartidas (productos, clientes, logos)
└── railway.toml     # Config de despliegue en Railway
```

## Desarrollo local

Requiere Node ≥ 22.12.0.

```bash
cd artecuador-v2
npm install
npm run dev        # Sitio + admin + API en http://localhost:4321
```

El catálogo público (`/`) ofrece búsqueda en vivo, filtros por colección y paginación por sección (8 productos por página), todo client-side sobre las tarjetas renderizadas en el servidor.

El panel de administración corre en el mismo servidor: mantener presionado el logo del nav 5 segundos abre el login, o visitar `/admin` con sesión activa.

Desde `/admin` se gestionan productos y colecciones, el mosaico de clientes, **todas las fotos subidas** (gestor con búsqueda y borrado de las no usadas) y un **contador de visitas** propio con país/ciudad (panel "📊 Visitas"). Detalles en `CLAUDE.md`.

## Docker local

Desde la **raíz del repo** (el build context debe ser la raíz para resolver `media/`):

```bash
docker build -t artecuador -f artecuador-v2/Dockerfile .
docker run -p 8080:8080 artecuador
# http://localhost:8080
```

## Despliegue

Push a `main` en GitHub → Railway construye `artecuador-v2/Dockerfile` (configurado en `railway.toml`) y despliega automáticamente.

### Persistencia (bucket S3/R2)

Con las variables de entorno `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` y `S3_BUCKET` configuradas en Railway, el catálogo, las imágenes subidas desde el admin y el contador de visitas (`data/analytics.json`) se guardan en el bucket y persisten entre redeploys. Sin ellas, los cambios en producción son efímeros (el filesystem de Railway no persiste). Ver detalles en `CLAUDE.md`.
