/*
POTENTIAL FUTURE REVISIONS

Terminological changes:
- Temporal Depth -> Temporal Bias (ALREADY CHANGED). but mention in the description what the 2 "poles" of that bias might be (e.g., present-focused vs future-oriented).
- Narrative Bias -> Coherence Bias (CHANGED). but mention in the description  what the two poles of that bias might be.
- Epistemic Foraging -> Exploration-Exploitation Bias (label: Exploration). Only proceed if Exploration-Exploitation is appropriate. But mention Epistemic foraging, Curiosity in the description.
- Action-Perception -> Action-Perception Bias (label: Action). 
- Coupling Bias -> Differentiation-Dissolution Bias (label: Differentiation). Consider Coupling and Synchrony in the description.
- Sensory Anchoring -> Interoception-Exteroception Bias (label: Interoception).

- Reserve -> Vitality Expectation? Allostatic Expectation? Metabolic Expectation? 
- Metabolic Deficit -> Metabolic Valence (label: Valence). Alternative: Vitality (Vitality State).





Add a "social" parameter. For instance, a Social Rank Prior — a foundational expectation about the agent's position in social dominance hierarchies, drawing on Paul Gilbert's evolutionary psychiatry and the broader literature on shame and submission. While theoretically distinct from both Coupling Bias and Tractability, it overlaps sufficiently with their interaction that its independent contribution to the observable phenotypes requires clearer empirical delimitation before warranting a dedicated node. Alternatively, we could consider an Expectation of Synchrony, representing the baseline expectation that other agents are available for co-regulation. High Synchrony expectation drives secure attachment and Agreeableness; low Synchrony expectation drives schizoid withdrawal or paranoid ideation, independent of general environmental Tractability.

Split the Epistemic Foraging node to differentiates where that foraging happens. Somatic Foraging: Testing the physical Markov blanket (extreme sports, somatic edge-seeking) to confirm the bodily self vs Semantic Foraging: Testing the conceptual Markov blanket (psychedelics, transgressive art, philosophy) to confirm or update the narrative self. You could split the L3 "Epistemic Foraging" into two distinct precision biases: Somatic Edge-Seeking (linked to the Bodily Self) and Semantic Edge-Seeking (linked to the Narrative Self). This perfectly explains why an adrenaline junkie and a psychedelic philosopher both score high on "Sensation Seeking" but manifest it entirely differently.

Allow for non-monotonic relationships: for instance for the Uncertainty → Narrative Precision path: the current implementation treats high uncertainty as uniformly eroding narrative coherence, but clinical and empirical evidence suggests that for some individuals, elevated uncertainty triggers defensive narrative rigidification rather than fragmentation — a U-shaped or sign-reversing relationship that the present weighted-sum computation cannot represent. Addressing this would require either a threshold term in the edge computation or a richer Bayesian parameterisation of the node update rule.

Consider renaming the model as Attractor Cascade Model.
*/

window.CORE_SELF_MODEL = {
    overview: {
        kicker: "Overview",
        title: "The Core Priors Cascade Model of Personality",
        text: [
            "The Core Priors Cascade model (Makowski, 2026; https://github.com/RealityBending/CoreSelfModel) is a theoretical generative personality framework grounded in active inference, the Free Energy Principle, and broader computational and cybernetic accounts of self-organising systems. Instead of treating personality as a flat list of traits, it models personality as the downstream expression of deeper expectations and precision biases that shape how an agent interprets uncertainty, regulates action, and maintains a sense of self.",
            'In that view, observable personality patterns emerge from a hierarchy that runs from foundational assumptions about the world, through affective and operational priors, into more visible behavioural dispositions. Under this model, "personality" is conceptualized as a <i>Free Energy Landscape</i>, where foundational expectations dictate the location of stable attractor basins, and precision biases determine their depth, defining exactly how much perturbation is required to dislodge the system from its habitual state.',
            "This app is a simplified interactive sketch of that cascade rather than a full formal implementation of the theory.",
        ],
    },
    levelHeaders: [
        { level: 1, label: "Ultra-Priors" },
        { level: 2, label: "Affective Priors" },
        { level: 3, label: "Precision Biases" },
        { level: 4, label: "Observables" },
    ],

    axes: {
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
                "Epistemic parameters related to the uncertainty-resolution strategy. This corresponds to Metzinger's 'Epistemic Agent Model' (EAM), representing the self as a system that actively controls its knowledge-gathering. Driven by prefrontal and dopaminergic policy selection, it defines the agent's cybernetic strategy for resolving expected free energy through action, exploration, or internal updating (DeYoung, Pezzulo).",
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
            description:
                "Expectation about how quickly the environment's hidden rules change. Grounded in the $\\omega$ parameter of Hierarchical Gaussian Filtering (Mathys et al.), high volatility discounts past learning, increases the learning rate, and keeps the system braced for fresh prediction errors. It is the primary upstream driver of Epistemic Uncertainty (Anxiety).",
            projectsTo: [{ target: "uncertainty", weight: 0.8, transform: "direct" }],
        },
        {
            id: "tractability",
            label: "Tractability",
            title: "Tractability Expectation",
            level: 1,
            order: 2,
            value: 0.5,
            description:
                "Expectation that action can reliably reduce prediction error (Friston's expected precision of proprioceptive and control signals). High tractability supports agency, approach, and policy execution; low tractability pushes the system toward helplessness. Because ineffective actions waste energy, low tractability is a primary driver of Metabolic Threat (Depression/Burnout).",
            projectsTo: [
                { target: "metabolic", weight: 0.6, transform: "inverse" },
                { target: "action", weight: 0.5, transform: "direct" },
                { target: "coupling", weight: 0.4, transform: "direct" },
                { target: "temporal", weight: 0.4, transform: "direct" },
            ],
        },
        {
            id: "noise",
            label: "Noise",
            title: "Noise Expectation",
            level: 1,
            order: 3,
            value: 0.5,
            description:
                "Expectation about irreducible aleatoric uncertainty — the baseline level of ambiguity the agent expects to simply tolerate rather than resolve. Maps onto Yu and Dayan's 'expected uncertainty' channel, associated with tonic acetylcholine signalling: a high noise expectation permits ambient ambiguity without triggering drastic model updates or precision reallocations. Low noise expectations push the system toward premature epistemic closure and distress when residual variance cannot be eliminated.",
            projectsTo: [
                { target: "uncertainty", weight: 0.5, transform: "direct" },
                { target: "epistemic", weight: 0.5, transform: "direct" },
            ],
        },
        {
            id: "horizon",
            label: "Horizon",
            title: "Horizon Expectation",
            level: 1,
            order: 4,
            value: 0.5,
            description:
                "Expectation about the depth of the agent's policy space — how far forward the generative model actively plans. Grounded in the temporal depth parameter T of active inference tree search. This parameter encodes how the agent resolves the ultimate prediction error of its own eventual dissolution. An extremely low parameter value represents Disengagement (fatalism, truncated self-model), collapsing the time horizon to avoid the free energy of a future the agent cannot control. Conversely, an extreme high value represents Transcendence, extending the Markov blanket across time through legacy, culture, or biology.",
            projectsTo: [
                { target: "temporal", weight: 0.6, transform: "direct" },
                { target: "metabolic", weight: 0.3, transform: "inverse" },
            ],
        },
        {
            id: "reward",
            label: "Reward",
            title: "Reward Expectation",
            level: 1,
            order: 5,
            value: 0.5,
            description:
                "Expectation about the value of available outcomes — the agent's baseline sensitivity to reward and goal-attainment signals. Distinct from Tractability: an agent can hold a high expectation that actions are effective (high tractability) while still expecting available outcomes to be low-value, and vice versa. Maps onto dopaminergic reward-prediction circuitry and anchors the model's relationship to BAS theory and Sensation Seeking. High reward expectation amplifies both the action-perception bias (approach drive) and epistemic foraging (reward-relevant information gain).",
            projectsTo: [
                { target: "action", weight: 0.4, transform: "direct" },
                { target: "epistemic", weight: 0.4, transform: "direct" },
            ],
        },
        {
            id: "reserve",
            label: "Reserve",
            title: "Metabolic Reserve Expectation",
            level: 1,
            order: 6,
            value: 0.5,
            description:
                "Expectation of allostatic reserve, i.e., metabolic resource abundance versus scarcity. Grounded in Barrett's Constructed Emotion framework, this parameter dictates whether the agent expects its body-budget to operate at a surplus or a deficit. A high expectation of abundance suppresses metabolic threat (depression/burnout), while a low expectation leaves the system perpetually braced for energetic bankruptcy.",
            projectsTo: [{ target: "metabolic", weight: 0.6, transform: "inverse" }],
        },

        // ── Level 2: Affective Priors ─────────────────────────────────────────
        {
            id: "metabolic",
            label: "Metabolic Deficit",
            title: "Metabolic Threat (Body-Budget)",
            level: 2,
            order: 1,
            value: 0,
            description:
                "The affective readout of a body-budget deficit, generated downstream of Reserve Expectation, Tractability, and Horizon. Phenomenologically experienced as depression, burnout, or low vitality. Rather than frantically trying to resolve prediction errors, high metabolic deficit mathematically forces the system to conserve energy: it dramatically suppresses approach behavior (Action-Perception), social co-regulation (Coupling), and exploration (Epistemic Foraging).",
            projectsTo: [
                { target: "coupling", weight: 0.8, transform: "inverse" },
                { target: "action", weight: 0.6, transform: "inverse" },
                { target: "epistemic", weight: 0.5, transform: "inverse" },
            ],
        },
        {
            id: "uncertainty",
            label: "Uncertainty",
            title: "Epistemic Uncertainty",
            level: 2,
            order: 2,
            value: 0,
            description:
                "The moment-to-moment felt opacity of the world, generated downstream of Volatility and Noise. Where Metabolic Deficit is a lack of energy, Epistemic Uncertainty is a lack of predictive grip. It is the phenomenological experience of anxiety. High chronic epistemic uncertainty forces the system to retreat to its most reliable data stream—the body—driving hyper-vigilance (Sensory Anchoring) while simultaneously eroding narrative self-coherence.",
            projectsTo: [
                { target: "sensory", weight: 0.7, transform: "direct" },
                { target: "coherence", weight: 0.5, transform: "inverse" },
            ],
        },

        // ── Level 3: Precision Biases ─────────────────────────────────────────
        {
            id: "sensory",
            label: "Sensory Anchoring",
            title: "Sensory-Anchoring Bias",
            level: 3,
            order: 1,
            value: 0,
            axisGroup: "minimal",
            description:
                "Precision bias for where reality is grounded: internal bodily signals or external sensory structure. It defines whether the self is stabilised more by interoception or exteroception. Grounded in Seth's interoceptive inference framework, high interoceptive anchoring not only amplifies Neuroticism (hyper-vigilance to somatic arousal) but also suppresses external Coupling — the body becomes the primary regulatory anchor, reducing investment in social co-regulation.",
            projectsTo: [
                { target: "neuro", weight: 0.4, transform: "direct" },
                { target: "coupling", weight: 0.3, transform: "inverse" },
                { target: "stability", weight: 0.4, transform: "inverse" },
                { target: "bis", weight: 0.6, transform: "direct" },
            ],
        },
        {
            id: "coupling",
            label: "Coupling Bias",
            title: "Coupling Bias",
            level: 3,
            order: 2,
            value: 0,
            axisGroup: "minimal",
            description:
                "Bias governing how tightly the self should couple to other people and the wider environment. One pole favours differentiation and autonomy; the other favours synchrony, affiliation, and dissolution into external structure. Receives input from Metabolic Deficit (energy preservation drives uncoupling), Tractability (effective action enables social co-regulation), and Sensory Anchoring (interoceptive grounding reduces external coupling). This three-way input structure generates the anxious/avoidant split: high epistemic uncertainty + high tractability produces anxious high-coupling; high metabolic deficit + low tractability produces avoidant withdrawal.",
            projectsTo: [
                { target: "ext", weight: 0.6, transform: "direct" },
                { target: "agree", weight: 0.6, transform: "direct" },
                { target: "stability", weight: 0.3, transform: "direct" },
            ],
        },
        {
            id: "action",
            label: "Action-Perception",
            title: "Action-Perception Bias",
            level: 3,
            order: 3,
            value: 0,
            axisGroup: "agentic",
            description:
                "Relative precision placed on changing the world versus changing beliefs. Action-heavy styles push active environmental control; perception-heavy styles favour internal updating and accommodation. Governed jointly by Tractability (low expected efficacy forecloses action) and Reward Expectation (high outcome value motivates approach). The inverse relationship with Openness reflects the trade-off between resolving uncertainty through action versus through conceptual exploration.",
            projectsTo: [
                { target: "cons", weight: 0.3, transform: "direct" },
                { target: "ext", weight: 0.4, transform: "direct" },
                { target: "open", weight: 0.3, transform: "inverse" },
                { target: "plasticity", weight: 0.5, transform: "direct" },
                { target: "bis", weight: 0.4, transform: "inverse" },
                { target: "bas", weight: 0.6, transform: "direct" },
            ],
        },
        {
            id: "epistemic",
            label: "Epistemic Foraging",
            title: "Epistemic-Gain Expectation",
            level: 3,
            order: 4,
            value: 0,
            axisGroup: "agentic",
            description:
                "Expected value of sampling uncertainty — the drive to seek out information that resolves ambiguity. Maps directly onto Friston et al.'s epistemic value / information gain construct (2015). Suppressed by high Metabolic Deficit (energy preservation makes exploration costly) and elevated by both low Noise expectations (ambient ambiguity is worth resolving) and high Reward Expectation (information gain is itself rewarding). The primary upstream driver of Openness to Experience, consistent with DeYoung's identification of curiosity as the core Openness facet.",
            projectsTo: [
                { target: "open", weight: 0.6, transform: "direct" },
                { target: "plasticity", weight: 0.6, transform: "direct" },
                { target: "bas", weight: 0.4, transform: "direct" },
            ],
        },
        {
            id: "coherence",
            label: "Coherence",
            title: "Coherence Bias",
            level: 3,
            order: 5,
            value: 0,
            axisGroup: "narrative",
            description:
                "The precision assigned to autobiographical continuity and the narrative self-model. Higher values stabilize identity across contexts; lower values allow fluid updating but increase fragmentation risk under stress. Rooted in Metzinger's narrative self-model, this bias dictates how aggressively the system works to maintain diachronic coherence. Note: the current implementation treats the Uncertainty → Coherence Bias path as monotonically inverse, but clinical evidence suggests a U-shaped relationship is possible for some individuals who respond to high uncertainty with defensive narrative rigidification.",
            projectsTo: [
                { target: "open", weight: 0.4, transform: "inverse" },
                { target: "cons", weight: 0.2, transform: "direct" },
                { target: "stability", weight: 0.4, transform: "direct" },
            ],
        },
        {
            id: "temporal",
            label: "Temporal",
            title: "Temporal Bias",
            level: 3,
            order: 6,
            value: 0,
            axisGroup: "narrative",
            description:
                "Precision weight allocated to long-range policy evaluation—representing the functional temporal depth of planning the agent actually deploys. Constrained by Horizon Expectation (the prior ceiling on policy depth) and shaped by Tractability (effective action makes long-horizon planning worthwhile). High temporal bias supports goal-directed persistence and narrative coherence; low temporal bias produces present-focused, reactive behavioral profiles.",
            projectsTo: [
                { target: "coherence", weight: 0.5, transform: "direct" },
                { target: "cons", weight: 0.5, transform: "direct" },
                { target: "stability", weight: 0.5, transform: "direct" },
            ],
        },
    ],
    observables: [
        // Big Five
        {
            id: "neuro",
            label: "Neuroticism",
            title: "Trait Neuroticism",
            level: 4,
            angle: -Math.PI / 2, // -90 deg (Top)
            color: "#ef4444",
            framework: "big5",
            description:
                "A stable behavioral attractor generated by chronically elevated epistemic uncertainty (anxiety) and interoceptive anchoring. Characterized by hyper-vigilance to internal arousal and perceptual accommodation over action. The path runs entirely through Sensory Anchoring, making interoceptive dysregulation the necessary mediator of trait-level anxiety.",
        },
        {
            id: "ext",
            label: "Extraversion",
            title: "Trait Extraversion",
            level: 4,
            angle: -Math.PI / 10, // -18 deg (Top Right)
            color: "#3b82f6",
            framework: "big5",
            description:
                "An outward-oriented behavioral attractor driven by high environmental coupling and a bias toward action over perception. Characterized by high reward-seeking, assertiveness, and social synchrony. Receives input from both Coupling Bias and Action-Perception Bias, reflecting both the social and the approach-motivation dimensions of the trait.",
        },
        {
            id: "open",
            label: "Openness",
            title: "Openness to Experience",
            level: 4,
            angle: (3 * Math.PI) / 10, // 54 deg (Bottom Right)
            color: "#f59e0b",
            framework: "big5",
            description:
                "Driven by high epistemic-gain expectations and highly fluid narrative precision. Manifests as exploratory edge-testing and willingness to revise the self-model without catastrophic fragmentation. The inverse path from Action-Perception Bias reflects the trade-off between resolving uncertainty through action versus through conceptual exploration.",
        },
        {
            id: "agree",
            label: "Agreeableness",
            title: "Trait Agreeableness",
            level: 4,
            angle: (7 * Math.PI) / 10, // 126 deg (Bottom Left)
            color: "#8b5cf6",
            framework: "big5",
            description:
                "Rooted in strong coupling biases and feeling secure in the environment (low metabolic deficit or epistemic uncertainty). Phenomenologically experienced as an orientation toward affiliation, trust, and structural alignment with others. The path runs through Coupling Bias, making the social-regulatory layer the necessary mediator.",
        },
        {
            id: "cons",
            label: "Conscientiousness",
            title: "Trait Conscientiousness",
            level: 4,
            angle: (11 * Math.PI) / 10, // 198 deg (Top Left)
            color: "#10b981",
            framework: "big5",
            description:
                "Rooted in deep temporal depth, rigid self-coherence, and a perception-overriding bias toward action. Phenomenologically experienced as an organised, persistent exertion of cybernetic control over the environment. Receives converging input from Temporal Depth, Narrative Precision, and Action-Perception Bias.",
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
                "Drives exploration and engagement with novel information. Captures the shared variance of Extraversion and Openness. Phenomenologically represents a highly active system parameterized for active epistemic foraging, reward seeking, and approach behaviors.",
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
                "Functions to protect the system from disruption and maintain goal coherence. Captures the shared variance of Neuroticism (reversed), Agreeableness, and Conscientiousness. Relies on deep temporal depth, secure narrative precision, and low sensory/threat anchoring.",
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
                "Highly sensitive to cues of punishment, ambiguity, and threat. Leads to anxiety and the halting of ongoing behavior. In the Cascade, this is driven downstream by high Sensory Anchoring (hyper-vigilance) and low Action-Perception bias (behavioral inhibition).",
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
                "Sensitive to reward and goal-attainment, driving impulsivity and approach behaviors. In the Cascade, this is strongly driven by the Action-Perception bias (approach) and Epistemic Foraging (reward-relevant information seeking).",
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
                    <li><b>Stability (Neuroticism, Agreeableness & Conscientiousness):</b> Functions to protect the system from disruption and maintain goal coherence. This mirrors the downstream regulatory effects of deep affective priors—specifically, how high <i>Temporal Depth</i>, secure <i>Narrative Precision</i>, and safety-biased <i>Valence</i> expectations work together to shield the self-model from catastrophic fragmentation and volatile prediction errors.</li>
                </ul>`,
            },
            {
                title: "BIS/BAS",
                description: `Biopsychological personality theory, commonly known as BIS/BAS Theory (Gray, 1981), is a neuropsychological framework that anchors behavioral dispositions in distinct neurobiological systems. It shifted personality psychology toward understanding traits as the chronic sensitivities of underlying motivational circuits. In the context of the Core Priors Cascade, Gray's dual systems can be understood as the direct affective readouts generated at Level 2 (Affective Priors):
                <ul>
                    <li><b>Behavioral Inhibition System (BIS):</b> Highly sensitive to cues of punishment, ambiguity, and threat, leading to anxiety and the halting of ongoing behavior. Phenomenologically, this is the equivalent of a system parameterized by high <i>Volatility</i> and low <i>Tractability</i>, generating an elevated state of <i>Uncertainty</i> and a chronic threat-biased <i>Valence</i> that aggressively halts active inference.</li>
                    <li><b>Behavioral Approach System (BAS):</b> Sensitive to reward and goal-attainment, driving impulsivity and approach behaviors. In V3 this maps most directly onto the <i>Reward Expectation</i> ultra-prior, which amplifies both Action-Perception Bias and Epistemic Foraging — propelling the agent forward to exploit the environment and aggressively reduce expected free energy through action.</li>
                </ul>`,
            },
            {
                title: "HiTOP",
                description:
                    "HiTOP (Hierarchical Taxonomy of Psychopathology; Kotov et al., 2017) is a dimensional classification system that conceptualizes mental health and psychopathology as a continuous hierarchy spanning from broad spectra to specific symptom components. It eschews categorical diagnoses in favor of empirically derived clinical phenotypes.",
            },
            {
                title: "Attachment Theory",
                description:
                    "Attachment Theory (Bowlby, 1969; Ainsworth, 1978) is an evolutionary and developmental model detailing how early interactions with caregivers internalize into working models of the self and others. These deep priors shape interpersonal affect regulation and relational expectations throughout the lifespan. In V3, the two-factor structure of attachment (anxiety × avoidance) is now partially captured by the Coupling Bias node, which receives input from both Valence (threat sensitivity) and Tractability (belief in effective action): high threat + high tractability produces anxious attachment; high threat + low tractability produces avoidant withdrawal.",
            },
            {
                title: "Sensation Seeking",
                description:
                    "Sensation Seeking (Zuckerman, 1979) is a biologically based trait defined by the persistent drive for novel, varied, and intense sensory experiences, often accompanied by a willingness to take physical, social, or financial risks to attain them. In V3, this construct is now directly anchored in the cascade via the Reward Expectation ultra-prior, which drives both approach behavior (Action-Perception Bias) and reward-relevant information seeking (Epistemic Foraging) — differentiating the sensation-seeker profile from high-tractability profiles that are effective but not necessarily reward-hungry.",
            },
            {
                title: "Jungian Archetypes",
                description:
                    "Rooted in Carl Jung's analytical psychology and later operationalized by figures like Carol Pearson (1986), this psychodynamic framework categorizes human behavioral patterns into universal, mythic narratives. It maps developmental journeys through distinct archetypal stages to facilitate individuation and self-awareness.",
            },
            {
                title: "REBUS",
                description:
                    "REBUS (Relaxed Beliefs Under Psychedelics; Carhart-Harris & Friston, 2019) is an active inference model offering direct pharmacological validation of ultra-priors. It proposes that psychedelics acutely relax the precision weighting ($\\pi$) of high-level prior beliefs. This temporary flattening of the landscape allows bottom-up prediction errors to revise deeply entrenched internal models.",
            },
            {
                title: "Primal World Beliefs",
                description:
                    "Primal World Beliefs (Clifton et al., 2019) is a cognitive framework focusing on an individual's most fundamental assumptions about the overall nature of reality—such as whether the world is essentially safe, enticing, or alive—which cascade down to shape broader behavioral and affective dispositions.",
            },
            {
                title: "Constructed Emotion",
                description:
                    "Barrett's framework is a predictive processing account of affect arguing that emotions are not innate, reactive circuits. Instead, they are top-down cortical predictions generated to make sense of, and allocate resources for, bottom-up interoceptive signals (allostasis). A future revision of the CPC model may decompose the current Valence node into a metabolic (body-budget) and an epistemic (prediction error) channel to better reflect Barrett's account — this is noted as a deferred architectural change.",
            },
            {
                title: "Primal Emotional Systems",
                description:
                    "Panksepp's Affective Neuroscience evolutionary neurobiological framework identifies deep, subcortical emotional operating systems (e.g., SEEKING, FEAR, RAGE, PLAY). These Primal Emotional Systems act as unconditioned foundational priors that drive mammalian behavior before higher-order cognitive regulation occurs.",
            },
            {
                title: "Temperament and Character Inventory",
                description:
                    "Cloninger's biopsychosocial model separating personality into basic biological temperaments (like Novelty Seeking and Harm Avoidance) and higher-order cybernetic character dimensions (like Self-Directedness) that regulate those basic drives.",
            },
            {
                title: "Existentialism",
                description: `This framework collects constructs related to how individuals cope with the awareness of their own mortality and seek meaning in life. By mapping these onto the Cascade, we can see how death-coping mechanisms fall out of cybernetic math:
                <ul>
                    <li><b>Legacy-Seeking (Transcendence):</b> Driven by high Tractability, deep Temporal Depth, and high Coupling. The agent builds structural, biological, or cultural extensions of themselves that outlast their physical dissolution.</li>
                    <li><b>Nihilistic Disengagement:</b> Driven by high Volatility, low Tractability, and a shallow Horizon. The agent collapses their temporal depth to avoid the profound free energy of a future they cannot control or predict.</li>
                </ul>`,
            },
        ],
    },
}
