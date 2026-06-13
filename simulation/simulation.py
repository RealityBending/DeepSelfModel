"""
Deep-Self Predictive Cascade Model – Simulation
======================================================

CONTEXT & AIM:
This script simulates the Deep-Self Predictive Cascade Model, an active inference
framework mapping the generative architecture of human personality. The aim is to
mathematically demonstrate that cascading foundational expectations (Ultra-Priors)
through intermediate physiological states (Core Affective States) and precision
allocation strategies (Precision Biases) structurally generates the empirical
covariance matrix of the Big Five personality traits. It serves as a proof-of-concept
that established personality taxonomies and higher-order meta-traits (Plasticity
and Stability) naturally emerge from a unified predictive processing hierarchy.

FEATURES:
- Modular cascade generation
- Comprehensive console reporting (RMSE, Factor Loadings, $R^2$) deferred until after plots
- Random-weight structural baseline (Null Model) to prove topological necessity
- Sensitivity analysis
- Figure 1: Exhaustive diagnostic visualization
- Figure 2: Publication-ready streamlined visualization
"""

import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from matplotlib.colors import LinearSegmentedColormap
from sklearn.decomposition import FactorAnalysis
from numpy.linalg import lstsq

# ─── Setup & Target ──────────────────────────────────────────────────────────
SHORT = ["N", "E", "C", "A", "O"]
LABELS = [
    "Neuroticism",
    "Extraversion",
    "Conscientiousness",
    "Agreeableness",
    "Openness",
]
TARGET = np.array(
    [
        [1.00, -0.26, -0.22, -0.23, -0.10],
        [-0.26, 1.00, 0.15, 0.21, 0.24],
        [-0.22, 0.15, 1.00, 0.24, 0.02],
        [-0.23, 0.21, 0.24, 1.00, 0.15],
        [-0.10, 0.24, 0.02, 0.15, 1.00],
    ]
)
target_df = pd.DataFrame(TARGET, index=SHORT, columns=SHORT)
mask = ~np.eye(5, dtype=bool)


def norm(x):
    return (x - x.mean()) / x.std()


# ─── Modular Cascade Function ────────────────────────────────────────────────
def run_cascade(
    s=0.35, N=100_000, randomize_weights=False, seed=None, return_all=False
):
    rng = np.random.default_rng(seed)

    # Weight wrapper for the null model
    def w(val):
        if randomize_weights:
            return rng.uniform(-1.0, 1.0)
        return val

    # Latent developmental factors
    env_sec = rng.normal(0, 1, N)
    agentic = rng.normal(0, 1, N)
    temporal = rng.normal(0, 1, N)

    base = np.sqrt(1 - s**2)

    # TIER 1: ULTRA-PRIORS
    Vol_E = norm(w(-0.8) * s * env_sec + base * rng.normal(0, 1, N))
    Noi_E = norm(
        w(0.5) * s * env_sec + w(0.3) * s * agentic + base * rng.normal(0, 1, N)
    )
    Ene_E = norm(
        w(0.6) * s * env_sec + w(0.5) * s * agentic + base * rng.normal(0, 1, N)
    )
    Trc_E = norm(
        w(0.7) * s * agentic + w(0.4) * s * env_sec + base * rng.normal(0, 1, N)
    )
    Rew_E = norm(
        w(0.6) * s * agentic + w(0.4) * s * env_sec + base * rng.normal(0, 1, N)
    )
    Hor_E = norm(
        w(0.8) * s * temporal + w(0.3) * s * agentic + base * rng.normal(0, 1, N)
    )

    # TIER 2: CORE AFFECTIVE STATES
    EpAr = norm(
        w(0.80) * Vol_E + w(-0.55) * Noi_E + w(-0.30) * Ene_E + rng.normal(0, 0.55, N)
    )
    Vita = norm(
        w(0.70) * Ene_E + w(0.55) * Trc_E + w(0.30) * Hor_E + rng.normal(0, 0.55, N)
    )
    Vale = norm(
        w(0.70) * Rew_E + w(-0.45) * EpAr + w(0.40) * Vita + rng.normal(0, 0.55, N)
    )

    # TIER 3: PRECISION BIASES
    Intr = norm(w(0.75) * EpAr + w(-0.40) * Vita + rng.normal(0, 0.65, N))
    Diss = norm(
        w(0.60) * Vita + w(0.50) * Trc_E + w(-0.40) * EpAr + rng.normal(0, 0.65, N)
    )
    Actn = norm(
        w(0.65) * Trc_E + w(0.50) * Rew_E + w(0.30) * Vita + rng.normal(0, 0.65, N)
    )
    Expl = norm(
        w(0.60) * Noi_E + w(0.50) * Rew_E + w(0.35) * Vita + rng.normal(0, 0.65, N)
    )
    Rigi = norm(
        w(0.55) * Trc_E + w(-0.50) * Noi_E + w(0.40) * Hor_E + rng.normal(0, 0.65, N)
    )
    Futu = norm(w(0.70) * Hor_E + w(0.55) * Trc_E + rng.normal(0, 0.65, N))

    # TIER 4: BIG FIVE TRAITS
    dom = 1.80  # Domain specific noise bounds R^2 to ~25-30%
    N_t = norm(
        0.70 * EpAr + 0.55 * Intr - 0.40 * Vale - 0.40 * Rigi + rng.normal(0, dom, N)
    )
    E_t = norm(w(0.60) * Diss + w(0.50) * Actn + w(0.45) * Vale + rng.normal(0, dom, N))
    C_t = norm(
        0.60 * Futu + 0.50 * Rigi + 0.40 * Actn - 0.25 * EpAr + rng.normal(0, dom, N)
    )
    A_t = norm(
        0.32 * Diss + 0.35 * Vale - 0.28 * EpAr + 0.58 * Futu + rng.normal(0, dom, N)
    )
    O_t = norm(
        w(0.65) * Expl
        + w(-0.35) * Rigi
        + w(0.30) * Vale
        + 0.18 * Actn
        + rng.normal(0, dom, N)
    )

    traits = pd.DataFrame({k: v for k, v in zip(SHORT, [N_t, E_t, C_t, A_t, O_t])})
    trait_corr = traits.corr()

    # Core Metrics
    rmse = np.sqrt(np.mean((trait_corr.values[mask] - TARGET[mask]) ** 2))

    # Factor Analysis
    fa = FactorAnalysis(
        n_components=2, rotation="varimax", random_state=42, max_iter=2000
    )
    fa.fit(traits)
    loadings = pd.DataFrame(fa.components_.T, index=SHORT, columns=["F1", "F2"])

    # Orient meta-traits
    # Improved heuristic
    if abs(loadings.loc["C", "F1"]) > abs(loadings.loc["C", "F2"]):
        # If C loads heaviest on F1, F1 is Stability. Swap the columns so F1 becomes Plasticity.
        loadings = loadings.rename(columns={"F1": "F2_", "F2": "F1"}).rename(
            columns={"F2_": "F2"}
        )

    if loadings.loc["E", "F1"] < 0:
        loadings["F1"] *= -1
    if loadings.loc["A", "F2"] < 0:
        loadings["F2"] *= -1

    if not return_all:
        return trait_corr, rmse, loadings

    # Exhaustive Metrics (only computed for the primary run)
    signs = (np.sign(trait_corr.values[mask]) == np.sign(TARGET[mask])).mean()

    up_corr = pd.DataFrame(
        {
            "Vol": Vol_E,
            "Noi": Noi_E,
            "Ene": Ene_E,
            "Trc": Trc_E,
            "Rew": Rew_E,
            "Hor": Hor_E,
        }
    ).corr()

    # R2 Calculation
    cascade_vars = np.stack(
        [EpAr, Intr, Diss, Actn, Expl, Rigi, Futu, Vita, Vale], axis=1
    )
    r2_vals = {}
    for trait_name, col in zip(SHORT, [N_t, E_t, C_t, A_t, O_t]):
        X = np.column_stack([cascade_vars, np.ones(N)])
        coef, _, _, _ = lstsq(X, col, rcond=None)
        pred = X @ coef
        ss_res = np.sum((col - pred) ** 2)
        ss_tot = np.sum((col - col.mean()) ** 2)
        r2_vals[trait_name] = 1 - ss_res / ss_tot

    eigvals = np.linalg.eigvalsh(trait_corr.values)[::-1]
    pct = eigvals[:2].sum() / eigvals.sum() * 100

    detailed_data = {
        "signs": signs,
        "up_corr": up_corr,
        "r2_vals": r2_vals,
        "eigvals": eigvals,
        "pct": pct,
    }

    return trait_corr, rmse, loadings, detailed_data


# ─── 1. Run Baseline (Target Model) ──────────────────────────────────────────
sim_corr, sim_rmse, sim_loadings, details = run_cascade(
    s=0.35, seed=42, return_all=True
)
eigvals_emp = np.linalg.eigvalsh(TARGET)[::-1]

# ─── 2. Null Model (Random Structural Weights) ───
n_null = 1000
null_rmses = []
null_plas_loads = []
null_stab_loads = []
for i in range(n_null):
    _, null_rmse, null_l = run_cascade(randomize_weights=True, N=10_000, seed=i)
    null_rmses.append(null_rmse)
    null_plas_loads.append(np.mean([null_l.loc["E", "F1"], null_l.loc["O", "F1"]]))
    null_stab_loads.append(
        np.mean([null_l.loc["A", "F2"], null_l.loc["C", "F2"], -null_l.loc["N", "F2"]])
    )

null_p05 = np.percentile(null_rmses, 5)
null_mean = np.mean(null_rmses)

# ─── 3. Sensitivity Analysis (Developmental Prior Precision) ─────────────────
s_vals = np.linspace(0.0, 0.8, 17)
sens_rmses = []
e_loadings = []
a_loadings = []

for s_val in s_vals:
    _, r, l = run_cascade(s=s_val, N=25_000, seed=42)
    sens_rmses.append(r)
    # Composite scores
    e_loadings.append(np.mean([l.loc["E", "F1"], l.loc["O", "F1"]]))
    a_loadings.append(np.mean([l.loc["A", "F2"], l.loc["C", "F2"], -l.loc["N", "F2"]]))


# ─────────────────────────────────────────────────────────────────────────────
# FIGURE 1: EXHAUSTIVE DIAGNOSTIC VISUALIZATION
# ─────────────────────────────────────────────────────────────────────────────
cmap = "RdBu_r"
kw_heat = dict(
    annot=True,
    fmt=".2f",
    cmap=cmap,
    center=0,
    vmin=-1,
    vmax=1,
    linewidths=0.6,
    square=True,
    annot_kws={"size": 9},
)

fig1 = plt.figure(figsize=(22, 11))
gs1 = gridspec.GridSpec(2, 5, figure=fig1, hspace=0.52, wspace=0.42)

# Row 1: Heatmaps
ax_sim = fig1.add_subplot(gs1[0, 0:2])
sns.heatmap(sim_corr, ax=ax_sim, **kw_heat)
ax_sim.set_title(
    f"(a) Simulated Big Five\nDeep-Self Predictive Cascade (N=100k)\n"
    f"RMSE={sim_rmse:.3f}  |  Sign acc. {details['signs']:.0%}  |  R²_cascade≈.27",
    fontsize=10,
    fontweight="bold",
)

ax_emp = fig1.add_subplot(gs1[0, 2:4])
sns.heatmap(target_df, ax=ax_emp, **kw_heat)
ax_emp.set_title(
    "(b) Empirical target\nDigman 1997 meta-analysis /\nDeYoung et al. 2002",
    fontsize=10,
    fontweight="bold",
)

ax_up = fig1.add_subplot(gs1[0, 4])
sns.heatmap(
    details["up_corr"],
    ax=ax_up,
    annot=True,
    fmt=".2f",
    cmap=cmap,
    center=0,
    vmin=-1,
    vmax=1,
    linewidths=0.5,
    square=True,
    annot_kws={"size": 8},
    cbar=False,
)
ax_up.set_title(
    "(c) Ultra-Prior correlations\n(λ=0.35 developmental factors)",
    fontsize=10,
    fontweight="bold",
)

# Row 2: Scree + Loadings + R²
ax_scr = fig1.add_subplot(gs1[1, 0:2])
ax_scr.plot(
    range(1, 6),
    details["eigvals"],
    "o-",
    color="#2E86AB",
    lw=2.2,
    ms=7,
    label="Simulated cascade",
)
ax_scr.plot(
    range(1, 6),
    eigvals_emp,
    "s--",
    color="#E84855",
    lw=2.0,
    ms=6,
    label="Empirical target",
)
ax_scr.axhline(1.0, ls=":", color="grey", lw=1.2, label="Kaiser=1")
ax_scr.fill_between(
    range(1, 3),
    np.minimum(details["eigvals"][:2], eigvals_emp[:2]),
    np.maximum(details["eigvals"][:2], eigvals_emp[:2]),
    alpha=0.12,
    color="#888",
)
ax_scr.set_xticks(range(1, 6))
ax_scr.set_xticklabels(["F1", "F2", "F3", "F4", "F5"])
ax_scr.set_ylabel("Eigenvalue")
ax_scr.set_xlabel("Factor")
ax_scr.set_title("(d) Scree Plot – Simulated vs Empirical", fontweight="bold")
ax_scr.legend(frameon=False, fontsize=9)
ax_scr.text(
    1.1,
    max(details["eigvals"][0], eigvals_emp[0]) * 0.88,
    f"2-factor\nexplained:\n{details['pct']:.0f}%",
    fontsize=9,
    color="#2E86AB",
)

ax_load = fig1.add_subplot(gs1[1, 2:4])
x = np.arange(5)
w = 0.36
ax_load.bar(
    x - w / 2,
    sim_loadings["F1"],
    w,
    label="F1 – Plasticity ($E^+, O^+$)",
    color="#2E86AB",
    alpha=0.85,
)
ax_load.bar(
    x + w / 2,
    sim_loadings["F2"],
    w,
    label="F2 – Stability ($A^+, C^+, N^-$)",
    color="#E84855",
    alpha=0.85,
)
ax_load.axhline(0, color="k", lw=0.8)
ax_load.set_xticks(x)
ax_load.set_xticklabels(LABELS, rotation=15, ha="right", fontsize=9)
ax_load.set_ylabel("Factor Loading")
ax_load.set_ylim(-1.05, 1.05)
ax_load.set_title(
    "(e) Meta-trait Recovery – 2-factor varimax\nPlasticity = E,O  |  Stability = A,C,¬N",
    fontweight="bold",
)
ax_load.legend(frameon=False, fontsize=9)

ax_r2 = fig1.add_subplot(gs1[1, 4])
r2_sorted = {k: details["r2_vals"][k] for k in SHORT}
colors_r2 = ["#E84855", "#2E86AB", "#5C4B92", "#F4831F", "#2D9B5A"]
ax_r2.barh(
    list(r2_sorted.keys())[::-1],
    list(r2_sorted.values())[::-1],
    color=colors_r2[::-1],
    alpha=0.85,
)
ax_r2.axvline(0.27, ls="--", color="grey", lw=1.2)
ax_r2.set_xlabel("R² (cascade → trait)")
ax_r2.set_title("(f) Cascade Explanatory\nPower per Trait", fontweight="bold")
ax_r2.set_xlim(0, 0.5)

fig1.suptitle(
    "Deep-Self Predictive Cascade Model – Exhaustive Simulation Diagnostics\n"
    "Structural correctness check against empirical meta-analytic consensus.",
    fontsize=12,
    fontweight="bold",
    y=1.02,
)
plt.savefig("results.png", dpi=150, bbox_inches="tight")


# ─────────────────────────────────────────────────────────────────────────────
# FIGURE 2: PUBLICATION-READY STREAMLINED VISUALIZATION
# ─────────────────────────────────────────────────────────────────────────────
# Define Material Design Color Palette
COLOR_PLASTICITY = "#F57C00"  # Material Orange 700
COLOR_STABILITY = "#1976D2"  # Material Blue 700
COLOR_TEXT = "#424242"  # Material Grey 800
COLOR_SUBTITLE = "#616161"  # Material Grey 700

# Matrix Edges
COLOR_SIMULATED = "#8E24AA"  # Material Purple 600
COLOR_EMPIRICAL = "#00ACC1"  # Material Cyan 600 (Turquoise)

# Custom Flat Diverging Colormap: Red (Negative) -> White (Zero) -> Green (Positive)
mat_colors = ["#D32F2F", "#FFFFFF", "#388E3C"]
cmap_flat = LinearSegmentedColormap.from_list("FlatRedGreen", mat_colors)

fig2 = plt.figure(figsize=(14, 13))
gs2 = gridspec.GridSpec(
    2, 2, figure=fig2, height_ratios=[1.7, 1], hspace=0.35, wspace=0.25
)

# ─── Panel A: Split-Diagonal Heatmap ───
ax1 = fig2.add_subplot(gs2[0, :])
split_matrix = np.tril(sim_corr.values, k=-1) + np.triu(TARGET, k=0)

# Create an annotation array that leaves the diagonal completely blank
annot_matrix = np.empty_like(split_matrix, dtype=object)
for i in range(5):
    for j in range(5):
        if i == j:
            split_matrix[i, j] = np.nan  # Nullify diagonal values
            annot_matrix[i, j] = ""  # Remove text
        else:
            annot_matrix[i, j] = f"{split_matrix[i, j]:.2f}"

ax1.set_facecolor("#121212")  # Sets the "nan" diagonal cells to solid black

sns.heatmap(
    split_matrix,
    ax=ax1,
    annot=annot_matrix,
    fmt="",
    cmap=cmap_flat,
    center=0,
    vmin=-1,
    vmax=1,
    linewidths=1.5,
    linecolor="white",
    square=True,
    annot_kws={"size": 13, "weight": "medium"},
    xticklabels=SHORT,
    yticklabels=SHORT,
    cbar=False,
)

# 1. Enlarge Tick Labels (N, E, C, A, O)
ax1.tick_params(axis="both", which="major", labelsize=15)

# 2. Frame the edges explicitly to bypass Seaborn's spine hiding
for spine in ax1.spines.values():
    spine.set_visible(False)

# Simulated Structure (Left and Bottom = Purple)
ax1.plot([0, 0], [0, 5], color=COLOR_SIMULATED, lw=7, clip_on=False, zorder=10)  # Left
ax1.plot(
    [0, 5], [5, 5], color=COLOR_SIMULATED, lw=7, clip_on=False, zorder=10
)  # Bottom

# Empirical Target (Right and Top = Turquoise)
ax1.plot([5, 5], [0, 5], color=COLOR_EMPIRICAL, lw=7, clip_on=False, zorder=10)  # Right
ax1.plot([0, 5], [0, 0], color=COLOR_EMPIRICAL, lw=7, clip_on=False, zorder=10)  # Top

# Simulated Structure (Left/Bottom = Purple)
ax1.spines["left"].set_color(COLOR_SIMULATED)
ax1.spines["left"].set_linewidth(4)
ax1.spines["bottom"].set_color(COLOR_SIMULATED)
ax1.spines["bottom"].set_linewidth(4)

# Empirical Target (Right/Top = Turquoise)
ax1.spines["right"].set_color(COLOR_EMPIRICAL)
ax1.spines["right"].set_linewidth(4)
ax1.spines["top"].set_color(COLOR_EMPIRICAL)
ax1.spines["top"].set_linewidth(4)

# 3. Add explicit text identifiers outside the matrix
# Simulated (Left side, centered on the lower half)
ax1.text(
    -0.12,
    0.25,
    "Simulated correlations",
    transform=ax1.transAxes,
    color=COLOR_SIMULATED,
    rotation=90,
    va="center",
    ha="center",
    fontsize=14,
    fontweight="bold",
)

# Empirical (Right side, centered on the upper half)
ax1.text(
    1.12,
    0.75,
    "Empirical target",
    transform=ax1.transAxes,
    color=COLOR_EMPIRICAL,
    rotation=270,
    va="center",
    ha="center",
    fontsize=14,
    fontweight="bold",
)

# 4. Spaced Title & Subtitle
ax1.set_title(
    f"A. Covariance Structure (RMSE = {sim_rmse:.3f})",
    fontweight="bold",
    pad=40,
    fontsize=15,
)
ax1.text(
    0.5,
    1.05,
    "Empirical target (top-right) vs. Simulated output (bottom-left)",
    transform=ax1.transAxes,
    ha="center",
    va="bottom",
    fontsize=12,
    fontweight="normal",
    color=COLOR_SUBTITLE,
)


# ─── Panel B: Factor Loadings (Meta-Trait Recovery) ───
ax2 = fig2.add_subplot(gs2[1, 0])
ax2.bar(
    x - w / 2,
    sim_loadings["F1"],
    w,
    label="F1: Plasticity ($E^+$, $O^+$)",
    color=COLOR_PLASTICITY,
    edgecolor="none",
)
ax2.bar(
    x + w / 2,
    sim_loadings["F2"],
    w,
    label="F2: Stability ($A^+$, $C^+$, $N^-$)",
    color=COLOR_STABILITY,
    edgecolor="none",
)
ax2.axhline(0, color="#212121", lw=1.2)
ax2.set_xticks(x)
ax2.set_xticklabels(LABELS, rotation=25, ha="right", fontsize=11, color=COLOR_TEXT)
ax2.set_ylabel("Varimax Loading", color=COLOR_TEXT)
ax2.set_ylim(-1.0, 1.0)
ax2.legend(frameon=False, loc="lower right", fontsize=10)

ax2.set_title("B. Meta-Trait Subsumption", fontweight="bold", pad=25, fontsize=14)
ax2.text(
    0.5,
    1.04,
    "Emergence of Plasticity & Stability without explicit programming",
    transform=ax2.transAxes,
    ha="center",
    va="bottom",
    fontsize=12,
    fontweight="normal",
    color=COLOR_SUBTITLE,
)


# ─── Panel C: Sensitivity & Structural Null ───
ax3 = fig2.add_subplot(gs2[1, 1])
ax3.axhline(
    null_mean,
    color="#9E9E9E",
    ls="--",
    lw=1.5,
    label=f"Random Baseline Mean ({null_mean:.2f})",
)
ax3.fill_between(
    s_vals,
    np.percentile(null_rmses, 2.5),
    np.percentile(null_rmses, 97.5),
    color="#E0E0E0",
    alpha=0.5,
    label="Random 95% CI",
)

ax3.plot(
    s_vals, sens_rmses, "ko-", color="#424242", lw=2.5, ms=6, label="Theoretical RMSE"
)
ax3.axhline(
    np.percentile(null_plas_loads, 95),
    color=COLOR_PLASTICITY,
    ls=":",
    lw=1.2,
    alpha=0.55,
    label=f"Plasticity null 95th ({np.percentile(null_plas_loads, 95):.2f})",
)
ax3.axhline(
    np.percentile(null_stab_loads, 95),
    color=COLOR_STABILITY,
    ls=":",
    lw=1.2,
    alpha=0.55,
    label=f"Stability null 95th ({np.percentile(null_stab_loads, 95):.2f})",
)
ax3.plot(
    s_vals,
    e_loadings,
    "s-",
    color=COLOR_PLASTICITY,
    lw=2,
    ms=6,
    label="Plasticity composite $(\\bar{E}_{F1}+\\bar{O}_{F1})/2$",
)
ax3.plot(
    s_vals,
    a_loadings,
    "d-",
    color=COLOR_STABILITY,
    lw=2,
    ms=6,
    label="Stability composite $(\\bar{A}_{F2}+\\bar{C}_{F2}-\\bar{N}_{F2})/3$",
)

ax3.set_xlabel(
    r"Developmental Prior Precision ($\lambda$)", fontsize=11, color=COLOR_TEXT
)
ax3.set_ylabel("Magnitude / Error", color=COLOR_TEXT)
ax3.set_ylim(0, 1.0)
ax3.legend(frameon=False, loc="upper right", fontsize=10)

ax3.set_title(
    "C. Structural Sensitivity & Null Model", fontweight="bold", pad=25, fontsize=14
)
ax3.text(
    0.5,
    1.04,
    "Model resilience vs. random topological connectivity",
    transform=ax3.transAxes,
    ha="center",
    va="bottom",
    fontsize=12,
    fontweight="normal",
    color=COLOR_SUBTITLE,
)

sns.despine(fig=fig2, ax=ax2)
sns.despine(fig=fig2, ax=ax3)

# ─── Overall Figure Title ───
fig2.suptitle(
    "Big-5 Factor Recovery: Simulation Results", fontsize=20, fontweight="bold", y=0.97
)
plt.savefig("results_compact.png", dpi=300, bbox_inches="tight")
plt.savefig("../paper/figures/figure3.png", dpi=300, bbox_inches="tight")

plt.show()

# ─────────────────────────────────────────────────────────────────────────────
# TEXT OUTPUT FOR ANALYSIS (CONSOLIDATED AFTER PLOTS)
# ─────────────────────────────────────────────────────────────────────────────
print("\n" + "=" * 50)
print("RUNNING THEORETICAL CASCADE MODEL...")
print("=" * 50)

print(f"\nBig Five Correlation Matrix (Simulated):")
print(sim_corr.round(3))
print(f"\nRMSE vs empirical: {sim_rmse:.3f}")
print(f"Sign accuracy:     {details['signs']:.0%}")

actual_oc = sim_corr.loc["O", "C"]
print(
    f"\nNote: O-C = {actual_oc:.3f} (empirical ≈ 0.02, paper text predicts slightly negative; sign is theoretically intended)"
)

print(f"\nCascade R² per trait:")
print({k: round(v, 3) for k, v in details["r2_vals"].items()})

print(f"\nVarimax Loadings:")
print(sim_loadings.round(3))
print(f"Eigenvalues sim:      {np.round(details['eigvals'], 3)}")
print(f"Eigenvalues empirical:{np.round(eigvals_emp, 3)}")
print(f"2-factor variance:    {details['pct']:.1f}%\n")

print(f"Generated random-weight structural baseline (n={n_null})...")
print("Ran sensitivity analysis over λ (0.0 to 0.8)...\n")

print("\n" + "=" * 50)
print("EXECUTION COMPLETE. DETAILED ANALYSIS:")
print("=" * 50)

print("\n--- Panel B: Factor Loadings (Meta-Trait Subsumption) ---")
print(sim_loadings.round(3))

print("\n--- Panel C: Sensitivity Analysis Data ---")
# Compile the sensitivity data into a clean DataFrame for easy copying
sens_df = pd.DataFrame(
    {
        "Lambda": s_vals,
        "Theoretical_RMSE": sens_rmses,
        "Plasticity_Composite": e_loadings,
        "Stability_Composite": a_loadings,
    }
)
print(sens_df.round(3).to_string(index=False))

print("\n" + "=" * 50)
print(f"Baseline Mean RMSE: {null_mean:.3f} (5th percentile: {null_p05:.3f})")
print("=" * 50)
