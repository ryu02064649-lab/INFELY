"""Fictional people for the film's scenes.

Each figure is a joint skeleton wrapped by Blender's Skin modifier and
smoothed with subdivision. They are meant to be seen the way luxury
photography shows people: in low light, by their outline, mostly outside
the plane of focus. No real person is depicted.
"""
import math
import bpy
import bmesh
from mathutils import Vector, Matrix


def _skin_object(name, joints, edges, radii, material, root=0, levels=2):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    vs = [bm.verts.new(j) for j in joints]
    for a, b in edges:
        bm.edges.new((vs[a], vs[b]))
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    skin = obj.modifiers.new("skin", "SKIN")
    skin.use_smooth_shade = True
    skin.branch_smoothing = 0.6
    for i, r in enumerate(radii):
        sv = me.skin_vertices[0].data[i]
        sv.radius = r if isinstance(r, tuple) else (r, r)
        sv.use_root = i == root
    sub = obj.modifiers.new("sub", "SUBSURF")
    sub.levels = sub.render_levels = levels
    obj.data.materials.append(material)
    return obj


def _ellipsoid(loc, scale, material, name):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=loc, segments=48, ring_count=24)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    for f in o.data.polygons:
        f.use_smooth = True
    o.data.materials.append(material)
    return o


def _hand(name, wrist, direction, material, curl=0.4, s=1.0):
    d = Vector(direction).normalized()
    side = d.cross(Vector((0, 0, 1)))
    if side.length < 1e-3:
        side = Vector((1, 0, 0))
    side.normalize()
    up = side.cross(d).normalized()
    w = Vector(wrist)
    joints = [w, w + d * 0.05 * s]
    radii = [(0.024 * s, 0.018 * s), (0.036 * s, 0.014 * s)]
    edges = [(0, 1)]
    for off, length in ((-1.5, 0.068), (-0.5, 0.078), (0.5, 0.074), (1.5, 0.058)):
        base = w + d * 0.085 * s + side * off * 0.0165 * s
        mid = base + d * length * 0.55 * s - up * curl * 0.012 * s
        tip = base + d * length * s - up * curl * 0.03 * s
        i = len(joints)
        joints += [base, mid, tip]
        radii += [0.0095 * s, 0.0088 * s, 0.0075 * s]
        edges += [(1, i), (i, i + 1), (i + 1, i + 2)]
    i = len(joints)
    tb = w + d * 0.03 * s - side * 0.03 * s
    joints += [tb, tb + d * 0.035 * s - side * 0.018 * s, tb + d * 0.06 * s - side * 0.02 * s]
    radii += [0.012 * s, 0.01 * s, 0.0085 * s]
    edges += [(0, i), (i, i + 1), (i + 1, i + 2)]
    return _skin_object(name, joints, edges, radii, material, root=0, levels=2)


def _shirt():
    m = bpy.data.materials.new("shirt")
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0.62, 0.6, 0.56, 1)
    p.inputs["Roughness"].default_value = 0.7
    p.inputs["Sheen Weight"].default_value = 0.4
    return m


def grip_hand(name, stem, approach, material, s=1.0):
    """A hand closed around a glass stem at `stem`, reaching in along `approach`."""
    a = Vector((approach[0], approach[1], 0)).normalized()
    side = a.cross(Vector((0, 0, 1))).normalized()
    c = Vector(stem)
    palm = c - a * 0.028 * s
    wrist = palm - a * 0.05 * s - Vector((0, 0, 0.028 * s))
    joints = [wrist, palm]
    radii = [(0.024 * s, 0.019 * s), (0.03 * s, 0.017 * s)]
    edges = [(0, 1)]
    r = 0.017 * s
    base_angle = math.atan2(-(a + side * 0.9).y, -(a + side * 0.9).x)
    for i in range(4):
        z = (0.016 - i * 0.0165) * s
        kn = c - a * 0.012 * s + side * 0.018 * s + Vector((0, 0, z))
        idx = len(joints)
        joints.append(kn)
        radii.append(0.0098 * s)
        edges.append((1, idx))
        prev = idx
        for k, sweep in enumerate((0.9, 1.75, 2.45)):
            th = base_angle - sweep
            pt = c + Vector((math.cos(th) * r, math.sin(th) * r, z - k * 0.002 * s))
            joints.append(pt)
            radii.append((0.0092 - k * 0.0006) * s)
            edges.append((prev, len(joints) - 1))
            prev = len(joints) - 1
    # thumb lies along the far side of the stem
    t0 = palm - side * 0.02 * s + Vector((0, 0, -0.012 * s))
    t1 = c - side * 0.016 * s + a * 0.004 * s + Vector((0, 0, 0.004 * s))
    t2 = c - side * 0.008 * s + a * 0.016 * s + Vector((0, 0, 0.018 * s))
    for pt, rr in ((t0, 0.012), (t1, 0.0105), (t2, 0.009)):
        joints.append(pt)
        radii.append(rr * s)
    n = len(joints)
    edges += [(1, n - 3), (n - 3, n - 2), (n - 2, n - 1)]
    return _skin_object(name, joints, edges, radii, material, root=0, levels=2), wrist


def person(loc, yaw, suit, skin, hair, long_hair=False, arms=None, lean=0.0, head_turn=0.0, name="guest",
           grips=None, shirt=None, reach=None, slim=1.0):
    """
    A seated figure, hips at `loc`, facing `yaw` (radians; 0 faces +Y).
    arms: {'left'|'right': (elbow, wrist, hand_direction)} in the figure's local space.
    lean: forward lean of the upper body in radians.
    """
    root = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(root)
    root.location = loc
    root.rotation_euler = (0, 0, yaw)

    lean_m = Matrix.Rotation(-lean, 4, "X")
    up = lambda v: lean_m @ Vector(v)  # upper body leans forward about the hips

    J = {
        "pelvis": Vector((0, 0, 0)),
        "waist": up((0, 0.0, 0.16)),
        "chest": up((0, 0.01, 0.32)),
        "neck0": up((0, 0.0, 0.47)),
        "neck1": up((0, 0.01, 0.55)),
        "shL": up((-0.185, 0.0, 0.445)),
        "shR": up((0.185, 0.0, 0.445)),
        "hipL": Vector((-0.095, 0.03, -0.02)),
        "hipR": Vector((0.095, 0.03, -0.02)),
        "kneeL": Vector((-0.11, 0.44, 0.0)),
        "kneeR": Vector((0.11, 0.44, 0.0)),
        "ankleL": Vector((-0.11, 0.47, -0.42)),
        "ankleR": Vector((0.11, 0.47, -0.42)),
    }
    arms = dict(arms or {})
    grips = grips or {}
    if shirt is None:
        shirt = bpy.data.materials.get("shirt") or _shirt()
    inv = Matrix.Rotation(-yaw, 4, "Z")
    grip_objs = []
    for key, (elbow_w, stem, approach) in grips.items():
        h, wrist_w = grip_hand(f"{name}_grip_{key}", stem, approach, skin, s=0.9)
        grip_objs.append(h)
        # shirt cuff and jacket sleeve at the wrist
        d = (Vector(wrist_w) - Vector(elbow_w)).normalized()
        q = d.to_track_quat("Z", "Y")
        for off, radius, depth, m in ((-0.004, 0.026, 0.016, shirt), (-0.03, 0.034, 0.042, suit)):
            bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, vertices=48,
                                                location=Vector(wrist_w) + d * off)
            cuff = bpy.context.object
            cuff.rotation_mode = "QUATERNION"
            cuff.rotation_quaternion = q
            bev = cuff.modifiers.new("bev", "BEVEL")
            bev.width = 0.003
            bev.segments = 3
            for f in cuff.data.polygons:
                f.use_smooth = True
            cuff.data.materials.append(m)
        to_local = lambda p: inv @ (Vector(p) - Vector(loc))
        arms[key] = (tuple(to_local(elbow_w)), tuple(to_local(wrist_w)), None)
    # relaxed hands placed in world space (resting on an object)
    for key, (elbow_w, wrist_w, dir_w, curl) in (reach or {}).items():
        h = _hand(f"{name}_reach_{key}", wrist_w, dir_w, skin, curl=curl)
        to_local = lambda p: inv @ (Vector(p) - Vector(loc))
        arms[key] = (tuple(to_local(elbow_w)), tuple(to_local(wrist_w)), None)
        grips[key] = None
        d = (Vector(wrist_w) - Vector(elbow_w)).normalized()
        q = d.to_track_quat("Z", "Y")
        for off, radius, depth, m in ((-0.004, 0.026, 0.016, shirt), (-0.03, 0.034, 0.042, suit)):
            bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, vertices=48,
                                                location=Vector(wrist_w) + d * off)
            cuff = bpy.context.object
            cuff.rotation_mode = "QUATERNION"
            cuff.rotation_quaternion = q
            for f in cuff.data.polygons:
                f.use_smooth = True
            cuff.data.materials.append(m)
    for side, sx in (("L", -1), ("R", 1)):
        key = "left" if side == "L" else "right"
        elbow, wrist, _ = arms.get(key, ((sx * 0.22, 0.06, 0.2), (sx * 0.15, 0.38, 0.3), (0, 1, 0)))
        J["elb" + side] = Vector(elbow)
        J["wri" + side] = Vector(wrist)
    names = list(J)
    idx = {n: i for i, n in enumerate(names)}
    E = [("pelvis", "waist"), ("waist", "chest"), ("chest", "neck0"), ("neck0", "neck1"),
         ("neck0", "shL"), ("neck0", "shR"), ("shL", "elbL"), ("elbL", "wriL"), ("shR", "elbR"), ("elbR", "wriR"),
         ("pelvis", "hipL"), ("hipL", "kneeL"), ("kneeL", "ankleL"),
         ("pelvis", "hipR"), ("hipR", "kneeR"), ("kneeR", "ankleR")]
    R = {"pelvis": (0.17, 0.13), "waist": (0.145, 0.1), "chest": (0.175, 0.115), "neck0": (0.09, 0.07),
         "neck1": 0.048, "shL": 0.062, "shR": 0.062, "elbL": 0.047, "elbR": 0.047, "wriL": 0.033, "wriR": 0.033,
         "hipL": 0.085, "hipR": 0.085, "kneeL": 0.06, "kneeR": 0.06, "ankleL": 0.04, "ankleR": 0.04}
    for k in ("shL", "shR", "elbL", "elbR", "wriL", "wriR", "chest", "waist"):
        r = R[k]
        R[k] = tuple(v * slim for v in r) if isinstance(r, tuple) else r * slim
    body = _skin_object(name + "_body", [J[n] for n in names], [(idx[a], idx[b]) for a, b in E],
                        [R[n] for n in names], suit, root=idx["pelvis"])
    body.parent = root

    head_c = J["neck1"] + up((0, 0.012, 0.13)) - up((0, 0, 0))
    turn = Matrix.Rotation(head_turn, 4, "Z")
    parts = [
        _ellipsoid(head_c, (0.078, 0.092, 0.108), skin, name + "_head"),
        _ellipsoid(head_c + turn @ Vector((0, 0.035, -0.06)), (0.05, 0.05, 0.05), skin, name + "_jaw"),
        _ellipsoid(J["neck1"] - up((0, 0, 0)) + up((0, 0, 0.02)), (0.045, 0.045, 0.06), skin, name + "_throat"),
    ]
    if long_hair:
        # a low chignon: hair swept back, face and neck open
        parts += [
            _ellipsoid(head_c + turn @ Vector((0, -0.014, 0.02)), (0.084, 0.096, 0.1), hair, name + "_hair"),
            _ellipsoid(head_c + turn @ Vector((0, -0.085, -0.035)), (0.045, 0.04, 0.042), hair, name + "_bun"),
        ]
    else:
        parts.append(_ellipsoid(head_c + turn @ Vector((0, -0.016, 0.028)), (0.083, 0.094, 0.095), hair, name + "_hair"))
    for p in parts:
        p.parent = root
    for side in ("left", "right"):
        sx = -1 if side == "left" else 1
        if side in grips:
            continue
        elbow, wrist, hdir = arms.get(side, ((sx * 0.22, 0.06, 0.2), (sx * 0.15, 0.38, 0.3), (0, 1, 0)))
        h = _hand(f"{name}_hand_{side}", wrist, hdir, skin)
        h.parent = root
    return root
