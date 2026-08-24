-- ============================================================================
-- REDROOM SEED DATA (PYQs, Chill Zone Games, Feature Flags)
-- ============================================================================

-- 1. SEED GAMES FOR CHILL ZONE
INSERT INTO public.games (slug, name, description, scoring_direction, is_active)
VALUES
('word-rush', 'Word Rush', 'Speed vocabulary and UPSC terminology recall challenge.', 'DESCENDING', true),
('quick-duel', 'Quick Duel', 'High-speed 1v1 multiplayer fact verification duel.', 'DESCENDING', true),
('memory-vault', 'Memory Vault', 'Pattern recognition and article recall memory matrix.', 'DESCENDING', true),
('focus-flow', 'Focus Flow', 'Zen focus and cognitive endurance rhythm test.', 'DESCENDING', true),
('blink', 'Blink Visualizer', 'Visual reflex and micro-elimination reaction trainer.', 'ASCENDING', true),
('react', 'Neural Reaction', 'Rapid cognitive split-second reflex evaluation.', 'ASCENDING', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;

-- 2. SEED DEFAULT FEATURE FLAGS
INSERT INTO public.feature_flags (id, key, name, description, is_enabled, is_beta, target_audience)
VALUES
('flag-ai-copilot', 'ai_copilot', 'AI Strategy Copilot', 'Enables deep-learning UPSC mentor and evaluation features.', true, false, 'ALL'),
('flag-offline-sync', 'offline_sync', 'Dexie Offline Cloud Sync', 'Enables zero-latency offline database sync with auto-outbox.', true, false, 'ALL'),
('flag-chill-zone', 'chill_zone', 'Chill Zone Arcade', 'Enables cognitive arcade and reflex games for cadets.', true, false, 'ALL'),
('flag-mains-diagram', 'mains_diagram_studio', 'Mains Diagram Studio', 'Enables dynamic flowchart and map diagram generators.', true, false, 'ALL'),
('flag-voice-briefs', 'voice_briefs', 'Daily Audio Briefs', 'Enables procedural WebAudio synthesis for daily news.', true, false, 'ALL')
ON CONFLICT (key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  description = EXCLUDED.description;

-- 3. SEED FOUNDATIONAL UPSC PRELIMS PYQs
INSERT INTO public.pyqs (year, subject, topic, question, important, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty)
VALUES
(2023, 'Polity', 'Preamble', 'Which one of the following factors constitutes the best safeguard of liberty in a liberal democracy?', true, 'A committed judiciary', 'Centralization of powers', 'Elected government', 'Separation of powers', 'D', 'Separation of powers ensures checks and balances, preventing arbitrary exercise of power and thereby safeguarding liberty.', 'Medium'),
(2023, 'Polity', 'Parliament', 'Consider the following statements regarding the Finance Bill and Money Bill: A Money Bill deals only with taxation and government spending. The Rajya Sabha has no power to amend or reject a Money Bill.', true, 'Statement 1 only', 'Statement 2 only', 'Both 1 and 2', 'Neither 1 nor 2', 'C', 'Under Article 110, a Money Bill contains only specified provisions, and Article 109 restricts Rajya Sabha powers to recommendations only.', 'Medium'),
(2022, 'Polity', 'Writs', 'With reference to the writs issued by the Courts in India, consider the following statements: Mandamus will not lie against a private individual. Quo-Warranto can be sought by any interested person.', true, '1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2', 'C', 'Mandamus is issued against public authorities. Quo-Warranto does not require locus standi in the strict private sense.', 'Hard'),
(2022, 'Economy', 'Monetary Policy', 'In India, which one of the following is responsible for maintaining price stability by controlling inflation?', true, 'Department of Consumer Affairs', 'Expenditure Management Commission', 'Financial Stability and Development Council', 'Reserve Bank of India', 'D', 'Under the RBI Act, 1934, the primary objective of monetary policy is to maintain price stability while keeping in mind the objective of growth.', 'Easy'),
(2021, 'History', 'Modern India', 'In the context of Indian history, the Rakhmabai case of 1884 revolved around: 1. Women''s right to gain education, 2. Age of consent, 3. Restitution of conjugal rights.', true, '1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3', 'B', 'The landmark case led by Dr. Rukhmabai led to the Age of Consent Act, 1891 and dealt with restitution of conjugal rights.', 'Hard'),
(2021, 'Environment', 'Biodiversity', 'Which one of the following is used in biochemical oxygen demand (BOD) calculation for water pollution measurement?', true, 'Oxygen consumed by microorganisms in decomposing organic matter', 'Total dissolved solids', 'Heavy metals concentration', 'Chemical oxidation of inorganic substances', 'A', 'BOD measures the amount of dissolved oxygen needed by aerobic biological organisms to break down organic material present in a given water sample.', 'Easy'),
(2020, 'Geography', 'Oceanography', 'Consider the following statements: Ocean currents are the slow surface movement of water in the ocean. Ocean currents assist in maintaining the Earth''s heat balance.', false, '1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2', 'B', 'Ocean currents can move both at the surface and deep underwater, and transfer heat from equatorial regions to polar regions.', 'Medium'),
(2020, 'Science & Technology', 'Biotechnology', 'What is the importance of using Pneumococcal Conjugate Vaccines in India? 1. These vaccines are effective against pneumonia as well as meningitis. 2. Dependence on antibiotics that are not effective against drug-resistant bacteria can be reduced.', true, '1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3', 'B', 'Pneumococcal vaccines protect against multiple invasive diseases caused by Streptococcus pneumoniae and help curb antibiotic resistance.', 'Medium')
ON CONFLICT DO NOTHING;
