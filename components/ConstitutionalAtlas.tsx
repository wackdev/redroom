"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { sound } from "@/lib/audio/sound-engine";

export interface ConstitutionalEntry {
  article: string;
  articleNumber: number;
  part: string;
  partRoman: string;
  partCategory: "rights" | "dpsp" | "union" | "states" | "federal" | "emergency" | "amendment" | "general";
  subject: string;
  keyProvision: string;
  mainsRelevance: string;
  landmarkCases?: string[];
  amendments?: string[];
}

export interface LandmarkCaseEntry {
  caseName: string;
  year: number;
  doctrine: string;
  bench: string;
  ratioDecidendi: string;
  articlesInvolved: string[];
}

const COMPREHENSIVE_ARTICLES_DATASET: ConstitutionalEntry[] = [
  // ==========================================================================
  // PART I: THE UNION AND ITS TERRITORY (ARTICLES 1 – 4)
  // ==========================================================================
  {
    article: "Article 1",
    articleNumber: 1,
    part: "Part I: The Union & Its Territory",
    partRoman: "Part I",
    partCategory: "general",
    subject: "Name and Territory of the Union",
    keyProvision: "Declares India, that is Bharat, shall be a 'Union of States' rather than a Federation of States, indicating the indestructible nature of the Indian Union.",
    mainsRelevance: "Asymmetric federalism, constitutional identity of Bharat, indestructible union with destructible states.",
    landmarkCases: ["Berubari Union Case (1960)", "State of West Bengal v. Union of India (1963)"],
  },
  {
    article: "Article 2 & 3",
    articleNumber: 3,
    part: "Part I: The Union & Its Territory",
    partRoman: "Part I",
    partCategory: "general",
    subject: "Formation of New States & Alteration of Areas/Boundaries",
    keyProvision: "Parliament may by simple majority form new States, alter boundaries or change state names on President's recommendation after consulting the state legislature.",
    mainsRelevance: "Linguistic reorganization of states (Fazal Ali Commission), regional autonomy movements, creation of Telangana and reorganization of Jammu & Kashmir.",
    landmarkCases: ["Babulal Parate v. State of Bombay (1960)", "Mullaperiyar Environmental Protection Forum (2006)"],
    amendments: ["States Reorganisation Act 1956", "J&K Reorganisation Act 2019"],
  },

  // ==========================================================================
  // PART II: CITIZENSHIP (ARTICLES 5 – 11)
  // ==========================================================================
  {
    article: "Article 5 – 11",
    articleNumber: 11,
    part: "Part II: Citizenship",
    partRoman: "Part II",
    partCategory: "general",
    subject: "Constitutional Citizenship & Parliamentary Regulation",
    keyProvision: "Article 11 empowers Parliament exclusively to regulate the right of citizenship by law (Citizenship Act 1955). Rejects dual citizenship in favor of single national citizenship.",
    mainsRelevance: "CAA 2019, NRC Assam, statelessness, non-resident voting rights, and constitutional principles of secular citizenship.",
    landmarkCases: ["Mohammad Ayub Khan v. Commissioner of Police (1965)", "Sarbananda Sonowal v. Union of India (2005)"],
    amendments: ["Citizenship (Amendment) Act 2019"],
  },

  // ==========================================================================
  // PART III: FUNDAMENTAL RIGHTS (ARTICLES 12 – 35)
  // ==========================================================================
  {
    article: "Article 12",
    articleNumber: 12,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Definition of 'The State'",
    keyProvision: "Defines 'State' to include Government and Parliament of India, State Governments/Legislatures, and all local or other authorities under control of Government of India.",
    mainsRelevance: "Applicability of Fundamental Rights against public sector corporations, privatized utilities, and quasi-state entities.",
    landmarkCases: ["Electricity Board Rajasthan v. Mohan Lal (1967)", "Ajay Hasia v. Khalid Mujib (1981)", "Pradeep Kumar Biswas (2002)"],
  },
  {
    article: "Article 13",
    articleNumber: 13,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Laws Inconsistent with Fundamental Rights (Judicial Review)",
    keyProvision: "All laws inconsistent with Fundamental Rights are void. Establishes the constitutional bedrock for Judicial Review and prohibits constitutional amendments from violating Part III.",
    mainsRelevance: "Shield against arbitrary executive and legislative action; foundation of the Basic Structure Doctrine.",
    landmarkCases: ["Shankari Prasad (1951)", "Golaknath (1967)", "Kesavananda Bharati (1973)", "Minerva Mills (1980)"],
  },
  {
    article: "Article 14",
    articleNumber: 14,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Equality Before Law & Equal Protection of the Laws",
    keyProvision: "Guarantees equality before the law and equal protection of the laws. Developed into the Non-Arbitrariness Doctrine (E.P. Royappa) and proportionality test.",
    mainsRelevance: "Rule of Law, anti-corruption safeguards, transparent executive allocation of natural resources, and algorithmic fairness in governance.",
    landmarkCases: ["E.P. Royappa (1974)", "Maneka Gandhi (1978)", "Shayara Bano (2017)", "Electoral Bonds Verdict (2024)"],
  },
  {
    article: "Article 15",
    articleNumber: 15,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Prohibition of Discrimination & Affirmative Action",
    keyProvision: "Prohibits state discrimination on grounds of religion, race, caste, sex, or place of birth. Enables special provisions for women, children, SC/ST, SEBC, and EWS.",
    mainsRelevance: "Reservations in higher educational institutions, gender equality, 103rd EWS quota constitutional validity.",
    landmarkCases: ["State of Madras v. Champakam Dorairajan (1951)", "M. Nagaraj (2006)", "Janki Prasad Parimoo (1973)", "Janhit Abhiyan (EWS Case 2022)"],
    amendments: ["1st Amendment 1951 (Art 15(4))", "93rd Amendment 2005 (Art 15(5))", "103rd Amendment 2019 (Art 15(6) EWS)"],
  },
  {
    article: "Article 16",
    articleNumber: 16,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Equality of Opportunity in Public Employment",
    keyProvision: "Guarantees equal opportunity in state employment. Authorizes affirmative reservations for backward classes not adequately represented.",
    mainsRelevance: "50% reservation ceiling, creamy layer exclusion, promotions reservation, and merit vs substantive equality debate.",
    landmarkCases: ["Indra Sawhney (Mandal Case 1992)", "M. Nagaraj (2006)", "Jarnail Singh (2018)"],
    amendments: ["77th Amendment 1995 (Art 16(4A))", "81st Amendment 2000 (Carry-forward Rule)", "103rd Amendment 2019 (EWS)"],
  },
  {
    article: "Article 17 & 18",
    articleNumber: 17,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Abolition of Untouchability & Titles",
    keyProvision: "Article 17 abolishes 'Untouchability' in all forms as an absolute fundamental right enforceable against private individuals (Protection of Civil Rights Act 1955, SC/ST Prevention of Atrocities Act).",
    mainsRelevance: "Substantive social democracy, eradication of manual scavenging, dignity of Dalits and marginalized communities.",
    landmarkCases: ["State of Karnataka v. Appa Balu Ingale (1993)", "Balaji Raghavan v. Union of India (1996 - National Honours)"],
  },
  {
    article: "Article 19",
    articleNumber: 19,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Six Democratic Freedoms & Reasonable Restrictions",
    keyProvision: "Guarantees speech, peaceful assembly, association/unions/cooperatives, free movement, residence, and profession, subject to reasonable restrictions under Art 19(2)-(6).",
    mainsRelevance: "Freedom of the press, internet shutdowns, right to peaceful protest, sedition law reform, and hate speech regulation.",
    landmarkCases: ["Romesh Thappar (1950)", "Shreya Singhal (Sec 66A IT Act 2015)", "Anuradha Bhasin (Internet Rights 2020)", "Kaushal Kishor (2023)"],
    amendments: ["97th Amendment 2011 (Right to form Co-operative Societies in Art 19(1)(c))"],
  },
  {
    article: "Article 20",
    articleNumber: 20,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Protection in Respect of Conviction for Offences",
    keyProvision: "Guarantees three vital safeguards: (1) Protection against ex-post facto criminal laws; (2) Protection against Double Jeopardy; (3) Right against Self-Incrimination.",
    mainsRelevance: "Narco-analysis, polygraph tests, DNA sampling ethics, criminal justice reforms under Bharatiya Nagarik Suraksha Sanhita (BNSS).",
    landmarkCases: ["Maqbool Hussain v. State of Bombay (1953)", "Selvi v. State of Karnataka (2010 - Narco tests unconstitutional without consent)"],
  },
  {
    article: "Article 21",
    articleNumber: 21,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Protection of Life & Personal Liberty (Due Process)",
    keyProvision: "No person shall be deprived of life or personal liberty except according to procedure established by law. Substantively expanded by judiciary to include Right to Privacy, Dignified Life, Clean Environment, and Speedy Trial.",
    mainsRelevance: "Most expansive constitutional provision; Right to Privacy, euthanasia (living wills), environmental justice, clean air, and reproductive autonomy.",
    landmarkCases: ["A.K. Gopalan (1950)", "Maneka Gandhi (1978)", "Olga Tellis (Pavement Dwellers 1985)", "K.S. Puttaswamy (Right to Privacy 2017)", "Common Cause (Passive Euthanasia 2018)"],
  },
  {
    article: "Article 21A",
    articleNumber: 21.1,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Right to Free and Compulsory Education",
    keyProvision: "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may determine by law (RTE Act 2009).",
    mainsRelevance: "Human capital development, 25% economically weaker section quotas in private schools, Foundational Literacy and Numeracy (FLN under NEP 2020).",
    landmarkCases: ["Mohini Jain (1992)", "Unni Krishnan (1993)", "Society for Unaided Private Schools (2012)"],
    amendments: ["86th Constitutional Amendment Act 2002"],
  },
  {
    article: "Article 22",
    articleNumber: 22,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Protection Against Arrest & Preventive Detention",
    keyProvision: "Mandates informing grounds of arrest, right to legal counsel, production before magistrate within 24 hours, and creates Advisory Boards for preventive detention laws.",
    mainsRelevance: "Misuse of UAPA, NSA, preventive detention safeguards, civil liberties vs national security balance.",
    landmarkCases: ["D.K. Basu v. State of West Bengal (1997 - Arrest Guidelines)", "Rekha v. State of Tamil Nadu (2011)"],
  },
  {
    article: "Article 23 & 24",
    articleNumber: 23,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Prohibition of Traffic in Human Beings, Begar & Child Labour",
    keyProvision: "Prohibits human trafficking, bonded labour (Begar), and bans child labour in factories, mines, and hazardous employments (Child Labour Prohibition Act).",
    mainsRelevance: "Eradication of human trafficking, protection of migrant workers, modern slavery, and child rights protection.",
    landmarkCases: ["People's Union for Democratic Rights (Asiad Workers Case 1982)", "M.C. Mehta v. State of Tamil Nadu (Sivakasi Child Labour 1996)"],
  },
  {
    article: "Article 25 – 28",
    articleNumber: 25,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Right to Freedom of Religion & Secularism",
    keyProvision: "Guarantees freedom of conscience, profession, practice, and propagation of religion (Art 25) subject to public order, morality, and health. Protects management of religious affairs (Art 26).",
    mainsRelevance: "Essential Religious Practices (ERP) doctrine, Sabarimala women entry, Hijab controversy, anti-conversion statutes, and secular management of temple trusts.",
    landmarkCases: ["Shirur Mutt (1954 - ERP Test)", "Bijoe Emmanuel (National Anthem 1986)", "Shayara Bano (Triple Talaq 2017)", "Indian Young Lawyers Association (Sabarimala 2018)"],
  },
  {
    article: "Article 29 & 30",
    articleNumber: 29,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Cultural & Educational Rights of Minorities",
    keyProvision: "Article 29 protects distinct language, script, or culture. Article 30 empowers religious and linguistic minorities to establish and administer educational institutions of their choice.",
    mainsRelevance: "Autonomy of minority institutions (e.g. AMU, St. Stephen's), state regulation of admissions/teachers, preserving linguistic diversity.",
    landmarkCases: ["T.M.A. Pai Foundation (2002)", "P.A. Inamdar (2005)", "Pramati Educational Trust (2014)", "Aligarh Muslim University Reference (2024)"],
  },
  {
    article: "Article 32",
    articleNumber: 32,
    part: "Part III: Fundamental Rights",
    partRoman: "Part III",
    partCategory: "rights",
    subject: "Right to Constitutional Remedies (Writs)",
    keyProvision: "Empowers citizens to move the Supreme Court directly for enforcement of Fundamental Rights. SC may issue five prerogative writs: Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari.",
    mainsRelevance: "Called by Dr. Ambedkar the 'Heart and Soul of the Constitution'; birthplace of Public Interest Litigation (PIL) and epistles jurisdiction.",
    landmarkCases: ["Bandhua Mukti Morcha (1984)", "S.P. Gupta (Judges Transfer 1981)", "Sunil Batra (Prisoner Rights 1978)"],
  },

  // ==========================================================================
  // PART IV: DIRECTIVE PRINCIPLES OF STATE POLICY (ARTICLES 36 – 51)
  // ==========================================================================
  {
    article: "Article 38 & 39",
    articleNumber: 38,
    part: "Part IV: Directive Principles (DPSP)",
    partRoman: "Part IV",
    partCategory: "dpsp",
    subject: "Social Order for Welfare of People & Equitable Wealth Distribution",
    keyProvision: "Directs State to promote welfare by securing a social order permeated by justice (social, economic, political), minimizing income inequalities, and preventing concentration of wealth (Art 39(b)&(c)).",
    mainsRelevance: "Welfare state jurisprudence, land reforms, wealth redistribution, progressive taxation, and prioritizing DPSP over Articles 14/19 under Article 31C.",
    landmarkCases: ["Kesavananda Bharati (1973)", "Minerva Mills (1980)", "Sanjeev Coke Mfg. Co. (1983)", "Property Owners Association v. State of Maharashtra (2024)"],
    amendments: ["42nd Constitutional Amendment 1976 (Added Art 39A Free Legal Aid)"],
  },
  {
    article: "Article 40",
    articleNumber: 40,
    part: "Part IV: Directive Principles (DPSP)",
    partRoman: "Part IV",
    partCategory: "dpsp",
    subject: "Organization of Village Panchayats",
    keyProvision: "Directs the State to organize village panchayats and endow them with powers and authority necessary to enable them to function as units of self-government.",
    mainsRelevance: "Gandhian dream of Gram Swaraj, realized formally through the 73rd Constitutional Amendment Act 1992.",
  },
  {
    article: "Article 44",
    articleNumber: 44,
    part: "Part IV: Directive Principles (DPSP)",
    partRoman: "Part IV",
    partCategory: "dpsp",
    subject: "Uniform Civil Code (UCC) for the Citizens",
    keyProvision: "The State shall endeavour to secure for the citizens a Uniform Civil Code throughout the territory of India, replacing religion-based personal laws on marriage, succession, and adoption.",
    mainsRelevance: "Gender justice, secular civil code, 21st Law Commission consultation paper, Uttarakhand UCC Act 2024, balancing with Article 25.",
    landmarkCases: ["Shah Bano Begum (1985)", "Sarla Mudgal (1995)", "John Vallamattom (2003)", "Shayara Bano (2017)"],
  },
  {
    article: "Article 48A & 50",
    articleNumber: 48.1,
    part: "Part IV: Directive Principles (DPSP)",
    partRoman: "Part IV",
    partCategory: "dpsp",
    subject: "Protection of Environment & Separation of Judiciary from Executive",
    keyProvision: "Article 48A mandates the State to protect and improve the environment and safeguard forests/wildlife. Article 50 directs the separation of Judiciary from Executive in public services.",
    mainsRelevance: "Judicial independence, environmental public trust doctrine, creation of National Green Tribunal (NGT).",
    landmarkCases: ["M.C. Mehta v. Union of India (Taj Trapezium 1996)", "T.N. Godavarman (1997)"],
    amendments: ["42nd Constitutional Amendment Act 1976 (Added Art 48A)"],
  },
  {
    article: "Article 51",
    articleNumber: 51,
    part: "Part IV: Directive Principles (DPSP)",
    partRoman: "Part IV",
    partCategory: "dpsp",
    subject: "Promotion of International Peace and Security",
    keyProvision: "Directs the State to promote international peace, maintain just relations between nations, foster respect for international law/treaties, and encourage settlement of international disputes by arbitration.",
    mainsRelevance: "Constitutional anchor for India's foreign policy: Non-Alignment, Panchsheel, Strategic Autonomy, and leadership of the Global South.",
  },

  // ==========================================================================
  // PART IVA: FUNDAMENTAL DUTIES (ARTICLE 51A)
  // ==========================================================================
  {
    article: "Article 51A",
    articleNumber: 51.2,
    part: "Part IVA: Fundamental Duties",
    partRoman: "Part IVA",
    partCategory: "rights",
    subject: "Fundamental Duties of Indian Citizens (11 Duties)",
    keyProvision: "Enlists 11 civic and ethical duties: respecting the National Flag/Anthem, cherishing ideals of freedom struggle, upholding sovereignty, defending nation, developing scientific temper (51A(h)), protecting environment (51A(g)), and parent duty to educate child (51A(k)).",
    mainsRelevance: "Balancing citizen rights with civic duties, Swaran Singh Committee recommendations, Justice Verma Committee on enforcement of fundamental duties.",
    landmarkCases: ["AIIMS Students Union v. AIIMS (2002)", "Shyam Narayan Chouksey (National Anthem 2016)"],
    amendments: ["42nd Amendment 1976 (Added Part IVA on Swaran Singh Committee recommendation)", "86th Amendment 2002 (Added 11th Duty 51A(k))"],
  },

  // ==========================================================================
  // PART V: THE UNION (ARTICLES 52 – 151)
  // ==========================================================================
  {
    article: "Article 52 – 72",
    articleNumber: 72,
    part: "Part V: The Union Executive",
    partRoman: "Part V",
    partCategory: "union",
    subject: "The President of India & Pardoning Powers",
    keyProvision: "Vests executive power of the Union in the President (Art 53) exercised on the aid and advice of the Council of Ministers (Art 74). Article 72 empowers President to grant pardons, reprieves, respites, or remissions of punishment.",
    mainsRelevance: "Constitutional head status vs real executive power (42nd/44th Amendments), judicial review of Presidential pardons (death penalty clemency delays).",
    landmarkCases: ["Shamsher Singh v. State of Punjab (1974)", "Kehar Singh v. Union of India (1989)", "Shatrughan Chauhan (2014 - Death Row Delay)"],
  },
  {
    article: "Article 74 & 75",
    articleNumber: 74,
    part: "Part V: The Union Executive",
    partRoman: "Part V",
    partCategory: "union",
    subject: "Council of Ministers & Collective Parliamentary Responsibility",
    keyProvision: "President bound by Council of Ministers' aid and advice headed by Prime Minister. Council of Ministers collectively responsible to the Lok Sabha (Art 75(3)). Ministerial size capped at 15% of Lok Sabha (Art 75(1A)).",
    mainsRelevance: "Cabinet government conventions, coalition ministries, No-Confidence Motions, Prime Ministerial accountability.",
    landmarkCases: ["U.N.R. Rao v. Indira Gandhi (1971)", "S.R. Bommai (1994)"],
    amendments: ["44th Amendment 1978 (President can send advice back once for reconsideration)", "91st Amendment 2003 (15% Ministry Size Cap)"],
  },
  {
    article: "Article 105",
    articleNumber: 105,
    part: "Part V: Parliament",
    partRoman: "Part V",
    partCategory: "union",
    subject: "Powers, Privileges and Immunities of Parliament & MPs",
    keyProvision: "Guarantees absolute freedom of speech in Parliament (no MP liable in court for anything said or vote given) and protects parliamentary proceedings from judicial inquiry (Art 122).",
    mainsRelevance: "Legislative privileges vs Fundamental Rights, Cash-for-query expulsions, immunity against criminal bribery charges.",
    landmarkCases: ["M.S.M. Sharma (Searchlight Case 1959)", "P.V. Narasimha Rao (1998)", "Sita Soren v. Union of India (7-Judge Bench 2024 - Bribery Not Protected)"],
  },
  {
    article: "Article 110",
    articleNumber: 110,
    part: "Part V: Parliament",
    partRoman: "Part V",
    partCategory: "union",
    subject: "Definition of 'Money Bills' & Speaker's Finality",
    keyProvision: "Defines Money Bills (containing solely provisions dealing with taxation, consolidated fund borrowing). Speaker's certificate is final. Rajya Sabha cannot amend or reject, but can only recommend within 14 days.",
    mainsRelevance: "Controversy over bypassing Rajya Sabha by certifying major non-financial laws as Money Bills (e.g. Aadhaar Act, Electoral Bonds, Tribunal Reforms).",
    landmarkCases: ["Justice K.S. Puttaswamy (Aadhaar Act 2018)", "Roger Mathew v. South Indian Bank (2020 - Referred to 7-Judge Bench)"],
  },
  {
    article: "Article 123",
    articleNumber: 123,
    part: "Part V: The Union Executive",
    partRoman: "Part V",
    partCategory: "union",
    subject: "Presidential Power to Promulgate Ordinances",
    keyProvision: "Empowers President to promulgate Ordinances during parliamentary recess if satisfied that immediate action is required. Must be laid before Parliament within six weeks of reassembly.",
    mainsRelevance: "Ordinance raj vs parliamentary supremacy, subversion of democratic debate, repromulgation of ordinances.",
    landmarkCases: ["R.C. Cooper (Bank Nationalisation 1970)", "A.K. Roy (1982)", "D.C. Wadhwa (1987)", "Krishna Kumar Singh v. State of Bihar (2017 - Repromulgation Unconstitutional)"],
  },
  {
    article: "Article 124 – 147",
    articleNumber: 124,
    part: "Part V: The Union Judiciary",
    partRoman: "Part V",
    partCategory: "union",
    subject: "Supreme Court of India, Collegium & Jurisdictions",
    keyProvision: "Establishes Supreme Court. Original Jurisdiction (Art 131), Appellate (Arts 132-134), Special Leave Petition (Art 136), Advisory (Art 143), and Complete Justice Decree Powers (Art 142). Court of Record with Contempt powers (Art 129).",
    mainsRelevance: "Collegium system vs NJAC, pending case backlogs, judicial independence, live streaming of court proceedings.",
    landmarkCases: ["First Judges (1981)", "Second Judges (1993)", "Third Judges (1998)", "NJAC Case (Fourth Judges 2015)"],
    amendments: ["99th Constitutional Amendment Act (NJAC - Struck down)"],
  },
  {
    article: "Article 142",
    articleNumber: 142,
    part: "Part V: The Union Judiciary",
    partRoman: "Part V",
    partCategory: "union",
    subject: "Supreme Court's Power to do 'Complete Justice'",
    keyProvision: "The Supreme Court may pass such decree or make such order as is necessary for doing complete justice in any cause or matter pending before it.",
    mainsRelevance: "Judicial activism, dissolving irretrievably broken marriages without waiting periods, environmental remediation, cancelling irregular coal block allocations.",
    landmarkCases: ["Union Carbide (Bhopal Gas 1991)", "Ayodhya Title Dispute (2019)", "Shilpa Sailesh (2023 - Divorce on Irretrievable Breakdown)"],
  },
  {
    article: "Article 148 – 151",
    articleNumber: 148,
    part: "Part V: Comptroller and Auditor General",
    partRoman: "Part V",
    partCategory: "union",
    subject: "Comptroller and Auditor-General of India (CAG)",
    keyProvision: "Independent constitutional authority appointed by President. Audits all receipts and expenditures of Union and States. Submits reports to President/Governors laid before Public Accounts Committee (PAC).",
    mainsRelevance: "Guardian of the public purse; performance audits, spectrum allocations, off-budget borrowings scrutiny.",
    landmarkCases: ["Centre for Public Interest Litigation v. Union of India (2G Spectrum Case 2012)"],
  },

  // ==========================================================================
  // PART VI: THE STATES (ARTICLES 152 – 237)
  // ==========================================================================
  {
    article: "Article 153 – 163",
    articleNumber: 153,
    part: "Part VI: The State Executive",
    partRoman: "Part VI",
    partCategory: "states",
    subject: "The Governor of the State & Discretionary Powers",
    keyProvision: "Governor is constitutional head of State, appointed by President (Art 155). Operates on aid and advice of State Council of Ministers (Art 163(1)), except where Constitution explicitly confers discretion.",
    mainsRelevance: "Flashpoint in Centre-State relations; discretionary appointment of Chief Ministers, floor tests, withholding of bills under Article 200.",
    landmarkCases: ["Shamsher Singh (1974)", "S.R. Bommai (1994)", "Nabam Rebia (2016)", "State of Punjab v. Principal Secretary to Governor (2023)"],
  },
  {
    article: "Article 200 & 201",
    articleNumber: 200,
    part: "Part VI: State Legislature",
    partRoman: "Part VI",
    partCategory: "states",
    subject: "Governor's Assent to Bills & Reservation for President",
    keyProvision: "Governor may declare assent, withhold assent, return bill for reconsideration 'as soon as possible', or reserve bill for President's consideration.",
    mainsRelevance: "Pocket veto controversies; SC ruling that Governors cannot sit indefinitely on bills passed by elected state legislatures.",
    landmarkCases: ["State of Punjab v. Governor of Punjab (2023 - 3-Judge Bench)"],
  },
  {
    article: "Article 214 – 227",
    articleNumber: 226,
    part: "Part VI: State Judiciary",
    partRoman: "Part VI",
    partCategory: "states",
    subject: "High Courts & Expansive Writ Jurisdiction (Article 226)",
    keyProvision: "Establishes High Courts for States. Article 226 confers writ jurisdiction wider than Supreme Court's Article 32, applicable for Fundamental Rights AND 'for any other legal right'. Article 227 grants superintendence over all subordinate courts.",
    mainsRelevance: "Administrative law remedies, federal judicial decentralization, High Court judge transfers and vacancies.",
    landmarkCases: ["Chandrakumar v. Union of India (1997)", "Whirlpool Corporation v. Registrar of Trade Marks (1998)"],
  },

  // ==========================================================================
  // PART IX & IXA: LOCAL SELF-GOVERNMENT (ARTICLES 243 – 243ZG)
  // ==========================================================================
  {
    article: "Article 243 – 243O (73rd CAA)",
    articleNumber: 243,
    part: "Part IX: The Panchayats",
    partRoman: "Part IX",
    partCategory: "states",
    subject: "Three-Tier Panchayati Raj & Eleventh Schedule",
    keyProvision: "Constitutionalizes Gram Sabha, 3-tier Panchayats, 5-year fixed tenure, State Election Commission (243K), State Finance Commission (243I), 33% mandatory reservation for women (243D), and 29 functional subjects in 11th Schedule.",
    mainsRelevance: "Grassroots democratic decentralization, 'Sarpanch Pati' challenges, fiscal devolution bottlenecks (Funds, Functions, Functionaries).",
    amendments: ["73rd Constitutional Amendment Act 1992"],
  },
  {
    article: "Article 243P – 243ZG (74th CAA)",
    articleNumber: 243.1,
    part: "Part IXA: The Municipalities",
    partRoman: "Part IXA",
    partCategory: "states",
    subject: "Urban Local Bodies (ULBs) & Twelfth Schedule",
    keyProvision: "Constitutionalizes Nagar Panchayats, Municipal Councils, Municipal Corporations, District Planning Committees (243ZD), Metropolitan Planning Committees (243ZE), and 18 urban subjects in 12th Schedule.",
    mainsRelevance: "Urban governance, municipal bond financing, smart cities, empowering directly elected Mayors.",
    amendments: ["74th Constitutional Amendment Act 1992"],
  },

  // ==========================================================================
  // PART XI: CENTRE-STATE RELATIONS (ARTICLES 245 – 263)
  // ==========================================================================
  {
    article: "Article 245 – 254",
    articleNumber: 245,
    part: "Part XI: Legislative Relations",
    partRoman: "Part XI",
    partCategory: "federal",
    subject: "Distribution of Legislative Powers & Seventh Schedule",
    keyProvision: "Article 246 establishes Union List (List I), State List (List II), and Concurrent List (List III). Article 248 grants residuary powers to Parliament. Article 254 establishes Union law supremacy in Concurrent List conflicts.",
    mainsRelevance: "Federal balance, Doctrines of Pith and Substance, Territorial Nexus, Colorable Legislation, and Repugnancy.",
    landmarkCases: ["Prafulla Kumar v. Bank of Commerce (Pith and Substance 1947)", "State of Rajasthan v. G. Chawla (1959)", "M. Karunanidhi v. Union of India (1979)"],
  },
  {
    article: "Article 262",
    articleNumber: 262,
    part: "Part XI: Inter-State River Disputes",
    partRoman: "Part XI",
    partCategory: "federal",
    subject: "Adjudication of Inter-State Water Disputes",
    keyProvision: "Parliament may by law provide for adjudication of any dispute relating to waters of inter-state rivers and exclude Supreme Court jurisdiction (Inter-State River Water Disputes Act 1956).",
    mainsRelevance: "Cauvery, Krishna, Godavari, and Sutlej-Yamuna Link (SYL) canal disputes; proposed standalone Inter-State River Water Disputes Tribunal.",
    landmarkCases: ["Cauvery Water Disputes Tribunal (1992)", "State of Karnataka v. State of Tamil Nadu (2018)"],
  },
  {
    article: "Article 263",
    articleNumber: 263,
    part: "Part XI: Inter-State Council",
    partRoman: "Part XI",
    partCategory: "federal",
    subject: "Inter-State Council for Cooperative Federalism",
    keyProvision: "President may establish an Inter-State Council to inquire into and investigate disputes between States and discuss common national policy interests.",
    mainsRelevance: "Sarkaria Commission recommendation; institutionalizing cooperative federal dialogue between Union Ministers and State Chief Ministers.",
  },

  // ==========================================================================
  // PART XII: FINANCE, PROPERTY & CONTRACTS (ARTICLES 264 – 300A)
  // ==========================================================================
  {
    article: "Article 279A",
    articleNumber: 279.1,
    part: "Part XII: Goods and Services Tax Council",
    partRoman: "Part XII",
    partCategory: "federal",
    subject: "GST Council & Pooled Fiscal Sovereignty",
    keyProvision: "Constitutional body chaired by Union Finance Minister with all State Finance Ministers. Union holds 1/3rd vote weight; States hold 2/3rd vote weight. Decisions require 3/4th majority.",
    mainsRelevance: "Cooperative vs bargaining fiscal federalism; SC holding in Mohit Minerals that GST Council recommendations are not binding mandates.",
    landmarkCases: ["Union of India v. Mohit Minerals (2022)"],
    amendments: ["101st Constitutional Amendment Act 2016"],
  },
  {
    article: "Article 280",
    articleNumber: 280,
    part: "Part XII: Finance Commission",
    partRoman: "Part XII",
    partCategory: "federal",
    subject: "Finance Commission (Fiscal Federal Devolution)",
    keyProvision: "Quinquennial constitutional body appointed by President. Recommends vertical tax devolution between Union and States, horizontal distribution formula among States, and Grant-in-Aids (Art 275).",
    mainsRelevance: "15th/16th Finance Commission terms of reference, 41% state share, demographic performance vs historical population weights.",
  },
  {
    article: "Article 300A",
    articleNumber: 300.1,
    part: "Part XII: Right to Property",
    partRoman: "Part XII",
    partCategory: "general",
    subject: "Right to Property as a Constitutional Human Right",
    keyProvision: "No person shall be deprived of his property save by authority of law. Demoted from Fundamental Right (former Art 31) to a Constitutional and Human Right.",
    mainsRelevance: "Eminent domain, fair compensation under Land Acquisition Act (LARR 2013), adverse possession by the State.",
    landmarkCases: ["Vidya Devi v. State of Himachal Pradesh (2020 - Right to Property is a Human Right)", "Kalyani v. State of UP (2021)"],
    amendments: ["44th Constitutional Amendment Act 1978 (Omitted Art 31 and inserted Art 300A)"],
  },

  // ==========================================================================
  // PART XIV & XV: SERVICES, TRIBUNALS & ELECTIONS (ARTICLES 308 – 329)
  // ==========================================================================
  {
    article: "Article 311",
    articleNumber: 311,
    part: "Part XIV: Services Under the Union & States",
    partRoman: "Part XIV",
    partCategory: "general",
    subject: "Constitutional Safeguards for Civil Servants",
    keyProvision: "Civil servants cannot be dismissed or reduced in rank except after an inquiry informing them of charges with reasonable opportunity to defend (doctrine of pleasure subject to Art 311).",
    mainsRelevance: "Neutrality of civil services, lateral entry in administration, executive summary dismissal exceptions (national security).",
    landmarkCases: ["Parshotam Lal Dhingra (1958)", "Tulsiram Patel (1985)"],
  },
  {
    article: "Article 315 – 323",
    articleNumber: 315,
    part: "Part XIV: Public Service Commissions",
    partRoman: "Part XIV",
    partCategory: "general",
    subject: "Union Public Service Commission (UPSC) & SPSC",
    keyProvision: "Independent constitutional recruiting agency for All India Services and Central Services. President appoints Chairman and members with protected security of tenure (Art 317).",
    mainsRelevance: "Merit-based recruitment, constitutional independence from executive interference, civil service reform commissions.",
  },
  {
    article: "Article 324 – 329",
    articleNumber: 324,
    part: "Part XV: Elections",
    partRoman: "Part XV",
    partCategory: "general",
    subject: "Election Commission of India (ECI) & Universal Suffrage",
    keyProvision: "Superintendence, direction, and control of elections vested in ECI (Art 324). Universal adult suffrage without discrimination (Art 325 & 326). Bar to interference by courts in electoral matters (Art 329).",
    mainsRelevance: "Model Code of Conduct, appointment of Election Commissioners (Anoop Baranwal 2023 & CEC Act 2023), Simultaneous Elections ('One Nation, One Election').",
    landmarkCases: ["Mohinder Singh Gill (1978)", "T.N. Seshan (1995)", "Anoop Baranwal v. Union of India (2023)"],
  },

  // ==========================================================================
  // PART XVIII: EMERGENCY PROVISIONS (ARTICLES 352 – 360)
  // ==========================================================================
  {
    article: "Article 352",
    articleNumber: 352,
    part: "Part XVIII: Emergency Provisions",
    partRoman: "Part XVIII",
    partCategory: "emergency",
    subject: "National Emergency (War, External Aggression, Armed Rebellion)",
    keyProvision: "President may proclaim National Emergency on written advice of the Union Cabinet. Must be approved by special majority of both Houses within one month. Transforms federal constitution into unitary structure.",
    mainsRelevance: "Suspension of Fundamental Rights (Articles 20 & 21 can never be suspended even during Emergency under 44th Amendment).",
    landmarkCases: ["Minerva Mills (1980)", "ADM Jabalpur v. Shivkant Shukla (1976 - Overruled in Puttaswamy 2017)"],
    amendments: ["44th Amendment 1978 (Replaced 'Internal Disturbance' with 'Armed Rebellion'; Mandated Written Cabinet Advice)"],
  },
  {
    article: "Article 356",
    articleNumber: 356,
    part: "Part XVIII: Emergency Provisions",
    partRoman: "Part XVIII",
    partCategory: "emergency",
    subject: "President's Rule (Failure of Constitutional Machinery in States)",
    keyProvision: "President on Governor's report or otherwise may dissolve or suspend State Legislative Assembly and assume state executive powers. Subject to parliamentary approval within two months.",
    mainsRelevance: "Federal integrity vs executive abuse; landmark S.R. Bommai guidelines establishing floor test as sole metric and subjecting proclamation to judicial review.",
    landmarkCases: ["State of Rajasthan v. Union of India (1977)", "S.R. Bommai v. Union of India (9-Judge Bench 1994)", "Rameshwar Prasad (Bihar Assembly 2006)"],
  },
  {
    article: "Article 360",
    articleNumber: 360,
    part: "Part XVIII: Emergency Provisions",
    partRoman: "Part XVIII",
    partCategory: "emergency",
    subject: "Financial Emergency",
    keyProvision: "If President is satisfied that financial stability or credit of India is threatened, Financial Emergency may be proclaimed, authorizing reduction of salaries of public servants including SC/HC judges.",
    mainsRelevance: "Never declared in independent India's history (even during 1991 Balance of Payments crisis), showcasing Indian macroeconomic resilience.",
  },

  // ==========================================================================
  // PART XX: AMENDMENT OF THE CONSTITUTION (ARTICLE 368)
  // ==========================================================================
  {
    article: "Article 368",
    articleNumber: 368,
    part: "Part XX: Amendment of the Constitution",
    partRoman: "Part XX",
    partCategory: "amendment",
    subject: "Constituent Power of Parliament to Amend Constitution",
    keyProvision: "Parliament may amend by addition, variation, or repeal any provision through Special Majority (2/3rd present & voting + 50% total membership) or Special Majority with 50% State Legislature Ratifications.",
    mainsRelevance: "Basic Structure Doctrine: Parliament's amending power is limited and cannot destroy the core constitutional identity (democracy, secularism, rule of law, federalism, judicial review).",
    landmarkCases: ["Shankari Prasad (1951)", "Sajjan Singh (1965)", "Golaknath (1967)", "Kesavananda Bharati (13-Judge Bench 1973)", "Minerva Mills (1980)", "I.R. Coelho (9th Schedule Review 2007)"],
    amendments: ["24th Amendment 1971", "42nd Amendment 1976 (Clause 4 & 5 struck down in Minerva Mills)"],
  },

  // ==========================================================================
  // PART XXI: SPECIAL PROVISIONS FOR STATES (ARTICLES 370 – 371J)
  // ==========================================================================
  {
    article: "Article 371 to 371-J",
    articleNumber: 371,
    part: "Part XXI: Temporary, Transitional & Special Provisions",
    partRoman: "Part XXI",
    partCategory: "federal",
    subject: "Special Provisions for Asymmetric Federalism (Maharashtra, Gujarat, Nagaland, Assam, Manipur, Andhra, Telangana, Sikkim, Mizoram, Arunachal, Goa, Karnataka)",
    keyProvision: "Enshrines special protections for customary tribal land rights (371A Nagaland, 371G Mizoram), regional development boards (371 Vidarbha/Marathwada, 371J Hyderabad-Karnataka), and democratic representation.",
    mainsRelevance: "Exemplifies India's flexible asymmetric federalism; protecting ethnic cultural diversity and resolving regional developmental imbalances.",
    landmarkCases: ["In Re Article 370 Constitutional Bench (2023 - Uheld Abrogation of Art 370)"],
    amendments: ["36th Amendment 1975 (Sikkim 371F)", "53rd Amendment 1986 (Mizoram 371G)", "98th Amendment 2012 (Art 371J)"],
  },
];

export default function ConstitutionalAtlas() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<ConstitutionalEntry | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);

  const filteredArticles = useMemo(() => {
    return COMPREHENSIVE_ARTICLES_DATASET.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.partCategory === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.article.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.part.toLowerCase().includes(query) ||
        item.keyProvision.toLowerCase().includes(query) ||
        item.landmarkCases?.some((c) => c.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const filteredArticlesRef = useRef<ConstitutionalEntry[]>(filteredArticles);
  filteredArticlesRef.current = filteredArticles;

  const selectedArticleRef = useRef<ConstitutionalEntry | null>(selectedArticle);
  selectedArticleRef.current = selectedArticle;

  // Set default selected article
  useEffect(() => {
    if (filteredArticles.length > 0 && !selectedArticle) {
      setSelectedArticle(filteredArticles[0]);
    }
  }, [filteredArticles, selectedArticle]);

  // 3D Interactive Constitutional Orbit Canvas
  useEffect(() => {
    if (viewMode !== "3d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 750);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const render = () => {
      ctx.fillStyle = "#030305";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width * 0.36, 160);

      if (!isDraggingRef.current) {
        rotationRef.current += 0.002;
      }
      const rot = rotationRef.current;

      // Central Holographic Constitutional Core Glow
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        radius * 1.3
      );
      coreGrad.addColorStop(0, "rgba(168, 85, 247, 0.35)"); // Purple
      coreGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.1)"); // Blue
      coreGrad.addColorStop(1, "rgba(3, 3, 5, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 3D Orbital Rings
      const orbits = [0.45, 0.75, 1.0, 1.25];
      orbits.forEach((mult, i) => {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          radius * mult,
          radius * mult * 0.35,
          (i * Math.PI) / 6,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 - i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Distribute Articles across a 3D Sphere (Fibonacci / Golden Spiral Lattice)
      const list = filteredArticlesRef.current;
      const total = list.length;

      list.forEach((art, idx) => {
        const phi = Math.acos(-1 + (2 * idx) / Math.max(total, 1));
        const theta = Math.sqrt(total * Math.PI) * phi + rot;

        const x3d = radius * Math.sin(phi) * Math.cos(theta);
        const y3d = radius * Math.cos(phi);
        const z3d = radius * Math.sin(phi) * Math.sin(theta);

        // Project onto 2D screen
        const scale = 300 / (300 + z3d);
        const screenX = centerX + x3d * scale;
        const screenY = centerY + y3d * scale;
        const depthAlpha = Math.max(0.2, (z3d + radius) / (2 * radius));

        const isSelected = selectedArticleRef.current?.article === art.article;

        // Color coding by part category
        let color = "#3b82f6"; // Default Blue
        if (art.partCategory === "rights") color = "#06b6d4"; // Cyan
        else if (art.partCategory === "dpsp") color = "#10b981"; // Emerald
        else if (art.partCategory === "union") color = "#f59e0b"; // Gold
        else if (art.partCategory === "states") color = "#f97316"; // Orange
        else if (art.partCategory === "federal") color = "#ec4899"; // Pink
        else if (art.partCategory === "emergency") color = "#ef4444"; // Red
        else if (art.partCategory === "amendment") color = "#8b5cf6"; // Purple

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, 15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.25 * depthAlpha})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(3, 5 * scale), 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = depthAlpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }

        // Text label for front nodes or selected
        if (z3d > 20 || isSelected) {
          ctx.save();
          ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.8)";
          ctx.font = isSelected
            ? "bold 11px Inter, sans-serif"
            : "600 9px Inter, sans-serif";
          ctx.fillText(art.article.split(" ")[0] + " " + (art.article.split(" ")[1] || ""), screenX + 8, screenY - 3);
          ctx.restore();
        }
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [viewMode]);

  // Pointer drag for rotating 3D matrix
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    rotationRef.current += deltaX * 0.006;
    lastXRef.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-purple-500/30 bg-gradient-to-r from-[#140624] via-[#1d0a33] to-[#0d0317] p-5 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-purple-500 animate-ping" />
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              3D Constitutional Matrix & All Articles Atlas
            </h2>
          </div>
          <p className="text-xs text-white/60 mt-0.5">
            Interactive 3D Celestial Matrix of the Indian Constitution: Articles 1 to 395, Landmark Supreme Court Precedents & Mains Jurisprudence
          </p>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center gap-1.5 rounded-xl bg-black/60 p-1 border border-white/10">
          <button
            onClick={() => {
              setViewMode("3d");
              sound.playClick();
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === "3d" ? "bg-purple-600 text-white shadow" : "text-white/50 hover:text-white"
            }`}
          >
            🌌 3D Celestial Sphere
          </button>
          <button
            onClick={() => {
              setViewMode("grid");
              sound.playClick();
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === "grid" ? "bg-purple-600 text-white shadow" : "text-white/50 hover:text-white"
            }`}
          >
            📋 Structured Grid
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* CATEGORY SELECTOR */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-black/50 p-1.5 border border-white/10">
          {[
            { id: "all", label: `All Parts (${COMPREHENSIVE_ARTICLES_DATASET.length})` },
            { id: "rights", label: "Part III: Fundamental Rights" },
            { id: "dpsp", label: "Part IV: DPSP & Duties" },
            { id: "union", label: "Part V: Union (President/PM/SC)" },
            { id: "states", label: "Part VI/IX: States & Panchayats" },
            { id: "federal", label: "Part XI/XII: Federal & GST" },
            { id: "emergency", label: "Part XVIII: Emergency" },
            { id: "amendment", label: "Part XX: Basic Structure" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                sound.playClick();
              }}
              className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                activeCategory === cat.id
                  ? "bg-purple-600 text-white shadow"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Article, Case, Doctrine..."
            className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-xs text-white/40 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3D CELESTIAL CANVAS & DEEP DIVE CONTAINER */}
      {viewMode === "3d" ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* 3D CANVAS (7 COLS) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl lg:col-span-7 h-[480px]">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing touch-none"
            />

            {/* TOP HUD */}
            <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-300">
                  3D CONSTITUTIONAL ORBIT
                </span>
                <span className="text-[11px] font-bold text-white/60">
                  {filteredArticles.length} Node Anchors
                </span>
              </div>
              <span className="text-[10px] text-white/40 italic">
                Drag to rotate Constitutional Matrix
              </span>
            </div>

            {/* BOTTOM ARTICLE SELECTOR CAROUSEL */}
            <div className="relative z-10 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {filteredArticles.map((art) => (
                  <button
                    key={art.article}
                    onClick={() => {
                      setSelectedArticle(art);
                      sound.playClick();
                    }}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                      selectedArticle?.article === art.article
                        ? "bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {art.article}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ARTICLE DEEP DIVE ANALYTICAL HUD (5 COLS) */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl lg:col-span-5 space-y-4">
            {selectedArticle ? (
              <div className="space-y-3.5">
                {/* ARTICLE TITLE & PART */}
                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                      {selectedArticle.part}
                    </span>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-white/70">
                      {selectedArticle.partRoman}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xl font-black text-white leading-tight">
                    {selectedArticle.article}: {selectedArticle.subject}
                  </h3>
                </div>

                {/* KEY CONSTITUTIONAL PROVISION */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                    📜 Constitutional Mandate & Text:
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {selectedArticle.keyProvision}
                  </p>
                </div>

                {/* MAINS RELEVANCE */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                    ⚖️ UPSC Mains Relevance & Governance Linkage:
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {selectedArticle.mainsRelevance}
                  </p>
                </div>

                {/* LANDMARK CASES & AMENDMENTS */}
                {selectedArticle.landmarkCases && selectedArticle.landmarkCases.length > 0 && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      🏛️ Landmark Supreme Court Precedents:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedArticle.landmarkCases.map((c, i) => (
                        <span
                          key={`case-${i}`}
                          className="rounded-lg bg-black/50 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-20 text-xs text-white/40">
                Select an Article node in 3D orbit to view details.
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="border-t border-white/10 pt-3">
              <button
                onClick={() => {
                  sound.playVictory();
                  window.location.href = `/mains-pyqs?search=${encodeURIComponent(
                    selectedArticle?.article || "Polity"
                  )}`;
                }}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-2.5 text-xs font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
              >
                View Mains Questions on {selectedArticle?.article || "this Article"} →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STRUCTURED GRID ATLAS VIEW */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((art) => (
            <div
              key={art.article}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4.5 space-y-3 backdrop-blur-xl hover:border-purple-500/40 transition"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-purple-400 uppercase">
                  <span>{art.partRoman}</span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-white/70">{art.partCategory}</span>
                </div>
                <h4 className="mt-1 text-base font-bold text-white">
                  {art.article}: {art.subject}
                </h4>
                <p className="mt-2 text-xs text-white/80 leading-relaxed line-clamp-3">
                  {art.keyProvision}
                </p>
              </div>

              {art.landmarkCases && art.landmarkCases.length > 0 && (
                <div className="border-t border-white/5 pt-2 flex flex-wrap gap-1">
                  {art.landmarkCases.map((c, i) => (
                    <span key={i} className="rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-amber-300">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
