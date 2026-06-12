"""
Figure 2. The Deep-Self Predictive Cascade Model (static schematic).
Final Polish: Material Design Palette, Clean Routing, and Layout Spacing.
"""

from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib.patches import FancyBboxPatch, Polygon, Circle

# --------------------------------------------------------------------------- #
# Palette - Material Design Gradients (Top to Bottom)
# --------------------------------------------------------------------------- #
GROUP = {
    "epistemic": "#E91E63",
    "allostatic": "#009688",
    "teleological": "#3F51B5",
    "minimal": "#FF9800",
    "agentic": "#8BC34A",
    "narrative": "#00BCD4",
}

AFF_COLORS = {
    "arousal": "#FF5722",
    "vitality": "#4CAF50",
    "valence": "#2196F3",
}

BIG5 = {
    "Openness": "#FFA000",
    "Extraversion": "#1E88E5",
    "Conscientiousness": "#00897B",
    "Agreeableness": "#8E24AA",
    "Neuroticism": "#E53935",
}

ACT = "#2E7D32"  # activating (+) : Green 800 (Changed from Indigo)
INH = "#E53935"  # inhibiting (-) : Red 600
INK = "#23272E"
BAND = "#F4F3EE"
CONTAINER_EDGE = "#C9CCD2"
LAND = "#94A7BD"  # landscape grid

# --------------------------------------------------------------------------- #
# Geometry & Spacing Adjustments
# --------------------------------------------------------------------------- #
X0, X1 = -0.5, 12.8
Y0, Y1 = -1.2, 15.4

T1, T2, T3 = 13.3, 9.8, 6.5  # tier y-centres

RAD_C = (6.4, 1.7)
RAD_R = 1.95

GCEN = [2.3, 6.4, 10.5]  # group centres (x)
OFF = 1.05  # within-group offset
CONT_HALF = 1.98  # container half-width

XS = [
    GCEN[0] - OFF,
    GCEN[0] + OFF,
    GCEN[1] - OFF,
    GCEN[1] + OFF,
    GCEN[2] - OFF,
    GCEN[2] + OFF,
]

PANEL_H = 1.26  # node height
T1_bot = T1 - PANEL_H / 2
T2_top = T2 + PANEL_H / 2
T2_bot = T2 - PANEL_H / 2
T3_top = T3 + PANEL_H / 2
T3_bot = T3 - PANEL_H / 2

# --------------------------------------------------------------------------- #
# Figure Setup
# --------------------------------------------------------------------------- #
plt.rcParams["font.family"] = "DejaVu Sans"
fig, ax = plt.subplots(figsize=(9.2, 11.8))
ax.set_xlim(X0, X1)
ax.set_ylim(Y0, Y1)
ax.set_aspect("equal")
ax.axis("off")


def rounded(xy, w, h, **kw):
    return FancyBboxPatch(xy, w, h, boxstyle="round,pad=0.0,rounding_size=0.14", **kw)


# =========================================================================== #
# Background free-energy landscape
# =========================================================================== #
def polar(angle_deg, r, c=RAD_C):
    a = np.radians(angle_deg)
    return c[0] + r * np.cos(a), c[1] + r * np.sin(a)


order = [
    "Extraversion",
    "Openness",
    "Conscientiousness",
    "Agreeableness",
    "Neuroticism",
]
angles_deg = {
    "Extraversion": 90,
    "Openness": 18,
    "Conscientiousness": -54,
    "Agreeableness": -126,
    "Neuroticism": 162,
}

LAND_FRONT, LAND_BACK = -1.2, 5.2
LAND_SPAN = LAND_BACK - LAND_FRONT


def make_wells():
    wells = []
    for t in order:
        vx, vy = polar(angles_deg[t], RAD_R)
        amp = 0.72
        vy_shifted = vy + amp * 0.9
        wv = (vy_shifted - LAND_FRONT) / LAND_SPAN
        wells.append((vx, wv, amp, 1.05, 0.08))

    cv = ((RAD_C[1] + 1.7 * 0.9) - LAND_FRONT) / LAND_SPAN
    wells.append((RAD_C[0], cv, 1.7, 1.7, 0.19))
    return wells


WELLS = make_wells()


def land_z(u, v):
    z = 0.0
    for wx, wv, amp, sx, sv in WELLS:
        z -= amp * np.exp(-(((u - wx) / sx) ** 2 + ((v - wv) / sv) ** 2))
    return z


def draw_landscape(x_lo, x_hi, nx=116, ny=44, color=LAND):
    us = np.linspace(x_lo, x_hi, nx)
    vs = np.linspace(0.0, 1.0, ny)

    def project(u, v):
        return u, LAND_FRONT + v * LAND_SPAN + land_z(u, v)

    for v in vs:
        pts = np.array([project(u, v) for u in us])
        a = 0.15 + 0.26 * v
        ax.plot(pts[:, 0], pts[:, 1], color=color, linewidth=0.6, alpha=a, zorder=0.5)
    for u in us:
        pts = np.array([project(u, v) for v in vs])
        ax.plot(
            pts[:, 0], pts[:, 1], color=color, linewidth=0.5, alpha=0.20, zorder=0.5
        )


grid_left = 0.0
grid_right = 12.8

# Increased the height (bh) of the T3 band from 2.1 to 2.45 to envelop the sub-titles
for by, bh in [(T1 - 1.05, 2.25), (T2 - 0.72, 1.45), (T3 - 1.05, 2.45)]:
    ax.add_patch(
        plt.Rectangle(
            (grid_left, by),
            grid_right - grid_left,
            bh,
            facecolor=BAND,
            edgecolor="none",
            zorder=0,
        )
    )

draw_landscape(x_lo=grid_left, x_hi=grid_right)

# --------------------------------------------------------------------------- #
# Tier labels (left, vertical)
# --------------------------------------------------------------------------- #
tier_lab = [
    (T1, "ULTRA-PRIORS"),
    (T2, "AFFECTIVE STATES"),
    (T3, "PRECISION BIASES"),
    (RAD_C[1], "OBSERVABLE PHENOTYPES"),
]
for y, big in tier_lab:
    ax.text(
        -0.25,
        y,
        big,
        fontsize=9.4,
        fontweight="bold",
        color=INK,
        rotation=90,
        ha="center",
        va="center",
        zorder=6,
    )


# =========================================================================== #
# Node panels with distributions
# =========================================================================== #
def gaussian_curve(xc, baseline, top, mean, sigma, col, hw, z=4):
    t = np.linspace(-hw, hw, 160)
    peak = (mean - 0.5) * 2 * hw * 0.85
    g = np.exp(-((t - peak) ** 2) / (2 * (sigma * hw / 0.5) ** 2))
    g = g / g.max()
    yc = baseline + g * (top - baseline)
    ax.fill_between(xc + t, baseline, yc, color=col, alpha=0.28, zorder=z, linewidth=0)
    ax.plot(xc + t, yc, color=col, linewidth=1.4, zorder=z)
    ax.plot(
        [xc - hw, xc + hw],
        [baseline, baseline],
        color="#B8BCC4",
        linewidth=0.7,
        zorder=z,
    )
    ax.plot(
        [xc + peak, xc + peak],
        [baseline, top],
        color=col,
        linewidth=0.8,
        linestyle=(0, (2, 2)),
        alpha=0.85,
        zorder=z,
    )


def panel(x, yc, w, h, col, mean, sigma, label, fs=8.0):
    ax.add_patch(
        rounded(
            (x - w / 2, yc - h / 2),
            w,
            h,
            facecolor="white",
            edgecolor=col,
            linewidth=1.4,
            zorder=3,
        )
    )
    ax.text(
        x,
        yc + h / 2 - 0.17,
        label,
        fontsize=fs,
        fontweight="bold",
        color=col,
        ha="center",
        va="center",
        zorder=5,
    )
    gaussian_curve(
        x, yc - h / 2 + 0.13, yc + h / 2 - 0.40, mean, sigma, col, hw=w / 2 - 0.18, z=4
    )


# ---- L1 Ultra-Priors ---- #
for cx, name, key in zip(
    GCEN,
    ["Epistemic", "Allostatic", "Teleological"],
    ["epistemic", "allostatic", "teleological"],
):
    ax.add_patch(
        rounded(
            (cx - CONT_HALF, T1 - 0.82),
            2 * CONT_HALF,
            1.64,
            facecolor="white",
            edgecolor=CONTAINER_EDGE,
            linewidth=1.2,
            zorder=1,
        )
    )
    ax.text(
        cx,
        T1 + 1.02,
        f"{name} Imperative",
        fontsize=8.6,
        style="italic",
        color=GROUP[key],
        ha="center",
        va="center",
        fontweight="bold",
        zorder=5,
    )

priors = [
    ("Volatility", XS[0], "epistemic", 0.63, 0.34),
    ("Noise", XS[1], "epistemic", 0.42, 0.22),
    ("Energy", XS[2], "allostatic", 0.55, 0.27),
    ("Tractability", XS[3], "allostatic", 0.66, 0.17),
    ("Reward", XS[4], "teleological", 0.70, 0.24),
    ("Horizon", XS[5], "teleological", 0.40, 0.31),
]
PW = 1.66
prior_x = {}
for label, x, key, mean, sigma in priors:
    panel(x, T1, PW, PANEL_H, GROUP[key], mean, sigma, label, fs=7.7)
    prior_x[label] = x

# ---- L2 Affective States ---- #
affective = [
    ("Arousal", GCEN[0], "arousal", 0.55, 0.28),
    ("Vitality", GCEN[1], "vitality", 0.60, 0.22),
    ("Valence", GCEN[2], "valence", 0.58, 0.25),
]
AW = 2.30
aff_x = {}
for label, x, key, mean, sigma in affective:
    panel(x, T2, AW, PANEL_H, AFF_COLORS[key], mean, sigma, label, fs=8.0)
    aff_x[key] = x

# ---- L3 Precision Biases ---- #
for cx, name, key in zip(
    GCEN,
    ["Minimal Self", "Agentic Self", "Narrative Self"],
    ["minimal", "agentic", "narrative"],
):
    ax.add_patch(
        rounded(
            (cx - CONT_HALF, T3 - 0.82),
            2 * CONT_HALF,
            1.64,
            facecolor="white",
            edgecolor=CONTAINER_EDGE,
            linewidth=1.2,
            zorder=1,
        )
    )
    ax.text(
        cx,
        T3 + 1.02,
        name,
        fontsize=8.6,
        style="italic",
        fontweight="bold",
        color=GROUP[key],
        ha="center",
        va="center",
        zorder=5,
    )

biases = [
    ("Interoception", XS[0], "minimal", 0.50, 0.26),
    ("Differentiation", XS[1], "minimal", 0.58, 0.24),
    ("Action", XS[2], "agentic", 0.60, 0.20),
    ("Exploration", XS[3], "agentic", 0.55, 0.27),
    ("Rigidity", XS[4], "narrative", 0.50, 0.23),
    ("Future", XS[5], "narrative", 0.57, 0.21),
]
BWp = 1.66
bias_x = {}
for label, x, key, mean, sigma in biases:
    panel(x, T3, BWp, PANEL_H, GROUP[key], mean, sigma, label, fs=7.0)
    bias_x[label] = x


# =========================================================================== #
# Connectors
# =========================================================================== #
def sign_node(x, y, col, sign, r=0.11, z=8):
    ax.add_patch(
        Circle((x, y), r, facecolor="white", edgecolor=col, linewidth=1.5, zorder=z)
    )
    glyph = "+" if sign == "+" else "\u2212"
    ax.text(
        x,
        y + 0.004,
        glyph,
        fontsize=8.0,
        fontweight="bold",
        color=col,
        ha="center",
        va="center",
        zorder=z + 1,
    )


def path(pts, sign, weight, z=5, alpha=0.92):
    col = ACT if sign == "+" else INH
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    ax.plot(
        xs,
        ys,
        color=col,
        linewidth=2.2,
        solid_capstyle="round",
        solid_joinstyle="miter",
        zorder=z,
        alpha=alpha,
    )
    sign_node(pts[-1][0], pts[-1][1], col, sign, z=z + 3)


def vhv(x0, y0, x1, y1, bus_y):
    return [(x0, y0), (x0, bus_y), (x1, bus_y), (x1, y1)]


PAD = 0.14

# ---- L1 -> L2 ---- #
l1l2 = [
    ("Volatility", 2.00, 0.8, "+", 11.2),
    ("Noise", 2.60, 0.5, "+", 11.5),
    ("Energy", 5.90, 0.6, "+", 11.2),
    ("Tractability", 6.40, 0.6, "+", 11.5),
    ("Horizon", 6.90, 0.3, "+", 11.85),
    ("Reward", 10.50, 0.6, "+", 11.2),
]
for src, tx, w, s, bus in l1l2:
    path(vhv(prior_x[src], T1_bot, tx, T2_top + PAD, bus), s, w)

# ---- L2 -> L3 ---- #
l2l3 = [
    ("arousal", "Interoception", 1.25, 0.7, "+", 8.05),
    ("arousal", "Rigidity", 9.40, 0.5, "-", 8.80),
    ("vitality", "Differentiation", 3.35, 0.8, "+", 8.25),
    ("vitality", "Action", 5.20, 0.6, "+", 7.70),
    ("vitality", "Exploration", 7.30, 0.5, "+", 7.70),
    ("valence", "Exploration", 7.60, 0.5, "+", 8.25),
]
for src, _tgt, tx, w, s, bus in l2l3:
    path(vhv(aff_x[src], T2_bot, tx, T3_top + PAD, bus), s, w)

# ---- L3 -> L4 (Clean routing avoiding intersections) ---- #
V = {t: polar(angles_deg[t], RAD_R) for t in order}

radar_edges = [
    (
        "+",
        0.4,
        [
            (1.25, T3_bot),
            (1.25, V["Neuroticism"][1]),
            (V["Neuroticism"][0] - 0.25, V["Neuroticism"][1]),
        ],
    ),
    (
        "+",
        0.6,
        [
            (3.20, T3_bot),
            (3.20, V["Agreeableness"][1]),
            (V["Agreeableness"][0] - 0.25, V["Agreeableness"][1]),
        ],
    ),
    (
        "+",
        0.6,
        [
            (3.55, T3_bot),
            (3.55, V["Extraversion"][1] + 0.15),
            (V["Extraversion"][0] - 0.25, V["Extraversion"][1] + 0.15),
        ],
    ),
    (
        "+",
        0.4,
        [
            (5.35, T3_bot),
            (5.35, V["Extraversion"][1] + 0.45),
            (V["Extraversion"][0] - 0.15, V["Extraversion"][1] + 0.45),
        ],
    ),
    (
        "+",
        0.6,
        [
            (7.45, T3_bot),
            (7.45, 4.7),
            (8.8, 4.7),
            (8.8, V["Openness"][1] + 0.25),
            (V["Openness"][0] + 0.15, V["Openness"][1] + 0.25),
        ],
    ),
    (
        "-",
        0.4,
        [
            (9.35, T3_bot),
            (9.35, V["Openness"][1] - 0.15),
            (V["Openness"][0] + 0.25, V["Openness"][1] - 0.15),
        ],
    ),
    (
        "+",
        0.2,
        [
            (9.70, T3_bot),
            (9.70, V["Conscientiousness"][1] + 0.25),
            (V["Conscientiousness"][0] + 0.25, V["Conscientiousness"][1] + 0.25),
        ],
    ),
    (
        "+",
        0.5,
        [
            (11.65, T3_bot),
            (11.65, V["Conscientiousness"][1] - 0.15),
            (V["Conscientiousness"][0] + 0.25, V["Conscientiousness"][1] - 0.15),
        ],
    ),
]
for sign, w, pts in radar_edges:
    path(pts, sign, w, z=5)

# =========================================================================== #
# Big Five radar
# =========================================================================== #
cx, cy = RAD_C
profile = {
    "Openness": 0.78,
    "Extraversion": 0.62,
    "Conscientiousness": 0.52,
    "Agreeableness": 0.66,
    "Neuroticism": 0.34,
}

ax.add_patch(
    Circle(
        (cx, cy),
        RAD_R + 0.28,
        facecolor="white",
        alpha=0.30,
        edgecolor="none",
        zorder=1.5,
    )
)

for frac in (0.33, 0.66, 1.0):
    pts = [polar(angles_deg[t], RAD_R * frac) for t in order]
    ax.add_patch(
        Polygon(
            pts, closed=True, fill=False, edgecolor="#AEB6C2", linewidth=0.8, zorder=2
        )
    )
for t in order:
    ex, ey = polar(angles_deg[t], RAD_R)
    ax.plot([cx, ex], [cy, ey], color="#AEB6C2", linewidth=0.8, zorder=2)

# --- Complex Multi-Color Gradient Mesh Implementation --- #
big5_rgb = {k: np.array(mcolors.to_rgb(v)) for k, v in BIG5.items()}

grid_res = 250
x_min, x_max = cx - RAD_R - 0.5, cx + RAD_R + 0.5
y_min, y_max = cy - RAD_R - 0.5, cy + RAD_R + 0.5
xx, yy = np.meshgrid(
    np.linspace(x_min, x_max, grid_res), np.linspace(y_min, y_max, grid_res)
)

pts_x, pts_y, pts_color = [], [], []
for t in order:
    px, py = polar(angles_deg[t], RAD_R * profile[t])
    pts_x.append(px)
    pts_y.append(py)
    pts_color.append(big5_rgb[t])

pts_x, pts_y, pts_color = np.array(pts_x), np.array(pts_y), np.array(pts_color)

dists = np.sqrt(
    (xx[None, :, :] - pts_x[:, None, None]) ** 2
    + (yy[None, :, :] - pts_y[:, None, None]) ** 2
)
dists = np.maximum(dists, 1e-5)
weights = 1.0 / (dists**2.5)
weights_norm = weights / weights.sum(axis=0)

img_rgb = np.zeros((grid_res, grid_res, 3))
for c in range(3):
    img_rgb[:, :, c] = np.sum(weights_norm * pts_color[:, c, None, None], axis=0)

ppts = [polar(angles_deg[t], RAD_R * profile[t]) for t in order]
poly_patch = Polygon(
    ppts, closed=True, facecolor="none", edgecolor="#333333", linewidth=2.0, zorder=3
)
ax.add_patch(poly_patch)

im = ax.imshow(
    img_rgb, origin="lower", extent=[x_min, x_max, y_min, y_max], alpha=0.85, zorder=2.5
)
im.set_clip_path(poly_patch)
# -------------------------------------------------------- #

for t in order:
    px, py = polar(angles_deg[t], RAD_R)
    ax.plot(
        px,
        py,
        "o",
        color=BIG5[t],
        markersize=12,
        markeredgecolor="white",
        markeredgewidth=1.2,
        zorder=6,
    )

# Custom tight offsets to cleanly avoid all incoming connection edges
label_offsets = {
    "Extraversion": (0.20, 0.10, "left", "bottom"),  # Tucked safely to the right
    "Openness": (0.42, 0.02, "left", "center"),  # Snug between top and bottom lines
    "Conscientiousness": (0, -0.28, "left", "top"),  # Tucked below
    "Agreeableness": (-0.15, -0.28, "right", "top"),  # Tucked below
    "Neuroticism": (0, 0.20, "right", "bottom"),  # Shifted above incoming line
}

for t in order:
    px, py = polar(angles_deg[t], RAD_R)
    dx, dy, ha, va = label_offsets[t]
    ax.text(
        px + dx,
        py + dy,
        t,
        fontsize=8.8,
        fontweight="bold",
        color=BIG5[t],
        ha=ha,
        va=va,
        zorder=7,
    )

# =========================================================================== #
# Title
# =========================================================================== #
ax.text(
    6.4,
    Y1 - 0.1,
    "The Deep-Self Predictive Cascade",
    fontsize=14.5,
    fontweight="bold",
    color=INK,
    ha="center",
    va="top",
)

plt.subplots_adjust(left=0.02, right=0.98, top=0.97, bottom=0.02)

out = Path(__file__).resolve().parent
fig.savefig(out / "figure2.png", dpi=300, bbox_inches="tight", facecolor="white")
fig.savefig(out / "figure2.pdf", bbox_inches="tight", facecolor="white")
print("saved figure2.png / figure2.pdf to", out)
