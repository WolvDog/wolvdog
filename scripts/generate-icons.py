"""
Gera os ícones do app a partir da arte-fonte do Logan (assets/brand/logan-icon-source.jpg).

Uso:  python scripts/generate-icons.py
Saída (em assets/):
  icon.png            1024x1024  ícone iOS/geral (fundo azul até a borda; o sistema arredonda)
  adaptive-icon.png   1024x1024  Android: só o Logan, fundo transparente, dentro da área segura
  splash-icon.png     1024x1024  tela de abertura: Logan com fundo transparente
  favicon.png         48x48      web
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "brand" / "logan-icon-source.jpg"
OUT = ROOT / "assets"

BLUE = (24, 80, 190)  # azul do fundo da arte (também usado no app.json)
SENTINEL = (255, 0, 255)


def background_mask(img: Image.Image) -> Image.Image:
    """Máscara (L) com 255 onde é fundo: o azul ligado às bordas e os cantos brancos."""
    work = img.copy()
    w, h = work.size
    # Cantos brancos fora do quadrado arredondado
    for corner in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(work, corner, SENTINEL, thresh=60)
    # Fundo azul (preenche a partir de vários pontos da borda interna)
    for seed in [(w // 2, h // 20), (w // 20, h // 2), (w - w // 20, h // 2), (w // 2, h - h // 20)]:
        ImageDraw.floodfill(work, seed, SENTINEL, thresh=70)
    px = work.load()
    # Os pixels de transição na borda arredondada escapam do preenchimento:
    # tudo fora da área central (onde o Logan está) também é fundo.
    margin = round(w * 0.075)
    mask = Image.new("L", (w, h), 0)
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            outside = x < margin or y < margin or x >= w - margin or y >= h - margin
            if outside or px[x, y] == SENTINEL:
                mp[x, y] = 255
    return mask


def main() -> None:
    src = Image.open(SOURCE).convert("RGB")
    bg = background_mask(src)

    # Logan isolado: alfa = não-fundo, com borda levemente suavizada
    alpha = Image.eval(bg, lambda v: 255 - v).filter(ImageFilter.GaussianBlur(1.2))
    logan = src.convert("RGBA")
    logan.putalpha(alpha)
    logan = logan.crop(alpha.getbbox())

    # 1) icon.png — composição original com fundo azul até a borda
    full = Image.new("RGB", src.size, BLUE)
    full.paste(logan, alpha.getbbox()[:2], logan)
    full.resize((1024, 1024), Image.LANCZOS).save(OUT / "icon.png", optimize=True)

    def centered(canvas_size: int, target_height: int, y_offset: int = 0) -> Image.Image:
        scale = target_height / logan.height
        art = logan.resize((round(logan.width * scale), target_height), Image.LANCZOS)
        canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
        canvas.paste(art, ((canvas_size - art.width) // 2, (canvas_size - art.height) // 2 + y_offset), art)
        return canvas

    # 2) adaptive-icon.png — Android recorta em círculo/squircle; mantém o Logan nos ~60% centrais
    centered(1024, 600).save(OUT / "adaptive-icon.png", optimize=True)

    # 3) splash-icon.png — usado no centro da tela de abertura azul
    centered(1024, 960).save(OUT / "splash-icon.png", optimize=True)

    # 4) favicon.png
    full.resize((48, 48), Image.LANCZOS).save(OUT / "favicon.png", optimize=True)

    print("Ícones gerados em", OUT)


if __name__ == "__main__":
    main()
