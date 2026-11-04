"""Small helper layer over bpy for low-key product/interior renders."""
import math, random
import bpy, bmesh
from mathutils import Vector

W, H = 1280, 1600


def reset(world=(0.004, 0.004, 0.005), world_strength=1.0, samples=160):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.samples = samples
    s.cycles.use_denoising = True
    s.cycles.max_bounces = 10
    s.cycles.transmission_bounces = 10
    s.cycles.glossy_bounces = 6
    s.cycles.caustics_reflective = False
    s.cycles.caustics_refractive = False
    s.cycles.blur_glossy = 1.0
    s.render.resolution_x, s.render.resolution_y = W, H
    s.render.film_transparent = False
    s.view_settings.view_transform = "AgX"
    s.render.image_settings.file_format = "PNG"
    s.render.image_settings.color_depth = "16"
    w = bpy.data.worlds.new("w")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (*world, 1)
    bg.inputs[1].default_value = world_strength
    s.world = w
    random.seed(11)
    return s


def mat(name, color=(0.8, 0.8, 0.8), rough=0.5, metal=0.0, trans=0.0, ior=1.45,
        coat=0.0, sheen=0.0, emit=None, emit_strength=0.0, aniso=0.0, spec=0.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["IOR"].default_value = ior
    p.inputs["Transmission Weight"].default_value = trans
    p.inputs["Coat Weight"].default_value = coat
    p.inputs["Sheen Weight"].default_value = sheen
    p.inputs["Anisotropic"].default_value = aniso
    p.inputs["Specular IOR Level"].default_value = spec
    if emit:
        p.inputs["Emission Color"].default_value = (*emit, 1)
        p.inputs["Emission Strength"].default_value = emit_strength
    return m


def textured(m, scale=8.0, detail=6.0, c1=None, c2=None, bump=0.05, stretch=(1, 1, 1), kind="noise", distortion=0.0):
    """Mix two colours through a noise/wave texture and add matching bump."""
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapn = nt.nodes.new("ShaderNodeMapping")
    mapn.inputs["Scale"].default_value = stretch
    nt.links.new(coord.outputs["Object"], mapn.inputs["Vector"])
    if kind == "wave":
        tex = nt.nodes.new("ShaderNodeTexWave")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Distortion"].default_value = distortion or 6
        tex.inputs["Detail"].default_value = detail
    else:
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Detail"].default_value = detail
        if distortion:
            tex.inputs["Distortion"].default_value = distortion
    nt.links.new(mapn.outputs["Vector"], tex.inputs["Vector"])
    if c1 and c2:
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].color = (*c1, 1)
        ramp.color_ramp.elements[1].color = (*c2, 1)
        nt.links.new(tex.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    if bump:
        b = nt.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value = bump
        nt.links.new(tex.outputs["Fac"], b.inputs["Height"])
        nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return m


def image_mat(name, path, emit_strength=0.0, rough=0.6, color_mult=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    img = nt.nodes.new("ShaderNodeTexImage")
    img.image = bpy.data.images.load(path)
    nt.links.new(img.outputs["Color"], p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = rough
    if emit_strength:
        nt.links.new(img.outputs["Color"], p.inputs["Emission Color"])
        p.inputs["Emission Strength"].default_value = emit_strength
    return m


def assign(obj, m):
    obj.data.materials.clear()
    obj.data.materials.append(m)
    return obj


def smooth(obj, subsurf=0, bevel=0.0, segments=4):
    if bevel:
        b = obj.modifiers.new("bev", "BEVEL")
        b.width = bevel
        b.segments = segments
        b.limit_method = "ANGLE"
    if subsurf:
        s = obj.modifiers.new("sub", "SUBSURF")
        s.levels = s.render_levels = subsurf
    for f in obj.data.polygons:
        f.use_smooth = True
    return obj


def box(size, loc, m=None, bevel=0.0, rot=(0, 0, 0), subsurf=0, name="box"):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    smooth(o, subsurf=subsurf, bevel=bevel)
    if m:
        assign(o, m)
    return o


def cyl(r, depth, loc, m=None, rot=(0, 0, 0), verts=96, bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.object
    smooth(o, bevel=bevel)
    if m:
        assign(o, m)
    return o


def sphere(r, loc, m=None, scale=(1, 1, 1), seg=64):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=seg // 2)
    o = bpy.context.object
    o.scale = scale
    for f in o.data.polygons:
        f.use_smooth = True
    if m:
        assign(o, m)
    return o


def torus(R, r, loc, m=None, rot=(0, 0, 0), scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot,
                                     major_segments=96, minor_segments=24)
    o = bpy.context.object
    o.scale = scale
    for f in o.data.polygons:
        f.use_smooth = True
    if m:
        assign(o, m)
    return o


def lathe(profile, loc, m=None, segments=96, name="lathe", closed=True):
    """Revolve a list of (radius, z) points around Z."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    rings = []
    for i in range(segments):
        a = 2 * math.pi * i / segments
        ring = [bm.verts.new((r * math.cos(a), r * math.sin(a), z)) for r, z in profile]
        rings.append(ring)
    n = len(profile)
    last = n if closed else n - 1
    for i in range(segments):
        a, b = rings[i], rings[(i + 1) % segments]
        for j in range(last):
            k = (j + 1) % n
            try:
                bm.faces.new((a[j], b[j], b[k], a[k]))
            except ValueError:
                pass
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    o.location = loc
    for f in me.polygons:
        f.use_smooth = True
    if m:
        assign(o, m)
    return o


def look_at(obj, target):
    d = Vector(target) - obj.location
    obj.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def camera(loc, target, lens=50, fstop=2.8, focus=None):
    bpy.ops.object.camera_add(location=loc)
    c = bpy.context.object
    look_at(c, target)
    c.data.lens = lens
    c.data.sensor_width = 36
    c.data.dof.use_dof = True
    c.data.dof.aperture_fstop = fstop
    c.data.dof.aperture_blades = 7
    c.data.dof.focus_distance = focus if focus else (Vector(target) - Vector(loc)).length
    bpy.context.scene.camera = c
    return c


def area(loc, target, size, energy, color=(1, 0.93, 0.85), shape="DISK", size_y=None, spread=None):
    bpy.ops.object.light_add(type="AREA", location=loc)
    l = bpy.context.object
    look_at(l, target)
    l.data.shape = shape
    l.data.size = size
    if size_y:
        l.data.size_y = size_y
    l.data.energy = energy
    l.data.color = color
    if spread:
        l.data.spread = spread
    return l


def point(loc, energy, color=(1, 0.75, 0.5), radius=0.02):
    bpy.ops.object.light_add(type="POINT", location=loc)
    l = bpy.context.object
    l.data.energy = energy
    l.data.color = color
    l.data.shadow_soft_size = radius
    return l


def spot(loc, target, energy, angle=0.5, blend=0.6, color=(1, 0.92, 0.82), radius=0.05):
    bpy.ops.object.light_add(type="SPOT", location=loc)
    l = bpy.context.object
    look_at(l, target)
    l.data.energy = energy
    l.data.spot_size = angle
    l.data.spot_blend = blend
    l.data.color = color
    l.data.shadow_soft_size = radius
    return l


def bokeh_field(n, xr, yr, zr, rr, colors, strength):
    """Distant emissive points that the lens turns into soft discs."""
    mats = [mat(f"bk{i}", color=(0, 0, 0), emit=c, emit_strength=strength) for i, c in enumerate(colors)]
    for i in range(n):
        o = sphere(random.uniform(*rr), (random.uniform(*xr), random.uniform(*yr), random.uniform(*zr)), seg=12)
        assign(o, mats[i % len(mats)])
        o.visible_shadow = False


def render(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
