#!/usr/bin/env python3
"""Generador de los diagramas del wiki (skill diagram-design, perfil prisma).

Cada diagrama sale como HTML autocontenido en docs/diagramas/. Los tokens vienen del
perfil `prisma` (frontend/src/index.css). Se ejecuta con: python3 gen.py <carpeta-salida>
"""
import sys, pathlib, html

PAPER, INK, MUTED, SOFT, ACCENT, TINT, LINK = "#f5f5f5", "#1c1c1c", "#4b5563", "#5b6472", "#0e7490", "#d6efff", "#1d4ed8"
SANS = "'Geist', system-ui, sans-serif"
MONO = "'Geist Mono', ui-monospace, monospace"
SERIF = "'Instrument Serif', 'Noto Serif', serif"

KINDS = {  # tratamiento por tipo de nodo (style-guide: Node type -> treatment)
    "backend":  dict(fill="#ffffff", stroke=INK, dash=None),
    "focal":    dict(fill=TINT, stroke=ACCENT, dash=None),
    "store":    dict(fill="rgba(28,28,28,0.05)", stroke=MUTED, dash=None),
    "external": dict(fill="rgba(28,28,28,0.03)", stroke="rgba(28,28,28,0.30)", dash=None),
    "input":    dict(fill="rgba(75,85,99,0.10)", stroke=SOFT, dash=None),
    "optional": dict(fill="rgba(28,28,28,0.02)", stroke="rgba(28,28,28,0.45)", dash="4,3"),
}


def esc(t):
    return html.escape(t, quote=False)


class Svg:
    def __init__(self, slug, title, desc, w=960, h=600):
        self.slug, self.title, self.desc, self.w, self.h = slug, title, desc, w, h
        self.arrows, self.nodes = [], []

    # -- nodos -------------------------------------------------------------
    def node(self, x, y, w, h, kind, name, sub=None, name_size=12):
        k = KINDS[kind]
        dash = f' stroke-dasharray="{k["dash"]}"' if k["dash"] else ""
        cy = y + h / 2
        parts = [
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{PAPER}"/>',
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{k["fill"]}" stroke="{k["stroke"]}" stroke-width="1"{dash}/>',
        ]
        if sub:
            parts.append(f'<text x="{x + w / 2}" y="{cy - 2}" fill="{INK}" font-size="{name_size}" font-weight="600" font-family="{SANS}" text-anchor="middle">{esc(name)}</text>')
            parts.append(f'<text x="{x + w / 2}" y="{cy + 14}" fill="{MUTED}" font-size="9" font-family="{MONO}" text-anchor="middle">{esc(sub)}</text>')
        else:
            parts.append(f'<text x="{x + w / 2}" y="{cy + 4}" fill="{INK}" font-size="{name_size}" font-weight="600" font-family="{SANS}" text-anchor="middle">{esc(name)}</text>')
        self.nodes.append("\n".join(parts))

    def diamond(self, cx, cy, w, h, name, sub):
        pts = f"{cx - w / 2},{cy} {cx},{cy - h / 2} {cx + w / 2},{cy} {cx},{cy + h / 2}"
        self.nodes.append(
            f'<polygon points="{pts}" fill="{PAPER}"/>'
            f'<polygon points="{pts}" fill="#ffffff" stroke="{INK}" stroke-width="1"/>'
            f'<text x="{cx}" y="{cy - 2}" fill="{INK}" font-size="12" font-weight="600" font-family="{SANS}" text-anchor="middle">{esc(name)}</text>'
            f'<text x="{cx}" y="{cy + 13}" fill="{MUTED}" font-size="9" font-family="{MONO}" text-anchor="middle">{esc(sub)}</text>'
        )

    # -- flechas -----------------------------------------------------------
    def arrow(self, d, kind="default", dashed=False):
        marker = {"default": "arrow", "accent": "arrow-accent", "link": "arrow-link"}[kind]
        color = {"default": MUTED, "accent": ACCENT, "link": LINK}[kind]
        dash = ' stroke-dasharray="5,4"' if dashed else ""
        self.arrows.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1.2"{dash} marker-end="url(#{marker})"/>')

    def label_h(self, cx, y, text):
        """Etiqueta sobre un conector horizontal en la coordenada y (hueco de 8px)."""
        w = int(len(text) * 5.5 + 12)
        w += (-w) % 4
        self.arrows.append(
            f'<rect x="{cx - w / 2}" y="{y - 20}" width="{w}" height="12" rx="2" fill="{PAPER}"/>'
            f'<text x="{cx}" y="{y - 11}" fill="{SOFT}" font-size="8" font-family="{MONO}" text-anchor="middle" letter-spacing="0.06em">{esc(text)}</text>'
        )

    def label_v(self, x, cy, text):
        """Etiqueta al costado derecho de un conector vertical (hueco de 8px)."""
        w = int(len(text) * 5.5 + 12)
        w += (-w) % 4
        self.arrows.append(
            f'<rect x="{x + 8}" y="{cy - 6}" width="{w}" height="12" rx="2" fill="{PAPER}"/>'
            f'<text x="{x + 8 + w / 2}" y="{cy + 3}" fill="{SOFT}" font-size="8" font-family="{MONO}" text-anchor="middle" letter-spacing="0.06em">{esc(text)}</text>'
        )

    # -- extras ------------------------------------------------------------
    def raw_front(self, s):
        self.arrows.append(s)

    def raw(self, s):
        self.nodes.append(s)

    def legend(self, y, items):
        out = [f'<line x1="40" y1="{y - 8}" x2="{self.w - 40}" y2="{y - 8}" stroke="rgba(28,28,28,0.10)" stroke-width="0.8"/>',
               f'<text x="40" y="{y + 8}" fill="{MUTED}" font-size="8" font-family="{MONO}" letter-spacing="0.14em">LEYENDA</text>']
        x = 120
        for kind, label in items:
            if kind in KINDS:
                k = KINDS[kind]
                dash = f' stroke-dasharray="{k["dash"]}"' if k["dash"] else ""
                out.append(f'<rect x="{x}" y="{y + 1}" width="16" height="10" rx="2" fill="{k["fill"]}" stroke="{k["stroke"]}" stroke-width="1"{dash}/>')
            elif kind == "line":
                out.append(f'<line x1="{x}" y1="{y + 6}" x2="{x + 16}" y2="{y + 6}" stroke="{MUTED}" stroke-width="1.2"/>')
            elif kind == "dashed":
                out.append(f'<line x1="{x}" y1="{y + 6}" x2="{x + 16}" y2="{y + 6}" stroke="{MUTED}" stroke-width="1.2" stroke-dasharray="5,4"/>')
            elif kind == "link":
                out.append(f'<line x1="{x}" y1="{y + 6}" x2="{x + 16}" y2="{y + 6}" stroke="{LINK}" stroke-width="1.2"/>')
            out.append(f'<text x="{x + 24}" y="{y + 10}" fill="{MUTED}" font-size="9" font-family="{MONO}">{esc(label)}</text>')
            x += 24 + int(len(label) * 5.6) + 28
        self.nodes.append("\n".join(out))

    def render(self):
        s = self.slug
        return f'''<svg viewBox="0 0 {self.w} {self.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="{s}-title {s}-desc">
<title id="{s}-title">{esc(self.title)}</title>
<desc id="{s}-desc">{esc(self.desc)}</desc>
<defs>
<marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{MUTED}"/></marker>
<marker id="arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{ACCENT}"/></marker>
<marker id="arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{LINK}"/></marker>
</defs>
<rect width="100%" height="100%" fill="{PAPER}"/>
{chr(10).join(self.arrows)}
{chr(10).join(self.nodes)}
</svg>'''


def page(svg, eyebrow, title):
    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<style>
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
:root {{
  --color-paper: {PAPER}; --color-ink: {INK}; --color-muted: {MUTED}; --color-accent: {ACCENT};
  --font-sans: {SANS}; --font-serif: {SERIF}; --font-mono: {MONO};
}}
body {{ font-family: var(--font-sans); background: var(--color-paper); color: var(--color-ink); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 3rem 2rem; }}
.frame {{ max-width: 1200px; width: 100%; }}
.diagram-container {{ width: 100%; overflow-x: auto; }}
.eyebrow {{ font-family: var(--font-mono); font-size: 0.66rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 0.5rem; }}
h1 {{ font-family: var(--font-serif); font-size: clamp(1.5rem, 2.4vw + 0.75rem, 2rem); font-weight: 400; letter-spacing: -0.02em; line-height: 1.15; color: var(--color-ink); margin-bottom: 1.5rem; }}
svg {{ width: 100%; min-width: 960px; display: block; }}
@media print {{ .diagram-container {{ overflow-x: visible; }} svg {{ min-width: 0; }} }}
</style>
</head>
<body>
<div class="frame">
<p class="eyebrow">{esc(eyebrow)}</p>
<h1>{esc(title)}</h1>
<div class="diagram-container">
{svg}
</div>
</div>
</body>
</html>
'''


def elbow_down_right(x0, y0, x1, y1, r=8):
    """Sale hacia la derecha desde (x0,y0), baja en x medio y llega a (x1,y1) hacia la derecha."""
    xm = (x0 + x1) / 2
    return f"M{x0},{y0} H{xm - r} a{r},{r} 0 0 1 {r},{r} V{y1 - r} a{r},{r} 0 0 0 {r},{r} H{x1}"


def elbow_up_right(x0, y0, x1, y1, r=8):
    xm = (x0 + x1) / 2
    return f"M{x0},{y0} H{xm - r} a{r},{r} 0 0 0 {r},-{r} V{y1 + r} a{r},{r} 0 0 1 {r},-{r} H{x1}"


# ---------------------------------------------------------------------------
def recorrido_cliente():
    d = Svg("recorrido-cliente", "Recorrido del cliente",
            "Siete pantallas de la tienda en orden, desde la portada hasta el seguimiento del pedido, con la búsqueda global que lleva directo al detalle de producto.", h=400)
    names = [("Portada", "/"), ("Catálogo", "/catalogo"), ("Detalle", "/producto/:slug"), ("Carrito", "drawer"),
             ("Checkout", "/checkout"), ("Confirmación", "…/confirmacion"), ("Seguimiento", "/pedido/:codigo")]
    w, gap, x0, y, h = 108, 20, 42, 188, 64
    xs = [x0 + i * (w + gap) for i in range(len(names))]
    for i in range(len(names) - 1):
        kind = "accent" if i == 4 else "default"
        d.arrow(f"M{xs[i] + w},{y + h / 2} H{xs[i + 1]}", kind)
    # búsqueda -> detalle
    cx = xs[2] + w / 2
    d.arrow(f"M{cx},{100} V{y}", "default", dashed=True)
    d.label_v(cx, 144, "RESULTADO")
    d.node(cx - 68, 40, 136, 60, "input", "Búsqueda global", "cmdk · tecla /")
    for i, (n, s) in enumerate(names):
        d.node(xs[i], y, w, h, "focal" if i == 5 else "backend", n, s)
    # fases
    fases = [(0, 2, "DESCUBRIR"), (3, 5, "COMPRAR"), (6, 6, "POSVENTA")]
    for a, b, t in fases:
        xa, xb = xs[a], xs[b] + w
        d.raw(f'<line x1="{xa}" y1="288" x2="{xb}" y2="288" stroke="{MUTED}" stroke-width="1"/>'
              f'<line x1="{xa}" y1="282" x2="{xa}" y2="288" stroke="{MUTED}" stroke-width="1"/>'
              f'<line x1="{xb}" y1="282" x2="{xb}" y2="288" stroke="{MUTED}" stroke-width="1"/>'
              f'<text x="{(xa + xb) / 2}" y="308" fill="{MUTED}" font-size="8" font-family="{MONO}" text-anchor="middle" letter-spacing="0.18em">{t}</text>')
    d.legend(356, [("backend", "Pantalla"), ("input", "Entrada global"), ("focal", "Pedido recibido"), ("dashed", "Atajo")])
    return page(d.render(), "Flujo · Tienda Prisma", "Recorrido del cliente"), d


def arquitectura_capas():
    d = Svg("arquitectura-capas", "Capas del frontend",
            "Cinco capas apiladas, de las páginas al origen de datos; los servicios son el único punto de acceso a los datos.", h=508)
    rows = [
        ("L1", "Páginas", "pantallas y sus estados: cargando, error, vacío", "feature/*", "backend"),
        ("L2", "Componentes y contextos", "piezas visuales y estado compartido", "shared/components · core/context", "backend"),
        ("L3", "Servicios", "único punto de acceso a datos y reglas de pedido", "catalogService · orderService", "focal"),
        ("L4", "Cliente HTTP", "fetch con errores uniformes e interruptor de modo", "apiClient · VITE_USE_MOCK", "backend"),
        ("L5", "Origen de datos", "datos simulados o API real", "mock · /api/public/...", "backend"),
    ]
    x, w, h, y0 = 100, 800, 72, 64
    d.raw_front(f'<line x1="60" y1="{y0}" x2="60" y2="{y0 + h * 5 - 8}" stroke="{MUTED}" stroke-width="1.2" marker-end="url(#arrow)"/>')
    d.raw(f'<text x="60" y="{y0 - 12}" fill="{MUTED}" font-size="8" font-family="{MONO}" text-anchor="middle" letter-spacing="0.14em">USUARIO</text>')
    d.raw(f'<text x="60" y="{y0 + h * 5 + 12}" fill="{MUTED}" font-size="8" font-family="{MONO}" text-anchor="middle" letter-spacing="0.14em">DATOS</text>')
    for i, (tag, name, note, tech, kind) in enumerate(rows):
        y = y0 + i * h
        focal = kind == "focal"
        d.raw(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{TINT if focal else "#ffffff"}" stroke="{ACCENT if focal else "rgba(28,28,28,0.18)"}" stroke-width="{1.2 if focal else 1}"/>')
        d.raw(f'<text x="{x + 20}" y="{y + 28}" fill="{ACCENT if focal else MUTED}" font-size="8" font-family="{MONO}" letter-spacing="0.18em">{tag}</text>')
        d.raw(f'<text x="{x + 20}" y="{y + 52}" fill="{INK}" font-size="14" font-weight="600" font-family="{SANS}">{esc(name)}</text>')
        d.raw(f'<text x="{x + w - 20}" y="{y + 32}" fill="{INK}" font-size="10" font-family="{SANS}" text-anchor="end">{esc(note)}</text>')
        d.raw(f'<text x="{x + w - 20}" y="{y + 52}" fill="{MUTED}" font-size="9" font-family="{MONO}" text-anchor="end">{esc(tech)}</text>')
    d.legend(468, [("backend", "Capa"), ("focal", "Capa clave: nada llega a los datos sin pasar por aquí")])
    return page(d.render(), "Capas · Tienda Prisma", "Capas del frontend"), d


def estados_pedido():
    d = Svg("estados-pedido", "Estados de un pedido",
            "Un pedido avanza de pendiente a preparación, enviado y entregado; cancelado se muestra aparte del flujo normal.", h=396)
    w, h, y = 128, 72, 56
    xs = [72, 296, 520, 744]
    estados = [("Pendiente", "PENDING"), ("En preparación", "PREPARING"), ("Enviado", "SHIPPED"), ("Entregado", "DELIVERED")]
    cy = y + h / 2
    d.arrow(f"M46,{cy} H{xs[0]}", "default")
    ev = ["PAGO VALIDADO", "DESPACHADO", "ENTREGADO"]
    for i in range(3):
        kind = "accent" if i == 2 else "default"
        d.arrow(f"M{xs[i] + w},{cy} H{xs[i + 1]}", kind)
        d.label_h((xs[i] + w + xs[i + 1]) / 2, cy, ev[i])
    d.arrow(f"M{xs[3] + w},{cy} H904", "accent")
    d.raw(f'<circle cx="40" cy="{cy}" r="6" fill="{INK}"/>')
    d.raw(f'<circle cx="912" cy="{cy}" r="8" fill="none" stroke="{INK}" stroke-width="1.2"/><circle cx="912" cy="{cy}" r="5" fill="{INK}"/>')
    for i, (n, s) in enumerate(estados):
        d.node(xs[i], y, w, h, "focal" if i == 3 else "backend", n, s)
    d.node(408, 204, 144, 72, "optional", "Cancelado", "CANCELLED")
    d.raw(f'<text x="480" y="300" fill="{SOFT}" font-size="9" font-family="{MONO}" text-anchor="middle">estado aparte, fuera del flujo normal</text>')
    d.legend(348, [("backend", "Estado"), ("focal", "Final feliz"), ("optional", "Estado aparte")])
    return page(d.render(), "Máquina de estados · Pedido", "Estados de un pedido"), d


def flujo_ramas():
    d = Svg("flujo-ramas", "Flujo de ramas",
            "El trabajo sale de una rama de tarea, entra a develop con un pull request y solo develop llega a main; develop publica staging y main publica producción.", h=436)
    w, h, y = 160, 72, 48
    xs = [100, 400, 700]
    cy = y + h / 2
    d.arrow(f"M{xs[0] + w},{cy} H{xs[1]}", "default")
    d.label_h((xs[0] + w + xs[1]) / 2, cy, "PR + CI")
    d.arrow(f"M{xs[1] + w},{cy} H{xs[2]}", "accent")
    d.label_h((xs[1] + w + xs[2]) / 2, cy, "PR + CI")
    # despliegues
    y2 = 228
    for xi, lab in ((xs[1], "AUTOMÁTICO"), (xs[2], "APROBACIÓN")):
        cx = xi + w / 2
        d.arrow(f"M{cx},{y + h} V{y2}", "link" if False else "default")
        d.label_v(cx, (y + h + y2) / 2, lab)
    d.node(xs[0], y, w, h, "input", "Rama de tarea", "feat/… · fix/… · ci/…")
    d.node(xs[1], y, w, h, "focal", "develop", "integración")
    d.node(xs[2], y, w, h, "backend", "main", "producción")
    d.node(xs[1], y2, w, h, "external", "Staging", "Vercel · vista previa")
    d.node(xs[2], y2, w, h, "external", "Producción", "Vercel · manual")
    d.raw(f'<text x="480" y="352" fill="{INK}" font-size="16" font-style="italic" font-family="{SERIF}" text-anchor="middle">Nunca se hace push directo a main ni a develop.</text>')
    d.legend(396, [("input", "Rama de trabajo"), ("focal", "Integración"), ("backend", "Producción"), ("external", "Despliegue")])
    return page(d.render(), "Git · Tienda Prisma", "Flujo de ramas"), d


def pipeline_ci():
    d = Svg("pipeline-ci", "Pipeline de CI/CD",
            "Al abrir un pull request corren tres grupos de verificaciones en paralelo; si el check CI aprobado pasa, el PR se revisa y se despliega, y si falla el bot comenta qué revisar.", h=496)
    # nodos
    pr = (40, 40, 120, 320)
    mids_x, mids_w, mids_h = 260, 200, 72
    mids_y = [58, 180, 302]
    ci = (580, 180, 140, 72)
    d.node(*pr, "input", "PR abierto", "hacia develop")
    mids = [("Política y PR", "ramas · título · Closes"), ("Lint y pruebas", "Node 20/22 · cobertura"), ("Build y seguridad", "bundle · audit · secretos")]
    for yy, (n, s) in zip(mids_y, mids):
        d.node(mids_x, yy, mids_w, mids_h, "backend", n, s)
    d.node(*ci, "focal", "CI aprobado", "check requerido")
    d.node(780, 180, 140, 72, "external", "Revisión y merge", "1 aprobación")
    d.node(580, 340, 140, 72, "store", "Comentario del bot", "qué falló y cómo")
    d.node(780, 340, 140, 72, "external", "Deploy Vercel", "develop o main")
    # PR -> mids (rectas)
    for yy in mids_y:
        d.arrow(f"M160,{yy + 36} H{mids_x}", "default")
    # mids -> CI (con codos separados)
    d.arrow(elbow_down_right(460, mids_y[0] + 36, 580, 180 + 18), "default")
    d.arrow(f"M460,{mids_y[1] + 36} H580", "default")
    d.arrow(elbow_up_right(460, mids_y[2] + 36, 580, 180 + 54), "default")
    # CI -> revisión (pasa), CI -> comentario (falla), revisión -> deploy
    d.arrow("M720,216 H780", "accent")
    d.label_h(750, 216, "PASA")
    d.arrow("M650,252 V340", "default", dashed=True)
    d.label_v(650, 296, "FALLA")
    d.arrow("M850,252 V340", "default")
    d.label_v(850, 296, "MERGE")
    d.legend(448, [("input", "Entrada"), ("backend", "Verificación"), ("focal", "Check requerido"), ("dashed", "Camino de falla")])
    return page(d.render(), "CI/CD · GitHub Actions", "Pipeline de CI/CD"), d


def fuente_datos():
    d = Svg("fuente-datos", "Origen de los datos",
            "Las pantallas piden datos al servicio; según VITE_USE_MOCK el servicio responde con datos simulados o con la API real a través de apiClient.", h=360)
    y, h = 48, 60
    d.arrow(f"M180,{y + 30} H260", "default")
    d.arrow(f"M400,{y + 30} H450", "default")
    d.arrow(f"M590,{y + 30} H700", "default")
    d.label_h(645, y + 30, "TRUE")
    d.arrow(f"M520,{y + 30 + 36} V176", "default")
    d.label_v(520, 146, "FALSE")
    d.arrow(f"M590,206 H700", "link")
    d.label_h(645, 206, "HTTP")
    d.node(40, y, 140, h, "backend", "Página", "feature/*")
    d.node(260, y, 140, h, "focal", "Servicio", "catalogService")
    d.diamond(520, y + 30, 140, 72, "¿Modo mock?", "VITE_USE_MOCK")
    d.node(700, y, 180, h, "store", "Datos simulados", "JSON y memoria")
    d.node(450, 176, 140, h, "backend", "apiClient", "fetch + errores")
    d.node(700, 176, 180, h, "external", "API real", "/api/public/...")
    d.legend(296, [("backend", "Código propio"), ("focal", "Punto único de acceso"), ("store", "Datos locales"), ("external", "Sistema externo")])
    return page(d.render(), "Datos · Tienda Prisma", "Origen de los datos"), d


if __name__ == "__main__":
    out = pathlib.Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    for fn in (recorrido_cliente, arquitectura_capas, estados_pedido, flujo_ramas, pipeline_ci, fuente_datos):
        html_text, d = fn()
        (out / f"{d.slug}.html").write_text(html_text, encoding="utf-8")
        print("ok", d.slug)
