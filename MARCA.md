# Marca Axchi

Guía de la marca definitiva. La versión anterior de este documento, con el brief y los prompts con
los que se buscó el logo, queda en el historial de git (commit `6d431ef`).

## Nombre

- **Axchi** en todo lo visible: cabecera, favicon, imagen social, firmas, conversaciones.
- **Axchi Software Solutions** solo como nombre comercial: páginas legales, cotizaciones, facturas
  y datos estructurados (`LEGAL_NAME` en `lib/site.ts`).
- Quién está detrás: Duvan Yair Arciniegas, fundador. Se nombra en `/empresa` y en legales.

## Logo

Una **cinta continua que se pliega y forma una A**. Tres caras planas, sin degradado: pata derecha
al fondo, barra encima, pata izquierda delante.

- La idea detrás: una sola pieza que conecta dos lados sin cortes, que es lo que hace el estudio
  cuando quita el paso manual entre dos sistemas que no se hablan.
- **Fuente única:** `components/site/logo-geometria.ts`. El componente `LogoMark`, el favicon, los
  iconos de la aplicación y la imagen social se generan desde ahí. Nadie dibuja el logo a mano.

| Cara | Hex |
|---|---|
| Delantera | `#3FC9C2` |
| Barra | `#12A5A5` |
| Fondo | `#0A7676` |
| Fondo de marca | `#0B0F14` |

## Usos

| Dónde | Versión |
|---|---|
| Cabecera y pie (banda oscura) | Cinta de tres caras y "Axchi" en blanco |
| Pestaña del navegador | `app/icon.svg`, sin fondo |
| Favicon clásico e iconos de app | Cinta sobre `#0B0F14` (`app/favicon.ico`, `app/apple-icon.png`, `public/icon-*.png`) |
| Android | `public/icon-maskable-512.png`, con la zona segura del recorte circular |
| Al compartir un enlace | `public/og.png`, 1200 × 630 |
| Barra de las demos | Cinta a 16 px y "Axchi" |

Para regenerar después de cualquier cambio del logo:

```bash
npm run iconos   # favicon, icono SVG, iconos de app y enmascarable
npm run og       # imagen para redes
```

## Reglas

- Margen de protección: el ancho de una pata de la cinta por cada lado.
- No se recolorea, no se deforma y no lleva sombra, contorno ni degradado.
- No se mete en una caja de color, salvo el fondo de marca de los iconos de app.
- Por debajo de 16 px de alto no se usa.

## Voz

Ver la sección *Voz* de `DESIGN.md`: marca en tercera persona, cliente de tú, cifras en lugar de
adjetivos y nada de "nuestro equipo".
