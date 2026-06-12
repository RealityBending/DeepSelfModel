import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# --------------------------------------------------
# PARAMETERS
# --------------------------------------------------

N = 10000
rng = np.random.default_rng(123)

# --------------------------------------------------
# LATENT FACTORS
# --------------------------------------------------
# These create structured covariance among Ultra-Priors

world_security = rng.normal(0, 1, N)
agency = rng.normal(0, 1, N)
future_orientation = rng.normal(0, 1, N)

# --------------------------------------------------
# ULTRA-PRIORS
# --------------------------------------------------

Volatility = -0.8 * world_security + rng.normal(0, 0.5, N)

Noise = -0.5 * world_security + 0.4 * agency + rng.normal(0, 0.5, N)

Vitality = 0.8 * world_security + 0.5 * agency + rng.normal(0, 0.5, N)

Tractability = 0.9 * agency + 0.4 * world_security + rng.normal(0, 0.5, N)

Reward = 0.7 * agency + 0.5 * world_security + rng.normal(0, 0.5, N)

Horizon = 0.8 * future_orientation + 0.4 * agency + rng.normal(0, 0.5, N)

ultra = pd.DataFrame(
    {
        "Volatility": Volatility,
        "Noise": Noise,
        "Vitality": Vitality,
        "Tractability": Tractability,
        "Reward": Reward,
        "Horizon": Horizon,
    }
)

# --------------------------------------------------
# CORE AFFECTIVE STATES
# --------------------------------------------------

EpistemicArousal = 0.7 * Volatility + 0.7 * Noise - 0.4 * Vitality

AgenticEngagement = 0.8 * Tractability + 0.7 * Reward + 0.3 * Vitality

ExistentialSecurity = (
    0.6 * Horizon + 0.6 * Vitality + 0.4 * Tractability - 0.5 * Volatility
)

# --------------------------------------------------
# BIG FIVE TRAITS
# --------------------------------------------------

Neuroticism = 0.8 * EpistemicArousal - 0.6 * ExistentialSecurity + rng.normal(0, 0.5, N)

Extraversion = 0.8 * AgenticEngagement + 0.4 * Reward + rng.normal(0, 0.5, N)

Conscientiousness = 0.7 * Horizon + 0.6 * Tractability + rng.normal(0, 0.5, N)

Agreeableness = 0.5 * ExistentialSecurity + 0.4 * Reward + rng.normal(0, 0.5, N)

Openness = 0.6 * Noise + 0.5 * AgenticEngagement + rng.normal(0, 0.5, N)

traits = pd.DataFrame(
    {
        "Neuroticism": Neuroticism,
        "Extraversion": Extraversion,
        "Conscientiousness": Conscientiousness,
        "Agreeableness": Agreeableness,
        "Openness": Openness,
    }
)

# --------------------------------------------------
# CORRELATION MATRICES
# --------------------------------------------------

ultra_corr = ultra.corr()
trait_corr = traits.corr()

print("\nUltra-Prior Correlations")
print(np.round(ultra_corr, 2))

print("\nTrait Correlations")
print(np.round(trait_corr, 2))

# --------------------------------------------------
# HEATMAPS
# --------------------------------------------------

plt.figure(figsize=(8, 6))
sns.heatmap(ultra_corr, annot=True, cmap="coolwarm", center=0)
plt.title("Ultra-Prior Correlation Matrix")
plt.tight_layout()
plt.show()

plt.figure(figsize=(8, 6))
sns.heatmap(trait_corr, annot=True, cmap="coolwarm", center=0)
plt.title("Trait Correlation Matrix")
plt.tight_layout()
plt.show()

# --------------------------------------------------
# EIGENVALUES
# --------------------------------------------------

eigvals = np.linalg.eigvals(trait_corr)

print("\nTrait Correlation Eigenvalues")
print(np.round(np.sort(eigvals)[::-1], 2))
