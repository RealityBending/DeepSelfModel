"""
Deep-Self Predictive Cascade Model – Simulation (Revised)
==========================================================

CONTEXT & AIM:
  Tests whether the theoretical topology is structurally necessary to recover
  the empirical Big-Five covariance matrix derived from Digman (1997) and
  DeYoung et al. (2002) meta-analytic consensus, using three null distributions.

NODE INDEX MAP:
  0–5   Ultra-Priors       (Tier 0)
  6–8   Affective States   (Tier 1)
  9–14  Precision Biases   (Tier 2)
  15–19 Phenotypes / Big Five (Tier 3)

EDGE-TYPE STRUCTURE OF THEORETICAL MODEL:
  The graph is a general DAG (not strictly tier-adjacent); it contains:
    T0→T1:  7 edges   (Ultra-Priors → Affective States)
    T0→T2: 10 edges   (Ultra-Priors → Precision Biases, skip-tier)
    T1→T1:  2 edges   (within Affective States)
    T1→T2:  6 edges   (Affective States → Precision Biases)
    T1→T3:  7 edges   (Affective States → Phenotypes, skip-tier)
    T2→T3: 12 edges   (Precision Biases → Phenotypes)

NULL MODELS:
  Null 1 – Random Weights (same topology):
    Weights drawn uniformly from [-1, 1] on the THEORETICAL graph.

  Null 2 – Weight Permutation (matched random topologies):
    A random DAG is generated that exactly matches the theoretical model's
    edge-type distribution. The theoretical weight vector is then randomly
    permuted onto those edges.

  Null 3 – Fixed Weights (matched random topologies):
    Uses the exact same matched topologies as Null 2, but applies the EXACT
    theoretical weights (signs and magnitudes) to those edges rather than
    permuting them. Isolates the contribution of the graph structure alone.
"""

import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from matplotlib.colors import LinearSegmentedColormap
from collections import defaultdict

# ─── Setup & Target ──────────────────────────────────────────────────────────
SHORT = ["N", "E", "C", "A", "O"]

TARGET = np.array(
    [
        [1.00, -0.26, -0.22, -0.23, -0.10],
        [-0.26, 1.00, 0.15, 0.21, 0.24],
        [-0.22, 0.15, 1.00, 0.24, 0.02],
        [-0.23, 0.21, 0.24, 1.00, 0.15],
        [-0.10, 0.24, 0.02, 0.15, 1.00],
    ]
)
mask = ~np.eye(5, dtype=bool)
target_vals = TARGET[mask]

# Tier membership
TIER = {
    0: list(range(0, 6)),
    1: list(range(6, 9)),
    2: list(range(9, 15)),
    3: list(range(15, 20)),
}


def get_tier(n):
    for t, ns in TIER.items():
        if n in ns:
            return t
    raise ValueError(f"Node {n} not in any tier")


# ─── Exact Analytical Covariance Solver ──────────────────────────────────────
def get_L1_cov(s):
    """Correlation matrix among Ultra-Priors (shared developmental ecology)."""
    base_var = 1 - s**2
    A = np.zeros((6, 9))
    A[0, 0] = -0.8 * s
    A[0, 3] = np.sqrt(base_var)
    A[1, 0] = 0.5 * s
    A[1, 1] = 0.3 * s
    A[1, 4] = np.sqrt(base_var)
    A[2, 0] = 0.6 * s
    A[2, 1] = 0.5 * s
    A[2, 5] = np.sqrt(base_var)
    A[3, 0] = 0.4 * s
    A[3, 1] = 0.7 * s
    A[3, 6] = np.sqrt(base_var)
    A[4, 0] = 0.4 * s
    A[4, 1] = 0.6 * s
    A[4, 7] = np.sqrt(base_var)
    A[5, 1] = 0.3 * s
    A[5, 2] = 0.8 * s
    A[5, 8] = np.sqrt(base_var)
    cov = A @ A.T
    d = np.sqrt(np.diag(cov))
    return cov / np.outer(d, d)


def exact_covariance_solver(W, L1_cov, noise_vars):
    """Propagates covariance analytically through the DAG."""
    Cov = np.eye(20)
    Cov[:6, :6] = L1_cov
    for i in range(6, 20):
        w_i = W[i, :i]
        var_Y = w_i @ Cov[:i, :i] @ w_i + noise_vars[i]
        c_i = 1.0 / np.sqrt(var_Y)
        for k in range(i):
            Cov[i, k] = c_i * np.dot(w_i, Cov[:i, k])
            Cov[k, i] = Cov[i, k]
        Cov[i, i] = 1.0
    return Cov[15:20, 15:20]


def compute_rmse(W, L1_cov, noise_vars):
    pred = exact_covariance_solver(W, L1_cov, noise_vars)
    return float(np.sqrt(np.mean((pred[mask] - target_vals) ** 2)))


# ─── Theoretical Architecture ─────────────────────────────────────────────────
def get_theoretical_architecture():
    """
    Returns (row_indices, col_indices), weight_array.
    """
    edges = [
        # T0 → T1  (Ultra-Priors → Affective States)
        (6, 0, 0.80),
        (6, 1, -0.55),
        (6, 2, -0.30),
        (7, 2, 0.70),
        (7, 3, 0.55),
        (7, 5, 0.30),
        (8, 4, 0.70),
        # T1 → T1  (within Affective States)
        (8, 6, -0.45),
        (8, 7, 0.40),
        # T1 → T2  (Affective States → Precision Biases)
        (9, 6, 0.75),
        (9, 7, -0.40),
        (10, 7, 0.60),
        (10, 6, -0.40),
        (11, 7, 0.30),
        (12, 7, 0.35),
        # T0 → T2  (Ultra-Priors → Precision Biases, skip-tier)
        (10, 3, 0.50),
        (11, 3, 0.65),
        (11, 4, 0.50),
        (12, 1, 0.60),
        (12, 4, 0.50),
        (13, 3, 0.55),
        (13, 1, -0.50),
        (13, 5, 0.40),
        (14, 5, 0.70),
        (14, 3, 0.55),
        # T2 → T3  (Precision Biases → Phenotypes)
        (15, 9, 0.55),
        (15, 13, -0.40),
        (16, 10, 0.60),
        (16, 11, 0.50),
        (17, 14, 0.60),
        (17, 13, 0.50),
        (17, 11, 0.40),
        (18, 10, 0.32),
        (18, 14, 0.58),
        (19, 12, 0.65),
        (19, 13, -0.35),
        (19, 11, 0.18),
        # T1 → T3  (Affective States → Phenotypes, skip-tier)
        (15, 6, 0.70),
        (15, 8, -0.40),
        (16, 8, 0.45),
        (17, 6, -0.25),
        (18, 8, 0.35),
        (18, 6, -0.28),
        (19, 8, 0.30),
    ]
    rows, cols, vals = zip(*edges)
    return (np.array(rows), np.array(cols)), np.array(vals)


def get_edge_type_spec(indices):
    """
    Returns a dict mapping (parent_tier, child_tier) → list of (child, count)
    and a per-node in-degree breakdown: node → {parent_tier: count}.
    """
    rows, cols = indices
    in_deg = defaultdict(lambda: defaultdict(int))
    for r, c in zip(rows, cols):
        in_deg[r][get_tier(c)] += 1

    type_counts = defaultdict(int)
    for r, c in zip(rows, cols):
        type_counts[(get_tier(c), get_tier(r))] += 1

    return dict(type_counts), {n: dict(d) for n, d in in_deg.items()}


def generate_matched_random_topology(in_deg_spec):
    """
    Generates a random DAG matching per-node in-degree from each parent tier.
    """
    rows, cols = [], []
    for child_node, tier_counts in in_deg_spec.items():
        chosen_parents = set()
        for parent_tier, count in tier_counts.items():
            available = [
                n
                for n in TIER[parent_tier]
                if n not in chosen_parents and n != child_node
            ]
            if len(available) < count:
                return None
            selected = np.random.choice(available, size=count, replace=False)
            rows.extend([child_node] * count)
            cols.extend(selected.tolist())
            chosen_parents.update(selected.tolist())
    return np.array(rows), np.array(cols)


# ─── Null 1: Random Weights on Theoretical Topology ──────────────────────────
def null1_random_weights(indices, L1_cov, noise_vars, n_iter=1000):
    n_edges = len(indices[0])
    rmses = []
    for _ in range(n_iter):
        W = np.zeros((20, 20))
        W[indices] = np.random.uniform(-1.0, 1.0, n_edges)
        rmses.append(compute_rmse(W, L1_cov, noise_vars))
    return np.array(rmses)


# ─── Null 2: Weight Permutation on Matched Random Topologies ─────────────────
def null2_weight_permutation(
    theo_weights, in_deg_spec, L1_cov, noise_vars, n_iter=1000
):
    n_theo = len(theo_weights)
    rmses = []
    skipped = 0

    for _ in range(n_iter):
        result = generate_matched_random_topology(in_deg_spec)
        if result is None:
            skipped += 1
            continue
        rand_rows, rand_cols = result

        if len(rand_rows) != n_theo:
            skipped += 1
            continue

        perm_weights = np.random.permutation(theo_weights)
        W = np.zeros((20, 20))
        W[rand_rows, rand_cols] = perm_weights
        rmses.append(compute_rmse(W, L1_cov, noise_vars))

    if skipped > 0:
        print(f"  [Null 2] Skipped {skipped}/{n_iter} degenerate samples")

    return np.array(rmses)


# ─── Null 3: Fixed Weights on Matched Random Topologies ──────────────────────
def null3_fixed_weights(
    theo_indices, theo_weights, in_deg_spec, L1_cov, noise_vars, n_iter=1000
):
    """
    Most stringent test: Fixes exact magnitudes and signs to specific edge types,
    but randomises which specific nodes within a tier are connected.
    """
    # Create a mapping pool to ensure specific edge types retain their exact theoretical weight.
    rows, cols = theo_indices
    weight_pool_master = defaultdict(list)
    for r, c, w in zip(rows, cols, theo_weights):
        weight_pool_master[(r, get_tier(c))].append(w)

    n_theo = len(theo_weights)
    rmses = []
    skipped = 0

    for _ in range(n_iter):
        result = generate_matched_random_topology(in_deg_spec)
        if result is None:
            skipped += 1
            continue
        rand_rows, rand_cols = result

        if len(rand_rows) != n_theo:
            skipped += 1
            continue

        W = np.zeros((20, 20))
        # Deep copy pool so we can safely pop items
        pool = {k: list(v) for k, v in weight_pool_master.items()}

        # Safely map the theoretical weights onto the newly generated edges
        for r, c in zip(rand_rows, rand_cols):
            pt = get_tier(c)
            w = pool[(r, pt)].pop(0)
            W[r, c] = w

        rmses.append(compute_rmse(W, L1_cov, noise_vars))

    if skipped > 0:
        print(f"  [Null 3] Skipped {skipped}/{n_iter} degenerate samples")

    return np.array(rmses)


# ─── Sensitivity Analysis ─────────────────────────────────────────────────────
def sensitivity_analysis(W_theo, noise_vars, s_vals):
    return [compute_rmse(W_theo, get_L1_cov(s), noise_vars) for s in s_vals]


# ─── Main ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    np.random.seed(42)

    noise_vars = np.zeros(20)
    noise_vars[6:9] = 0.55**2
    noise_vars[9:15] = 0.65**2
    noise_vars[15:20] = 1.80**2

    # 1. Theoretical Baseline
    print("Evaluating theoretical model...")
    theo_indices, theo_weights = get_theoretical_architecture()
    _, in_deg_spec = get_edge_type_spec(theo_indices)

    L1_cov = get_L1_cov(0.35)
    W_theo = np.zeros((20, 20))
    W_theo[theo_indices] = theo_weights
    theo_rmse = compute_rmse(W_theo, L1_cov, noise_vars)
    sim_corr = exact_covariance_solver(W_theo, L1_cov, noise_vars)

    # 2. Null 1
    print("Generating Null 1 (random weights, N=1000)...")
    null1 = null1_random_weights(theo_indices, L1_cov, noise_vars, n_iter=1000)

    # 3. Null 2
    print("Generating Null 2 (weight permutation on matched topologies, N=1000)...")
    null2 = null2_weight_permutation(
        theo_weights, in_deg_spec, L1_cov, noise_vars, n_iter=1000
    )

    # 4. Null 3
    print("Generating Null 3 (fixed weights on matched topologies, N=1000)...")
    null3 = null3_fixed_weights(
        theo_indices, theo_weights, in_deg_spec, L1_cov, noise_vars, n_iter=1000
    )

    # 5. Sensitivity
    print("Running sensitivity analysis...")
    s_vals = np.linspace(0.0, 0.8, 17)
    sens_rmses = sensitivity_analysis(W_theo, noise_vars, s_vals)

    # ── Report ────────────────────────────────────────────────────────────────
    print("\n" + "=" * 65)
    print(f"Theoretical Baseline:             RMSE = {theo_rmse:.4f}")
    print(
        f"Null 1 (Random Weights):          Mean = {null1.mean():.4f}  "
        f"95% CI = [{np.percentile(null1, 2.5):.4f}, "
        f"{np.percentile(null1, 97.5):.4f}]"
    )
    print(
        f"Null 2 (Permuted Weights/Topo):   Mean = {null2.mean():.4f}  "
        f"95% CI = [{np.percentile(null2, 2.5):.4f}, "
        f"{np.percentile(null2, 97.5):.4f}]"
    )
    print(
        f"Null 3 (Fixed Weights/Topo):      Mean = {null3.mean():.4f}  "
        f"95% CI = [{np.percentile(null3, 2.5):.4f}, "
        f"{np.percentile(null3, 97.5):.4f}]"
    )
    print(
        f"  Theoretical beats Null 1 in {100 * np.mean(null1 > theo_rmse):.1f}% of iterations"
    )
    print(
        f"  Theoretical beats Null 2 in {100 * np.mean(null2 > theo_rmse):.1f}% of iterations"
    )
    print(
        f"  Theoretical beats Null 3 in {100 * np.mean(null3 > theo_rmse):.1f}% of iterations"
    )
    print("=" * 65)

    # ── Figure ────────────────────────────────────────────────────────────────
    COLOR_TEXT = "#424242"
    COLOR_SIMULATED = "#8E24AA"
    COLOR_EMPIRICAL = "#00ACC1"
    COLOR_NULL1 = "#D32F2F"
    COLOR_NULL2 = "#1976D2"
    COLOR_NULL3 = "#388E3C"
    cmap_flat = LinearSegmentedColormap.from_list(
        "FlatRedGreen", ["#D32F2F", "#FFFFFF", "#388E3C"]
    )

    fig = plt.figure(figsize=(16, 8))
    gs = gridspec.GridSpec(1, 2, figure=fig, width_ratios=[1.3, 1], wspace=0.25)

    # Panel A: Split-Diagonal Heatmap ─────────────────────────────────────────
    ax1 = fig.add_subplot(gs[0, 0])
    split_matrix = np.tril(sim_corr, k=-1) + np.triu(TARGET, k=0)
    annot_matrix = np.where(
        np.eye(5, dtype=bool), "", np.vectorize(lambda x: f"{x:.2f}")(split_matrix)
    )
    np.fill_diagonal(split_matrix, np.nan)

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
    ax1.set_facecolor("white")
    for i in range(5):
        ax1.add_patch(
            plt.Rectangle((i, i), 1, 1, facecolor="#333333", edgecolor="white", lw=1.5)
        )
    for spine in ax1.spines.values():
        spine.set_visible(False)
    ax1.plot([0, 0], [0, 5], color=COLOR_SIMULATED, lw=7, clip_on=False)
    ax1.plot([0, 5], [5, 5], color=COLOR_SIMULATED, lw=7, clip_on=False)
    ax1.plot([5, 5], [0, 5], color=COLOR_EMPIRICAL, lw=7, clip_on=False)
    ax1.plot([0, 5], [0, 0], color=COLOR_EMPIRICAL, lw=7, clip_on=False)
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
        f"A. Covariance Structure (RMSE = {theo_rmse:.3f})",
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
        color="#616161",
    )

    # Panel B: Sensitivity + Triple Null ────────────────────────────────────────
    ax2 = fig.add_subplot(gs[0, 1])

    n3_lo, n3_hi = np.percentile(null3, 2.5), np.percentile(null3, 97.5)
    ax2.axhline(
        null3.mean(),
        color=COLOR_NULL3,
        ls="-.",
        lw=2,
        label=f"Null model  (M = {null3.mean():.3f})",
    )
    ax2.fill_between(s_vals, n3_lo, n3_hi, color="#A5D6A7", alpha=0.5)

    ax2.plot(
        s_vals,
        sens_rmses,
        "o-",
        color="#212121",
        lw=2.5,
        ms=6,
        label=f"Cascade model  (RMSE = {theo_rmse:.3f})",
        zorder=5,
    )

    ax2.set_xlabel(
        r"Shared variance between Ultra-priors ($\lambda$)",
        fontsize=11,
        color=COLOR_TEXT,
    )
    ax2.set_ylabel("RMSE vs. target matrix", color=COLOR_TEXT)
    ax2.set_ylim(0, 0.40)
    ax2.legend(frameon=False, loc="upper right", fontsize=9.5)
    ax2.set_title(
        "B. Sensitivity vs. Null Models", fontweight="bold", pad=40, fontsize=15
    )
    ax2.text(
        0.5,
        1.05,
        "Cascade Model error vs. matched random topologies",
        transform=ax2.transAxes,
        ha="center",
        va="bottom",
        fontsize=12,
        color="#616161",
    )
    sns.despine(ax=ax2)

    fig.suptitle(
        "Big-5 Factor Structure Recovery: Simulation Results",
        fontsize=20,
        fontweight="bold",
        y=1.05,
    )
    plt.savefig("results.png", dpi=300, bbox_inches="tight")
    plt.show()
    print("Figure saved to results.png")
