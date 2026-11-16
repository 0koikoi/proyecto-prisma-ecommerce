# Diagramas del wiki

Aquí viven las **fuentes** de los diagramas que se ven en el wiki. Cada uno es un HTML autocontenido con SVG en línea; el SVG exportado vive en `docs/wiki/images/` y es el que muestran las páginas.

| Fuente | Se usa en |
| :--- | :--- |
| `recorrido-cliente.html` | Home |
| `fuente-datos.html` | Primeros pasos |
| `arquitectura-capas.html` | Arquitectura |
| `estados-pedido.html` | Checkout y seguimiento |
| `flujo-ramas.html` | Flujo de trabajo con Git |
| `pipeline-ci.html` | CI/CD |

## Cómo se generan

`generar.py` dibuja los seis diagramas con los colores de la tienda (los tokens de `frontend/src/index.css`: tinta `#1c1c1c`, papel `#f5f5f5`, hielo `#d6efff` y un cian `#0e7490` como único acento).

```bash
python3 docs/diagramas/generar.py docs/diagramas
```

Después se exporta cada HTML a SVG. Si usas la skill `diagram-design`, el exportador viene incluido:

```bash
python3 <ruta-de-la-skill>/scripts/export_svg.py docs/diagramas/flujo-ramas.html docs/wiki/images/flujo-ramas.svg --system-fonts
```

`--system-fonts` hace que el SVG no pida ninguna fuente a internet: un SVG cargado como imagen en el wiki no puede descargarlas.

## Reglas al editar

- **Máximo 9 nodos y 12 flechas** por diagrama; si pasa, se divide en dos.
- **El acento va en uno o dos elementos**, nunca en todo lo importante.
- Los conectores son siempre **ángulos rectos** y las etiquetas no tocan su línea.
- Si cambias un diagrama, regenera el SVG en la misma PR para que el wiki no quede desactualizado.
