/*
POTENTIAL FUTURE REVISIONS

Three constructs identified could potentially be added but need to be carefully considered to favour parsimony.

The first is a Social Rank Prior — a foundational expectation about the agent's position in
social dominance hierarchies, drawing on Paul Gilbert's evolutionary psychiatry and the broader
literature on shame and submission. While theoretically distinct from both Coupling Bias and
Tractability, it overlaps sufficiently with their interaction that its independent contribution
to the observable phenotypes requires clearer empirical delimitation before warranting a
dedicated node.

The second is Allostatic Reserve, grounded in Barrett's Constructed Emotion framework, which
would reframe the L2 Valence node as a body-budget prediction rather than a purely epistemic
free-energy summary. Incorporating this would require splitting L2 into a metabolic and an
epistemic channel — a substantive architectural revision best treated as a parallel development.

The third is the non-monotonic structure of the Uncertainty → Narrative Precision path: the
current implementation treats high uncertainty as uniformly eroding narrative coherence, but
clinical and empirical evidence suggests that for some individuals, elevated uncertainty triggers
defensive narrative rigidification rather than fragmentation — a U-shaped or sign-reversing
relationship that the present weighted-sum computation cannot represent. Addressing this would
require either a threshold term in the edge computation or a richer Bayesian parameterisation
of the node update rule.

Another potential issue: The Overloaded Valence Node: Because there is no "Allostatic Reserve" node, the Valence node is currently doing double-duty. It represents both epistemic free energy (prediction error) and metabolic free energy (body-budget deficit). Until these are split, the model will struggle to differentiate between anxiety (epistemic threat) and depression/burnout (metabolic bankruptcy).
*/

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
        // ── Level 1: Ultra-Priors ─────────────────────────────────────────────
        {
            id: "volatility",
            label: "Volatility",
            title: "Volatility Expectation",
            level: 1,
            order: 1,
            value: 0.5,
            description:
                "Baseline expectation about how quickly the environment's hidden rules change. Grounded in the $\\omega$ parameter of Hierarchical Gaussian Filtering (Mathys et al.), high volatility discounts past learning, increases the learning rate, and keeps the system braced for fresh prediction errors.",
            projectsTo: [
                { target: "valence", weight: 0.6, transform: "direct" },
                { target: "uncertainty", weight: 0.5, transform: "direct" },
            ],
        },
        {
            id: "tractability",
            label: "Tractability",
            title: "Tractability Expectation",
            level: 1,
            order: 2,
            value: 0.5,
            description:
                "Expectation that action can reliably reduce prediction error (Friston's expected precision of proprioceptive and control signals). High tractability supports agency, approach, and policy execution; low tractability pushes the system toward helplessness, perceptual accommodation, and inhibition.",
            projectsTo: [
                { target: "valence", weight: 0.6, transform: "inverse" },
                { target: "action", weight: 0.5, transform: "direct" },
                { target: "coupling", weight: 0.4, transform: "direct" },
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
                "Prior expectation about irreducible aleatoric uncertainty — the baseline level of ambiguity the agent expects to simply tolerate rather than resolve. Maps onto Yu and Dayan's 'expected uncertainty' channel, associated with tonic acetylcholine signalling: a high noise expectation permits ambient ambiguity without triggering drastic model updates or precision reallocations. Low noise expectations push the system toward premature epistemic closure and distress when residual variance cannot be eliminated.",
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
                "Prior expectation about the depth of the agent's policy space — how far forward the generative model actively plans. Grounded in the temporal depth parameter T of active inference tree search. A shallow horizon expectation forecloses long-range policy evaluation and elevates expected free energy; existential phenomena such as mortality salience and meaning-making are downstream consequences of this parameter, not constitutive of it.",
            projectsTo: [
                { target: "temporal", weight: 0.6, transform: "direct" },
                { target: "valence", weight: 0.3, transform: "inverse" },
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
                "Prior expectation about the value of available outcomes — the agent's baseline sensitivity to reward and goal-attainment signals. Distinct from Tractability: an agent can hold a high expectation that actions are effective (high tractability) while still expecting available outcomes to be low-value, and vice versa. Maps onto dopaminergic reward-prediction circuitry and anchors the model's relationship to BAS theory and Sensation Seeking. High reward expectation amplifies both the action-perception bias (approach drive) and epistemic foraging (reward-relevant information gain).",
            projectsTo: [
                { target: "action", weight: 0.4, transform: "direct" },
                { target: "epistemic", weight: 0.4, transform: "direct" },
            ],
        },

        // ── Level 2: Affective Priors ─────────────────────────────────────────
        {
            id: "valence",
            label: "Valence",
            title: "Valence / Free Energy Expectation",
            level: 2,
            order: 1,
            value: 0,
            description:
                "Affective readout of baseline expected free energy. It is the felt sense of safety versus chronic threat generated downstream of Volatility and Tractability. High valence (threat-biased) drives interoceptive anchoring, suppresses external coupling, and forecloses both active inference and epistemic foraging. The direct paths to Neuroticism and Agreeableness that appeared in earlier model versions have been removed: those phenotypic effects are now carried entirely by the indirect routes through Sensory Anchoring and Coupling Bias, making the Level 3 layer the necessary mediator.",
            projectsTo: [
                { target: "sensory", weight: 0.7, transform: "direct" },
                { target: "coupling", weight: 0.8, transform: "inverse" },
                { target: "action", weight: 0.5, transform: "inverse" },
                { target: "epistemic", weight: 0.5, transform: "inverse" },
            ],
        },
        {
            id: "uncertainty",
            label: "Uncertainty",
            title: "Uncertainty / Ambiguity Expectation",
            level: 2,
            order: 2,
            value: 0,
            description:
                "The moment-to-moment felt opacity of the world, generated downstream of both Volatility and Noise. Where Noise (L1) sets the prior baseline for tolerable ambiguity, Uncertainty is its affective realisation: the phenomenological experience of not knowing what is happening right now. Corresponds to tonic acetylcholine-mediated expected uncertainty in the Yu and Dayan neuromodulatory framework. High chronic uncertainty erodes narrative self-coherence and biases the system toward interoceptive over exteroceptive anchoring.",
            projectsTo: [
                { target: "sensory", weight: 0.3, transform: "direct" },
                { target: "narrative", weight: 0.5, transform: "inverse" },
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
            description:
                "Precision bias for where reality is grounded: internal bodily signals or external sensory structure. It defines whether the self is stabilised more by interoception or exteroception. Grounded in Seth's interoceptive inference framework, high interoceptive anchoring not only amplifies Neuroticism (hyper-vigilance to somatic arousal) but also suppresses external Coupling — the body becomes the primary regulatory anchor, reducing investment in social co-regulation.",
            projectsTo: [
                { target: "neuro", weight: 0.4, transform: "direct" },
                { target: "coupling", weight: 0.3, transform: "inverse" },
            ],
        },
        {
            id: "coupling",
            label: "Coupling Bias",
            title: "Coupling Bias",
            level: 3,
            order: 2,
            value: 0,
            description:
                "Bias governing how tightly the self should couple to other people and the wider environment. One pole favours differentiation and autonomy; the other favours synchrony, affiliation, and dissolution into external structure. Receives input from Valence (threat drives uncoupling), Tractability (effective action enables social co-regulation), and Sensory Anchoring (interoceptive grounding reduces external coupling). This three-way input structure generates the anxious/avoidant split: high threat + high tractability produces anxious high-coupling; high threat + low tractability produces avoidant withdrawal.",
            projectsTo: [
                { target: "ext", weight: 0.6, transform: "direct" },
                { target: "agree", weight: 0.6, transform: "direct" },
            ],
        },
        {
            id: "action",
            label: "Action-Perception",
            title: "Action-Perception Bias",
            level: 3,
            order: 3,
            value: 0,
            description:
                "Relative precision placed on changing the world versus changing beliefs. Action-heavy styles push active environmental control; perception-heavy styles favour internal updating and accommodation. Governed jointly by Tractability (low expected efficacy forecloses action) and Reward Expectation (high outcome value motivates approach). The inverse relationship with Openness reflects the trade-off between resolving uncertainty through action versus through conceptual exploration.",
            projectsTo: [
                { target: "cons", weight: 0.3, transform: "direct" },
                { target: "ext", weight: 0.4, transform: "direct" },
                { target: "open", weight: 0.3, transform: "inverse" },
            ],
        },
        {
            id: "epistemic",
            label: "Epistemic Foraging",
            title: "Epistemic-Gain Expectation",
            level: 3,
            order: 4,
            value: 0,
            description:
                "Expected value of sampling uncertainty — the drive to seek out information that resolves ambiguity. Maps directly onto Friston et al.'s epistemic value / information gain construct (2015). Suppressed by high Valence (threat makes exploration costly) and elevated by both low Noise expectations (ambient ambiguity is worth resolving) and high Reward Expectation (information gain is itself rewarding). The primary upstream driver of Openness to Experience, consistent with DeYoung's identification of curiosity as the core Openness facet.",
            projectsTo: [{ target: "open", weight: 0.6, transform: "direct" }],
        },
        {
            id: "narrative",
            label: "Narrative Precision",
            title: "Narrative Precision / Self-Coherence",
            level: 3,
            order: 5,
            value: 0,
            description:
                "Precision assigned to autobiographical continuity and the narrative self. Higher values stabilise identity across contexts; lower values allow fluid updating but increase fragmentation risk under stress. Rooted in Metzinger's narrative self-model and McAdams' identity work. Note: the current implementation treats the Uncertainty → Narrative Precision path as monotonically inverse, but clinical evidence suggests a U-shaped relationship is possible — some individuals respond to high uncertainty with defensive narrative rigidification rather than fragmentation. This non-monotonicity is a known simplification deferred to a future revision.",
            projectsTo: [
                { target: "open", weight: 0.4, transform: "inverse" },
                { target: "cons", weight: 0.2, transform: "direct" },
            ],
        },
        {
            id: "temporal",
            label: "Temporal Depth",
            title: "Temporal Depth Bias",
            level: 3,
            order: 6,
            value: 0,
            description:
                "Precision weight allocated to long-range policy evaluation — the functional depth of planning the agent actually deploys. Moved from Level 2 in V3 because it functions as a precision allocation (an operational bias) rather than an affective prior per se. Constrained by Horizon Expectation (the prior ceiling on policy depth) and shaped by Tractability (effective action makes long-horizon planning worthwhile). High temporal depth supports narrative coherence and goal-directed persistence; low temporal depth produces present-focused, reactive behavioural profiles.",
            projectsTo: [
                { target: "narrative", weight: 0.5, transform: "direct" },
                { target: "cons", weight: 0.5, transform: "direct" },
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
                "A stable behavioral attractor generated by chronically elevated valence expectations (threat) and interoceptive anchoring. Characterized by hyper-vigilance to internal arousal and perceptual accommodation over action. In V3, Valence no longer projects directly to Neuroticism — the path runs entirely through Sensory Anchoring, making interoceptive dysregulation the necessary mediator of trait-level anxiety.",
        },
        {
            id: "ext",
            label: "Extraversion",
            title: "Trait Extraversion",
            level: 4,
            angle: -Math.PI / 10, // -18 deg (Top Right)
            color: "#3b82f6",
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
            description:
                "Rooted in strong coupling biases and feeling secure in the environment (low threat expectations). Phenomenologically experienced as an orientation toward affiliation, trust, and structural alignment with others. In V3, Valence no longer projects directly to Agreeableness — the path runs through Coupling Bias, making the social-regulatory layer the necessary mediator.",
        },
        {
            id: "cons",
            label: "Conscientiousness",
            title: "Trait Conscientiousness",
            level: 4,
            angle: (11 * Math.PI) / 10, // 198 deg (Top Left)
            color: "#10b981",
            description:
                "Rooted in deep temporal depth, rigid self-coherence, and a perception-overriding bias toward action. Phenomenologically experienced as an organised, persistent exertion of cybernetic control over the environment. Receives converging input from Temporal Depth, Narrative Precision, and Action-Perception Bias.",
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
