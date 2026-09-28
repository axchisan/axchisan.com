"""
Descarga de Google Fonts, una sola vez, las fuentes que usan el sitio y las
demos, y cambia cada `next/font/google` por `next/font/local`.

Por qué: `next/font/google` baja las fuentes en cada compilación, y Google
devuelve de vez en cuando una URL que Turbopack no sabe leer
(vercel/next.js#99114). Con 19 fuentes, alguna compilación de producción
fallaba. Con los archivos en el repositorio, la compilación no depende de la red.

    python3 scripts/fuentes-locales.py

Guarda el subconjunto latino, en versión variable cuando existe, en
`app/fuentes/`. Para agregar una fuente nueva: declararla con next/font/google,
correr este script y listo.
"""
import glob, json, os, re, urllib.request

DESTINO = "app/fuentes"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
datos = json.load(open(glob.glob("node_modules/next/dist/compiled/@next/font/dist/google/font-data.json")[0]))
os.makedirs(DESTINO, exist_ok=True)

def descargar(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30).read()

def slug(familia):
    return familia.lower().replace(" ", "-")

def caras(familia, pesos, estilos, ejes):
    """Pide el CSS a Google y devuelve las caras latinas: estilo, peso, ancho y archivo."""
    info = datos[familia]
    ejes_fuente = {a["tag"]: a for a in info.get("axes", [])}
    variable = "wght" in ejes_fuente
    etiquetas, valores = [], []
    for tag in sorted(set(ejes) | ({"wght"} if variable else set()), key=lambda t: (t.isupper(), t)):
        a = ejes_fuente[tag]
        if tag == "wght" and pesos:
            etiquetas.append("wght"); valores.append(f"{min(pesos)}..{max(pesos)}")
        else:
            etiquetas.append(tag); valores.append(f"{a['min']:g}..{a['max']:g}")
    if not variable:
        etiquetas, valores = ["wght"], [str(pesos[0] if pesos else 400)]
    italica = "italic" in estilos
    if italica:
        spec = "ital," + ",".join(etiquetas) + "@" + ";".join(f"{i}," + ",".join(valores) for i in (0, 1))
    else:
        spec = ",".join(etiquetas) + "@" + ",".join(valores)
    url = f"https://fonts.googleapis.com/css2?family={familia.replace(' ', '+')}:{spec}&display=swap"
    css = descargar(url).decode()
    salida = []
    for bloque in re.findall(r"/\* latin \*/\s*@font-face \{(.*?)\}", css, re.S):
        estilo = re.search(r"font-style: (\w+)", bloque).group(1)
        peso = re.search(r"font-weight: ([\d ]+);", bloque).group(1)
        ancho = re.search(r"font-stretch: ([^;]+);", bloque)
        src = re.search(r"url\((.*?)\)", bloque).group(1)
        nombre = f"{slug(familia)}{'-italica' if estilo == 'italic' else ''}.woff2"
        ruta = f"{DESTINO}/{nombre}"
        if not os.path.exists(ruta):
            open(ruta, "wb").write(descargar(src))
        salida.append({"archivo": nombre, "estilo": estilo, "peso": peso, "ancho": ancho.group(1) if ancho else None})
    assert salida, f"sin caras latinas para {familia}"
    return salida

LLAMADA = re.compile(r"const (\w+) = ([A-Z]\w*)\((\{.*?\})\)", re.S)

for archivo in sorted(glob.glob("app/**/layout.tsx", recursive=True)):
    s = open(archivo).read()
    if "next/font/google" not in s:
        continue
    relativa = os.path.relpath(DESTINO, os.path.dirname(archivo))
    def reemplazar(m):
        nombre, funcion, cfg = m.groups()
        familia = funcion.replace("_", " ")
        variable = re.search(r'variable: "([^"]+)"', cfg).group(1)
        pesos = [int(p) for p in re.findall(r'"(\d{3})"', re.search(r"weight: (\[.*?\]|\"\d+\")", cfg).group(1))] if "weight:" in cfg else []
        estilos = re.findall(r'"(normal|italic)"', re.search(r"style: \[(.*?)\]", cfg).group(1)) if "style:" in cfg else ["normal"]
        ejes = re.findall(r'"(\w+)"', re.search(r"axes: \[(.*?)\]", cfg).group(1)) if "axes:" in cfg else []
        fuentes = []
        for c in caras(familia, pesos, estilos, ejes):
            linea = f'{{ path: "{relativa}/{c["archivo"]}", weight: "{c["peso"]}", style: "{c["estilo"]}" }}'
            fuentes.append(linea)
        src = fuentes[0] if len(fuentes) == 1 else "[\n    " + ",\n    ".join(fuentes) + ",\n  ]"
        if len(fuentes) == 1:
            src = f"[{fuentes[0]}]"
        anchos = {c["ancho"] for c in caras(familia, pesos, estilos, ejes) if c["ancho"]}
        extra = f'\n  declarations: [{{ prop: "font-stretch", value: "{anchos.pop()}" }}],' if anchos else ""
        return f'const {nombre} = localFont({{\n  src: {src},\n  variable: "{variable}",\n  display: "swap",{extra}\n}})'
    nuevo = LLAMADA.sub(reemplazar, s)
    nuevo = re.sub(r'import \{[^}]*\} from "next/font/google"', 'import localFont from "next/font/local"', nuevo)
    open(archivo, "w").write(nuevo)
    print("ok", archivo)
