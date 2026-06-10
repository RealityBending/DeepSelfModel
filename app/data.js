window.CORE_SELF_MODEL = {
    levelHeaders: [
        { level: 1, label: "Ultra-Priors" },
        { level: 2, label: "Affective Priors" },
        { level: 3, label: "Precision Biases" },
        { level: 4, label: "Observables" },
    ],
    nodes: [
        {
            id: "vol",
            label: "Volatility",
            title: "Volatility Expectation",
            level: 1,
            order: 1,
            value: 0.5,
            description:
                "Baseline expectation about how quickly the environment's hidden rules change. Higher volatility discounts past learning and keeps the system braced for fresh prediction error.",
        },
        {
            id: "trac",
            label: "Tractability",
            title: "Tractability Expectation",
            level: 1,
            order: 2,
            value: 0.5,
            description:
                "Expectation that action can reduce prediction error. High tractability supports agency and approach; low tractability pushes the system toward helplessness, shielding, and inhibition.",
        },
        {
            id: "noi",
            label: "Noise",
            title: "Noise Expectation",
            level: 1,
            order: 3,
            value: 0.5,
            description:
                "Expectation about how much residual ambiguity must simply be tolerated once epistemic foraging has done its best. Higher noise expectation permits ambiguity; lower noise expectation pushes toward premature closure and distress.",
        },
        {
            id: "term",
            label: "Terminal",
            title: "Terminal Expectation",
            level: 1,
            order: 4,
            value: 0.5,
            description:
                "Temporal horizon the self can sustain before anticipating dissolution. In the latest model this spans disengagement, integration of finitude, and attempts to extend the self through legacy or transcendence.",
        },
        {
            id: "gv",
            label: "Valence",
            title: "Valence / Free Energy Expectation",
            level: 2,
            order: 1,
            value: 0,
            description:
                "Affective readout of baseline expected free energy. It is the felt sense of safety versus chronic threat generated downstream of volatility and tractability.",
        },
        {
            id: "gu",
            label: "Uncertainty",
            title: "Uncertainty / Ambiguity Expectation",
            level: 2,
            order: 2,
            value: 0,
            description:
                "Expected opacity of the world in the moment. It translates volatility and noise into how much ambient ambiguity or confusion the system expects to feel.",
        },
        {
            id: "te",
            label: "Temporal Efficacy",
            title: "Temporal Efficacy / Efficacy Horizon",
            level: 2,
            order: 3,
            value: 0,
            description:
                "Felt depth of future planning and efficacy across time. When the terminal model is shortened, temporal efficacy collapses and long-horizon control becomes harder to sustain.",
        },
        {
            id: "sa",
            label: "Sensory Anchoring",
            title: "Sensory-Anchoring Bias",
            level: 3,
            order: 1,
            value: 0,
            description:
                "Precision bias for where reality is grounded: internal bodily signals or external sensory structure. It defines whether the self is stabilized more by interoception or exteroception.",
        },
        {
            id: "coup",
            label: "Coupling Bias",
            title: "Coupling Bias",
            level: 3,
            order: 2,
            value: 0,
            description:
                "Bias governing how tightly the self should couple to other people and the wider environment. One pole favors differentiation and autonomy; the other favors synchrony, affiliation, and dissolution into external structure.",
        },
        {
            id: "ap",
            label: "Action Perception",
            title: "Action-Perception Bias",
            level: 3,
            order: 3,
            value: 0,
            description:
                "Relative precision placed on changing the world versus changing beliefs. Action-heavy styles push active control; perception-heavy styles favor internal updating and accommodation.",
        },
        {
            id: "ef",
            label: "Epistemic Foraging",
            title: "Epistemic-Gain Expectation",
            level: 3,
            order: 4,
            value: 0,
            description:
                "Expected value of sampling uncertainty. Across model revisions this becomes the epistemic-gain drive behind exploration; in the latest version the simulator compresses both intensity and domain of foraging into this single node.",
        },
        {
            id: "np",
            label: "Narrative Precision",
            title: "Narrative Precision / Self-Coherence",
            level: 3,
            order: 5,
            value: 0,
            description:
                "Precision assigned to autobiographical continuity and the narrative self. Higher values stabilize identity across contexts; lower values allow fluid updating but increase fragmentation risk under stress.",
        },
    ],
    observables: [
        { id: "neuro", label: "Neuroticism", angle: -Math.PI / 2, color: "#ef4444" }, // Top (-90 degrees)
        { id: "open", label: "Openness", angle: Math.PI / 6, color: "#f59e0b" }, // Bottom Right (30 degrees)
        { id: "cons", label: "Conscientiousness", angle: (5 * Math.PI) / 6, color: "#10b981" }, // Bottom Left (150 degrees)
    ],
    edges: [
        // Level 1 to 2
        { source: "vol", target: "gv", weight: 0.6, transform: "direct" },
        { source: "trac", target: "gv", weight: 0.6, transform: "inverse" },
        { source: "vol", target: "gu", weight: 0.5, transform: "direct" },
        { source: "noi", target: "gu", weight: 0.5, transform: "direct" },
        { source: "trac", target: "te", weight: 0.4, transform: "direct" },
        { source: "term", target: "te", weight: 0.6, transform: "direct" },
        // Level 2 to 3
        { source: "gv", target: "sa", weight: 0.7, transform: "direct" },
        { source: "gu", target: "sa", weight: 0.3, transform: "direct" },
        { source: "gv", target: "coup", weight: 0.8, transform: "inverse" },
        { source: "gv", target: "ap", weight: 0.5, transform: "inverse" },
        { source: "trac", target: "ap", weight: 0.5, transform: "direct" },
        { source: "gv", target: "ef", weight: 0.5, transform: "inverse" },
        { source: "noi", target: "ef", weight: 0.5, transform: "direct" },
        { source: "gu", target: "np", weight: 0.5, transform: "inverse" },
        { source: "te", target: "np", weight: 0.5, transform: "direct" },
        // Level 3 to 4 (Observables)
        { source: "gv", target: "neuro", weight: 0.6, transform: "direct" },
        { source: "sa", target: "neuro", weight: 0.4, transform: "direct" },
        { source: "ef", target: "open", weight: 0.6, transform: "direct" },
        { source: "np", target: "open", weight: 0.4, transform: "inverse" },
        { source: "te", target: "cons", weight: 0.5, transform: "direct" },
        { source: "ap", target: "cons", weight: 0.3, transform: "direct" },
        { source: "np", target: "cons", weight: 0.2, transform: "direct" },
    ],
}
