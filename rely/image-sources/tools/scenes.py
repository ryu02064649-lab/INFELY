import sys, os, math, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
import lib
from lib import *

HERE = os.path.dirname(os.path.abspath(__file__))

WARM = (1.0, 0.78, 0.55)
NEUTRAL = (1.0, 0.94, 0.86)
COOL = (0.82, 0.88, 1.0)

IVORY = (0.80, 0.76, 0.68)
CHAR = (0.018, 0.018, 0.018)


def glass_mat():
    return mat("glass", color=(1, 1, 1), rough=0.0, trans=1.0, ior=1.5)


def silver_mat(rough=0.18):
    return mat("silver", color=(0.86, 0.86, 0.87), rough=rough, metal=1.0)


def wine_glass(x, y, s=1.0, wine=True):
    g = glass_mat()
    # closed profile: outer surface up, inner surface down (gives the glass thickness)
    outer = [(0.0, 0.0), (0.038, 0.0), (0.040, 0.003), (0.006, 0.008), (0.004, 0.02), (0.004, 0.09),
             (0.012, 0.105), (0.035, 0.13), (0.045, 0.16), (0.046, 0.19), (0.040, 0.225), (0.036, 0.235)]
    inner = [(0.0345, 0.235), (0.0385, 0.224), (0.0445, 0.19), (0.0435, 0.16), (0.034, 0.132), (0.011, 0.108), (0.0, 0.106)]
    prof = [(r * s, z * s) for r, z in outer + inner]
    lathe(prof, (x, y, 0), g, name="wineglass")
    if wine:
        wm = mat("wine", color=(0.30, 0.02, 0.035), rough=0.02, trans=0.85, ior=1.34)
        wp = [(0.0, 0.1075), (0.011, 0.1085), (0.033, 0.133), (0.0425, 0.158), (0.0428, 0.162), (0.0, 0.162)]
        lathe([(r * s, z * s) for r, z in wp], (x, y, 0), wm, name="wine")


def candle(x, y, h=0.08):
    wax = mat("wax", color=(0.85, 0.80, 0.70), rough=0.4, sheen=0.3)
    cyl(0.025, h, (x, y, h / 2), wax, bevel=0.003)
    flame = mat("flame", color=(0, 0, 0), emit=(1.0, 0.62, 0.28), emit_strength=60)
    f = sphere(0.006, (x, y, h + 0.018), flame, scale=(1, 1, 2.4), seg=24)
    f.visible_shadow = False
    point((x, y, h + 0.03), 1.6, (1.0, 0.6, 0.3), radius=0.01)
    holder = [(0.0, 0.0), (0.04, 0.0), (0.041, 0.07), (0.037, 0.07), (0.036, 0.004), (0.0, 0.004)]
    lathe(holder, (x, y, 0), glass_mat(), name="holder")


# ─────────────────────────────────────────────────────────────
def dining(q):
    reset(world=(0.003, 0.003, 0.0035), samples=q["samples"])
    table = textured(mat("table", color=(0.02, 0.018, 0.016), rough=0.28, coat=0.3),
                     scale=3, c1=(0.012, 0.011, 0.010), c2=(0.03, 0.026, 0.022), bump=0.02,
                     stretch=(0.2, 3, 1), kind="wave", distortion=4)
    box((4, 3, 0.06), (0, 0.4, -0.03), table)
    linen = mat("linen", color=(0.42, 0.40, 0.36), rough=0.8, sheen=0.6)
    box((0.42, 3, 0.004), (0.02, 0.4, 0.002), linen, bevel=0.001)
    # plate + folded napkin
    plate = mat("porcelain", color=(0.82, 0.80, 0.76), rough=0.12, coat=0.6)
    lathe([(0, 0.004), (0.10, 0.006), (0.14, 0.018), (0.145, 0.02), (0.135, 0.02), (0.098, 0.011), (0, 0.009)],
          (0.0, 0.05, 0.004), plate, name="plate")
    box((0.09, 0.14, 0.012), (0.0, 0.05, 0.022), linen, bevel=0.004, rot=(0, 0, 0.12))
    # cutlery
    sv = silver_mat(0.12)
    box((0.012, 0.21, 0.003), (-0.18, 0.05, 0.006), sv, bevel=0.0012)
    box((0.016, 0.21, 0.003), (0.18, 0.05, 0.006), sv, bevel=0.0012)
    box((0.012, 0.18, 0.003), (0.205, 0.05, 0.006), sv, bevel=0.0012)
    wine_glass(0.13, 0.30, 1.0)
    wine_glass(-0.10, 0.42, 1.0, wine=False)
    candle(-0.02, 0.62)
    candle(0.30, 0.95, h=0.12)
    # far room: warm pendants out of focus
    bokeh_field(70, (-4, 4), (5, 10), (0.2, 2.0), (0.012, 0.03), [(1, 0.7, 0.42), (1, 0.8, 0.58), (0.85, 0.8, 0.75)], 6)
    area((-0.9, -0.4, 1.4), (0, 0.3, 0), 0.9, 12, NEUTRAL)
    area((0.3, 2.2, 0.8), (0.1, 0.3, 0.1), 1.2, 14, WARM)  # rim for the glass edges
    camera((0.38, -0.78, 0.30), (0.08, 0.28, 0.11), lens=62, fstop=1.8)


def stay(q):
    reset(world=(0.004, 0.005, 0.008), samples=q["samples"])
    floor = textured(mat("floor", color=(0.02, 0.018, 0.016), rough=0.35), scale=2, c1=(0.01, 0.009, 0.008),
                     c2=(0.03, 0.026, 0.022), bump=0.01, stretch=(0.3, 4, 1), kind="wave", distortion=3)
    box((14, 14, 0.1), (0, 2, -0.05), floor)
    fabric_dark = mat("upholstery", color=(0.03, 0.03, 0.03), rough=0.9, sheen=0.5)
    linen = mat("linen", color=(0.58, 0.56, 0.52), rough=0.85, sheen=0.7)
    box((1.9, 2.1, 0.32), (0, 0, 0.16), fabric_dark, bevel=0.03)
    box((1.86, 2.02, 0.22), (0, 0.02, 0.42), linen, bevel=0.09, subsurf=2)
    box((1.96, 0.55, 0.06), (0, 0.72, 0.54), fabric_dark, bevel=0.03, subsurf=1)  # folded throw at the foot
    for x in (-0.48, 0.48):
        box((0.78, 0.2, 0.45), (x, -0.86, 0.72), linen, bevel=0.09, subsurf=2, rot=(0.35, 0, 0))
    box((2.4, 0.12, 1.4), (0, -1.12, 0.7), fabric_dark, bevel=0.02)  # headboard
    # nightstand + lamp
    box((0.5, 0.45, 0.5), (1.35, -0.85, 0.25), mat("stone", color=(0.035, 0.034, 0.032), rough=0.3), bevel=0.01)
    shade_in = mat("shade", color=(0.9, 0.8, 0.65), rough=0.9, emit=(1, 0.72, 0.45), emit_strength=3)
    lathe([(0.14, 0.0), (0.11, 0.22), (0.105, 0.22), (0.135, 0.0)], (1.35, -0.85, 0.82), shade_in, name="shade")
    cyl(0.012, 0.32, (1.35, -0.85, 0.66), silver_mat(0.3))
    point((1.35, -0.85, 0.9), 40, (1, 0.7, 0.42), radius=0.06)
    # window wall on the right side of the bed, city far below
    mull = mat("mullion", color=(0.01, 0.01, 0.01), rough=0.5)
    for y in (-1.8, -0.6, 0.6, 1.8, 3.0):
        box((0.08, 0.05, 3.2), (2.3, y, 1.6), mull)
    box((0.06, 7, 0.06), (2.3, 0.6, 0.03), mull)
    bokeh_field(1600, (25, 90), (-90, 90), (-20, -1.5), (0.1, 0.28),
                [(1, 0.78, 0.5), (0.9, 0.92, 1.0), (1, 0.9, 0.75)], 14)
    horizon = mat("horizon", color=(0, 0, 0), emit=(0.03, 0.035, 0.045), emit_strength=1.0)
    box((1, 400, 6), (200, 0, -6), horizon)
    area((0.0, 0.4, 2.8), (0, 0.2, 0.4), 2.0, 40, NEUTRAL)
    area((2.2, 0.4, 1.4), (0, 0, 0.5), 1.5, 22, COOL)  # moonlight from the window side
    camera((-1.5, 2.9, 1.35), (0.55, -0.45, 0.55), lens=30, fstop=2.2, focus=3.3)


def experience(q):
    reset(world=(0.004, 0.005, 0.007), samples=q["samples"])
    water = mat("water", color=(0.004, 0.006, 0.008), rough=0.03, spec=0.6)
    nt = water.node_tree
    tex = nt.nodes.new("ShaderNodeTexNoise"); tex.inputs["Scale"].default_value = 3; tex.inputs["Detail"].default_value = 4
    mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (1, 6, 1)
    co = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(co.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], tex.inputs["Vector"])
    b = nt.nodes.new("ShaderNodeBump"); b.inputs["Strength"].default_value = 0.08
    nt.links.new(tex.outputs["Fac"], b.inputs["Height"]); nt.links.new(b.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])
    box((60, 60, 0.02), (0, 20, -0.01), water)
    # stone ledge in the foreground right
    stone = textured(mat("basalt", color=(0.03, 0.03, 0.03), rough=0.6), scale=12, c1=(0.015, 0.015, 0.015),
                     c2=(0.05, 0.048, 0.045), bump=0.15)
    box((0.9, 0.7, 0.12), (0.6, -0.08, 0.04), stone, bevel=0.01)
    # stacked stones
    z = 0.10
    for r, sc in [(0.11, 0.42), (0.085, 0.45), (0.065, 0.5), (0.045, 0.55)]:
        h = r * sc
        o = sphere(r, (0.42, -0.02, z + h), stone, scale=(1, 0.9, sc))
        d = o.modifiers.new("d", "DISPLACE"); t = bpy.data.textures.new("n", "CLOUDS"); t.noise_scale = 0.3; d.texture = t; d.strength = 0.006
        z += 2 * h - 0.004
    # rolled towel
    towel = mat("towel", color=(0.72, 0.69, 0.63), rough=0.95, sheen=0.9)
    cyl(0.055, 0.34, (0.78, 0.02, 0.155), towel, rot=(0, math.pi / 2, 0.25), bevel=0.02)
    candle(0.22, -0.28, h=0.07)
    # distant resort lights across the water and a pale horizon
    bokeh_field(160, (-40, 40), (30, 60), (0.2, 1.6), (0.05, 0.14), [(1, 0.75, 0.48), (1, 0.85, 0.65)], 22)
    sky = mat("sky", color=(0, 0, 0), emit=(0.035, 0.045, 0.06), emit_strength=0.6)
    box((400, 1, 30), (0, 90, 15), sky)
    area((1.8, -0.6, 1.2), (0.5, 0, 0.2), 1.0, 30, NEUTRAL)
    area((-0.5, 1.5, 0.7), (0.45, 0, 0.2), 1.0, 12, COOL)
    camera((0.02, -0.72, 0.30), (0.5, 0.0, 0.2), lens=45, fstop=2.0)


def gift(q):
    reset(world=(0.004, 0.004, 0.004), samples=q["samples"])
    leather = textured(mat("leather", color=(0.03, 0.028, 0.026), rough=0.55, coat=0.15), scale=180, detail=3,
                       c1=(0.02, 0.019, 0.018), c2=(0.04, 0.037, 0.034), bump=0.25)
    box((3, 3, 0.04), (0, 0.4, -0.02), leather)
    black = mat("boxblack", color=(0.012, 0.012, 0.012), rough=0.45, coat=0.2)
    satin = mat("satin", color=(0.50, 0.47, 0.42), rough=0.25, sheen=0.6, aniso=0.6)
    # main box, lid, ribbon cross and bow
    box((0.24, 0.24, 0.10), (0, 0, 0.05), black, bevel=0.002, rot=(0, 0, 0.35))
    box((0.246, 0.246, 0.035), (0, 0, 0.0975), black, bevel=0.002, rot=(0, 0, 0.35))
    box((0.035, 0.25, 0.117), (0, 0, 0.058), satin, bevel=0.001, rot=(0, 0, 0.35))
    box((0.25, 0.035, 0.117), (0, 0, 0.058), satin, bevel=0.001, rot=(0, 0, 0.35))
    for a in (0.35 + math.pi / 4, 0.35 + math.pi / 4 + math.pi):
        torus(0.026, 0.0045, (0.024 * math.cos(a), 0.024 * math.sin(a), 0.124), satin,
              rot=(math.radians(70), 0, a + math.pi / 2), scale=(1, 0.35, 1))
    sphere(0.011, (0, 0, 0.121), satin, scale=(1, 1, 0.6))
    # smaller box behind
    box((0.14, 0.14, 0.07), (-0.24, 0.28, 0.035), satin, bevel=0.002, rot=(0, 0, -0.2))
    box((0.02, 0.145, 0.075), (-0.24, 0.28, 0.036), black, bevel=0.001, rot=(0, 0, -0.2))
    # perfume bottle
    g = glass_mat()
    box((0.07, 0.035, 0.09), (0.22, 0.2, 0.045), g, bevel=0.006)
    juice = mat("juice", color=(0.75, 0.68, 0.55), rough=0.0, trans=1.0, ior=1.36)
    box((0.058, 0.024, 0.06), (0.22, 0.2, 0.038), juice, bevel=0.004)
    cyl(0.011, 0.012, (0.22, 0.2, 0.096), silver_mat(0.1))
    cyl(0.018, 0.035, (0.22, 0.2, 0.118), black, bevel=0.002)
    # watch lying on its side
    sv = silver_mat(0.14)
    cyl(0.021, 0.011, (0.17, -0.19, 0.0055), sv, bevel=0.002)
    cyl(0.018, 0.001, (0.17, -0.19, 0.0115), mat("dial", color=(0.02, 0.02, 0.022), rough=0.3))
    cyl(0.019, 0.001, (0.17, -0.19, 0.0125), g)
    strap = mat("strap", color=(0.025, 0.022, 0.02), rough=0.6)
    box((0.022, 0.09, 0.004), (0.17, -0.26, 0.002), strap, bevel=0.001)
    box((0.022, 0.09, 0.004), (0.17, -0.12, 0.002), strap, bevel=0.001)
    spot((-0.35, -0.25, 0.9), (0, 0, 0.05), 55, angle=0.55, blend=0.9, color=NEUTRAL, radius=0.12)
    area((0.6, 0.6, 0.35), (0, 0, 0.08), 0.5, 3, COOL)
    area((0.1, -0.8, 0.5), (0.05, 0, 0.06), 0.8, 3, NEUTRAL)
    camera((0.42, -0.95, 0.42), (0.02, 0.05, 0.06), lens=62, fstop=3.2)


def research(q):
    reset(world=(0.004, 0.004, 0.004), samples=q["samples"])
    walnut = textured(mat("walnut", color=(0.04, 0.025, 0.016), rough=0.4, coat=0.1), scale=6, detail=8,
                      c1=(0.014, 0.010, 0.007), c2=(0.045, 0.031, 0.02), bump=0.004,
                      stretch=(0.06, 3.0, 1), kind="noise", distortion=1.5)
    box((3, 2, 0.05), (0, 0.3, -0.025), walnut)
    # laptop
    alu = mat("alu", color=(0.12, 0.12, 0.125), rough=0.35, metal=1.0)
    lx, ly, rz = 0.18, 0.28, -0.28
    base = box((0.31, 0.215, 0.012), (lx, ly, 0.006), alu, bevel=0.003, rot=(0, 0, rz))
    screen_path = os.path.join(HERE, "screen.png")
    scr = image_mat("screen", screen_path, emit_strength=3.0, rough=0.2)
    hinge_y = 0.1075
    import mathutils
    # lid rotated open ~105°, placed at the back edge of the base
    lid = box((0.31, 0.006, 0.205), (0, 0, 0.1025), alu, bevel=0.002, name="lid")
    disp = box((0.29, 0.001, 0.185), (0, -0.0035, 0.1025), scr, name="display")
    bpy.ops.object.select_all(action="DESELECT")
    for o in (lid, disp):
        o.select_set(True)
    bpy.context.view_layer.objects.active = lid
    bpy.ops.object.parent_set(type="OBJECT")
    lid.rotation_euler = (math.radians(-12), 0, rz)
    back = mathutils.Matrix.Rotation(rz, 4, "Z") @ Vector((0, hinge_y, 0))
    lid.location = (lx + back.x, ly + back.y, 0.012)
    # papers with a printed page on top
    paper = mat("paper", color=(0.78, 0.76, 0.71), rough=0.9)
    page = image_mat("page", os.path.join(HERE, "page.png"), rough=0.85)
    for i, (dx, dy, r) in enumerate([(0, 0, 0.1), (0.01, -0.006, 0.16), (-0.006, 0.004, 0.05)]):
        box((0.21, 0.297, 0.0015), (-0.2 + dx, 0.02 + dy, 0.001 + i * 0.0016), paper, rot=(0, 0, r))
    top = box((0.21, 0.297, 0.0015), (-0.2, 0.02, 0.0065), page, rot=(0, 0, 0.12))
    bpy.context.view_layer.objects.active = top
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.uv.cube_project(); bpy.ops.object.mode_set(mode="OBJECT")
    # pen
    pen = mat("pen", color=(0.01, 0.01, 0.01), rough=0.15, coat=0.8)
    cyl(0.0065, 0.14, (-0.16, -0.08, 0.0137), pen, rot=(0, math.pi / 2, 0.55))
    cyl(0.0068, 0.02, (-0.1, -0.044, 0.0137), silver_mat(0.1), rot=(0, math.pi / 2, 0.55))
    # glass of water
    lathe([(0, 0), (0.033, 0), (0.034, 0.1), (0.031, 0.1), (0.030, 0.006), (0, 0.006)], (-0.02, 0.36, 0), glass_mat(), name="tumbler")
    lathe([(0, 0.0062), (0.0298, 0.0062), (0.0305, 0.06), (0, 0.06)], (-0.02, 0.36, 0),
          mat("water", color=(1, 1, 1), rough=0, trans=1, ior=1.33), name="water")
    # desk lamp pool + window light
    spot((-0.5, -0.1, 0.8), (-0.12, 0.1, 0), 70, angle=0.8, blend=0.9, color=WARM, radius=0.1)
    area((0.9, 0.9, 1.2), (0, 0.2, 0), 1.5, 14, COOL)
    area((-0.2, 1.4, 0.5), (-0.02, 0.36, 0.05), 0.8, 10, NEUTRAL)  # backlight for the glass
    bokeh_field(24, (-2, 2), (2.5, 5), (0.2, 1.4), (0.02, 0.04), [(1, 0.8, 0.6), (0.9, 0.9, 1.0)], 12)
    camera((-0.02, -0.55, 0.40), (-0.02, 0.12, 0.03), lens=40, fstop=2.2, focus=0.72)


def other(q):
    reset(world=(0.004, 0.004, 0.0045), samples=q["samples"])
    marble = textured(mat("marble", color=(0.02, 0.02, 0.02), rough=0.12, coat=0.6), scale=2.2, detail=8,
                      c1=(0.010, 0.010, 0.010), c2=(0.075, 0.072, 0.068), bump=0.0, distortion=9,
                      stretch=(1, 0.4, 1), kind="wave")
    box((3, 3, 0.05), (0, 0.4, -0.025), marble)
    sv = silver_mat(0.08)
    # service bell: base disk, dome, plunger
    lathe([(0, 0), (0.07, 0), (0.072, 0.004), (0.07, 0.014), (0.0, 0.014)], (0, 0, 0),
          mat("bellbase", color=(0.015, 0.015, 0.015), rough=0.2, coat=0.6), name="bellbase")
    dome = [(0.0, 0.086), (0.012, 0.085), (0.03, 0.078), (0.045, 0.065), (0.056, 0.047), (0.062, 0.03),
            (0.064, 0.018), (0.066, 0.016), (0.0, 0.016)]
    lathe(dome, (0, 0, 0), sv, name="dome")
    cyl(0.004, 0.016, (0, 0, 0.094), sv)
    sphere(0.009, (0, 0, 0.104), sv, scale=(1, 1, 0.55))
    # a key with an ivory tassel
    key_m = mat("key", color=(0.78, 0.76, 0.72), rough=0.2, metal=1.0)
    k = (0.14, -0.1, 0.004)
    torus(0.018, 0.004, (k[0] - 0.05, k[1], 0.004), key_m, rot=(0, 0, 0))
    cyl(0.0035, 0.085, (k[0], k[1], 0.004), key_m, rot=(0, math.pi / 2, 0))
    box((0.012, 0.016, 0.004), (k[0] + 0.035, k[1] - 0.009, 0.004), key_m, bevel=0.001)
    box((0.006, 0.012, 0.004), (k[0] + 0.02, k[1] - 0.007, 0.004), key_m, bevel=0.001)
    tassel = mat("tassel", color=(0.72, 0.68, 0.6), rough=0.7, sheen=1.0)
    cyl(0.004, 0.06, (k[0] - 0.1, k[1] - 0.02, 0.004), tassel, rot=(0, math.pi / 2, 0.3))
    lathe([(0.0, 0.0), (0.009, 0.002), (0.012, 0.03), (0.0, 0.034)], (k[0] - 0.14, k[1] - 0.032, 0.008), tassel, name="tassel")
    bpy.data.objects["tassel"].rotation_euler = (0, math.pi / 2, 0.3 + math.pi)
    # softboxes for reflections in the polished metal
    area((-0.35, -0.2, 0.6), (0, 0, 0.05), 0.6, 18, NEUTRAL, shape="RECTANGLE", size_y=0.2)
    wall = mat("wall", color=(0, 0, 0), emit=(0.12, 0.12, 0.12), emit_strength=1.0)
    w = box((2, 0.02, 1.2), (0.4, -1.4, 0.4), wall)  # soft grey card behind camera for the dome to reflect
    w.visible_camera = False
    area((0.4, 0.35, 0.5), (0, 0, 0.05), 0.5, 8, COOL)
    spot((0.05, -0.1, 0.9), (0, 0, 0.05), 40, angle=0.4, blend=0.9, color=NEUTRAL, radius=0.08)
    bokeh_field(30, (-3, 3), (3, 7), (0.2, 1.5), (0.02, 0.05), [(1, 0.82, 0.62), (0.92, 0.92, 1.0)], 14)
    camera((0.26, -0.55, 0.22), (0.02, 0.0, 0.05), lens=75, fstop=2.2)


if __name__ == "__main__":
    name = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else sys.argv[1]
    quality = sys.argv[-1]
    q = {"preview": {"samples": 40, "pct": 50}, "final": {"samples": 128, "pct": 100}}[quality]
    globals()[name](q)
    bpy.context.scene.render.resolution_percentage = q["pct"]
    render(os.path.join(HERE, "out", f"{name}-{quality}.png"))
