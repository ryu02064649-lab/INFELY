"""
Scene plates for the RELY film, rendered with Blender (Cycles).

    python3 film/scenes/render_scenes.py dining final
    python3 film/scenes/render_scenes.py all final

Output: film/scenes/out/<scene>.png (1216 × 2160, a little larger than the
video frame so the film can move the camera without enlarging pixels).
Everyone in these scenes is fictional.
"""
import os
import sys
import math
import random

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "../../image-sources/tools"))
import bpy  # noqa: E402
import lib  # noqa: E402
from lib import mat, textured, box, cyl, sphere, lathe, camera, area, point, spot, bokeh_field, reset, assign  # noqa: E402
from scenes import glass_mat, silver_mat, wine_glass, candle, WARM, NEUTRAL, COOL  # noqa: E402
from people import person  # noqa: E402

OUT = os.path.join(HERE, "out")
PX_W, PX_H = 1216, 2160


def skin(tone=(0.34, 0.23, 0.17)):
    m = mat("skin", color=tone, rough=0.48)
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Subsurface Weight"].default_value = 0.25
    p.inputs["Subsurface Radius"].default_value = (0.9, 0.35, 0.2)
    p.inputs["Subsurface Scale"].default_value = 0.02
    return m


def suit(color=(0.012, 0.012, 0.014)):
    """Wool suiting: dark, matte, with a fine weave and soft creases."""
    m = mat("suit", color=color, rough=0.7, sheen=0.12)
    textured(m, scale=140, detail=3, bump=0.12, stretch=(1, 1, 3))
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    creases = nt.nodes.new("ShaderNodeTexNoise")
    creases.inputs["Scale"].default_value = 9
    creases.inputs["Detail"].default_value = 2
    b2 = nt.nodes.new("ShaderNodeBump")
    b2.inputs["Strength"].default_value = 0.25
    nt.links.new(creases.outputs["Fac"], b2.inputs["Height"])
    old = p.inputs["Normal"].links[0].from_node if p.inputs["Normal"].links else None
    if old is not None:
        nt.links.new(old.outputs["Normal"], b2.inputs["Normal"])
    nt.links.new(b2.outputs["Normal"], p.inputs["Normal"])
    return m


def hair(color=(0.008, 0.006, 0.005)):
    m = mat("hair", color=color, rough=0.55, sheen=0.0)
    return textured(m, scale=260, detail=2, bump=0.35, stretch=(1, 1, 18))


def table_top(w=3.2, d=1.4):
    t = textured(mat("table", color=(0.02, 0.018, 0.016), rough=0.25, coat=0.35),
                 scale=3, c1=(0.011, 0.010, 0.009), c2=(0.028, 0.024, 0.02), bump=0.015,
                 stretch=(0.2, 3, 1), kind="wave", distortion=4)
    box((w, d, 0.05), (0, 0, -0.025), t)
    linen = mat("linen", color=(0.5, 0.48, 0.44), rough=0.8, sheen=0.6)
    return linen


def plate_setting(x, y, rot=0.0):
    porcelain = mat("porcelain", color=(0.82, 0.80, 0.76), rough=0.12, coat=0.6)
    lathe([(0, 0.004), (0.10, 0.006), (0.14, 0.018), (0.145, 0.02), (0.135, 0.02), (0.098, 0.011), (0, 0.009)],
          (x, y, 0.0), porcelain, name="plate")
    sv = silver_mat(0.12)
    c, s = math.cos(rot), math.sin(rot)
    for dx, w in ((-0.18, 0.012), (0.18, 0.016), (0.205, 0.012)):
        box((w, 0.2, 0.003), (x + dx * c, y + dx * s, 0.004), sv, bevel=0.0012, rot=(0, 0, rot))
    # a small, precise dish: three rounds on the plate
    sauce = mat("sauce", color=(0.18, 0.05, 0.03), rough=0.2, coat=0.5)
    main = mat("main", color=(0.35, 0.22, 0.14), rough=0.5)
    green = mat("herb", color=(0.08, 0.14, 0.05), rough=0.6)
    cyl(0.05, 0.004, (x, y, 0.012), sauce)
    box((0.07, 0.045, 0.028), (x, y, 0.028), main, bevel=0.006)
    sphere(0.008, (x + 0.02, y - 0.01, 0.046), green)
    sphere(0.006, (x - 0.018, y + 0.008, 0.045), green)


def restaurant_background():
    # other tables: warm pendants and a few seated guests, far and soft
    bokeh_field(60, (-4, 4), (3.5, 9), (0.3, 2.2), (0.012, 0.03),
                [(1, 0.7, 0.42), (1, 0.8, 0.58), (0.85, 0.8, 0.75)], 7)
    far = suit((0.02, 0.018, 0.017))
    sk = skin((0.45, 0.32, 0.25))
    hr = hair()
    for x, y, yaw, lh in ((-1.6, 3.2, 1.2, False), (-1.1, 3.4, -1.9, True), (1.7, 4.2, -1.3, True), (2.2, 4.0, 1.7, False)):
        person((x, y, -0.3), yaw, far, sk, hr, long_hair=lh, lean=0.08, name=f"far{x}")
    wall = mat("wall", color=(0.03, 0.025, 0.02), rough=0.9)
    box((12, 0.1, 5), (0, 9.5, 1.5), wall)


def quiet_candles(energy):
    """Candles glow on the table but must not light faces from the front."""
    for o in bpy.data.objects:
        if o.type == "LIGHT" and o.data.type == "POINT":
            o.data.energy = energy


def dining(samples):
    reset(world=(0.003, 0.003, 0.0035), samples=samples)
    table_top()
    plate_setting(0.02, -0.28)
    plate_setting(-0.02, 0.3, rot=math.pi)
    wine_glass(0.2, -0.1, 1.0)
    wine_glass(-0.2, 0.27, 1.0)
    candle(-0.04, 0.02, h=0.09)
    candle(0.1, 0.07, h=0.13)
    # guest across the table: elbows in, forearms resting on the table edge
    sk = skin((0.16, 0.11, 0.085))
    person((-0.08, 0.8, -0.3), math.pi + 0.35, suit((0.008, 0.008, 0.009)), sk, hair(), long_hair=True, lean=0.14,
           head_turn=-0.25, name="guest",
           arms={"left": ((-0.2, 0.14, 0.2), (-0.1, 0.45, 0.318), (0.35, 1.0, 0.0)),
                 "right": ((0.2, 0.14, 0.2), (0.13, 0.43, 0.318), (-0.3, 1.0, 0.0))})
    # host in the foreground, back to camera, almost a silhouette
    person((0.27, -0.88, -0.3), -0.2, suit((0.004, 0.004, 0.004)), skin((0.2, 0.14, 0.11)), hair(), lean=0.1,
           name="host",
           arms={"left": ((-0.2, 0.14, 0.2), (-0.12, 0.45, 0.318), (0.3, 1.0, 0.0)),
                 "right": ((0.2, 0.14, 0.2), (0.12, 0.43, 0.318), (-0.3, 1.0, 0.0))})
    restaurant_background()
    quiet_candles(0.45)
    spot((0.02, -0.25, 1.0), (0.0, -0.1, 0.0), 22, angle=0.34, blend=0.85, color=WARM, radius=0.06)  # pendant over the table
    # a warm wash on the far wall: the guest becomes a silhouette against it
    wall = textured(mat("plaster", color=(0.16, 0.14, 0.12), rough=0.95), scale=4, detail=4,
                    c1=(0.13, 0.115, 0.1), c2=(0.18, 0.16, 0.14), bump=0.08)
    box((6, 0.05, 3), (0, 3.3, 0.8), wall)
    for x, e in ((-0.12, 10), (1.25, 7)):
        point((x, 3.12, 1.0), e, (1.0, 0.72, 0.45), radius=0.06)
    area((0.45, 1.9, 0.95), (-0.08, 0.8, 0.42), 0.9, 60, WARM)      # rim behind the guest
    area((-1.2, 0.4, 0.9), (0, 0.2, 0.05), 0.6, 1.5, NEUTRAL)    # a breath of fill on the table
    camera((-0.02, -1.42, 0.3), (-0.06, 0.5, 0.18), lens=52, fstop=1.1, focus=1.3)


def raised_glass(base, tilt, yaw=0.0, wine=True):
    """A wine glass lifted off the table: `base` is the foot, tilted by `tilt` radians toward yaw."""
    g = glass_mat()
    outer = [(0.0, 0.0), (0.038, 0.0), (0.040, 0.003), (0.006, 0.008), (0.004, 0.02), (0.004, 0.09),
             (0.012, 0.105), (0.035, 0.13), (0.045, 0.16), (0.046, 0.19), (0.040, 0.225), (0.036, 0.235)]
    inner = [(0.0345, 0.235), (0.0385, 0.224), (0.0445, 0.19), (0.0435, 0.16), (0.034, 0.132), (0.011, 0.108), (0.0, 0.106)]
    objs = [lathe(outer + inner, (0, 0, 0), g, name="toastglass")]
    if wine:
        wm = mat("wine", color=(0.30, 0.02, 0.035), rough=0.02, trans=0.85, ior=1.34)
        objs.append(lathe([(0.0, 0.1075), (0.011, 0.1085), (0.033, 0.133), (0.0425, 0.158), (0.0428, 0.160), (0.0, 0.160)],
                          (0, 0, 0), wm, name="toastwine"))
    for o in objs:
        o.location = base
        # yaw 0 leans the glass toward +X
        o.rotation_euler = (-tilt * math.sin(yaw), tilt * math.cos(yaw), 0)
    return objs


def toast(samples):
    """会食: two glasses meet over a candlelit table. Faces stay out of frame."""
    reset(world=(0.003, 0.003, 0.0035), samples=samples)
    table_top()
    plate_setting(0.0, -0.32)
    plate_setting(0.0, 0.34, rot=math.pi)
    candle(-0.16, 0.12, h=0.09)
    candle(0.2, 0.2, h=0.13)
    sk_host, sk_guest = skin((0.36, 0.24, 0.17)), skin((0.46, 0.31, 0.23))
    # glasses meet at the rims just above the table centre
    raised_glass((-0.088, -0.01, 0.13), 0.22, yaw=0.0)
    raised_glass((0.088, 0.01, 0.13), 0.22, yaw=math.pi)
    # host on the left, guest on the right; each closes a hand around the stem
    tilt = 0.22
    lstem = (-0.088 + math.sin(tilt) * 0.05, -0.01, 0.13 + math.cos(tilt) * 0.05)
    rstem = (0.088 - math.sin(tilt) * 0.05, 0.01, 0.13 + math.cos(tilt) * 0.05)
    person((-0.72, -0.1, -0.3), -math.pi / 2 + 0.25, suit((0.006, 0.006, 0.007)), sk_host, hair(), lean=0.12, name="host",
           grips={"right": ((-0.42, -0.2, 0.02), lstem, (0.75, 0.25))},
           arms={"left": ((-0.22, 0.12, 0.2), (-0.12, 0.44, 0.318), (0.3, 1.0, 0.0))})
    person((0.72, 0.12, -0.3), math.pi / 2 - 0.2, suit((0.01, 0.009, 0.01)), sk_guest, hair(), long_hair=True,
           lean=0.12, name="guest",
           grips={"left": ((0.42, -0.12, 0.02), rstem, (-0.75, 0.3))},
           arms={"right": ((0.22, 0.12, 0.2), (0.12, 0.44, 0.318), (-0.3, 1.0, 0.0))})
    wall = textured(mat("plaster", color=(0.16, 0.14, 0.12), rough=0.95), scale=4, detail=4,
                    c1=(0.13, 0.115, 0.1), c2=(0.18, 0.16, 0.14), bump=0.08)
    box((6, 0.05, 3), (0, 2.6, 0.8), wall)
    for x, e in ((-0.5, 8), (0.9, 6)):
        point((x, 2.42, 0.95), e, (1.0, 0.72, 0.45), radius=0.06)
    bokeh_field(40, (-3, 3), (1.6, 2.5), (0.2, 1.6), (0.008, 0.02), [(1, 0.7, 0.42), (1, 0.8, 0.58)], 7)
    quiet_candles(0.8)
    spot((0.0, -0.5, 1.1), (0.0, 0.0, 0.25), 14, angle=0.3, blend=0.9, color=NEUTRAL, radius=0.05)
    area((0.0, 1.5, 0.7), (0.0, 0.0, 0.3), 0.35, 5, WARM)       # thin rims on the glass edges
    camera((0.04, -1.05, 0.22), (0.0, 0.0, 0.25), lens=52, fstop=2.0, focus=1.05)


def gift_box(x, y, rot):
    black = mat("boxblack", color=(0.012, 0.012, 0.012), rough=0.42, coat=0.25)
    satin = mat("satin", color=(0.5, 0.47, 0.42), rough=0.24, sheen=0.7, aniso=0.6)
    card = mat("card", color=(0.72, 0.69, 0.63), rough=0.8)
    c, s_ = math.cos(rot), math.sin(rot)
    box((0.2, 0.2, 0.085), (x, y, 0.0425), black, bevel=0.002, rot=(0, 0, rot))
    box((0.205, 0.205, 0.03), (x, y, 0.0875), black, bevel=0.002, rot=(0, 0, rot))
    box((0.03, 0.208, 0.106), (x, y, 0.052), satin, bevel=0.001, rot=(0, 0, rot))
    box((0.208, 0.03, 0.106), (x, y, 0.052), satin, bevel=0.001, rot=(0, 0, rot))
    for a in (rot + math.pi / 4, rot + math.pi / 4 + math.pi):
        lib.torus(0.024, 0.0042, (x + 0.022 * math.cos(a), y + 0.022 * math.sin(a), 0.109), satin,
                  rot=(math.radians(70), 0, a + math.pi / 2), scale=(1, 0.35, 1))
    sphere(0.01, (x, y, 0.107), satin, scale=(1, 1, 0.6))
    # a small card tucked under the ribbon
    box((0.075, 0.045, 0.0012), (x + 0.05 * c - 0.05 * s_, y + 0.05 * s_ + 0.05 * c, 0.1035), card,
        rot=(0, 0, rot + 0.25))


def gift(samples):
    """贈り物: a box slid across the table, received with open hands. Faces out of frame or soft."""
    reset(world=(0.003, 0.003, 0.0035), samples=samples)
    table_top()
    gift_box(0.0, 0.04, 0.28)
    candle(-0.3, 0.42, h=0.09)
    candle(0.34, 0.5, h=0.13)
    wine_glass(0.3, 0.25, 0.95, wine=True)
    sk_host, sk_guest = skin((0.36, 0.24, 0.17)), skin((0.46, 0.31, 0.23))
    # the giver, at the near side: fingertips on the lid, pushing it gently forward
    person((0.22, -0.9, -0.3), 0.08, suit((0.006, 0.006, 0.007)), sk_host, hair(), lean=0.16, name="giver",
           reach={"right": ((0.36, -0.52, 0.02), (0.1, -0.12, 0.112), (-0.45, 1.0, -0.12), 0.35)})
    # the receiver across the table: both hands open toward the gift
    person((-0.02, 0.82, -0.3), math.pi, mat("knit", color=(0.01, 0.009, 0.01), rough=0.8), sk_guest, hair(), long_hair=True,
           lean=0.2, name="receiver", slim=0.82,
           reach={"left": ((-0.16, 0.6, 0.02), (-0.09, 0.3, 0.012), (0.2, -1.0, 0.0), 0.2),
                  "right": ((0.16, 0.62, 0.02), (0.09, 0.3, 0.012), (-0.2, -1.0, 0.0), 0.2)})
    wall = textured(mat("plaster", color=(0.16, 0.14, 0.12), rough=0.95), scale=4, detail=4,
                    c1=(0.13, 0.115, 0.1), c2=(0.18, 0.16, 0.14), bump=0.08)
    box((6, 0.05, 3), (0, 3.0, 0.8), wall)
    for x, e in ((-0.1, 9), (1.2, 6)):
        point((x, 2.82, 1.0), e, (1.0, 0.72, 0.45), radius=0.06)
    quiet_candles(0.6)
    spot((-0.08, -0.12, 0.85), (0.0, 0.04, 0.06), 16, angle=0.24, blend=0.9, color=NEUTRAL, radius=0.05)
    area((0.5, 0.9, 0.5), (0.0, 0.04, 0.08), 0.4, 3, COOL)            # a cool edge on the ribbon
    area((0.3, 2.0, 0.95), (0, 0.8, 0.42), 0.9, 9, WARM)              # rim behind the receiver
    camera((0.06, -0.62, 0.62), (0.0, 0.12, 0.02), lens=45, fstop=1.4, focus=0.84)


def research(samples):
    """リサーチ: late at night, a concierge at work — screen, notes, the city beyond the window."""
    reset(world=(0.003, 0.003, 0.004), samples=samples)
    import mathutils
    from mathutils import Vector
    walnut = textured(mat("walnut", color=(0.04, 0.025, 0.016), rough=0.35, coat=0.15), scale=6, detail=8,
                      c1=(0.014, 0.010, 0.007), c2=(0.045, 0.031, 0.02), bump=0.004,
                      stretch=(0.06, 3.0, 1), kind="noise", distortion=1.5)
    box((2.4, 1.2, 0.05), (0, 0.2, -0.025), walnut)
    tex = os.path.join(HERE, "textures")
    # laptop, lid open
    alu = mat("alu", color=(0.1, 0.1, 0.105), rough=0.35, metal=1.0)
    lx, ly, rz = 0.14, 0.32, -0.12
    box((0.31, 0.215, 0.012), (lx, ly, 0.006), alu, bevel=0.003, rot=(0, 0, rz))
    scr = lib.image_mat("screen", os.path.join(tex, "screen.png"), emit_strength=2.2, rough=0.2)
    lid = box((0.31, 0.006, 0.205), (0, 0, 0.1025), alu, bevel=0.002, name="lid")
    disp = box((0.29, 0.001, 0.185), (0, -0.0035, 0.1025), scr, name="display")
    bpy.context.view_layer.objects.active = disp
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.uv.cube_project(cube_size=0.29); bpy.ops.object.mode_set(mode="OBJECT")
    disp.parent = lid
    lid.rotation_euler = (math.radians(-14), 0, rz)
    back = mathutils.Matrix.Rotation(rz, 4, "Z") @ Vector((0, 0.1075, 0))
    lid.location = (lx + back.x, ly + back.y, 0.012)
    area((lx + back.x, ly + back.y - 0.05, 0.12), (0.0, -0.4, 0.2), 0.25, 1.2, (0.8, 0.85, 1.0))  # screen spill
    # open notebook and pen
    page = lib.image_mat("notebook", os.path.join(tex, "notebook.png"), rough=0.85)
    nb = box((0.36, 0.25, 0.012), (-0.2, 0.08, 0.006), page, rot=(0, 0, 0.1))
    bpy.context.view_layer.objects.active = nb
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.uv.cube_project(cube_size=0.36); bpy.ops.object.mode_set(mode="OBJECT")
    pen = mat("pen", color=(0.01, 0.01, 0.01), rough=0.15, coat=0.8)
    cyl(0.0062, 0.14, (-0.13, 0.02, 0.019), pen, rot=(0, math.pi / 2, 0.6))
    cyl(0.0065, 0.02, (-0.075, 0.06, 0.019), silver_mat(0.1), rot=(0, math.pi / 2, 0.6))
    # a glass of water, catching the screen
    lathe([(0, 0), (0.033, 0), (0.034, 0.1), (0.031, 0.1), (0.030, 0.006), (0, 0.006)], (-0.05, 0.42, 0), glass_mat(), name="tumbler")
    lathe([(0, 0.0062), (0.0298, 0.0062), (0.0305, 0.06), (0, 0.06)], (-0.05, 0.42, 0),
          mat("water", color=(1, 1, 1), rough=0, trans=1, ior=1.33), name="water")
    # the concierge: seen from behind the shoulder, one hand on the notes, one at the keyboard
    person((-0.06, -0.5, -0.3), 0.05, suit((0.004, 0.004, 0.005)), skin((0.36, 0.24, 0.17)), hair(), lean=0.22,
           name="concierge", head_turn=0.1,
           reach={"left": ((-0.3, -0.2, 0.02), (-0.2, 0.0, 0.016), (0.25, 1.0, -0.05), 0.35),
                  "right": ((0.12, -0.16, 0.03), (0.1, 0.16, 0.02), (0.05, 1.0, -0.05), 0.45)})
    # window: the city at night, far and soft
    bokeh_field(90, (-3, 3), (3.5, 8), (-0.6, 1.4), (0.012, 0.035),
                [(1, 0.8, 0.6), (0.9, 0.92, 1.0), (1, 0.7, 0.45)], 10)
    spot((-0.55, -0.05, 0.75), (-0.2, 0.1, 0.0), 45, angle=0.6, blend=0.9, color=WARM, radius=0.08)  # desk lamp
    area((-0.3, 1.4, 0.6), (-0.05, 0.42, 0.05), 0.6, 6, NEUTRAL)       # backlight for the glass
    area((0.7, -0.9, 0.9), (0.0, -0.5, 0.35), 0.4, 0.8, COOL)          # a thin edge on the shoulder
    camera((0.33, -0.8, 0.5), (0.06, 0.3, 0.08), lens=40, fstop=1.6, focus=1.05)


def grade(src, dest):
    """Bring a warm render into the film's palette: less saturation, deep but open blacks."""
    from PIL import Image, ImageEnhance
    im = Image.open(src).convert("RGB")
    im = ImageEnhance.Color(im).enhance(0.72)
    im = ImageEnhance.Contrast(im).enhance(1.04)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    im.save(dest, "WEBP", quality=92, method=6)


SCENES = {"toast": toast, "gift": gift, "research": research}


if __name__ == "__main__":
    name, quality = sys.argv[1], sys.argv[2]
    q = {"test": (24, 30), "preview": (48, 50), "final": (160, 100)}[quality]
    names = list(SCENES) if name == "all" else [name]
    os.makedirs(OUT, exist_ok=True)
    for n in names:
        SCENES[n](q[0])
        s = bpy.context.scene
        s.render.resolution_x, s.render.resolution_y = PX_W, PX_H
        s.render.resolution_percentage = q[1]
        s.render.threads_mode = "AUTO"
        suffix = "" if quality == "final" else f"-{quality}"
        png = os.path.join(OUT, f"{n}{suffix}.png")
        lib.render(png)
        if quality == "final":
            grade(png, os.path.join(HERE, "../assets", f"{n}.webp"))
