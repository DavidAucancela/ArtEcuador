# ArtEcuador — Catálogo de Artesanías

Catálogo web de artesanías ecuatorianas construido con Astro v6 + TypeScript.

## Estructura

```
ArtEcuador/
├── artecuador-v2/   # Código fuente (Astro)
├── media/           # Imágenes compartidas
├── Dockerfile       # Build multi-stage para producción
└── railway.toml     # Config de despliegue en Railway
```

## Desarrollo local

```bash
cd artecuador-v2
npm install
npm run dev        # http://localhost:4321
npm run admin      # Panel admin http://localhost:4000
```

## Docker local

```bash
docker build -t artecuador .
docker run -p 8080:8080 artecuador
# http://localhost:8080
```

## Despliegue

Push a `main` en GitHub → Railway detecta el Dockerfile y despliega automáticamente.
