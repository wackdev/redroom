/**
 * WHYNOTUPSC — POLITY GOLD STANDARD SERIES SEMANTIC CHUNKS
 * Extracted and structured knowledge atoms with exact page ranges and entities.
 */

import { SourceChunk } from "../types";

export const POLITY_SOURCE_CHUNKS: SourceChunk[] = [
  // CHUNK 1: Regulating Act 1773
  {
    id: "chunk-issf-polity-p15-p18",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "historical-underpinnings-company-rule",
    topicName: "Historical Underpinnings & Company Rule (1773–1858)",
    pageStart: 15,
    pageEnd: 18,
    heading: "The Regulating Act of 1773: Origins, Background & Key Provisions",
    subheading: "Genesis of Parliamentary Control over East India Company",
    chunkType: "constitutional_provision",
    rawContent:
      "The Regulating Act of 1773 holds immense constitutional importance as it was the first direct intervention by the British Parliament in the affairs of the East India Company in India. It marked the beginning of parliamentary control and centralization...",
    cleanedContent:
      "The Regulating Act of 1773 was the first direct intervention by the British Parliament in EIC affairs. Background: 1) EIC financial crisis (£1M loan request in 1772), 2) Rampant corruption among Nabobs, 3) Failure of Dual Government in Bengal (1765-1772) separating power (Company) from accountability (Nawab), and 4) Great Bengal Famine of 1770.\n\nKey Provisions:\n1) Elevated Governor of Bengal to Governor-General of Bengal (Lord Warren Hastings as first).\n2) Created 4-member Executive Council deciding by majority.\n3) Subordinated Bombay and Madras Governors in war, diplomacy, and revenue.\n4) Established 1774 Supreme Court at Calcutta (1 Chief Justice + 3 Judges; Sir Elijah Impey as first CJ).\n5) Prohibited private trade and bribes.\n\nDefects: Powerless Governor-General with no veto power; jurisdictional ambiguity between Supreme Court and Governor-General's Council (e.g. Trial of Nandakumar).",
    searchableContent:
      "Regulating Act of 1773 East India Company Lord Warren Hastings Governor-General of Bengal Supreme Court at Calcutta 1774 Sir Elijah Impey Trial of Nandakumar Dual Government Bengal Famine 1770",
    keywords: [
      "regulating act 1773",
      "warren hastings",
      "supreme court calcutta",
      "elijah impey",
      "dual government",
      "nandakumar",
    ],
    entities: {
      cases: ["Trial of Nandakumar (1775)"],
      dates: ["1773", "1774", "1770", "1765"],
    },
    ocrConfidence: 1.0,
    sourcePosition: 1,
  },

  // CHUNK 2: Pitt's India Act 1784
  {
    id: "chunk-issf-polity-p19-p22",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "historical-underpinnings-company-rule",
    topicName: "Historical Underpinnings & Company Rule (1773–1858)",
    pageStart: 19,
    pageEnd: 22,
    heading: "Pitt's India Act of 1784: Dual Control & British Possessions",
    subheading: "Demarcation of Commercial and Political Functions",
    chunkType: "constitutional_provision",
    rawContent:
      "Passed by the British Parliament to rectify the serious defects of the Regulating Act of 1773, the Pitt's India Act of 1784 marked a pivotal moment in the evolution of British control over India...",
    cleanedContent:
      "Named after British Prime Minister William Pitt the Younger, the 1784 Act established a system of 'double government' or 'dual control'.\n\nKey Provisions:\n1) Board of Control: 6 Commissioners in London (including Chancellor of Exchequer & Secretary of State) supervising civil, military, and revenue affairs (Crown authority).\n2) Court of Directors: Managed commercial trade and company appointments with Crown approval.\n3) Reduced Governor-General's Council from 4 to 3 members, giving Governor-General casting vote and decisive control.\n4) First time Company territories were officially designated as 'British possessions in India'.\n\nSignificance: Clarified separation of political and commercial spheres, lasting until 1858.",
    searchableContent:
      "Pitt's India Act 1784 Board of Control Court of Directors dual control double government British possessions in India Governor-General council reduced to 3",
    keywords: [
      "pitts india act 1784",
      "board of control",
      "court of directors",
      "double government",
      "british possessions in india",
    ],
    entities: {
      dates: ["1784", "1858"],
    },
    ocrConfidence: 1.0,
    sourcePosition: 2,
  },

  // CHUNK 3: Charter Acts 1793–1853
  {
    id: "chunk-issf-polity-p23-p28",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "historical-underpinnings-company-rule",
    topicName: "Historical Underpinnings & Company Rule (1773–1858)",
    pageStart: 23,
    pageEnd: 28,
    heading: "Charter Acts (1793, 1813, 1833, 1853): The Climax of Centralization",
    subheading: "From Commercial Enterprise to Legislative State",
    chunkType: "chronology",
    rawContent:
      "The Charter Acts were a series of legislative enactments passed at 20-year intervals to renew the charter of the East India Company...",
    cleanedContent:
      "1) Charter Act 1793: Extended charter 20 years; Board of Control salaries paid from Indian revenues (burden until 1919); separated revenue from judicial courts (abolished Maal Adalats).\n2) Charter Act 1813: Abolished trade monopoly except tea and China trade; asserted Crown sovereignty; set aside ₹1 Lakh annually for education; permitted Christian missionaries.\n3) Charter Act 1833: Climax of centralization; Governor-General of Bengal became Governor-General of India (Lord William Bentinck); deprived Bombay & Madras of legislative powers; ended commercial activity completely (EIC became pure administrative trustee); added 4th Law Member (Lord Macaulay) leading to 1st Law Commission; Section 87 non-discrimination clause.\n4) Charter Act 1853: Separated legislative and executive functions; created 6-member Indian (Central) Legislative Council ('mini-parliament'); introduced open competitive examination for Civil Services (Macaulay Committee 1854); introduced local provincial representation in council.",
    searchableContent:
      "Charter Act 1793 Charter Act 1813 Charter Act 1833 Charter Act 1853 Lord William Bentinck Lord Macaulay Law Commission Section 87 Indian Legislative Council open competition civil services",
    keywords: [
      "charter act 1833",
      "charter act 1853",
      "william bentinck",
      "lord macaulay",
      "civil services open competition",
      "mini parliament",
    ],
    entities: {
      committees: ["Macaulay Committee on Civil Services (1854)"],
      dates: ["1793", "1813", "1833", "1853", "1854"],
    },
    ocrConfidence: 1.0,
    sourcePosition: 3,
  },

  // CHUNK 4: Preamble & Philosophy
  {
    id: "chunk-issf-polity-p65-p70",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "preamble-and-constitutional-philosophy",
    topicName: "The Preamble: Philosophy, Key Terminology & Amendability",
    pageStart: 65,
    pageEnd: 70,
    heading: "The Preamble: Identity Card, Keywords & Amendability Jurisprudence",
    subheading: "Berubari, Kesavananda Bharati & 42nd Amendment",
    chunkType: "definition",
    rawContent:
      "The Preamble is the introductory statement setting out guiding purposes, principles and philosophy. N.A. Palkhivala called it the 'identity card of the Constitution'...",
    cleanedContent:
      "The Preamble is the soul and philosophical essence of the Constitution, based on Nehru's Objective Resolution.\n\nKeywords:\n- Sovereign: Independent state, free internal & external jurisdiction.\n- Socialist: 42nd Amendment 1976; 'Democratic Socialism' (mixed economy), blend of Marxism and Gandhism (leaning to Gandhi).\n- Secular: 42nd Amendment 1976; positive secularism ('Sarva Dharma Sama Bhava') granting equal protection to all religions (Arts 25-28).\n- Democratic: Parliamentary representative democracy based on universal adult suffrage (Art 326).\n- Republic: Elected head of state (President of India for 5-year fixed term, not hereditary monarch).\n- Objectives: Justice (Social, Economic, Political), Liberty (Thought, Expression, Belief, Faith, Worship), Equality (Status, Opportunity), Fraternity & Integrity.\n\nAmendability Jurisprudence:\n1) Berubari Union (1960): Held Preamble is NOT part of Constitution and cannot be amended.\n2) Kesavananda Bharati (1973): Overruled Berubari. Held Preamble IS an integral part of Constitution and can be amended under Article 368 subject to Basic Structure doctrine.\n3) 42nd Amendment (1976): Added 'Socialist', 'Secular', and 'Integrity'. Upheld in LIC of India (1995).",
    searchableContent:
      "Preamble soul of constitution NA Palkhivala identity card sovereign socialist secular democratic republic justice liberty equality fraternity Berubari 1960 Kesavananda Bharati 1973 LIC of India 1995 42nd amendment",
    keywords: [
      "preamble",
      "sovereign socialist secular democratic republic",
      "palkhivala identity card",
      "kesavananda bharati 1973",
      "berubari 1960",
      "42nd amendment 1976",
    ],
    entities: {
      cases: [
        "Berubari Union Case (1960)",
        "Kesavananda Bharati v. State of Kerala (1973)",
        "LIC of India Case (1995)",
      ],
      amendments: ["42nd Constitutional Amendment Act, 1976"],
    },
    ocrConfidence: 1.0,
    sourcePosition: 4,
  },

  // CHUNK 5: Article 14 & Rule of Law
  {
    id: "chunk-issf-polity-p97-p100",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "right-to-equality-articles-14-18",
    topicName: "Right to Equality (Articles 14–18), Rule of Law & Affirmative Action",
    pageStart: 97,
    pageEnd: 100,
    heading: "Article 14: Equality before Law, Equal Protection & Non-Arbitrariness",
    subheading: "Rule of Law, Intelligible Differentia & E.P. Royappa",
    chunkType: "constitutional_provision",
    rawContent:
      "Article 14 is the bedrock of Right to Equality. The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India...",
    cleanedContent:
      "Article 14 applies to all persons (citizens, foreigners, and legal entities).\n\nTwo Dual Concepts:\n1) 'Equality before the Law': British origin (A.V. Dicey's Rule of Law); negative concept implying absence of special privilege; no one is above the law.\n2) 'Equal Protection of the Laws': US 14th Amendment origin; positive concept requiring equality of treatment under equal circumstances.\n\nReasonable Classification Test (Anwar Ali Sarkar):\n- Must be based on 'Intelligible Differentia' (clear distinguishing feature).\n- Must have a 'Rational Nexus' with the objective sought to be achieved.\n\nNew Doctrine of Non-Arbitrariness (E.P. Royappa 1974 & Maneka Gandhi 1978):\n- 'Equality is dynamic and antithetical to arbitrariness. Any arbitrary state action violates Article 14.'\n\nConstitutional Exceptions: Immunities of President and Governors (Article 361), MP/MLA parliamentary speech immunities (Articles 105 & 194), foreign diplomats.",
    searchableContent:
      "Article 14 equality before law equal protection of laws AV Dicey rule of law intelligible differentia rational nexus EP Royappa Maneka Gandhi non-arbitrariness Article 361 immunity",
    keywords: [
      "article 14",
      "equality before law",
      "equal protection of laws",
      "dicey rule of law",
      "intelligible differentia",
      "ep royappa",
      "non arbitrariness",
    ],
    entities: {
      articles: ["Article 14", "Article 361", "Article 105", "Article 194"],
      cases: [
        "State of West Bengal v. Anwar Ali Sarkar (1952)",
        "E.P. Royappa v. State of Tamil Nadu (1974)",
        "Maneka Gandhi v. Union of India (1978)",
      ],
    },
    ocrConfidence: 1.0,
    sourcePosition: 5,
  },

  // CHUNK 6: Article 19 & Free Speech & Internet
  {
    id: "chunk-issf-polity-p111-p126",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "right-to-freedom-articles-19-22",
    topicName: "Right to Freedom (Articles 19–22), Free Speech & Article 21 Due Process",
    pageStart: 111,
    pageEnd: 126,
    heading: "Article 19: Protection of 6 Freedoms, Press, RTI & Right to Internet",
    subheading: "Reasonable Restrictions under 19(2)-(6) and Digital Rights",
    chunkType: "constitutional_provision",
    rawContent:
      "Article 19 guarantees six fundamental freedoms to all citizens of India, subject to reasonable restrictions...",
    cleanedContent:
      "Article 19(1) guarantees 6 freedoms to citizens:\n- 19(1)(a) Speech & Expression (includes Press Freedom / Romesh Thappar, RTI / Raj Narain, Right to Silence / Bijoe Emmanuel, Right to Internet / Anuradha Bhasin).\n- 19(1)(b) Peaceful Assembly without arms.\n- 19(1)(c) Form Associations or Co-operatives (97th Amendment 2011).\n- 19(1)(d) Move freely throughout India.\n- 19(1)(e) Reside and settle anywhere in India.\n- 19(1)(g) Practice any profession, trade, or business.\n\nReasonable Restrictions (19(2)): Sovereignty and integrity of India, security of the State, friendly relations with foreign States, public order, decency/morality, contempt of court, defamation, incitement to an offence.\n\nKey Contemporary Battles:\n1) Sedition (Sec 124A IPC): Kedar Nath (1962) restricted it strictly to speech having tendency/intent to incite violence or public disorder.\n2) Right to Internet (Anuradha Bhasin 2020): Access to internet for trade (19(1)(g)) and expression (19(1)(a)) is constitutionally protected; indefinite internet shutdown is illegal; must satisfy the Test of Proportionality.",
    searchableContent:
      "Article 19 freedom of speech and expression freedom of press Romesh Thappar RTI Raj Narain Right to Internet Anuradha Bhasin Sedition Section 124A Kedar Nath Proportionality",
    keywords: [
      "article 19",
      "freedom of speech",
      "freedom of press",
      "anuradha bhasin",
      "right to internet",
      "sedition section 124a",
      "proportionality test",
    ],
    entities: {
      articles: ["Article 19", "Article 19(1)(a)", "Article 19(1)(g)", "Article 19(2)"],
      cases: [
        "Romesh Thappar v. State of Madras (1950)",
        "Raj Narain v. State of UP (1975)",
        "Kedar Nath Singh v. State of Bihar (1962)",
        "Anuradha Bhasin v. Union of India (2020)",
        "Bijoe Emmanuel v. State of Kerala (1986)",
      ],
    },
    ocrConfidence: 1.0,
    sourcePosition: 6,
  },

  // CHUNK 7: Article 21 & Due Process
  {
    id: "chunk-issf-polity-p129-p133",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "right-to-freedom-articles-19-22",
    topicName: "Right to Freedom (Articles 19–22), Free Speech & Article 21 Due Process",
    pageStart: 129,
    pageEnd: 133,
    heading: "Article 21: Evolution from Gopalan to Maneka Gandhi & Golden Triangle",
    subheading: "Substantive Due Process, Privacy & Right to Die with Dignity",
    chunkType: "concept",
    rawContent:
      "Article 21 states that no person shall be deprived of his life or personal liberty except according to procedure established by law...",
    cleanedContent:
      "The transformative journey of Article 21:\n1) Phase 1 - A.K. Gopalan (1950): Narrow literal view. 'Procedure established by law' meant any duly enacted statute; court could not examine substantive fairness; Articles 19 and 21 were mutually exclusive.\n2) Phase 2 - Maneka Gandhi (1978): Revolutionary reinterpretation. 'Procedure established by law' must be 'right, just, and fair' (importing American Substantive Due Process); created the 'Golden Triangle' (Articles 14, 19, 21 are mutually supportive).\n\nExpansive Implied Rights:\n- Right to Privacy: K.S. Puttaswamy (2017) 9-judge bench declared privacy a fundamental right.\n- Right to Die with Dignity: Gian Kaur (1996) held right to die is NOT part of Art 21; Common Cause (2018) legalized Passive Euthanasia and Living Wills/Advance Medical Directives.\n- Other rights: Livelihood (Olga Tellis), Clean environment (Subhash Kumar), Free legal aid (Hussainara Khatoon), Speedy trial, Clean drinking water.",
    searchableContent:
      "Article 21 protection of life and personal liberty AK Gopalan 1950 Maneka Gandhi 1978 procedure established by law due process golden triangle KS Puttaswamy privacy Common Cause passive euthanasia living wills",
    keywords: [
      "article 21",
      "maneka gandhi 1978",
      "substantive due process",
      "golden triangle",
      "right to privacy",
      "puttaswamy 2017",
      "passive euthanasia",
      "common cause 2018",
    ],
    entities: {
      articles: ["Article 21", "Article 14", "Article 19"],
      cases: [
        "A.K. Gopalan v. State of Madras (1950)",
        "Maneka Gandhi v. Union of India (1978)",
        "K.S. Puttaswamy v. Union of India (2017)",
        "Gian Kaur v. State of Punjab (1996)",
        "Common Cause v. Union of India (2018)",
      ],
    },
    ocrConfidence: 1.0,
    sourcePosition: 7,
  },

  // CHUNK 8: Governor & Article 356
  {
    id: "chunk-issf-polity-p265-p273",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "governor-and-article-356-presidents-rule",
    topicName: "The Governor (Arts 153–167), Discretionary Powers & Article 356",
    pageStart: 265,
    pageEnd: 273,
    heading: "The Governor & Article 356: Discretion, Deadlock & S.R. Bommai Safeguards",
    subheading: "Judicial Review of President's Rule & Mandatory Floor Test",
    chunkType: "case_law",
    rawContent:
      "Article 356 of the Constitution provides for President's Rule on grounds of failure of constitutional machinery...",
    cleanedContent:
      "The Governor (Article 153) is appointed by the President during pleasure (Article 155). Article 163 gives the Governor constitutional discretion (reserving bills Art 200, recommending President's Rule Art 356).\n\nArticle 356 (President's Rule): Intended by Dr. Ambedkar as a 'dead letter', it was used over 125 times as a political weapon to dismiss opposition state governments.\n\nLandmark S.R. Bommai v. Union of India (1994) Principles:\n1) Judicial Review: Presidential proclamation under Art 356 is subject to judicial review on grounds of malafide or irrelevant material.\n2) Objective Material: Union must produce verifiable factual evidence justifying failure of constitutional machinery.\n3) Floor Test is Supreme: Assembly floor is the ONLY constitutional forum to test government majority. Governor cannot assess majority subjectively in Raj Bhavan.\n4) No Immediate Dissolution: Assembly must only be kept in suspended animation until Parliament approves proclamation.\n5) Power to Restore: Court can restore dismissed government and revive dissolved assembly if proclamation is held unconstitutional.\n6) Secularism is Basic Structure: Pursuing anti-secular policies justifies Article 356.",
    searchableContent:
      "Governor Article 153 Article 163 discretionary powers Article 356 President's Rule SR Bommai 1994 floor test mandatory judicial review suspended animation secularism basic structure",
    keywords: [
      "governor article 153",
      "article 356 presidents rule",
      "sr bommai case 1994",
      "floor test supreme",
      "suspended animation",
      "judicial review article 356",
    ],
    entities: {
      articles: ["Article 153", "Article 155", "Article 163", "Article 200", "Article 356"],
      cases: [
        "S.R. Bommai v. Union of India (1994)",
        "Rameshwar Prasad v. Union of India (2006)",
        "Nabam Rebia v. Deputy Speaker (2016)",
      ],
      committees: ["Sarkaria Commission (1988)", "Punchhi Commission (2010)"],
    },
    ocrConfidence: 1.0,
    sourcePosition: 8,
  },

  // CHUNK 9: Electoral Bonds & ADR 2024
  {
    id: "chunk-issf-polity-p606-p610",
    sourceId: "issf-indian-polity-2025",
    sourceTitle: "Indian Polity & Constitution (Gold Standard Series)",
    sourceType: "Standard Book",
    topicId: "elections-rpa-electoral-reforms",
    topicName: "Electoral Framework: RPA 1950 & 1951, MCC, Electoral Bonds & Reforms",
    pageStart: 606,
    pageEnd: 610,
    heading: "The Electoral Bonds Verdict (2024): Right to Information & Political Funding",
    subheading: "ADR v. Union of India — Striking Down Anonymity",
    chunkType: "case_law",
    rawContent:
      "The Electoral Bonds Scheme introduced via Finance Act 2017 allowed anonymous political donations through SBI promissory notes...",
    cleanedContent:
      "The Electoral Bonds Scheme (Finance Act 2017) allowed individuals and corporations to donate unlimited anonymous bearer bonds via SBI to registered political parties.\n\nSupreme Court Verdict (ADR v. Union of India, Feb 2024 - 5-Judge Constitution Bench):\n1) Unanimously struck down the Electoral Bonds Scheme as unconstitutional.\n2) Violation of Article 19(1)(a): Voters have a fundamental Right to Information regarding the financial backers of political parties to cast an informed vote.\n3) Quid Pro Quo Risk: Anonymity facilitated corporate-political nexus for policy favours and licenses.\n4) Struck down unlimited corporate donations: Unlimited corporate funding treated profit-making corporations equal to individual citizens under Article 14, which is arbitrary.\n5) Ordered SBI to publish full serial numbers, buyer details, and redemption history via ECI portal.",
    searchableContent:
      "Electoral Bonds Scheme Finance Act 2017 ADR v Union of India 2024 Supreme Court unconstitutional Article 19 1 a Right to Information quid pro quo corporate donations SBI disclosure",
    keywords: [
      "electoral bonds",
      "adr v union of india 2024",
      "right to information article 19 1 a",
      "quid pro quo",
      "corporate donations",
      "sbi disclosures",
    ],
    entities: {
      articles: ["Article 19(1)(a)", "Article 14"],
      cases: ["Association for Democratic Reforms v. Union of India (2024)"],
    },
    ocrConfidence: 1.0,
    sourcePosition: 9,
  },
];
