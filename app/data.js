/*
POTENTIAL FUTURE REVISIONS
(perhaps best left to be discussed in the future directions of the paper)

Is there a need for some kind of "social" parameter, grounded in multi-agent active inference. Humans are obligatorily gregarious; our generative models assume the availability of another Markov blanket for co-regulation.
- For instance, a Social Rank Prior — a foundational expectation about the agent's position in social dominance hierarchies, drawing on Paul Gilbert's evolutionary psychiatry and the broader literature on shame and submission. While theoretically distinct from both Coupling Bias and Tractability, it overlaps sufficiently with their interaction that its independent contribution to the observable phenotypes requires clearer empirical delimitation before warranting a dedicated node. However, a "Social Rank Prior" implies complex cultural embedding, which feels too high-level for an ultra-prior.
- Alternatively, we could consider an Expectation of Synchrony, representing the baseline expectation that other agents are available for co-regulation. High Synchrony expectation drives secure attachment and Agreeableness; low Synchrony expectation drives schizoid withdrawal or paranoid ideation, independent of general environmental Tractability. However, it might overlap with Differentiation-Dissolution. 
- One could also argue that an ultra-prior is the degree of consideration / acknowledgement of other agents. Perhaps psychopathy, machiavelism and dark triad traits could stem out of a low ultra-prior about the very existence and motivation to simulate other agents' mental states (empathy)?


Alternative Model Names:
- Core Priors Cascade Model of Personality
- Attractor Cascade Model of Personality
- Computational Cascade Model of Personality
- Predictive Cascade Model of Personality
- Deep Self Model of Personality
- Attractor Landscape Mode
- Deep-Self Predictive Cascade Model of Personality (DEPREC Model / short: Deep Model of Personality)
- Prior-Cascade Model of the Deep-Self
- ...
*/

window.CORE_SELF_MODEL = {
    overview: {
        kicker: "Overview",
        title: "The Deep-Self Predictive Cascade Model of Personality",
        text: [
            "The Deep-Self Predictive Cascade Model (Makowski, 2026; https://github.com/RealityBending/CoreSelfModel) is a theoretical generative personality framework grounded in active inference, the Free Energy Principle, and broader computational and cybernetic accounts of self-organising systems. Instead of treating personality as a flat list of traits people are endowed with, it models personality as the downstream expression of deep prior expectations and precision biases that shape how an agent interprets uncertainty, regulates action, and maintains a sense of self.",
            'In that view, observable personality patterns emerge from a hierarchy that runs from foundational assumptions about the world, through affective and operational priors, into more visible behavioural dispositions. Under this model, "personality" is conceptualized as a <i>Free Energy Landscape</i>, where foundational expectations dictate the location of stable attractor basins, and precision biases determine their depth, defining exactly how much perturbation is required to dislodge the system from its habitual state. Traits are not things we have; they are holes we fall into.',
            "This app is a simplified interactive sketch of that cascade rather than a full formal implementation of the theory.",
        ],
    },
    levelHeaders: [
        { level: 1, label: "Ultra-Priors" }, // Defining the deep-Self
        { level: 2, label: "Affective States" },
        { level: 3, label: "Precision Biases" },
        { level: 4, label: "Observables" },
    ],

    axes: {
        // L1 Imperatives (Ultra-Priors)
        epistemic: {
            id: "epistemic",
            label: "Epistemic Imperative",
            description:
                "The computational drive to resolve and manage uncertainty. This dictates how the system handles the opacity of the world, generating the fundamental baseline for epistemic foraging and anxiety.",
        },
        allostatic: {
            id: "allostatic",
            label: "Allostatic Imperative",
            description:
                "The pragmatic, metabolic drive to maintain systemic integrity and efficacy. This dictates the system's baseline expectation of its own energetic reserves and its ability to act meaningfully upon the world.",
        },
        teleological: {
            id: "teleological",
            label: "Teleological Imperative", // Alternative names: Teleological/Goal/Volitional/Affective/Motivational?
            description:
                "The goal-directed, purposive drive toward preferred states. This dictates how strongly the system is pulled forward by the anticipated value of outcomes (Reward) and the temporal depth of its planning (Horizon).",
        },

        // L3 Selves (Precision Biases)
        minimal: {
            id: "minimal",
            label: "Minimal Self",
            description:
                "Topological parameters related to the Markov blanket definition (Friston). Anchoring the boundary where the organism ends and the world begins, this level corresponds to Thomas Metzinger's 'Minimal Phenomenal Self' (MPS) and Antonio Damasio's 'Proto-Self'. Defined by interoceptive and allostatic circuitry (aligned with Anil Seth's interoceptive inference), it governs foundational somatic stability.",
        },
        agentic: {
            id: "agentic",
            label: "Agentic Self",
            description:
                "Epistemic parameters related to the uncertainty-resolution strategy. This corresponds to Metzinger's 'Epistemic Agent Model' (EAM), representing the self as a system that actively controls its knowledge-gathering. It defines the agent's cybernetic strategy for resolving expected free energy through action, exploration, or internal updating (DeYoung, Pezzulo). A candidate biological substrate is provided by prefrontal and dopaminergic policy selection.",
        },
        narrative: {
            id: "narrative",
            label: "Narrative Self",
            description:
                "The temporal (diachronic) coherence relates to how the self persists across time. Sustained by hippocampal and default-mode network binding, it manages how identity integrates experiences into a coherent autobiography, aligning directly with Dan McAdams' 'Narrative Identity' tier and Metzinger's 'Autobiographical Self-Model'. Note that the Narrative Self operates hierarchically as a higher-order structure: it requires a functioning, stable synchronic substrate (the Minimal and Agentic selves) before it can construct and maintain diachronic continuity.",
        },
    },

    nodes: [
        // ── Level 1: Ultra-Priors ─────────────────────────────────────────────
        {
            id: "volatility",
            label: "Volatility",
            title: "Volatility Expectation",
            level: 1,
            order: 1,
            value: 0.5,
            axisGroup: "epistemic",
            description:
                "Expectation about how quickly the environment's hidden rules change. Grounded in the $\\omega$ parameter of Hierarchical Gaussian Filtering (Mathys et al.), high volatility discounts past learning, increases the learning rate, and keeps the system braced for fresh prediction errors. It is the primary upstream driver of Epistemic Uncertainty (Anxiety).",
            projectsTo: [
                { target: "arousal", weight: 0.8, transform: "direct" },
                { target: "emotion_distress", weight: 0.6, transform: "direct" },
                { target: "existential_nihilism", weight: 0.7, transform: "direct" },
            ],
        },
        {
            id: "noise",
            label: "Noise",
            title: "Noise Expectation",
            level: 1,
            order: 2,
            value: 0.5,
            axisGroup: "epistemic",
            description:
                "Expectation about irreducible aleatoric uncertainty — the baseline level of ambiguity the agent expects to simply tolerate rather than resolve. Maps onto Yu and Dayan's 'expected uncertainty' channel, associated with tonic acetylcholine signalling: a high noise expectation permits ambient ambiguity without triggering drastic model updates or precision reallocations. Low noise expectations push the system toward premature epistemic closure and distress when residual variance cannot be eliminated.",
            projectsTo: [
                { target: "arousal", weight: 0.5, transform: "direct" },
                { target: "exploration", weight: 0.5, transform: "direct" },
                { target: "primal_safe", weight: 0.6, transform: "inverse" },
            ],
        },
        {
            id: "energy",
            label: "Energy",
            title: "Energy Expectation",
            level: 1,
            order: 3,
            value: 0.5,
            axisGroup: "allostatic",
            description:
                "Expectation of allostatic reserve, i.e., metabolic resource abundance versus scarcity. Grounded in Barrett's Constructed Emotion framework, this parameter dictates whether the agent expects its body-budget to operate at a surplus or a deficit. A high expectation of abundance raises the Vitality State, facilitating active behaviour, while a low expectation leaves the system perpetually braced for energetic bankruptcy.",
            projectsTo: [{ target: "vitality", weight: 0.6, transform: "direct" }],
        },
        {
            id: "tractability",
            label: "Tractability",
            title: "Tractability Expectation",
            level: 1,
            order: 4,
            value: 0.5,
            axisGroup: "allostatic",
            description:
                "Expectation that action can reliably reduce prediction error. Related to self-efficacy, perceived controllability, and Friston's expected precision of proprioceptive and control signals. High tractability supports agency, approach, and policy execution; low tractability pushes the system toward helplessness. Because ineffective actions waste energy, low tractability is a primary driver of Metabolic Threat (Depression/Burnout).",
            projectsTo: [
                { target: "vitality", weight: 0.6, transform: "direct" },
                { target: "action", weight: 0.5, transform: "direct" },
                { target: "differentiation", weight: 0.4, transform: "direct" },
                { target: "future", weight: 0.4, transform: "direct" },
                { target: "primal_safe", weight: 0.7, transform: "direct" },
                { target: "attachment_secure", weight: 0.8, transform: "direct" },
                { target: "existential_transcendence", weight: 0.6, transform: "direct" },
                { target: "attachment_avoidant", weight: 0.6, transform: "inverse" },
            ],
        },
        {
            id: "reward",
            label: "Reward",
            title: "Reward Expectation",
            level: 1,
            order: 5,
            value: 0.5,
            axisGroup: "teleological",
            description:
                "Expectation about the value of available outcomes — the agent's baseline sensitivity to reward and goal-attainment signals. Distinct from Tractability: an agent can hold a high expectation that actions are effective (high tractability) while still expecting available outcomes to be low-value, and vice versa. Maps onto dopaminergic reward-prediction circuitry and anchors the model's relationship to BAS theory and Sensation Seeking. Within the Free Energy Principle more formally, Reward Expectation corresponds to the log prior probability over preferred outcomes — the C-vector in Friston's active inference formalism. Rather than signalling experienced pleasure, it shapes the agent's policy by weighting expected free energy toward states the generative model treats as intrinsically valuable. The BAS and dopaminergic framing above is therefore not inconsistent with FEP accounts but represents the implementational register of the same computational quantity. High reward expectation amplifies both the action-perception bias (approach drive) and the exploration-exploitation bias (reward-relevant information gain).",
            projectsTo: [
                { target: "action", weight: 0.4, transform: "direct" },
                { target: "exploration", weight: 0.4, transform: "direct" },
                { target: "valence", weight: 0.6, transform: "direct" },
                { target: "primal_enticing", weight: 0.9, transform: "direct" },
                { target: "panksepp_seeking", weight: 0.5, transform: "direct" },
                { target: "emotion_excitement", weight: 0.7, transform: "direct" },
            ],
        },
        {
            id: "horizon",
            label: "Horizon",
            title: "Horizon Expectation",
            level: 1,
            order: 6,
            value: 0.5,
            axisGroup: "teleological",
            description:
                "Expectation about the depth of the agent's policy space — how far forward the generative model actively plans. Grounded in the temporal depth parameter T of active inference tree search. This parameter encodes how the agent resolves the ultimate prediction error of its own eventual dissolution. An extremely low parameter value represents Disengagement (fatalism, truncated self-model), collapsing the time horizon to avoid the free energy of a future the agent cannot control. Conversely, an extreme high value represents Transcendence, extending the Markov blanket across time through legacy, culture, or biology.",
            projectsTo: [
                { target: "future", weight: 0.6, transform: "direct" },
                { target: "vitality", weight: 0.3, transform: "direct" },
                { target: "existential_transcendence", weight: 0.9, transform: "direct" },
                { target: "existential_nihilism", weight: 0.9, transform: "inverse" },
            ],
        },

        // ── Level 2: Affective States ─────────────────────────────────────────
        // Arousal is the felt interoceptive intensity of prediction error, Vitality is the felt metabolic capacity to resolve it, and Valence is the felt trajectory of success or failure. Separates the physiological alarm (Arousal), the gas in the tank (Vitality), and the directional pull (Valence).
        {
            id: "arousal",
            label: "Arousal",
            title: "Epistemic Arousal State",
            level: 2,
            order: 1,
            value: 0,
            description:
                "The felt interoceptive consequence of unresolved, high-precision prediction errors, representing the moment-to-moment state of world-opacity. Generated downstream of Volatility and Noise, this node captures the autonomic nervous system's response to epistemic threat. Where the Vitality State represents a lack of energy, the Epistemic Arousal State represents a lack of predictive grip. It is the phenomenological experience of uncertainty - distinct from reward-driven approach arousal - often translating into anxiety. Chronic high epistemic arousal forces the system to retreat to its most reliable data stream—the body—driving hyper-vigilance (Interoception) while eroding narrative coherence.",
            projectsTo: [
                { target: "interoception", weight: 0.7, transform: "direct" },
                { target: "rigidity", weight: 0.5, transform: "inverse" },
                { target: "hitop_thought_disorder", weight: 0.6, transform: "direct" },
                { target: "panksepp_fear", weight: 0.5, transform: "direct" },
                { target: "attachment_anxious", weight: 0.6, transform: "direct" },
                { target: "emotion_distress", weight: 0.7, transform: "direct" },
                { target: "emotion_calm", weight: 0.8, transform: "inverse" },
            ],
        },
        {
            id: "vitality",
            label: "Vitality",
            title: "Vitality State",
            level: 2,
            order: 2,
            value: 0,
            description:
                "The affective readout of the body-budget, generated downstream of Energy Expectation, Tractability, and Horizon. Phenomenologically experienced as vitality, depression, or burnout. High vitality signals an energetic surplus, facilitating active behavior; low vitality (allostatic load) forces the system to conserve resources, suppressing action, social coupling, and epistemic exploration.",
            projectsTo: [
                { target: "differentiation", weight: 0.8, transform: "direct" },
                { target: "action", weight: 0.6, transform: "direct" },
                { target: "exploration", weight: 0.5, transform: "direct" },
                { target: "valence", weight: 0.4, transform: "inverse" },
                { target: "hitop_internalizing", weight: 0.7, transform: "inverse" },
                { target: "emotion_depression", weight: 0.8, transform: "inverse" },
                { target: "attachment_avoidant", weight: 0.5, transform: "inverse" },
                { target: "emotion_excitement", weight: 0.6, transform: "direct" },
            ],
        },
        {
            id: "valence",
            label: "Valence",
            title: "Valence State",
            level: 2,
            order: 3,
            value: 0,
            description:
                "The affective readout of the reward circuit, representing hedonic tone and anticipatory positive affect. Corresponds to the system's tracking of its own Free Energy derivative." +
                "High Valence State signals reward availability and positive anticipation; low Valence produces hedonic flatness or anhedonia. " +
                "Receives direct input from Reward Expectation (higher reward sensitivity → higher hedonic tone) and an inverse signal " +
                "from Vitality (energetic depletion blunts positive affect). Projects forward to amplify both the " +
                "Action-Perception Bias (approach drive) and Exploration-Exploitation Bias (reward-relevant curiosity). " +
                "This node anchors the BAS observable and provides Barrett's Constructed Emotion framework with a proper " +
                "affective-readout anchor distinct from the metabolic Vitality channel.",
            projectsTo: [
                { target: "action", weight: 0.4, transform: "direct" },
                { target: "exploration", weight: 0.5, transform: "direct" },
                { target: "emotion_calm", weight: 0.6, transform: "direct" },
                { target: "emotion_distress", weight: 0.6, transform: "inverse" },
            ],
        },

        // ── Level 3: Precision Biases ─────────────────────────────────────────
        {
            id: "interoception",
            label: "Interoception",
            title: "Interoception-Exteroception Bias",
            level: 3,
            order: 1,
            value: 0,
            axisGroup: "minimal",
            description:
                "Precision bias dictating whether the self relies more heavily on internal bodily signals or external sensory structure (formerly Sensory Anchoring). Grounded in Seth's interoceptive inference framework, high interoceptive anchoring not only amplifies Neuroticism (hyper-vigilance to somatic arousal) but also suppresses structural coupling—the body becomes the primary regulatory anchor, reducing investment in exteroceptive or social co-regulation.",
            projectsTo: [
                { target: "neuroticism", weight: 0.4, transform: "direct" },
                { target: "differentiation", weight: 0.3, transform: "inverse" },
                { target: "stability", weight: 0.4, transform: "inverse" },
                { target: "bis", weight: 0.6, transform: "direct" },
                { target: "hitop_internalizing", weight: 0.8, transform: "direct" },
                { target: "panksepp_fear", weight: 0.6, transform: "direct" },
                { target: "emotion_distress", weight: 0.5, transform: "direct" },
            ],
        },
        {
            id: "differentiation",
            label: "Differentiation",
            title: "Differentiation-Dissolution Bias",
            level: 3,
            order: 2,
            value: 0,
            axisGroup: "minimal",
            description:
                "Bias governing the structural coupling of the agent's Markov blanket to other agents and the environment. One pole favours Differentiation (autonomy, distinct boundaries); the other favours Dissolution (synchrony, intense coupling, and affiliation). It receives input from Metabolic Deficit (energy preservation forces differentiation/withdrawal) and Tractability (efficacy enables social synchrony). This creates the anxious/avoidant split: high epistemic uncertainty + high tractability produces anxious dissolution (hyper-coupling); high metabolic deficit + low tractability produces avoidant differentiation.",
            projectsTo: [
                { target: "extraversion", weight: 0.6, transform: "direct" },
                { target: "agreeableness", weight: 0.6, transform: "direct" },
                { target: "stability", weight: 0.3, transform: "direct" },
                { target: "hitop_externalizing", weight: 0.6, transform: "direct" },
                { target: "primal_alive", weight: 0.8, transform: "direct" },
                { target: "panksepp_panic", weight: 0.8, transform: "inverse" },
                { target: "attachment_anxious", weight: 0.7, transform: "direct" },
                { target: "attachment_avoidant", weight: 0.8, transform: "inverse" },
            ],
        },
        {
            id: "action",
            label: "Action",
            title: "Action-Perception Bias",
            level: 3,
            order: 3,
            value: 0,
            axisGroup: "agentic",
            description:
                "Relative precision placed on changing the world versus changing beliefs. Action-heavy styles push active environmental control and policy execution; perception-heavy styles favour internal updating and accommodation. Governed jointly by Tractability (low expected efficacy forecloses action) and Reward Expectation (high outcome value motivates approach). The inverse relationship with Openness reflects the trade-off between resolving uncertainty through action versus conceptual updating.",
            projectsTo: [
                { target: "conscientiousness", weight: 0.3, transform: "direct" },
                { target: "extraversion", weight: 0.4, transform: "direct" },
                { target: "openness", weight: 0.3, transform: "inverse" },
                { target: "plasticity", weight: 0.5, transform: "direct" },
                { target: "bis", weight: 0.4, transform: "inverse" },
                { target: "bas", weight: 0.6, transform: "direct" },
                { target: "hitop_externalizing", weight: 0.7, transform: "direct" },
                { target: "sensation_seeking", weight: 0.6, transform: "direct" },
            ],
        },
        {
            id: "exploration",
            label: "Exploration",
            title: "Exploration-Exploitation Bias",
            level: 3,
            order: 4,
            value: 0,
            axisGroup: "agentic",
            description:
                "Relative precision placed on epistemic foraging (i.e., policies that yield high information gain) vs exploiting known priors. In active inference terms, this represents the expected value of sampling uncertainty (curiosity). This foraging might unfold across two distinct trajectories: Somatic Exploration (viscerally testing the physical Markov blanket via risk or high sensory-motor engagement) and Phenomenological Exploration (testing the conceptual boundaries of the narrative self-model via transgressive art, psychedelics, or esoteric philosophy). Suppressed by high Metabolic Deficit (which makes foraging energetically costly) and elevated by both low Noise expectations and high Reward Expectation. It is the primary upstream driver of Openness to Experience, consistent with DeYoung's identification of curiosity as the core Openness facet.",
            projectsTo: [
                { target: "openness", weight: 0.6, transform: "direct" },
                { target: "plasticity", weight: 0.6, transform: "direct" },
                { target: "bas", weight: 0.4, transform: "direct" },
                { target: "sensation_seeking", weight: 0.6, transform: "direct" },
                { target: "panksepp_seeking", weight: 0.6, transform: "direct" },
            ],
        },
        {
            id: "rigidity",
            label: "Rigidity",
            title: "Rigidity-Fluidity Bias",
            level: 3,
            order: 5,
            value: 0,
            axisGroup: "narrative",
            description:
                "Relative precision assigned to autobiographical continuity and the stability of the narrative self-model. The high pole manifests as high inertia, translating into narrative rigidification (conserving identity across contexts, often defensively); the low pole allows for a fluid, easily updated narrative self, but increases the risk of identity fragmentation under stress. Although the current model treats the Arousal → Rigidity path as monotonically inverse (high uncertainty dissolves the narrative), clinical evidence suggests a U-shaped relationship is possible for some individuals who respond to high uncertainty with defensive rigidification.",
            projectsTo: [
                { target: "openness", weight: 0.4, transform: "inverse" },
                { target: "conscientiousness", weight: 0.2, transform: "direct" },
                { target: "stability", weight: 0.4, transform: "direct" },
                { target: "hitop_thought_disorder", weight: 0.7, transform: "inverse" },
                { target: "existential_nihilism", weight: 0.5, transform: "inverse" },
            ],
        },
        {
            id: "future",
            label: "Future",
            title: "Future-Present Bias",
            level: 3,
            order: 6,
            value: 0,
            axisGroup: "narrative",
            description:
                "Policy Depth Precision Bias weight allocated to long-range policy evaluation. This Temporal Discounting Bias dictates how quickly the precision of a predicted outcome degrades over time. High temporal discounting (low delay precision) results in impulsive, present-focused behavior, cleanly mapping onto Conscientiousness and Stability. The high pole of this temporal bias is future-oriented, enabling goal-directed persistence and delayed gratification; the low pole is present-focused, yielding highly reactive, short-horizon behavioral profiles. Constrained by Horizon Expectation (the prior ceiling on policy depth) and shaped by Tractability (effective action makes long-horizon planning worthwhile).",
            projectsTo: [
                { target: "rigidity", weight: 0.5, transform: "direct" },
                { target: "conscientiousness", weight: 0.5, transform: "direct" },
                { target: "stability", weight: 0.5, transform: "direct" },
            ],
        },
    ],
    observables: [
        // Big Five
        {
            id: "neuroticism",
            label: "Neuroticism",
            title: "Trait Neuroticism",
            level: 4,
            angle: -Math.PI / 2, // -90 deg (Top)
            color: "#ef4444",
            framework: "big5",
            description:
                "A stable behavioral attractor generated by chronically elevated anxiety and a bias toward interoception over exteroception. Characterized by hyper-vigilance to internal arousal and perceptual accommodation over action. The path runs entirely through the Interoception-Exteroception Bias, making somatic dysregulation the necessary mediator of trait-level anxiety.",
        },
        {
            id: "extraversion",
            label: "Extraversion",
            title: "Trait Extraversion",
            level: 4,
            angle: -Math.PI / 10, // -18 deg (Top Right)
            color: "#3b82f6",
            framework: "big5",
            description:
                "An outward-oriented behavioral attractor driven by high environmental coupling (Dissolution) and a bias toward action over perception. Characterized by high reward-seeking, assertiveness, and social synchrony. Receives converging input from both the Differentiation-Dissolution Bias and the Action-Perception Bias.",
        },
        {
            id: "openness",
            label: "Openness",
            title: "Openness to Experience",
            level: 4,
            angle: (3 * Math.PI) / 10, // 54 deg (Bottom Right)
            color: "#f59e0b",
            framework: "big5",
            description:
                "Driven by a strong bias toward epistemic foraging (Exploration) and a highly fluid Narrative Self (low Rigidity). Manifests as exploratory edge-testing and a willingness to revise the self-model without catastrophic fragmentation. The inverse path from Action-Perception Bias reflects the trade-off between resolving uncertainty through physical action versus through conceptual exploration.",
        },
        {
            id: "agreeableness",
            label: "Agreeableness",
            title: "Trait Agreeableness",
            level: 4,
            angle: (7 * Math.PI) / 10, // 126 deg (Bottom Left)
            color: "#8b5cf6",
            framework: "big5",
            description:
                "Rooted in a strong bias toward Dissolution (synchrony/coupling) and feeling secure in the environment (low metabolic deficit or epistemic uncertainty). Phenomenologically experienced as an orientation toward affiliation, trust, and structural alignment with others. The path runs entirely through the Differentiation-Dissolution Bias.",
        },
        {
            id: "conscientiousness",
            label: "Conscientiousness",
            title: "Trait Conscientiousness",
            level: 4,
            angle: (11 * Math.PI) / 10, // 198 deg (Top Left)
            color: "#10b981",
            framework: "big5",
            description:
                "Rooted in Future-Present Bias, high Rigidity Bias, and an overriding preference for Action. Phenomenologically experienced as an organised, persistent exertion of cybernetic control over the environment. Receives converging input from Future, Rigidity, and Action biases.",
        },
        // Cybernetic Big Five Theory (CB5T)
        {
            id: "plasticity",
            label: "Plasticity",
            title: "Meta-Trait Plasticity",
            level: 4,
            angle: -Math.PI / 2, // Top
            color: "#f59e0b",
            framework: "cb5t",
            description:
                "Drives exploration and engagement with novel information. Captures the shared variance of Extraversion and Openness. Phenomenologically represents a highly active system parameterized for active epistemic foraging (Exploration Bias), reward seeking, and approach behaviors.",
        },
        {
            id: "stability",
            label: "Stability",
            title: "Meta-Trait Stability",
            level: 4,
            angle: Math.PI / 2, // Bottom
            color: "#10b981",
            framework: "cb5t",
            description:
                "Functions to protect the system from disruption and maintain goal coherence. Captures the shared variance of Neuroticism (reversed), Agreeableness, and Conscientiousness. Relies on Future Bias, secure narrative Coherence, and low interoceptive threat-anchoring.",
        },
        // BIS/BAS Framework
        {
            id: "bis",
            label: "BIS",
            title: "Behavioral Inhibition System",
            level: 4,
            angle: Math.PI / 2, // Bottom
            color: "#ef4444",
            framework: "bisbas",
            description:
                "Highly sensitive to cues of punishment, ambiguity, and threat. Leads to anxiety and the halting of ongoing behavior. In the Cascade, this is driven downstream by high Interoceptive Bias (hyper-vigilance) and low Action Bias (behavioral inhibition).",
        },
        {
            id: "bas",
            label: "BAS",
            title: "Behavioral Approach System",
            level: 4,
            angle: -Math.PI / 2, // Top
            color: "#31c53d",
            framework: "bisbas",
            description:
                "Sensitive to reward and goal-attainment, driving impulsivity and approach behaviors. In the Cascade, this is strongly driven by the Action Bias (approach) and the Exploration Bias (reward-relevant information seeking).",
        },
        // HiTOP Framework
        {
            id: "hitop_internalizing",
            label: "Internalizing",
            title: "Internalizing Spectrum",
            level: 4,
            angle: -Math.PI / 2, // Top
            color: "#ef4444",
            framework: "hitop",
            description:
                "Maps onto high Vitality Load (metabolic deficit) combined with high Interoception-Exteroception Bias (somatic hyper-vigilance). This forms the core computational mechanism for the anxiety and depression phenotype cluster, prioritizing physiological alarm over external action.",
        },
        {
            id: "hitop_externalizing",
            label: "Externalizing",
            title: "Externalizing Spectrum",
            level: 4,
            angle: Math.PI / 6, // Bottom Right
            color: "#3b82f6",
            framework: "hitop",
            description:
                "Driven by high Action Bias combined with a Dissolution pole on the Differentiation axis. This produces disinhibited approach behavior and impulsivity, prioritizing rapid structural coupling and policy execution.",
        },
        {
            id: "hitop_thought_disorder",
            label: "Thought Disorder",
            title: "Thought Disorder Spectrum",
            level: 4,
            angle: (5 * Math.PI) / 6, // Bottom Left
            color: "#a855f7",
            framework: "hitop",
            description:
                "Maps to disrupted Coherence Bias under high Arousal (Epistemic Uncertainty). Narrative fragmentation serves as the primary mechanism by which chronically elevated volatility produces psychosis-spectrum presentations.",
        },

        // Sensation Seeking
        {
            id: "sensation_seeking",
            label: "Sensation Seeking",
            title: "Trait Sensation Seeking",
            level: 4,
            angle: -Math.PI / 2, // Top
            color: "#f97316",
            framework: "sensation",
            description:
                "Anchored deeply by the Reward Expectation ultra-prior, which simultaneously drives approach behavior (Action-Perception Bias) and reward-relevant information seeking (Epistemic Foraging), pushing the agent to aggressively exploit the environment.",
        },

        // Primal World Beliefs
        {
            id: "primal_enticing",
            label: "Enticing World",
            title: "Enticing World Belief",
            level: 4,
            angle: -Math.PI / 2, // Top
            color: "#eab308",
            framework: "primals",
            description:
                "Maps directly to Reward Expectation. An 'enticing' world is fundamentally perceived by the generative model as rich with highly valuable, easily accessible outcomes, drawing the agent forward.",
        },
        {
            id: "primal_alive",
            label: "Alive World",
            title: "Alive World Belief",
            level: 4,
            angle: Math.PI / 6, // Bottom Right
            color: "#ec4899",
            framework: "primals",
            description:
                "Maps to the Coupling expectation embedded in the Differentiation-Dissolution Bias. A responsive, 'alive' world is one that is expected to engage synchronously with the agent's own hidden states.",
        },
        {
            id: "primal_safe",
            label: "Safe World",
            title: "Safe World Belief",
            level: 4,
            angle: (5 * Math.PI) / 6, // Bottom Left
            color: "#10b981",
            framework: "primals",
            description:
                "Maps to Tractability combined with low expected Noise. A 'safe' world is mathematically one where the agent's actions reliably reduce uncertainty, and any residual ambiguity is easily tolerated without triggering hyper-vigilance.",
        },

        // Panksepp's Primal Emotional Systems
        {
            id: "panksepp_fear",
            label: "FEAR",
            title: "FEAR System",
            level: 4,
            angle: -Math.PI / 2, // Top
            color: "#ef4444",
            framework: "panksepp",
            description:
                "Maps directly to the Arousal State feeding the Interoception Bias. Hyperactive FEAR is the phenomenological signature of a system overwhelmed by high volatility and extreme somatic salience.",
        },
        {
            id: "panksepp_seeking",
            label: "SEEKING",
            title: "SEEKING System",
            level: 4,
            angle: Math.PI / 6, // Bottom Right
            color: "#3b82f6",
            framework: "panksepp",
            description:
                "Corresponds to the joint action of Reward Expectation and Exploration Bias. Tonic SEEKING drive is the functional equivalent of high reward sensitivity amplifying epistemic foraging across the Markov blanket.",
        },
        {
            id: "panksepp_panic",
            label: "PANIC/GRIEF",
            title: "PANIC/GRIEF System",
            level: 4,
            angle: (5 * Math.PI) / 6, // Bottom Left
            color: "#6366f1",
            framework: "panksepp",
            description:
                "Maps to the Differentiation pole. The distress of attachment loss is equivalent to an abrupt, forced shift toward the extreme differentiated end of the social coupling axis.",
        },

        // Attachment Theory
        {
            id: "attachment_secure",
            label: "Secure",
            title: "Secure Attachment",
            level: 4,
            angle: -Math.PI / 2, // Top
            color: "#10b981",
            framework: "attachment",
            description:
                "Rooted in high Tractability and an expectation of synchrony. The agent expects its Markov blanket to successfully co-regulate with others without the threat of catastrophic resource depletion or overwhelming prediction error.",
        },
        {
            id: "attachment_anxious",
            label: "Anxious-Preoccupied",
            title: "Anxious Attachment",
            level: 4,
            angle: Math.PI / 6, // Bottom Right
            color: "#f59e0b",
            framework: "attachment",
            description:
                "Driven by high Epistemic Arousal and a hyper-bias toward Dissolution. The agent experiences high uncertainty and attempts to resolve it through intense, urgent structural coupling with another agent, often overwhelming its own regulatory boundaries.",
        },
        {
            id: "attachment_avoidant",
            label: "Dismissive-Avoidant",
            title: "Avoidant Attachment",
            level: 4,
            angle: (5 * Math.PI) / 6, // Bottom Left
            color: "#3b82f6",
            framework: "attachment",
            description:
                "Driven by low Tractability and a defensive shift toward extreme Differentiation. Facing high metabolic cost or low expected synchrony, the agent withdraws, severing structural coupling to preserve internal stability and energetic reserves.",
        },

        // Constructed Emotion Core Affect
        {
            id: "emotion_excitement",
            label: "Excitement",
            title: "High Arousal / High Valence",
            level: 4,
            angle: -Math.PI / 4, // Top Right
            color: "#eab308",
            framework: "emotion",
            description:
                "The conceptualization of a body-budget surplus combined with rapid but manageable information gain. Driven by high Reward Expectation, moderate Arousal, and high Vitality.",
        },
        {
            id: "emotion_distress",
            label: "Distress",
            title: "High Arousal / Low Valence",
            level: 4,
            angle: (3 * Math.PI) / 4, // Bottom Left
            color: "#ef4444",
            framework: "emotion",
            description:
                "The conceptualization of critical predictive failure. Driven by volatile environments generating intense, unresolved Epistemic Arousal alongside plummeting Valence and shrinking Tractability.",
        },
        {
            id: "emotion_depression",
            label: "Depression",
            title: "Low Arousal / Low Valence",
            level: 4,
            angle: (5 * Math.PI) / 4, // Top Left
            color: "#64748b",
            framework: "emotion",
            description:
                "The conceptualization of severe allostatic load. The system minimizes metabolic expenditure by enforcing a deep Vitality deficit, suppressing action, and flattening affective tone to survive a perceived state of energy bankruptcy.",
        },
        {
            id: "emotion_calm",
            label: "Calm",
            title: "Low Arousal / High Valence",
            level: 4,
            angle: Math.PI / 4, // Bottom Right
            color: "#0ea5e9",
            framework: "emotion",
            description:
                "The conceptualization of optimal predictive grip. Volatility is low, the environment is tractable, and the minimal self is securely anchored without needing hyper-vigilant interoceptive monitoring.",
        },

        // Existentialism
        {
            id: "existential_transcendence",
            label: "Transcendence",
            title: "Legacy & Transcendence",
            level: 4,
            angle: -Math.PI / 2, // Top
            color: "#8b5cf6",
            framework: "existential",
            description:
                "A deep temporal horizon combined with high Tractability. The agent extends its generative model beyond the lifespan of its physical Markov blanket, seeking to resolve uncertainty through biological, cultural, or structural legacy.",
        },
        {
            id: "existential_nihilism",
            label: "Disengagement",
            title: "Nihilistic Disengagement",
            level: 4,
            angle: Math.PI / 2, // Bottom
            color: "#1e293b",
            framework: "existential",
            description:
                "A collapsed temporal horizon driven by high Volatility and low Tractability. To avoid the massive free energy of an uncontrollable future, the agent aggressively truncates its policy depth and narrative coherence.",
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
                description: `The Cybernetic Big Five Theory (CB5T), formalized by Colin G. DeYoung (2015), is a mechanistic framework that maps the Five-Factor Model onto the functional requirements of any cybernetic system. It conceptualizes personality as the typical parameters of a goal-directed, self-regulating entity navigating uncertainty and reward. DeYoung organizes the Big Five into two higher-order meta-traits, which map cleanly onto the lower-level operational biases of our model:
                <ul>
                    <li><b>Plasticity (Extraversion & Openness):</b> Drives exploration and engagement with novel information. In our model, this closely aligns with the <i>Epistemic Foraging</i> and <i>Action-Perception</i> biases, representing a system parameterized for active exploration and high expected information gain.</li>
                    <li><b>Stability (Neuroticism, Agreeableness & Conscientiousness):</b> Functions to protect the system from disruption and maintain goal coherence. This mirrors the downstream regulatory effects of deep affective priors—specifically, how high <i>Temporal Depth</i>, secure <i>Narrative Precision</i>, and safety-biased <i>Valence</i> expectations work together to shield the self-model from catastrophic fragmentation and volatile prediction errors.</li>
                </ul>`,
            },
            {
                title: "BIS/BAS",
                description: `Biopsychological personality theory, commonly known as BIS/BAS Theory (Gray, 1981), is a neuropsychological framework that anchors behavioral dispositions in distinct neurobiological systems. It shifted personality psychology toward understanding traits as the chronic sensitivities of underlying motivational circuits. In the context of our model, Gray's dual systems can be understood as the direct affective readouts generated at Level 2 (Affective Priors):
                <ul>
                    <li><b>Behavioral Inhibition System (BIS):</b> Highly sensitive to cues of punishment, ambiguity, and threat, leading to anxiety and the halting of ongoing behavior. Phenomenologically, this is the equivalent of a system parameterized by high <i>Volatility</i> and low <i>Tractability</i>, generating a chronically elevated <i>Arousal State</i> that aggressively suppresses the <i>Action-Perception</i> Bias.</li>
                    <li><b>Behavioral Approach System (BAS):</b> Sensitive to reward and goal-attainment, driving impulsivity and approach behaviors. In V3 this maps most directly onto the <i>Reward Expectation</i> ultra-prior, which amplifies both Action-Perception Bias and Epistemic Foraging — propelling the agent forward to exploit the environment and aggressively reduce expected free energy through action.</li>
                </ul>`,
            },
            {
                title: "HiTOP",
                description: `
                HiTOP (Hierarchical Taxonomy of Psychopathology; Kotov et al., 2017) is a dimensional classification system that conceptualizes mental health and psychopathology as a continuous hierarchy spanning from broad spectra to specific symptom components. It eschews categorical diagnoses in favor of empirically derived clinical phenotypes.
                    
                The current model maps cleanly onto HiTOP's principal spectra: the Internalising spectrum corresponds to high Vitality Load (metabolic deficit) combined with high Interoception-Exteroception Bias (somatic hyper-vigilance), generating the anxiety/depression phenotype cluster. The Externalising spectrum corresponds to high Action Bias combined with a Dissolution pole on the Differentiation axis, producing disinhibited approach behaviour. Thought Disorder maps to disrupted Coherence Bias under high Arousal (Epistemic Uncertainty) — the cascade predicts that narrative fragmentation is the mechanism by which elevated volatility produces psychosis-spectrum presentations.`,
            },

            {
                title: "Sensation Seeking",
                description:
                    "Sensation Seeking (Zuckerman, 1979) is a biologically based trait defined by the persistent drive for novel, varied, and intense sensory experiences, often accompanied by a willingness to take physical, social, or financial risks to attain them. This construct is anchored in the cascade via the Reward Expectation ultra-prior, which drives both approach behavior (Action-Perception Bias) and reward-relevant information seeking (Epistemic Foraging) — differentiating the sensation-seeker profile from high-tractability profiles that are effective but not necessarily reward-hungry.",
            },
            {
                title: "Primal World Beliefs",
                description: `Primal World Beliefs (Clifton et al., 2019) is a cognitive framework focusing on an individual's most fundamental assumptions about the overall nature of reality—such as whether the world is essentially safe, enticing, or alive—which cascade down to shape broader behavioral and affective dispositions.
                    
                Clifton et al.'s Primal World Beliefs are essentially operationalisations of L1 Ultra-Priors — making this framework a candidate empirical validation anchor for the cascade's foundational layer. 'Is the world safe?' maps to Tractability × inverse(Noise): a safe world is one where actions reliably reduce uncertainty and residual ambiguity is tolerable. 'Is the world enticing?' maps directly to Reward Expectation: a world perceived as rich with valuable outcomes. 'Is the world alive and responsive?' maps to the Coupling expectation embedded in the Differentiation-Dissolution Bias: a responsive world is one that engages synchronously with the agent's states. If the Primals scale can be shown to predict L1 parameter estimates derived from behavioural or physiological data, it would constitute partial empirical grounding for the model's L1 structure.`,
            },
            {
                title: "Primal Emotional Systems",
                description: `Panksepp's Affective Neuroscience evolutionary neurobiological framework identifies deep, subcortical emotional operating systems (e.g., SEEKING, FEAR, RAGE, PLAY). These Primal Emotional Systems act as unconditioned foundational priors that drive mammalian behavior before higher-order cognitive regulation occurs.
                    
                The primary Primal Emotional Systems have direct anchors in the cascade. The SEEKING system corresponds most directly to the joint action of Reward Expectation and Exploration Bias: tonic SEEKING drive is equivalent to high reward sensitivity amplifying epistemic foraging. The FEAR system maps to Arousal State (epistemic uncertainty) feeding the Interoception Bias — hyperactive FEAR is the phenomenological signature of a system with high volatility and high somatic salience. The PANIC/GRIEF system maps to the Differentiation pole of the Differentiation-Dissolution Bias: loss of attachment is equivalently an abrupt forced shift toward the differentiated end of the coupling axis.`,
            },
            {
                title: "Attachment Theory",
                description:
                    "Attachment Theory (Bowlby, 1969; Ainsworth, 1978) is an evolutionary and developmental model detailing how early interactions with caregivers internalize into working models of the self and others. These deep priors shape interpersonal affect regulation and relational expectations throughout the lifespan. The two-factor structure of attachment (anxiety × avoidance) maps onto the Differentiation-Dissolution Bias, which receives converging input from Vitality (energetic reserves for social engagement) and Tractability (belief in effective action): high Tractability + low Vitality produces anxious-preoccupied coupling; low Tractability produces avoidant withdrawal.",
            },

            {
                title: "Constructed Emotion",
                description:
                    "Barrett's framework is a predictive processing account of affect arguing that emotions are not innate, reactive circuits. Instead, they are top-down cortical predictions generated to make sense of, and allocate resources for, bottom-up interoceptive signals (allostasis).",
            },

            {
                title: "Existentialism",
                description: `This framework collects constructs related to how individuals cope with the awareness of their own mortality and seek meaning in life. By mapping these onto the Cascade, we can see how death-coping mechanisms fall out of cybernetic math:
                <ul>
                    <li><b>Legacy-Seeking (Transcendence):</b> Driven by high Tractability, deep Temporal Depth, and high Coupling. The agent builds structural, biological, or cultural extensions of themselves that outlast their physical dissolution.</li>
                    <li><b>Nihilistic Disengagement:</b> Driven by high Volatility, low Tractability, and a shallow Horizon. The agent collapses their temporal depth to avoid the profound free energy of a future they cannot control or predict.</li>
                </ul>`,
            },

            {
                title: "Temperament and Character Inventory",
                description:
                    "Cloninger's biopsychosocial model separating personality into basic biological temperaments (like Novelty Seeking and Harm Avoidance) and higher-order cybernetic character dimensions (like Self-Directedness) that regulate those basic drives.",
            },

            {
                title: "Jungian Archetypes",
                description:
                    "Rooted in Carl Jung's analytical psychology and later operationalized by figures like Carol Pearson (1986), this psychodynamic framework categorizes human behavioral patterns into universal, mythic narratives. It maps developmental journeys through distinct archetypal stages to facilitate individuation and self-awareness.",
            },

            {
                title: "REBUS",
                description:
                    "REBUS (Relaxed Beliefs Under Psychedelics; Carhart-Harris & Friston, 2019) is an active inference model offering direct pharmacological validation of ultra-priors. It proposes that psychedelics acutely relax the precision weighting (pi) of high-level prior beliefs. This temporary flattening of the landscape allows bottom-up prediction errors to revise deeply entrenched internal models.",
            },
        ],
    },
}
