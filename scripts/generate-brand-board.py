"""
Gera a prancha de identidade visual do WolvDog (docs/identidade-visual/prancha-identidade.png).

Uso:  python scripts/generate-brand-board.py
Usa as fontes reais do app (Oswald) e capturas de docs/identidade-visual/telas/.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "docs" / "identidade-visual"
SCREENS = OUT_DIR / "telas"
OSWALD_BOLD = ROOT / "node_modules/@expo-google-fonts/oswald/700Bold/Oswald_700Bold.ttf"
OSWALD_MED = ROOT / "node_modules/@expo-google-fonts/oswald/500Medium/Oswald_500Medium.ttf"
BODY = Path("C:/Windows/Fonts/segoeui.ttf")
BODY_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")

INK = (17, 17, 17)
CLAW = (255, 199, 44)
HERO = (30, 58, 138)
WHITE = (255, 255, 255)
CLOUD = (244, 245, 247)
SOFT = (74, 79, 92)
MUTED = (139, 144, 156)
LOCKED = (228, 230, 235)
AKITA = (242, 140, 40)
HERO_LIGHT = (220, 230, 251)

W, H = 2400, 1900


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def hero_button(d: ImageDraw.ImageDraw, x: int, y: int, w: int, label: str, bg, fg, f) -> None:
    """Botão "quadrinho": sombra sólida deslocada + contorno preto."""
    h = 84
    d.rounded_rectangle([x + 8, y + 8, x + w + 8, y + h + 8], radius=18, fill=INK)
    d.rounded_rectangle([x, y, x + w, y + h], radius=18, fill=bg, outline=INK, width=5)
    tw = d.textlength(label, font=f)
    d.text((x + (w - tw) / 2, y + 12), label, font=f, fill=fg)


def hexagon(d: ImageDraw.ImageDraw, cx: int, cy: int, size: int, fill, outline, width=6) -> None:
    w = size * 0.9
    pts = [(cx, cy - size / 2), (cx + w / 2, cy - size / 4), (cx + w / 2, cy + size / 4),
           (cx, cy + size / 2), (cx - w / 2, cy + size / 4), (cx - w / 2, cy - size / 4)]
    d.polygon(pts, fill=fill, outline=outline, width=width)


def section_title(d: ImageDraw.ImageDraw, x: int, y: int, text: str) -> None:
    d.rectangle([x, y + 14, x + 16, y + 30], fill=CLAW, outline=INK, width=3)
    d.text((x + 30, y), text, font=font(OSWALD_MED, 34), fill=SOFT)


def main() -> None:
    img = Image.new("RGB", (W, H), CLOUD)
    d = ImageDraw.Draw(img)

    # Cabeçalho
    d.rectangle([0, 0, W, 170], fill=INK)
    d.rectangle([0, 170, W, 186], fill=HERO)
    d.text((70, 28), "WOLVDOG", font=font(OSWALD_BOLD, 96), fill=CLAW)
    d.text((700, 62), "Guia de identidade visual  ·  app de adestramento gamificado", font=font(BODY, 40), fill=WHITE)
    d.text((W - 170, 40), "///", font=font(OSWALD_BOLD, 80), fill=CLAW)

    # Logan / ícone
    section_title(d, 70, 230, "MASCOTE  ·  LOGAN, AKITA INU HERÓI")
    icon = Image.open(ROOT / "assets/icon.png").convert("RGB").resize((360, 360))
    mask = Image.new("L", icon.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, 359, 359], radius=80, fill=255)
    img.paste(icon, (70, 300), mask)
    splash = Image.open(ROOT / "assets/splash-icon.png").convert("RGBA").resize((300, 300))
    d.rounded_rectangle([460, 300, 820, 660], radius=40, fill=WHITE, outline=INK, width=5)
    img.paste(splash, (490, 330), splash)
    d.text((70, 680), "Ícone do app (fundo #1850BE)", font=font(BODY, 28), fill=SOFT)
    d.text((460, 680), "Logan sobre fundo claro", font=font(BODY, 28), fill=SOFT)
    d.text((70, 730), "Pelagem laranja-dourada, máscara amarela com\ndetalhes pretos, bandana azul com emblema \"W\".\nMentor animado, didático e encorajador.",
           font=font(BODY, 30), fill=INK, spacing=8)

    # Paleta
    section_title(d, 900, 230, "PALETA")
    swatches = [
        ("Amarelo Garra", "#FFC72C", CLAW, INK, "Botões principais, conquistas"),
        ("Azul Herói", "#1E3A8A", HERO, WHITE, "Destaques, missão atual, links"),
        ("Preto Tinta", "#111111", INK, WHITE, "Contornos, títulos, sombras"),
        ("Laranja Akita", "#F28C28", AKITA, INK, "Logan, sequência, treinos"),
        ("Azul Ícone", "#1850BE", (24, 80, 190), WHITE, "Ícone e tela de abertura"),
        ("Azul Claro", "#DCE6FB", HERO_LIGHT, INK, "Fundos de destaque"),
        ("Nuvem", "#F4F5F7", CLOUD, INK, "Fundo das telas"),
        ("Alerta", "#E5484D", (229, 72, 77), WHITE, "Erros e avisos"),
    ]
    for i, (name, hexv, color, fg, use) in enumerate(swatches):
        col, row = i % 4, i // 4
        x, y = 900 + col * 360, 300 + row * 250
        d.rounded_rectangle([x + 6, y + 6, x + 330 + 6, y + 220 + 6], radius=18, fill=INK)
        d.rounded_rectangle([x, y, x + 330, y + 220], radius=18, fill=WHITE, outline=INK, width=4)
        d.rounded_rectangle([x, y, x + 330, y + 120], radius=18, fill=color, outline=INK, width=4)
        d.rectangle([x + 4, y + 100, x + 326, y + 118], fill=color)
        d.text((x + 20, y + 30), hexv, font=font(OSWALD_BOLD, 44), fill=fg)
        d.text((x + 20, y + 130), name, font=font(BODY_BOLD, 30), fill=INK)
        d.text((x + 20, y + 172), use, font=font(BODY, 22), fill=SOFT)

    # Tipografia
    section_title(d, 70, 880, "TIPOGRAFIA")
    d.text((70, 940), "MISSÃO CUMPRIDA!", font=font(OSWALD_BOLD, 92), fill=INK)
    d.text((70, 1060), "Oswald Bold — títulos, botões e números (sempre em MAIÚSCULAS nos botões)", font=font(BODY, 28), fill=SOFT)
    d.text((70, 1120), "DICA DO LOGAN  ·  HORA DO TREINO", font=font(OSWALD_MED, 48), fill=HERO)
    d.text((70, 1185), "Oswald Medium — rótulos e etiquetas, com espaçamento entre letras", font=font(BODY, 28), fill=SOFT)
    d.text((70, 1245), "Texto corrido em fonte do sistema, amigável e fácil de ler.", font=font(BODY, 36), fill=INK)
    d.text((70, 1300), "Sistema (San Francisco / Roboto) — conteúdo das missões e falas do Logan", font=font(BODY, 28), fill=SOFT)

    # Componentes
    section_title(d, 1300, 880, "COMPONENTES  ·  ESTILO HISTÓRIA EM QUADRINHOS")
    bf = font(OSWALD_BOLD, 44)
    hero_button(d, 1300, 950, 470, "MISSÃO DE HOJE", CLAW, INK, bf)
    hero_button(d, 1810, 950, 470, "CONTINUAR", HERO, WHITE, bf)
    hero_button(d, 1300, 1080, 470, "CRIAR CONTA", WHITE, INK, bf)
    d.text((1810, 1090), "Contorno preto de 2,5 px +\nsombra sólida deslocada.\nAo tocar, o botão \"afunda\".", font=font(BODY, 26), fill=SOFT, spacing=6)

    # Medalhas da trilha
    states = [("Cumprida", CLAW, INK, "✓"), ("Atual", HERO, INK, "▶"), ("Liberada", WHITE, INK, "●"), ("Bloqueada", LOCKED, MUTED, "🔒"), ("Pro", INK, INK, "♛")]
    for i, (label, fill, outline, _) in enumerate(states):
        cx = 1370 + i * 205
        hexagon(d, cx, 1290, 120, fill, outline)
        tw = d.textlength(label, font=font(BODY_BOLD, 24))
        d.text((cx - tw / 2, 1365), label, font=font(BODY_BOLD, 24), fill=SOFT)
    d.text((1300, 1405), "Medalhas hexagonais do Mapa de Missões (linha do tempo vertical)", font=font(BODY, 26), fill=SOFT)

    # Vocabulário
    section_title(d, 70, 1390, "VOCABULÁRIO PRÓPRIO")
    vocab = [("Lição", "Missão"), ("XP / pontos", "Garras"), ("Streak", "Sequência (semanal)"),
             ("Streak freeze", "Osso Reserva"), ("Nível", "Patente"), ("Revisão", "Treino de Reforço")]
    for i, (old, new) in enumerate(vocab):
        y = 1460 + i * 52
        d.text((70, y), old, font=font(BODY, 30), fill=MUTED)
        d.text((330, y), "→", font=font(BODY, 30), fill=MUTED)
        d.text((390, y), new, font=font(BODY_BOLD, 30), fill=INK)
    d.text((70, 1785), "Tom de voz: o Logan fala em 1ª pessoa, com humor leve,\n\"Au au!\", incentivo e zero bronca. Português do Brasil.", font=font(BODY, 28), fill=SOFT, spacing=6)

    # Telas
    section_title(d, 1300, 1460, "TELAS DO APP")
    shots = ["00-boas-vindas.jpg", "02-mapa-de-missoes.jpg", "04-missao-treino-clicker.jpg", "05-missao-cumprida.jpg"]
    for i, name in enumerate(shots):
        p = SCREENS / name
        if not p.exists():
            continue
        shot = Image.open(p).convert("RGB")
        shot = shot.crop((0, 0, shot.width, min(shot.height, int(shot.width * 1.25))))
        shot = shot.resize((230, int(230 * shot.height / shot.width)))
        x = 1300 + i * 255
        d.rounded_rectangle([x - 4, 1520 - 4, x + 230 + 4, 1520 + shot.height + 4], radius=14, fill=INK)
        img.paste(shot, (x, 1520))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / "prancha-identidade.png"
    img.save(out, optimize=True)
    print("Prancha salva em", out)


if __name__ == "__main__":
    main()
