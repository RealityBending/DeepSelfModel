window.CORE_SELF_MODEL = {
    overview: {
        kicker: "Overview",
        title: "The Core Priors Cascade Model of Personality",
        text: [
            "The Core Priors Cascade model is a theoretical generative personality framework grounded in active inference, the Free Energy Principle, and broader computational and cybernetic accounts of self-organising systems. Instead of treating personality as a flat list of traits, it models personality as the downstream expression of deeper expectations and precision biases that shape how an agent interprets uncertainty, regulates action, and maintains a sense of self.",
            "In that view, observable personality patterns emerge from a hierarchy that runs from foundational assumptions about the world, through affective and operational priors, into more visible behavioural dispositions. This app is a simplified interactive sketch of that cascade rather than a full formal implementation of the theory.",
        ],
    },
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
            projectsTo: [
                { target: "gv", weight: 0.6, transform: "direct" },
                { target: "gu", weight: 0.5, transform: "direct" },
            ],
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
            projectsTo: [
                { target: "gv", weight: 0.6, transform: "inverse" },
                { target: "te", weight: 0.4, transform: "direct" },
                { target: "ap", weight: 0.5, transform: "direct" },
            ],
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
            projectsTo: [
                { target: "gu", weight: 0.5, transform: "direct" },
                { target: "ef", weight: 0.5, transform: "direct" },
            ],
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
            projectsTo: [{ target: "te", weight: 0.6, transform: "direct" }],
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
            projectsTo: [
                { target: "sa", weight: 0.7, transform: "direct" },
                { target: "coup", weight: 0.8, transform: "inverse" },
                { target: "ap", weight: 0.5, transform: "inverse" },
                { target: "ef", weight: 0.5, transform: "inverse" },
                { target: "neuro", weight: 0.6, transform: "direct" },
                { target: "agree", weight: 0.4, transform: "inverse" },
            ],
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
            projectsTo: [
                { target: "sa", weight: 0.3, transform: "direct" },
                { target: "np", weight: 0.5, transform: "inverse" },
            ],
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
            projectsTo: [
                { target: "np", weight: 0.5, transform: "direct" },
                { target: "cons", weight: 0.5, transform: "direct" },
            ],
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
            projectsTo: [{ target: "neuro", weight: 0.4, transform: "direct" }],
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
            projectsTo: [
                { target: "ext", weight: 0.6, transform: "direct" },
                { target: "agree", weight: 0.6, transform: "direct" },
            ],
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
            projectsTo: [
                { target: "cons", weight: 0.3, transform: "direct" },
                { target: "ext", weight: 0.4, transform: "direct" },
                { target: "open", weight: 0.3, transform: "inverse" },
            ],
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
            projectsTo: [{ target: "open", weight: 0.6, transform: "direct" }],
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
            projectsTo: [
                { target: "open", weight: 0.4, transform: "inverse" },
                { target: "cons", weight: 0.2, transform: "direct" },
            ],
        },
    ],
    observables: [
        {
            id: "neuro",
            label: "Neuroticism",
            title: "Trait Neuroticism",
            level: 4,
            angle: -Math.PI / 2, // -90 deg (Top)
            color: "#ef4444",
            description:
                "A stable behavioral attractor generated by chronically elevated valence expectations (threat) and interoceptive anchoring. Characterized by hyper-vigilance to internal arousal and perceptual accommodation over action.",
        },
        {
            id: "ext",
            label: "Extraversion",
            title: "Trait Extraversion",
            level: 4,
            angle: -Math.PI / 10, // -18 deg (Top Right)
            color: "#3b82f6",
            description:
                "An outward-oriented behavioral attractor driven by high environmental coupling and a bias toward action over perception. Characterized by high reward-seeking, assertiveness, and social synchrony.",
        },
        {
            id: "open",
            label: "Openness",
            title: "Openness to Experience",
            level: 4,
            angle: (3 * Math.PI) / 10, // 54 deg (Bottom Right)
            color: "#f59e0b",
            description:
                "Driven by high epistemic-gain expectations and highly fluid narrative precision. Manifests as exploratory edge-testing and willingness to revise the self-model without catastrophic fragmentation.",
        },
        {
            id: "agree",
            label: "Agreeableness",
            title: "Trait Agreeableness",
            level: 4,
            angle: (7 * Math.PI) / 10, // 126 deg (Bottom Left)
            color: "#8b5cf6",
            description:
                "Rooted in strong coupling biases and feeling secure in the environment (low threat expectations). Phenomenologically experienced as an orientation toward affiliation, trust, and structural alignment with others.",
        },
        {
            id: "cons",
            label: "Conscientiousness",
            title: "Trait Conscientiousness",
            level: 4,
            angle: (11 * Math.PI) / 10, // 198 deg (Top Left)
            color: "#10b981",
            description:
                "Rooted in deep temporal efficacy, rigid self-coherence, and a perception-overriding bias toward action. Phenomenologically experienced as an organized, persistent exertion of cybernetic control over the environment.",
        },
    ],
    relatedFrameworks: {
        kicker: "Context",
        title: "Relation with Existing Frameworks",
        items: [
            {
                title: "Big Five",
                description:
                    "The Five-Factor Model of personality is the dominant empirical taxonomy in psychology, organizing trait variance into five orthogonal dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. It serves primarily as a descriptive structural model rather than a mechanistic explanation of underlying drives.",
            },
            {
                title: "Cybernetic Big Five Theory",
                description: `The Cybernetic Big Five Theory (CB5T), formalized by Colin G. DeYoung (2015), is a mechanistic framework that maps the Five-Factor Model onto the functional requirements of any cybernetic system. It conceptualizes personality as the typical parameters of a goal-directed, self-regulating entity navigating uncertainty and reward. DeYoung organizes the Big Five into two higher-order meta-traits, which map cleanly onto the lower-level operational biases and observable attractors (Levels 3 and 4) within the Core Priors Cascade:
                <ul>
                    <li><b>Plasticity (Extraversion & Openness):</b> Drives exploration and engagement with novel information. In our model, this closely aligns with the <i>Epistemic Foraging</i> and <i>Action-Perception</i> biases, representing a system parameterized for active exploration and high expected information gain.</li>
                    <li><b>Stability (Neuroticism, Agreeableness & Conscientiousness):</b> Functions to protect the system from disruption and maintain goal coherence. This mirrors the downstream regulatory effects of deep affective priors—specifically, how high <i>Temporal Efficacy</i>, secure <i>Narrative Precision</i>, and safety-biased <i>Valence</i> expectations work together to shield the self-model from catastrophic fragmentation and volatile prediction errors.</li>
                </ul>`,
            },

            {
                title: "BIS/BAS",
                description: `Biopsychological personality theory, commonly known as BIS/BAS Theory (Gray, 1981), is a neuropsychological framework that anchors behavioral dispositions in distinct neurobiological systems. It shifted personality psychology toward understanding traits as the chronic sensitivities of underlying motivational circuits. In the context of the Core Priors Cascade, Gray's dual systems can be understood as the direct affective readouts generated at Level 2 (Affective Priors):
                <ul>
                    <li><b>Behavioral Inhibition System (BIS):</b> Highly sensitive to cues of punishment, ambiguity, and threat, leading to anxiety and the halting of ongoing behavior. Phenomenologically, this is the equivalent of a system parameterized by high <i>Volatility</i> and low <i>Tractability</i>, generating an elevated state of <i>Uncertainty</i> and a chronic threat-biased <i>Valence</i> that aggressively halts active inference.</li>
                    <li><b>Behavioral Approach System (BAS):</b> Sensitive to reward and goal-attainment, driving impulsivity and approach behaviors. This operates as the affective prior generated when <i>Tractability</i> expectations are high, propelling the agent forward to exploit the environment and aggressively reduce expected free energy through action.</li>
                </ul>`,
            },
            {
                title: "HiTOP ",
                description:
                    "HiTOP (Hierarchical Taxonomy of Psychopathology) is a dimensional classification system that conceptualizes mental health and psychopathology as a continuous hierarchy spanning from broad spectra to specific symptom components. It eschews categorical diagnoses in favor of empirically derived clinical phenotypes.",
            },
            {
                title: "Attachment Theory",
                description:
                    "Attachment Theory (Bowlby & Ainsworth, XXXX) is an evolutionary and developmental model detailing how early interactions with caregivers internalize into working models of the self and others. These deep priors shape interpersonal affect regulation and relational expectations throughout the lifespan.",
            },
            {
                title: "Sensation Seeking",
                description:
                    "Sensation Seeking (Zuckerman, XXXX) is a biologically based trait defined by the persistent drive for novel, varied, and intense sensory experiences, often accompanied by a willingness to take physical, social, or financial risks to attain them.",
            },

            {
                title: "Jungian Archetypes",
                description:
                    "Pearson-Marr's (XXXX) psychodynamic and symbolic framework categorizes human behavioral patterns and motivations into universal, mythic narratives. It maps developmental journeys through distinct archetypal stages to facilitate individuation and self-awareness.",
            },
            {
                title: "REBUS",
                description:
                    "REBUS (Relaxed Beliefs Under Psychedelics) is an active inference model proposing that psychedelics acutely relax the precision weighting of high-level prior beliefs. This temporary flattening of the landscape allows bottom-up prediction errors to revise deeply entrenched internal models.",
            },
            {
                title: "Primal World Beliefs",
                description:
                    "Primal World Beliefs (Clifton, XXXX) is a cognitive framework focusing on an individual's most fundamental assumptions about the overall nature of reality—such as whether the world is essentially safe, enticing, or alive—which cascade down to shape broader behavioral and affective dispositions.",
            },
            {
                title: "Constructed Emotion",
                description:
                    "Barrett's framework is a predictive processing account of affect arguing that emotions are not innate, reactive circuits. Instead, they are top-down cortical predictions generated to make sense of, and allocate resources for, bottom-up interoceptive signals (allostasis).",
            },
            {
                title: "Affective Neuroscience",
                description:
                    "Panksepp's evolutionary neurobiological framework that identifies deep, subcortical emotional operating systems (e.g., SEEKING, FEAR, RAGE, PLAY). These act as unconditioned foundational priors that drive mammalian behavior before higher-order cognitive regulation occurs.",
            },
            {
                title: "Temperament and Character Inventory",
                description:
                    "Cloninger's biopsychosocial model separating personality into basic biological temperaments (like Novelty Seeking and Harm Avoidance) and higher-order cybernetic character dimensions (like Self-Directedness) that regulate those basic drives.",
            },
        ],
    },
}
