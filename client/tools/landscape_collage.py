import random, sys
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance, ImageChops

SRC = r'C:/Users/khush/OneDrive/Pictures/Screenshots/Screenshot 2026-11-15 184838.png'
OUT = sys.argv[1]
W, H = 2400, 1350
random.seed(11)
src = Image.open(SRC).convert('RGB')

def up(im, k):
    im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))

def torn_mask(w, h, rough=10, step=6):
    """Rectangle with ragged, torn-paper edges."""
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    pts = []
    for x in range(0, w, step): pts.append((x, random.uniform(0, rough)))
    for y in range(0, h, step): pts.append((w - random.uniform(0, rough), y))
    for x in range(w, 0, -step): pts.append((x, h - random.uniform(0, rough)))
    for y in range(h, 0, -step): pts.append((random.uniform(0, rough), y))
    d.polygon(pts, fill=255)
    return m.filter(ImageFilter.GaussianBlur(0.8))

def paste(canvas, piece, x, y, rot=0, shadow=True, rough=10, edge=True):
    mask = torn_mask(*piece.size, rough=rough) if edge else Image.new('L', piece.size, 255)
    if edge:
        # thin white paper fibre along the torn edge
        rim = mask.filter(ImageFilter.MaxFilter(7))
        base = Image.new('RGB', piece.size, (247, 240, 225))
        piece = Image.composite(piece, base, mask)
        mask = rim
    piece = piece.convert('RGBA'); piece.putalpha(mask)
    piece = piece.rotate(rot, resample=Image.BICUBIC, expand=True)
    if shadow:
        sh = Image.new('RGBA', piece.size, (40, 25, 5, 0))
        sh.putalpha(piece.getchannel('A').point(lambda a: a * 0.45).filter(ImageFilter.GaussianBlur(14)))
        canvas.alpha_composite(sh, (int(x + 10), int(y + 16)))
    canvas.alpha_composite(piece, (int(x), int(y)))

# 1. Base: warm mustard from the collage itself, blurred, plus a damask texture strip tiled faintly
base = src.resize((W, int(W * src.height / src.width))).crop((0, 600, W, 600 + H)).filter(ImageFilter.GaussianBlur(60))
base = ImageEnhance.Color(base).enhance(1.15)
canvas = base.convert('RGBA')
damask = up(src.crop((0, 300, 46, 560)), 2.2).filter(ImageFilter.GaussianBlur(1.2))
tile = Image.new('RGB', (damask.width * 2, damask.height))
tile.paste(damask, (0, 0)); tile.paste(damask.transpose(Image.FLIP_LEFT_RIGHT), (damask.width, 0))
tex = Image.new('RGB', (W, H))
for tx in range(0, W, tile.width):
    for ty in range(0, H, tile.height):
        tex.paste(tile, (tx, ty))
canvas = Image.blend(canvas.convert('RGB'), tex, 0.3).convert('RGBA')

# 2. Big plain torn paper in the middle (sits under the card)
paper = up(src.crop((140, 95, 330, 300)), 4.6)
paste(canvas, paper, W * 0.22, H * 0.08, rot=-2, rough=16)
clip = up(src.crop((86, 58, 132, 232)), 3.0)
paste(canvas, clip, W * 0.27, H * 0.01, rot=4, shadow=True, edge=False)

# 3. Newspaper + roses scraps on the left and right
news_l = up(src.crop((150, 300, 440, 770)), 2.2)
paste(canvas, news_l, -W * 0.03, H * 0.18, rot=-5, rough=14)
news_r = up(src.crop((300, 280, 445, 600)), 2.9)
paste(canvas, news_r, W * 0.8, H * 0.02, rot=4, rough=12)

# 4. Yellow collage bits bottom-right
bits = up(src.crop((290, 560, 476, 776)), 2.6)
paste(canvas, bits, W * 0.76, H * 0.6, rot=-3, rough=12)

# 5. Sunflower clusters on top
top_r = up(src.crop((300, 0, 476, 285)), 2.6)
paste(canvas, top_r, W * 0.83, -H * 0.06, rot=6, rough=8)
top_l = up(src.crop((40, 0, 330, 120)), 2.4)
paste(canvas, top_l, W * 0.02, -H * 0.04, rot=-3, rough=8)
bouquet = up(src.crop((0, 440, 200, 778)), 2.5)
paste(canvas, bouquet, -W * 0.02, H * 0.42, rot=3, rough=8)
daisies = up(src.crop((385, 400, 476, 560)), 2.6)
paste(canvas, daisies, W * 0.66, H * 0.66, rot=-6, rough=8)

roses = up(src.crop((190, 360, 330, 600)), 2.4)
paste(canvas, roses, W * 0.36, H * 0.72, rot=-8, rough=12)
news_b = up(src.crop((160, 660, 300, 778)), 2.6)
paste(canvas, news_b, W * 0.5, H * 0.78, rot=3, rough=10)
sun2 = up(src.crop((365, 165, 476, 285)), 2.4)
paste(canvas, sun2, W * 0.27, H * 0.74, rot=-12, rough=6)

# 6. Paper grain + gentle vignette
grain = Image.effect_noise((W, H), 18).convert('RGB')
out = ImageChops.overlay(canvas.convert('RGB'), Image.blend(Image.new('RGB', (W, H), (128, 128, 128)), grain, 0.35))
vig = Image.new('L', (W, H), 0)
ImageDraw.Draw(vig).ellipse((-W * 0.15, -H * 0.2, W * 1.15, H * 1.2), fill=255)
vig = vig.filter(ImageFilter.GaussianBlur(160))
out = Image.composite(out, ImageEnhance.Brightness(out).enhance(0.8), vig)
out.save(OUT, quality=88, optimize=True)
out.resize((W // 2, H // 2)).save('collage-landscape-preview.png')
print('saved', out.size)
