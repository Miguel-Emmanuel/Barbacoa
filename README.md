# Barbacoa La Virgencita — Gemelos Ortega

Sitio estático (HTML, CSS, JS) con galería por categorías, novedades desde JSON y modal de eventos.

## Ver la página

1. Ideal: sirve la carpeta con un servidor local (necesario para cargar el JSON):

```powershell
cd "C:\Users\gemelo\Documents\MIKE\TwisoTech\BARBACOA"
npx --yes serve .
```

O abre la copia con fotos en:

`%USERPROFILE%\.cursor\projects\c-Users-gemelo-Documents-MIKE-TwisoTech-BARBACOA\site`

2. Si faltan fotos en `assets/images`, ejecuta `INSTALAR-IMAGENES.bat`.

> Nota: `fetch` de `data/*.json` no funciona con `file://`. Usa Live Server, `npx serve` o el hosting.

## Estructura

```
BARBACOA/
├── index.html
├── css/styles.css
├── js/main.js
├── data/
│   ├── eventos.json      ← novedades + modal de inicio
│   └── galeria.json      ← fotos por categoría
├── assets/images/
├── INSTALAR-IMAGENES.bat
└── README.md
```

## Actualizar eventos / modal de novedades

Edita `data/eventos.json`:

```json
{
  "eventos": [
    {
      "id": "mi-evento-unico",
      "titulo": "Inauguración de Terraza",
      "etiqueta": "¡Evento Especial!",
      "fecha": "28 de Septiembre 2026",
      "hora": "9:00 AM",
      "lugar": "Barbacoa La Virgencita",
      "descripcion": "Texto corto para tarjeta y modal.",
      "descripcionCompleta": "Texto largo para 'Leer más'.",
      "imagen": "assets/images/cartel-inauguracion.png",
      "activo": true,
      "mostrarEnModal": true,
      "ctaTexto": "Reservar",
      "ctaUrl": "#visitanos"
    }
  ]
}
```

| Campo | Uso |
|--------|-----|
| `activo` | Si es `false`, no aparece en Novedades ni en el modal |
| `mostrarEnModal` | Solo el evento activo con esto en `true` sale al cargar (tras ~2.5 s) |
| `id` | Identificador único; el modal se recuerda por sesión (`sessionStorage`) |

Si cambias el `id` o es un evento nuevo, el modal vuelve a mostrarse una vez por sesión.

## Actualizar la galería

Edita `data/galeria.json`. Categorías:

- `lugar` — Nuestro Lugar
- `menu` — Nuestro Menú
- `eventos` — Eventos y Novedades
- `clientes` — Nuestros Clientes

Ejemplo:

```json
{
  "src": "assets/images/mi-foto.jpg",
  "alt": "Descripción accesible",
  "titulo": "Título en hover",
  "categoria": "lugar"
}
```

Coloca el archivo en `assets/images/` y referencia la ruta.

## Sección Visítanos

En `index.html` (`#visitanos`): horarios, ubicación, WhatsApp, redes y mapa. El formulario envía a WhatsApp (número en `js/main.js`, variable `phone`).

## Despliegue

Sube toda la carpeta (incluye `data/` y `assets/images/`) a Vercel, Netlify o similar. Sin build.

```bash
npx vercel
```

## SEO y estilo

Paleta y tipografías en `css/styles.css` (`:root`). Meta tags en `index.html`.
