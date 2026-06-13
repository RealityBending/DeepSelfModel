"""
Deep-Self Predictive Cascade Model – Simulation
======================================================

CONTEXT & AIM:
This script simulates the Deep-Self Predictive Cascade Model. The aim is to
mathematically demonstrate that cascading foundational expectations (Ultra-Priors)
structurally generates the empirical covariance matrix of the Big Five personality
traits. It serves as a proof-of-concept that established personality taxonomies
naturally emerge from a unified predictive processing hierarchy.
"""

import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from matplotlib.colors import LinearSegmentedColormap
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

# Empirical target derived from Digman (1997) and DeYoung et al. (2002) meta-analytic consensus
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
def run_cascade(s=0.35, N=100_000, randomize_weights=False, seed=None):
    """
    s represents the shared variance (lambda) among Ultra-Priors. While the three
    imperatives (Epistemic, Allostatic, Teleological) solve computationally
    orthogonal problems, the biological agent calibrates these priors within
    a unified environment. 's' operationalizes this shared developmental
    ecology (e.g., a globally hostile environment simultaneously driving up
    Volatility and driving down Energy/Tractability expectations) and
    accounts for genetic pleiotropy.
    """
    rng = np.random.default_rng(seed)

    def w(val):
        if randomize_weights:
            return rng.uniform(-1.0, 1.0)
        return val

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
    dom = 1.80
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
    rmse = np.sqrt(np.mean((trait_corr.values[mask] - TARGET[mask]) ** 2))

    return trait_corr, rmse


# ─── 1. Run Baseline (Target Model) ──────────────────────────────────────────
sim_corr, sim_rmse = run_cascade(s=0.35, seed=42)

# ─── 2. Null Model (Random Structural Weights) ───────────────────────────────
n_null = 1000
null_rmses = []
for i in range(n_null):
    _, null_rmse = run_cascade(randomize_weights=True, N=10_000, seed=i)
    null_rmses.append(null_rmse)

null_p05 = np.percentile(null_rmses, 5)
null_mean = np.mean(null_rmses)

# ─── 3. Sensitivity Analysis ─────────────────────────────────────────────────
s_vals = np.linspace(0.0, 0.8, 17)
sens_rmses = []
for s_val in s_vals:
    _, r = run_cascade(s=s_val, N=25_000, seed=42)
    sens_rmses.append(r)

# ─────────────────────────────────────────────────────────────────────────────
# FIGURE GENERATION
# ─────────────────────────────────────────────────────────────────────────────
COLOR_TEXT = "#424242"
COLOR_SUBTITLE = "#616161"
COLOR_SIMULATED = "#8E24AA"
COLOR_EMPIRICAL = "#00ACC1"

mat_colors = ["#D32F2F", "#FFFFFF", "#388E3C"]
cmap_flat = LinearSegmentedColormap.from_list("FlatRedGreen", mat_colors)

fig = plt.figure(figsize=(16, 8))
gs = gridspec.GridSpec(1, 2, figure=fig, width_ratios=[1.3, 1], wspace=0.25)

# ─── Panel A: Split-Diagonal Heatmap ───
ax1 = fig.add_subplot(gs[0, 0])
split_matrix = np.tril(sim_corr.values, k=-1) + np.triu(TARGET, k=0)
annot_matrix = np.empty_like(split_matrix, dtype=object)

for i in range(5):
    for j in range(5):
        if i == j:
            split_matrix[i, j] = np.nan
            annot_matrix[i, j] = ""
        else:
            annot_matrix[i, j] = f"{split_matrix[i, j]:.2f}"

ax1.set_facecolor("#121212")

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

ax1.tick_params(axis="both", which="major", labelsize=15)
for spine in ax1.spines.values():
    spine.set_visible(False)

ax1.plot([0, 0], [0, 5], color=COLOR_SIMULATED, lw=7, clip_on=False, zorder=10)
ax1.plot([0, 5], [5, 5], color=COLOR_SIMULATED, lw=7, clip_on=False, zorder=10)
ax1.plot([5, 5], [0, 5], color=COLOR_EMPIRICAL, lw=7, clip_on=False, zorder=10)
ax1.plot([0, 5], [0, 0], color=COLOR_EMPIRICAL, lw=7, clip_on=False, zorder=10)

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
ax1.text(
    1.05,
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
    color=COLOR_SUBTITLE,
)

# ─── Panel B: Sensitivity & Structural Null ───
ax2 = fig.add_subplot(gs[0, 1])
ax2.axhline(
    null_mean,
    color="#9E9E9E",
    ls="--",
    lw=1.5,
    label=f"Random Baseline Mean ({null_mean:.2f})",
)
ax2.fill_between(
    s_vals,
    np.percentile(null_rmses, 2.5),
    np.percentile(null_rmses, 97.5),
    color="#E0E0E0",
    alpha=0.5,
    label="Random 95% CI",
)

# Clarified legend label
ax2.plot(
    s_vals,
    sens_rmses,
    "ko-",
    color="#424242",
    lw=2.5,
    ms=6,
    label="Simulated Model RMSE",
)

# Clarified x-axis with two lines
ax2.set_xlabel(
    r"Shared variance between Ultra-priors $\lambda$", fontsize=11, color=COLOR_TEXT
)
ax2.set_ylabel("RMSE vs Target Matrix", color=COLOR_TEXT)
ax2.set_ylim(0, 0.3)
ax2.legend(frameon=False, loc="upper right", fontsize=11)

# Fixed Title and Subtitle Overlap
ax2.set_title(
    "B. Structural Sensitivity & Null Model\n", fontweight="bold", fontsize=15
)
ax2.text(
    0.5,
    1.0,
    "Model error vs. random topological connectivity",
    transform=ax2.transAxes,
    ha="center",
    va="bottom",
    fontsize=12,
    color=COLOR_SUBTITLE,
)

sns.despine(fig=fig, ax=ax2)
fig.suptitle(
    "Big-5 Factor Structure Recovery: Simulation Results",
    fontsize=20,
    fontweight="bold",
    y=1.05,
)
plt.savefig("../paper/figures/figure3.png", dpi=300, bbox_inches="tight")
plt.savefig("results.png", dpi=300, bbox_inches="tight")
plt.show()
