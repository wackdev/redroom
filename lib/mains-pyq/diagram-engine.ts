/**
 * REDROOM Mains Blueprint & Diagram Stencil Engine
 * Provides structured multi-dimensional blueprints, PESTLE templates,
 * ASCII mindmaps, flowcharts, and Ethics case study matrices.
 */

export interface DiagramStencil {
  id: string;
  title: string;
  category: "GS-1" | "GS-2" | "GS-3" | "GS-4" | "General";
  description: string;
  stencilText: string;
}

export interface DirectiveGuide {
  directive: string;
  meaning: string;
  structureRecommendation: string;
  introStyle: string;
  conclusionStyle: string;
}

export const DIRECTIVE_GUIDELINES: Record<string, DirectiveGuide> = {
  Discuss: {
    directive: "Discuss",
    meaning: "Write about the issue in depth, exploring different perspectives, causes, impacts, and solutions.",
    structureRecommendation: "Intro (Context/Def) → 3-4 Key Dimensions → Challenges → Way Forward & Conclusion.",
    introStyle: "Define core concept or quote latest government data / international index.",
    conclusionStyle: "Pragmatic, forward-looking synthesis pointing to SDG / Vision 2047 goals.",
  },
  "Critically Examine": {
    directive: "Critically Examine",
    meaning: "Dissect both pros and cons with evidence, highlight hidden lacunae, and deliver a balanced verdict.",
    structureRecommendation: "Intro → Positive Aspects / Successes (40%) → Structural Limitations / Failures (50%) → Constructive Reforms (10%).",
    introStyle: "State the rationale behind the policy/concept and its fundamental premise.",
    conclusionStyle: "Balanced middle-path conclusion providing institutional and policy remedies.",
  },
  Evaluate: {
    directive: "Evaluate",
    meaning: "Assess the extent to which a policy or mechanism has achieved its stated objectives with quantitative/qualitative proof.",
    structureRecommendation: "Intro → Key Achievements with Data → Gaps & Implementation Bottlenecks → Policy Recommendations.",
    introStyle: "State objectives and timeline of the policy under review.",
    conclusionStyle: "Summary rating of efficacy with 2-3 high-impact reform points.",
  },
  Elucidate: {
    directive: "Elucidate",
    meaning: "Make the concept clear, explain the underlying logic, and provide illustrations or examples.",
    structureRecommendation: "Intro → Core Mechanism / Meaning → Practical Case Studies / Examples → Significance in Governance.",
    introStyle: "Clear definition elucidating the core principle directly.",
    conclusionStyle: "Highlight long-term institutional value.",
  },
  Comment: {
    directive: "Comment",
    meaning: "Express your informed opinion supported by facts, constitutional values, and authoritative reports.",
    structureRecommendation: "Intro → Affirm or nuance the premise → 3-4 arguments backed by case laws/reports → Conclusion.",
    introStyle: "Directly address the quote or statement provided.",
    conclusionStyle: "Reiterate your stand grounded in constitutional morality.",
  },
};

export const STANDARD_DIAGRAM_STENCILS: DiagramStencil[] = [
  {
    id: "pestle-matrix",
    title: "PESTLE Multi-Dimensional Analysis Matrix",
    category: "General",
    description: "Holistic 6-pillar framework covering Political, Economic, Social, Technological, Legal & Environmental dimensions.",
    stencilText: `┌─────────────────────────────────────────────────────────────┐
│                 PESTLE 360° DIMENSIONAL MATRIX              │
├──────────────────────────────┬──────────────────────────────┤
│ 🏛️ POLITICAL / GOVERNANCE     │ 💰 ECONOMIC & FISCAL         │
│ • Federal dynamics & policy  │ • Resource mobilization      │
│ • Inter-state coordination   │ • Private capital investment │
├──────────────────────────────┼──────────────────────────────┤
│ 👥 SOCIAL & INCLUSIVE        │ 🔬 TECHNOLOGICAL & DIGITAL   │
│ • Gender, vulnerable groups  │ • Digital public infrastructure
│ • Human capital & health     │ • AI / Big Data monitoring   │
├──────────────────────────────┼──────────────────────────────┤
│ ⚖️ LEGAL & REGULATORY        │ 🌱 ENVIRONMENTAL & CLIMATE   │
│ • Statutory backing & laws   │ • Climate resilience & ESG   │
│ • Enforcement & accountability│ • Circular economy footprint │
└──────────────────────────────┴──────────────────────────────┘`,
  },
  {
    id: "ethics-stakeholder-wheel",
    title: "GS-4 Ethics Case Study Stakeholder & Dilemma Matrix",
    category: "GS-4",
    description: "Structured matrix detailing Primary vs Secondary stakeholders and ethical principles at stake.",
    stencilText: `┌─────────────────────────────────────────────────────────────┐
│             ETHICS CASE STUDY RESOLUTION BLUEPRINT          │
├─────────────────────────────────────────────────────────────┤
│ 1. KEY STAKEHOLDERS:                                        │
│   • Primary: Affected Citizens, Vulnerable Groups, District Admin
│   • Secondary: State Govt, Media, Civil Society, Future Gen │
│                                                             │
│ 2. CORE ETHICAL DILEMMAS:                                   │
│   • Administrative Duty vs Human Compassion                 │
│   • Procedural Rigidity vs Substantive Justice              │
│   • Short-term Expediency vs Long-term Institutional Trust  │
│                                                             │
│ 3. OPTIONS EVALUATION MATRIX:                               │
│   [Option A]: Strict legal enforcement (High duty, low mercy)│
│   [Option B]: Complete bypass of rules (High mercy, illegal)│
│   [Option C (Recommended)]: Balanced creative administrative│
│              action with interim relief and fast-track appeal│
└─────────────────────────────────────────────────────────────┘`,
  },
  {
    id: "center-state-flowchart",
    title: "Center-State Cooperative Federalism Architecture",
    category: "GS-2",
    description: "Flowchart depicting Legislative, Administrative, and Financial coordination mechanisms.",
    stencilText: `                  UNION GOVERNMENT (Art. 245-255)
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
   [LEGISLATIVE]          [ADMINISTRATIVE]         [FINANCIAL]
 • 7th Schedule Lists   • All India Services     • Finance Comm (Art 280)
 • Inter-State Council  • Zonal Councils         • GST Council (Art 279A)
 • Art 256/257 Direct.  • NITI Aayog Governing   • Scheme Grants (Art 282)
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
                   STATE GOVERNMENTS & LOCAL BODIES
                     (Cooperative & Fiscal Synergy)`,
  },
  {
    id: "disaster-management-cycle",
    title: "Disaster Management & Sendai Framework Cycle",
    category: "GS-3",
    description: "Pre-disaster risk reduction to post-disaster Build Back Better cycle.",
    stencilText: `               [ PRE-DISASTER PHASE ]
          Early Warning (IMD/INCOIS) ──► Hazard Mapping
                     │                         │
                     ▼                         ▼
         Structural Mitigation ◄─── Preparedness & Mock Drills
                                 │
                   ⚡ DISASTER EVENT IMPACT ⚡
                                 │
                     ▼                         ▼
            Search & Rescue ────► Immediate Relief (NDRF/SDRF)
                     │                         │
               [ POST-DISASTER PHASE (Sendai BBB) ]
                     │                         │
         Post-Disaster Recovery ──► Resilient Reconstruction`,
  },
  {
    id: "separation-of-powers-checks",
    title: "Separation of Powers & Mutual Checks/Balances",
    category: "GS-2",
    description: "Tripartite constitutional balance among Legislature, Executive, and Judiciary.",
    stencilText: `         ┌────────────────── LEGISLATURE ──────────────────┐
         │ (Parliament / Assemblies - Enacts Laws & Budget)│
         └─────────────┬─────────────────────▲─────────────┘
                       │                     │
      Executive        │                     │ Judicial Review
      Accountability   │                     │ (Art 13, 32, 226)
      (No-Confidence)  ▼                     │
         ┌───────────────────┐         ┌───────────────────┐
         │     EXECUTIVE     │◄───────►│     JUDICIARY     │
         │ (PM/Council/IAS)  │ Checks  │ (SC/HC Collegium) │
         └───────────────────┘ Balance └───────────────────┘`,
  },
];

/**
 * Generates an instant structured PESTLE markdown breakdown for any topic/question.
 */
export function generatePESTLEOutline(topic: string, directive: string = "Discuss"): string {
  return `### Multi-Dimensional PESTLE Analysis for: "${topic}" (${directive})

1. **🏛️ Political & Governance Dimensions**:
   - Institutional accountability, inter-agency coordination, and executive capacity.
   - Alignment with cooperative federalism and participatory citizen governance.

2. **💰 Economic & Fiscal Dimensions**:
   - Fiscal burden, capital expenditure allocation, and return on investment.
   - Ease of doing business, formalization of employment, and market competitiveness.

3. **👥 Social & Inclusive Dimensions**:
   - Impact on marginalized communities (SC/ST, women, elderly, informal labor).
   - Human development index (HDI) drivers: education access, nutritional equity, social safety nets.

4. **🔬 Technological & Digital Dimensions**:
   - Digital public infrastructure (DPI), transparency mechanisms, and real-time monitoring.
   - Last-mile digital connectivity and bridging the digital divide.

5. **⚖️ Legal & Constitutional Dimensions**:
   - Alignment with Fundamental Rights (Part III) and Directive Principles (Part IV).
   - Statutory compliance, dispute redressal architecture, and regulatory enforcement.

6. **🌱 Environmental & Sustainability Dimensions**:
   - Climate resilience, carbon footprint, and adherence to SDG 2030 targets.
   - Sustainable natural resource utilization and ecological impact assessments.`;
}
