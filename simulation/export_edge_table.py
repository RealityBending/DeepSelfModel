"""
Writes paper/_table_s2.md (Supplementary Table S2): every path of the simulated cascade,
read directly from get_theoretical_architecture() in simulation.py.

Run after any change to the edge list:  python export_edge_table.py
"""

import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "paper" / "_table_s2.md"

NODES = [
    "Volatility Expectation", "Noise Expectation", "Energy Expectation",
    "Tractability Expectation", "Reward Expectation", "Horizon Expectation",
    "Epistemic Arousal", "Vitality", "Valence",
    "Interoception Bias", "Differentiation Bias", "Action Bias",
    "Exploration Bias", "Rigidity Bias", "Future Bias",
    "Neuroticism", "Extraversion", "Conscientiousness", "Agreeableness", "Openness",
]
TIERS = ["Ultra-Priors"] * 6 + ["Affective States"] * 3 + ["Precision Biases"] * 6 + ["Phenotypes"] * 5
DISSOLUTION = 10  # coded as Dissolution in simulation.py; reported here as Differentiation

text = (HERE / "simulation.py").read_text(encoding="utf-8")
block = text[text.index("def get_theoretical_architecture"): text.index("rows, cols, vals = zip")]
edges = []
for child, parent, w in re.findall(r"\((\d+),\s*(\d+),\s*(-?[\d.]+)\)", block):
    child, parent, w = int(child), int(parent), float(w)
    if DISSOLUTION in (child, parent):
        w = -w
    edges.append((parent, child, w))
edges.sort(key=lambda e: (e[1], e[0]))

lines = ["| To | Level | From | Weight |", "|:---|:---|:---|---:|"]
for parent, child, w in edges:
    weight = f"{w:+.2f}".replace("-", "−")  # typographic minus
    lines.append(f"| {NODES[child]} | {TIERS[child]} | {NODES[parent]} | {weight} |")
OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"{len(edges)} edges written to {OUT}")
