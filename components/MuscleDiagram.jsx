import { useState, useEffect } from "react";

// Muscle activation data per exercise
var MUSCLE_ACT = {
  "Bench Press":         {"Pec Major (Sternal)":55,"Pec Major (Clavicular)":20,"Ant Deltoid":15,"Tricep Long Head":10},
  "Incline DB Press":    {"Pec Major (Clavicular)":50,"Pec Major (Sternal)":20,"Ant Deltoid":20,"Tricep Lateral Head":10},
  "Decline Bench Press": {"Pec Major (Sternal)":65,"Pec Minor":15,"Tricep Long Head":12,"Ant Deltoid":8},
  "Cable Fly":           {"Pec Major (Sternal)":60,"Pec Major (Clavicular)":25,"Pec Minor":10,"Bicep Short Head":5},
  "Push-ups":            {"Pec Major (Sternal)":45,"Pec Major (Clavicular)":15,"Tricep Long Head":20,"Ant Deltoid":15,"Serratus Anterior":5},
  "Deadlift":            {"Erector Spinae":30,"Glute Max":25,"Bicep Femoris (Long)":15,"Trap (Mid)":10,"Lat Dorsi":10,"Quad (Vastus Lat)":10},
  "Pull-ups":            {"Lat Dorsi":45,"Teres Major":15,"Bicep Long Head":15,"Bicep Short Head":10,"Rhomboids":10,"Lower Trap":5},
  "Barbell Row":         {"Lat Dorsi":35,"Rhomboids":20,"Trap (Mid)":15,"Bicep Long Head":15,"Erector Spinae":10,"Teres Major":5},
  "Lat Pulldown":        {"Lat Dorsi":50,"Teres Major":15,"Bicep Short Head":15,"Rhomboids":10,"Lower Trap":10},
  "Seated Cable Row":    {"Rhomboids":30,"Lat Dorsi":25,"Trap (Mid)":20,"Bicep Short Head":15,"Erector Spinae":10},
  "Overhead Press":      {"Ant Deltoid":40,"Mid Deltoid":25,"Tricep Lateral Head":20,"Tricep Long Head":10,"Upper Trap":5},
  "Lateral Raise":       {"Mid Deltoid":75,"Ant Deltoid":15,"Supraspinatus":10},
  "Face Pull":           {"Post Deltoid":40,"Infraspinatus":25,"Teres Minor":15,"Rhomboids":10,"Trap (Mid)":10},
  "Barbell Curl":        {"Bicep Long Head":45,"Bicep Short Head":35,"Brachialis":15,"Brachioradialis":5},
  "Hammer Curl":         {"Brachioradialis":40,"Brachialis":30,"Bicep Long Head":20,"Bicep Short Head":10},
  "Tricep Pushdown":     {"Tricep Lateral Head":50,"Tricep Medial Head":30,"Tricep Long Head":20},
  "Skull Crushers":      {"Tricep Long Head":45,"Tricep Lateral Head":30,"Tricep Medial Head":25},
  "Hip Thrust":          {"Glute Max":60,"Glute Med":15,"Bicep Femoris (Long)":15,"Erector Spinae":10},
  "Squat":               {"Quad (Vastus Lat)":20,"Quad (Rectus Femoris)":15,"Quad (Vastus Med)":15,"Glute Max":25,"Bicep Femoris (Long)":15,"Erector Spinae":10},
  "Leg Press":           {"Quad (Vastus Lat)":25,"Quad (Rectus Femoris)":15,"Quad (Vastus Med)":15,"Glute Max":25,"Bicep Femoris (Short)":20},
  "Romanian Deadlift":   {"Bicep Femoris (Long)":35,"Semimembranosus":25,"Glute Max":25,"Erector Spinae":15},
  "Standing Calf Raise": {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Plank":               {"Transverse Abdominis":40,"Rectus Abdominis":25,"Obliques":20,"Glute Max":15},
  "Treadmill Run":       {"Quad (Rectus Femoris)":25,"Gastrocnemius (Med)":20,"Glute Max":20,"Bicep Femoris (Long)":20,"Soleus":15},
};

var MUSCLE_COLOR = {
  "Pec Major (Sternal)":"#ff6b35","Pec Major (Clavicular)":"#ff8c5a","Pec Minor":"#ffb07a","Serratus Anterior":"#ffcc99",
  "Lat Dorsi":"#3eb8f5","Rhomboids":"#5cc8ff","Erector Spinae":"#2a9fd6","Trap (Mid)":"#7dd8ff","Trap (Upper)":"#a0e4ff","Lower Trap":"#1a7fa6","Teres Major":"#4fb0e0","Teres Minor":"#80c8e8","Infraspinatus":"#2288bb",
  "Ant Deltoid":"#b03ef5","Mid Deltoid":"#c86aff","Post Deltoid":"#8a20d4","Supraspinatus":"#d490ff","Upper Trap":"#9040d0",
  "Bicep Long Head":"#c8f53e","Bicep Short Head":"#b8e030","Brachialis":"#7aaa10","Brachioradialis":"#e8ff70",
  "Tricep Long Head":"#f5c842","Tricep Lateral Head":"#ffd966","Tricep Medial Head":"#e0aa20",
  "Quad (Rectus Femoris)":"#ff4040","Quad (Vastus Lat)":"#ff6060","Quad (Vastus Med)":"#ff2020","Quad (Vastus Int)":"#e03030","Adductor Magnus":"#ff8080",
  "Bicep Femoris (Long)":"#3ef5b0","Bicep Femoris (Short)":"#20d490","Semimembranosus":"#10b070","Semitendinosus":"#60ffc0",
  "Glute Max":"#f53eb0","Glute Med":"#ff60c0","Glute Min":"#e020a0","TFL":"#ff80d0",
  "Gastrocnemius (Med)":"#f53e3e","Gastrocnemius (Lat)":"#ff6060","Soleus":"#cc2020","Tibialis Anterior":"#ff8080",
  "Rectus Abdominis":"#3ef5f5","Obliques":"#20d4d4","Transverse Abdominis":"#10b0b0","Hip Flexors":"#60ffff",
};

var BACK_MUSCLES = new Set([
  "Lat Dorsi","Rhomboids","Erector Spinae","Trap (Mid)","Trap (Upper)","Lower Trap",
  "Teres Major","Teres Minor","Infraspinatus","Post Deltoid","Glute Max","Glute Med",
  "Glute Min","TFL","Bicep Femoris (Long)","Bicep Femoris (Short)","Semimembranosus",
  "Semitendinosus","Tricep Long Head","Tricep Lateral Head","Tricep Medial Head",
  "Supraspinatus",
]);

// ── Skin tones ──
var S = { light:"#e8aa80", mid:"#d4956a", dark:"#b87348", shadow:"#a06030", deep:"#8a5028" };

// ── FRONT body paths (viewBox 0 0 60 170) ──
var FB = [
  // Head
  {d:"M21,2 Q30,-1 39,2 Q44,8 44,16 Q44,26 30,28 Q16,26 16,16 Q16,8 21,2 Z", f:S.mid},
  {d:"M22,4 Q30,1 38,4 Q43,9 43,15 Q43,24 30,26 Q17,24 17,15 Q17,9 22,4 Z", f:S.light},
  // Ear details
  {d:"M16,14 Q14,14 14,18 Q14,21 17,21 L17,14 Z", f:S.dark},
  {d:"M44,14 Q46,14 46,18 Q46,21 43,21 L43,14 Z", f:S.dark},
  // Neck
  {d:"M24,26 Q30,25 36,26 L37,33 Q33,35 30,35 Q27,35 23,33 Z", f:S.dark},
  {d:"M25,27 Q30,26 35,27 L36,32 Q32,34 30,34 Q28,34 24,32 Z", f:S.mid},
  // Traps/Shoulders base
  {d:"M8,32 Q18,27 30,29 Q42,27 52,32 L50,40 Q40,36 30,37 Q20,36 10,40 Z", f:S.dark},
  // Chest base
  {d:"M10,38 Q20,35 30,36 Q40,35 50,38 L50,58 Q40,62 30,63 Q20,62 10,58 Z", f:S.mid},
  // Pec left shape
  {d:"M10,38 Q20,35 30,38 L29,58 Q19,62 11,57 Q8,53 9,45 Z", f:S.dark},
  // Pec right shape
  {d:"M30,38 Q40,35 50,38 L51,45 Q52,53 49,57 Q41,62 31,58 Z", f:S.dark},
  // Pec left highlight
  {d:"M11,40 Q20,37 29,40 L28,56 Q19,59 12,55 Z", f:S.mid},
  // Pec right highlight
  {d:"M31,40 Q40,37 49,40 L48,55 Q41,59 32,56 Z", f:S.mid},
  // Nipple area (sternum line)
  {d:"M29,38 L31,38 L31,63 L29,63 Z", f:S.shadow},
  // Serratus left
  {d:"M8,48 Q11,46 12,52 L11,60 Q7,58 7,54 Z", f:S.shadow},
  {d:"M8,56 Q11,54 12,60 L11,66 Q7,64 7,60 Z", f:S.shadow},
  // Serratus right
  {d:"M52,48 Q49,46 48,52 L49,60 Q53,58 53,54 Z", f:S.shadow},
  {d:"M52,56 Q49,54 48,60 L49,66 Q53,64 53,60 Z", f:S.shadow},
  // Abs - 6 pack with definition
  {d:"M19,60 Q24,58 30,59 L30,68 Q25,70 19,69 Z", f:S.dark},
  {d:"M30,59 Q36,58 41,60 L41,69 Q36,70 30,68 Z", f:S.dark},
  {d:"M19,69 Q24,67 30,68 L30,77 Q25,79 19,78 Z", f:S.mid},
  {d:"M30,68 Q36,67 41,69 L41,78 Q36,79 30,77 Z", f:S.mid},
  {d:"M19,78 Q24,76 30,77 L30,85 Q25,87 19,86 Z", f:S.dark},
  {d:"M30,77 Q36,76 41,78 L41,86 Q36,87 30,85 Z", f:S.dark},
  // Linea alba
  {d:"M29,59 L31,59 L31,86 L29,86 Z", f:S.shadow},
  // Horizontal ab lines
  {d:"M19,68 Q30,67 41,68 L41,69 Q30,70 19,69 Z", f:S.shadow},
  {d:"M19,77 Q30,76 41,77 L41,78 Q30,79 19,78 Z", f:S.shadow},
  // Obliques
  {d:"M9,58 Q15,55 19,59 L18,82 Q12,86 8,80 Z", f:S.dark},
  {d:"M41,59 Q46,55 51,58 L52,80 Q48,86 42,82 Z", f:S.dark},
  // Hip flexors/lower abs
  {d:"M17,84 Q23,82 30,83 L29,93 Q22,96 16,92 Z", f:S.mid},
  {d:"M30,83 Q37,82 43,84 L44,92 Q38,96 31,93 Z", f:S.mid},
  // Left deltoid
  {d:"M4,32 Q10,28 14,34 L13,46 Q7,49 3,45 Z", f:S.dark},
  {d:"M5,34 Q10,30 13,35 L12,44 Q8,47 4,44 Z", f:S.mid},
  // Right deltoid
  {d:"M46,34 Q50,28 56,32 L57,45 Q53,49 47,46 Z", f:S.dark},
  {d:"M47,35 Q50,30 55,34 L56,44 Q52,47 48,44 Z", f:S.mid},
  // Left bicep
  {d:"M2,45 Q7,43 11,46 L10,63 Q6,66 1,62 Z", f:S.mid},
  {d:"M3,46 Q7,44 10,47 L9,61 Q6,64 2,61 Z", f:S.light},
  // Right bicep
  {d:"M49,46 Q53,43 58,45 L59,62 Q54,66 50,63 Z", f:S.mid},
  {d:"M50,47 Q53,44 57,46 L58,61 Q54,64 51,61 Z", f:S.light},
  // Bicep peak definition
  {d:"M4,52 Q7,50 10,52 L9,58 Q7,59 4,57 Z", f:S.dark},
  {d:"M50,52 Q53,50 56,52 L55,58 Q53,59 50,57 Z", f:S.dark},
  // Left forearm
  {d:"M1,62 Q6,60 10,63 L9,83 Q5,86 0,82 Z", f:S.dark},
  {d:"M2,63 Q6,61 9,64 L8,81 Q5,84 1,81 Z", f:S.mid},
  // Right forearm
  {d:"M50,63 Q54,60 59,62 L60,82 Q55,86 51,83 Z", f:S.dark},
  {d:"M51,64 Q54,61 58,63 L59,81 Q55,84 52,81 Z", f:S.mid},
  // Left hand
  {d:"M0,82 Q5,80 9,83 L8,95 Q4,97 -1,94 Z", f:S.mid},
  // Right hand
  {d:"M51,83 Q55,80 60,82 L61,94 Q57,97 52,95 Z", f:S.mid},
  // Left quad
  {d:"M13,92 Q21,89 30,91 L29,123 Q20,127 12,122 Z", f:S.dark},
  // Right quad
  {d:"M30,91 Q39,89 47,92 L48,122 Q40,127 31,123 Z", f:S.dark},
  // Left quad divisions
  {d:"M17,93 Q22,91 27,93 L26,121 Q21,124 16,120 Z", f:S.mid},
  {d:"M21,96 Q25,94 29,96 L28,118 Q24,121 20,118 Z", f:S.light},
  // Right quad divisions
  {d:"M33,93 Q38,91 43,93 L44,120 Q39,124 34,121 Z", f:S.mid},
  {d:"M31,96 Q35,94 39,96 L40,118 Q36,121 32,118 Z", f:S.light},
  // Knee caps
  {d:"M13,122 Q21,120 29,122 L28,131 Q20,133 12,130 Z", f:S.shadow},
  {d:"M31,122 Q39,120 47,122 L48,130 Q40,133 32,131 Z", f:S.shadow},
  {d:"M15,122 Q21,121 28,122 L27,130 Q21,132 14,129 Z", f:S.mid},
  {d:"M32,122 Q38,121 46,122 L47,129 Q39,132 33,130 Z", f:S.mid},
  // Left calf
  {d:"M12,131 Q20,129 27,131 L26,153 Q19,156 11,152 Z", f:S.dark},
  {d:"M14,132 Q20,130 26,132 L25,151 Q19,154 13,150 Z", f:S.mid},
  // Right calf
  {d:"M33,131 Q40,129 48,131 L49,152 Q41,156 34,153 Z", f:S.dark},
  {d:"M34,132 Q40,130 47,132 L48,150 Q41,154 35,151 Z", f:S.mid},
  // Calf inner definition
  {d:"M16,136 Q19,134 22,136 L21,150 Q19,151 16,149 Z", f:S.light},
  {d:"M38,136 Q41,134 44,136 L43,149 Q41,151 38,149 Z", f:S.light},
  // Left ankle/foot
  {d:"M11,152 Q18,150 26,152 L25,164 Q17,166 10,163 Z", f:S.mid},
  // Right ankle/foot
  {d:"M34,152 Q41,150 49,152 L50,163 Q42,166 35,164 Z", f:S.mid},
];

// ── BACK body paths (viewBox 0 0 60 170, same coords) ──
var BB = [
  // Head back
  {d:"M21,2 Q30,-1 39,2 Q44,8 44,16 Q44,26 30,28 Q16,26 16,16 Q16,8 21,2 Z", f:S.mid},
  {d:"M22,4 Q30,1 38,4 Q43,9 43,15 Q43,24 30,26 Q17,24 17,15 Q17,9 22,4 Z", f:S.light},
  {d:"M16,14 Q14,14 14,18 Q14,21 17,21 L17,14 Z", f:S.dark},
  {d:"M44,14 Q46,14 46,18 Q46,21 43,21 L43,14 Z", f:S.dark},
  // Neck back
  {d:"M24,26 Q30,25 36,26 L37,33 Q33,35 30,35 Q27,35 23,33 Z", f:S.dark},
  // Upper traps - wide, prominent
  {d:"M8,32 Q18,27 30,29 Q42,27 52,32 L50,40 Q40,36 30,37 Q20,36 10,40 Z", f:S.dark},
  {d:"M10,33 Q18,28 30,30 Q42,28 50,33 L49,39 Q40,35 30,36 Q20,35 11,39 Z", f:S.mid},
  // Mid trap
  {d:"M12,39 Q20,36 30,37 Q40,36 48,39 L47,54 Q38,58 30,59 Q22,58 13,54 Z", f:S.dark},
  {d:"M13,40 Q20,37 30,38 Q40,37 47,40 L46,53 Q38,57 30,58 Q22,57 14,53 Z", f:S.mid},
  // Rhomboids between shoulder blades
  {d:"M18,40 Q24,37 30,38 Q36,37 42,40 L41,54 Q36,57 30,58 Q24,57 19,54 Z", f:S.shadow},
  // Lats left - wide wing shape
  {d:"M8,42 Q14,38 18,44 L16,74 Q9,78 5,72 Z", f:S.dark},
  {d:"M9,44 Q13,40 17,45 L15,72 Q10,75 6,70 Z", f:S.mid},
  // Lats right
  {d:"M52,42 Q46,38 42,44 L44,74 Q51,78 55,72 Z", f:S.dark},
  {d:"M51,44 Q47,40 43,45 L45,72 Q50,75 54,70 Z", f:S.mid},
  // Teres major/minor left
  {d:"M8,40 Q12,36 16,41 L15,52 Q10,55 7,51 Z", f:S.shadow},
  // Teres major/minor right
  {d:"M52,40 Q48,36 44,41 L45,52 Q50,55 53,51 Z", f:S.shadow},
  // Infraspinatus
  {d:"M14,36 Q22,32 30,33 Q38,32 46,36 L45,48 Q38,52 30,53 Q22,52 15,48 Z", f:S.mid},
  // Erector spinae - central columns
  {d:"M26,38 Q28,36 30,38 L29,78 Q27,79 25,78 Z", f:S.shadow},
  {d:"M30,38 Q32,36 34,38 L33,78 Q31,79 30,78 Z", f:S.shadow},
  {d:"M27,40 Q29,38 30,40 L29,76 Q28,77 26,76 Z", f:S.dark},
  {d:"M30,40 Q31,38 33,40 L32,76 Q31,77 30,76 Z", f:S.dark},
  // Lower back
  {d:"M16,72 Q22,69 30,70 Q38,69 44,72 L43,82 Q37,86 30,87 Q23,86 17,82 Z", f:S.mid},
  // Glutes - rounded, defined
  {d:"M12,87 Q20,82 30,84 L29,108 Q20,113 11,108 Z", f:S.dark},
  {d:"M30,84 Q40,82 48,87 L49,108 Q40,113 31,108 Z", f:S.dark},
  {d:"M14,88 Q21,84 30,86 L29,106 Q21,110 13,106 Z", f:S.mid},
  {d:"M30,86 Q39,84 46,88 L47,106 Q39,110 31,106 Z", f:S.mid},
  // Glute crease
  {d:"M12,108 Q21,106 30,107 Q39,106 48,108 L48,110 Q39,112 30,111 Q21,112 12,110 Z", f:S.shadow},
  // Glute med visible above glute max
  {d:"M10,78 Q18,74 26,77 L25,88 Q17,91 9,87 Z", f:S.dark},
  {d:"M34,77 Q42,74 50,78 L51,87 Q43,91 35,88 Z", f:S.dark},
  // Left deltoid back
  {d:"M4,32 Q10,28 14,35 L13,46 Q7,50 3,46 Z", f:S.dark},
  {d:"M5,33 Q10,29 13,36 L12,45 Q8,48 4,44 Z", f:S.mid},
  // Right deltoid back
  {d:"M56,32 Q50,28 46,35 L47,46 Q53,50 57,46 Z", f:S.dark},
  {d:"M55,33 Q50,29 47,36 L48,45 Q52,48 56,44 Z", f:S.mid},
  // Left tricep
  {d:"M2,46 Q7,44 12,47 L11,65 Q6,68 1,64 Z", f:S.dark},
  {d:"M3,47 Q7,45 11,48 L10,63 Q6,66 2,62 Z", f:S.mid},
  // Right tricep
  {d:"M58,46 Q53,44 48,47 L49,65 Q54,68 59,64 Z", f:S.dark},
  {d:"M57,47 Q53,45 49,48 L50,63 Q54,66 58,62 Z", f:S.mid},
  // Tricep definition horseshoe
  {d:"M3,54 Q7,52 11,54 L10,60 Q7,61 3,59 Z", f:S.light},
  {d:"M57,54 Q53,52 49,54 L50,60 Q53,61 57,59 Z", f:S.light},
  // Left forearm back
  {d:"M1,64 Q6,62 11,65 L10,84 Q5,87 0,83 Z", f:S.dark},
  {d:"M2,65 Q6,63 10,66 L9,82 Q5,85 1,82 Z", f:S.mid},
  // Right forearm back
  {d:"M59,64 Q54,62 49,65 L50,84 Q55,87 60,83 Z", f:S.dark},
  {d:"M58,65 Q54,63 50,66 L51,82 Q55,85 59,82 Z", f:S.mid},
  // Left hand
  {d:"M0,83 Q4,81 10,84 L9,95 Q5,97 0,94 Z", f:S.mid},
  // Right hand
  {d:"M50,84 Q56,81 60,83 L61,94 Q56,97 51,95 Z", f:S.mid},
  // Hamstrings left - 3 heads
  {d:"M12,108 Q20,105 28,107 L27,135 Q19,139 11,134 Z", f:S.dark},
  {d:"M14,109 Q20,107 27,109 L26,133 Q19,136 13,132 Z", f:S.mid},
  // Ham divisions left
  {d:"M16,110 Q19,108 22,110 L21,132 Q19,133 15,131 Z", f:S.light},
  {d:"M22,110 Q25,108 27,110 L26,132 Q24,133 21,131 Z", f:S.mid},
  // Hamstrings right
  {d:"M32,107 Q40,105 48,108 L49,134 Q41,139 33,135 Z", f:S.dark},
  {d:"M33,109 Q40,107 46,109 L47,132 Q41,136 34,133 Z", f:S.mid},
  // Ham divisions right
  {d:"M33,110 Q35,108 38,110 L37,132 Q35,133 32,131 Z", f:S.mid},
  {d:"M38,110 Q41,108 44,110 L43,131 Q41,133 37,132 Z", f:S.light},
  // Knee back
  {d:"M12,134 Q20,132 28,134 L27,143 Q19,145 11,142 Z", f:S.shadow},
  {d:"M32,134 Q40,132 48,134 L49,142 Q41,145 33,143 Z", f:S.shadow},
  {d:"M14,134 Q20,133 27,134 L26,141 Q20,143 13,141 Z", f:S.mid},
  {d:"M33,134 Q39,133 47,134 L48,141 Q40,143 34,141 Z", f:S.mid},
  // Calves back
  {d:"M11,143 Q19,141 27,143 L26,158 Q18,161 10,157 Z", f:S.dark},
  {d:"M13,144 Q19,142 26,144 L25,156 Q19,159 12,156 Z", f:S.mid},
  {d:"M33,143 Q41,141 49,143 L50,157 Q42,161 34,158 Z", f:S.dark},
  {d:"M34,144 Q40,142 48,144 L49,156 Q41,159 35,156 Z", f:S.mid},
  // Calf definition
  {d:"M15,148 Q18,146 21,148 L20,156 Q18,157 15,155 Z", f:S.light},
  {d:"M39,148 Q42,146 45,148 L44,155 Q42,157 39,155 Z", f:S.light},
  // Achilles/ankle
  {d:"M10,157 Q18,155 26,157 L25,166 Q17,168 9,165 Z", f:S.mid},
  {d:"M34,157 Q42,155 50,157 L51,165 Q43,168 35,166 Z", f:S.mid},
];

// ── Muscle overlay paths FRONT (viewBox 0 0 60 170) ──
var MF = {
  "Pec Major (Sternal)":      "M10,40 Q20,37 30,39 L29,58 Q19,62 11,57 Z M30,39 Q40,37 50,40 L49,57 Q41,62 31,58 Z",
  "Pec Major (Clavicular)":   "M10,38 Q20,35 30,37 L29,42 Q20,43 11,41 Z M30,37 Q40,35 50,38 L49,41 Q40,43 31,42 Z",
  "Pec Minor":                "M14,40 Q21,37 29,39 L28,50 Q21,52 15,49 Z M31,39 Q39,37 46,40 L45,49 Q39,52 32,50 Z",
  "Serratus Anterior":        "M8,47 Q11,45 13,50 L12,57 Q9,58 7,54 Z M47,50 Q49,45 52,47 L53,54 Q51,58 48,57 Z M8,56 Q11,54 13,59 L12,64 Q8,65 7,61 Z M47,59 Q49,54 52,56 L53,61 Q51,65 48,64 Z",
  "Ant Deltoid":              "M4,32 Q10,28 14,35 L13,47 Q7,50 3,46 Z M46,35 Q50,28 56,32 L57,46 Q53,50 47,47 Z",
  "Mid Deltoid":              "M1,43 Q6,40 10,44 L9,57 Q4,60 0,56 Z M50,44 Q54,40 59,43 L60,56 Q56,60 51,57 Z",
  "Bicep Long Head":          "M2,45 Q6,43 9,46 L8,61 Q4,64 1,60 Z M51,46 Q54,43 58,45 L59,60 Q56,64 52,61 Z",
  "Bicep Short Head":         "M6,45 Q9,43 12,46 L11,61 Q8,64 5,61 Z M48,46 Q51,43 54,45 L55,61 Q52,64 49,61 Z",
  "Brachialis":               "M2,60 Q6,58 10,61 L9,69 Q6,71 2,68 Z M50,61 Q54,58 58,60 L59,68 Q56,71 51,69 Z",
  "Brachioradialis":          "M1,68 Q5,66 9,69 L8,83 Q4,85 0,82 Z M51,69 Q55,66 59,68 L60,82 Q56,85 52,83 Z",
  "Flex Carpi Radialis":      "M1,81 Q4,79 8,81 L7,91 Q4,93 0,90 Z M52,81 Q56,79 59,81 L60,90 Q56,93 53,91 Z",
  "Flex Carpi Ulnaris":       "M0,79 Q3,77 5,80 L4,90 Q2,91 -1,89 Z M55,80 Q57,77 60,79 L61,89 Q59,91 56,90 Z",
  "Pronator Teres":           "M4,63 Q8,61 11,64 L10,71 Q7,73 4,70 Z M49,64 Q52,61 56,63 L57,70 Q54,73 50,71 Z",
  "Flex Digitorum":           "M0,89 Q4,87 8,90 L7,95 Q4,97 0,94 Z M52,90 Q56,87 60,89 L61,94 Q57,97 53,95 Z",
  "Rectus Abdominis":         "M19,60 Q24,58 30,59 L30,85 Q25,87 19,86 Z M30,59 Q36,58 41,60 L41,86 Q36,87 30,85 Z",
  "Obliques":                 "M9,58 Q15,55 19,59 L18,82 Q12,86 8,80 Z M41,59 Q46,55 51,58 L52,80 Q48,86 42,82 Z",
  "Transverse Abdominis":     "M17,66 Q23,64 30,65 L30,82 Q24,83 17,82 Z M30,65 Q37,64 43,66 L43,82 Q37,83 30,82 Z",
  "Hip Flexors":              "M17,83 Q23,81 30,82 L29,93 Q22,95 16,91 Z M30,82 Q37,81 43,83 L44,91 Q38,95 31,93 Z",
  "Quad (Rectus Femoris)":    "M22,92 Q26,90 30,91 L29,121 Q25,124 21,120 Z",
  "Quad (Vastus Lat)":        "M13,93 Q18,90 22,94 L21,122 Q15,126 11,121 Z M38,94 Q42,90 47,93 L48,121 Q44,126 39,122 Z",
  "Quad (Vastus Med)":        "M24,100 Q27,97 32,100 L31,121 Q27,124 23,121 Z",
  "Quad (Vastus Int)":        "M21,92 Q25,90 29,92 L28,120 Q24,122 20,119 Z",
  "Adductor Magnus":          "M22,92 Q26,90 29,92 L28,118 Q25,120 21,117 Z M31,92 Q34,90 38,92 L39,117 Q35,120 32,118 Z",
  "Gastrocnemius (Med)":      "M13,131 Q19,129 26,131 L25,152 Q18,155 12,151 Z M34,131 Q40,129 47,131 L48,151 Q41,155 35,152 Z",
  "Gastrocnemius (Lat)":      "M10,133 Q14,131 18,135 L17,152 Q12,155 8,151 Z M42,135 Q46,131 50,133 L51,151 Q47,155 43,152 Z",
  "Soleus":                   "M11,146 Q20,144 29,144 L30,158 Q20,160 10,158 Z M31,144 Q40,144 49,146 L50,158 Q40,160 30,158 Z",
  "Tibialis Anterior":        "M10,131 Q14,129 17,133 L16,151 Q12,153 9,149 Z M43,133 Q46,129 50,131 L51,149 Q48,153 44,151 Z",
};

// ── Muscle overlay paths BACK (viewBox 0 0 60 170) ──
var MB = {
  "Trap (Upper)":             "M8,32 Q18,27 30,29 Q42,27 52,32 L50,40 Q40,36 30,37 Q20,36 10,40 Z",
  "Trap (Mid)":               "M12,39 Q20,36 30,37 Q40,36 48,39 L47,54 Q38,58 30,59 Q22,58 13,54 Z",
  "Lower Trap":               "M14,53 Q21,50 30,51 Q39,50 46,53 L45,63 Q38,67 30,68 Q22,67 15,63 Z",
  "Rhomboids":                "M18,40 Q24,37 30,38 Q36,37 42,40 L41,54 Q36,57 30,58 Q24,57 19,54 Z",
  "Lat Dorsi":                "M8,42 Q14,38 18,45 L16,73 Q9,77 5,71 Z M42,45 Q46,38 52,42 L55,71 Q51,77 44,73 Z",
  "Teres Major":              "M8,40 Q12,36 16,42 L15,54 Q10,57 7,52 Z M44,42 Q48,36 52,40 L53,52 Q50,57 45,54 Z",
  "Teres Minor":              "M8,36 Q12,32 16,38 L15,46 Q10,48 7,44 Z M44,38 Q48,32 52,36 L53,44 Q50,48 45,46 Z",
  "Infraspinatus":            "M14,36 Q22,32 30,33 Q38,32 46,36 L45,48 Q38,52 30,53 Q22,52 15,48 Z",
  "Erector Spinae":           "M26,38 Q28,36 30,38 L29,78 Q27,79 25,78 Z M30,38 Q32,36 34,38 L33,78 Q31,79 30,78 Z",
  "Post Deltoid":             "M4,32 Q10,28 14,36 L13,47 Q7,51 3,47 Z M46,36 Q50,28 56,32 L57,47 Q53,51 47,47 Z",
  "Glute Max":                "M12,87 Q20,82 30,84 L29,108 Q20,113 11,108 Z M30,84 Q40,82 48,87 L49,108 Q40,113 31,108 Z",
  "Glute Med":                "M10,78 Q18,74 26,77 L25,88 Q17,91 9,87 Z M34,77 Q42,74 50,78 L51,87 Q43,91 35,88 Z",
  "Glute Min":                "M12,80 Q19,76 26,79 L25,88 Q18,90 11,87 Z M34,79 Q41,76 48,80 L49,87 Q42,90 35,88 Z",
  "TFL":                      "M9,79 Q13,75 16,81 L15,94 Q10,97 7,92 Z M44,81 Q47,75 51,79 L53,92 Q50,97 45,94 Z",
  "Bicep Femoris (Long)":     "M12,108 Q18,105 25,108 L24,133 Q17,137 11,132 Z M35,108 Q42,105 48,108 L49,132 Q43,137 36,133 Z",
  "Bicep Femoris (Short)":    "M13,118 Q18,115 24,118 L23,135 Q17,138 12,134 Z M36,118 Q42,115 47,118 L48,134 Q43,138 37,135 Z",
  "Semimembranosus":          "M21,108 Q25,105 29,108 L28,133 Q24,136 20,133 Z",
  "Semitendinosus":           "M16,108 Q20,105 24,108 L23,133 Q19,136 15,133 Z",
  "Tricep Long Head":         "M3,46 Q7,43 12,47 L11,65 Q6,68 2,64 Z M48,47 Q53,43 57,46 L58,64 Q54,68 49,65 Z",
  "Tricep Lateral Head":      "M1,47 Q5,44 9,48 L8,65 Q3,68 0,64 Z M51,48 Q55,44 59,47 L60,64 Q57,68 52,65 Z",
  "Tricep Medial Head":       "M4,54 Q7,52 10,55 L9,65 Q7,66 4,64 Z M50,55 Q53,52 56,54 L57,64 Q55,66 51,65 Z",
  "Supraspinatus":            "M16,34 Q22,30 30,31 Q38,30 44,34 L43,42 Q37,38 30,39 Q23,38 17,42 Z",
  "Levator Scapulae":         "M16,30 Q19,27 22,32 L21,42 Q18,44 15,41 Z M38,32 Q41,27 44,30 L45,41 Q42,44 39,42 Z",
  "Ext Carpi Ulnaris":        "M0,64 Q4,62 8,65 L7,80 Q3,82 -1,79 Z M52,65 Q56,62 60,64 L61,79 Q57,82 53,80 Z",
  "Gastrocnemius (Med)_back": "M21,143 Q25,141 29,143 L28,158 Q24,161 20,158 Z",
  "Gastrocnemius (Lat)_back": "M15,143 Q19,141 22,143 L21,158 Q17,161 14,158 Z M28,143 Q31,141 35,143 L34,158 Q30,161 27,158 Z",
  "Soleus_back":              "M11,153 Q20,151 29,152 L30,163 Q20,165 10,163 Z M31,152 Q40,151 49,153 L50,163 Q40,165 31,163 Z",
};

export default function MuscleDiagram({ exerciseName, color }) {
  var acts = MUSCLE_ACT[exerciseName] || {};
  var muscles = Object.keys(acts).sort(function(a,b){return acts[b]-acts[a];});
  if (!muscles.length) return null;
  var GC = color || "#c8f53e";
  var primaryMuscles = muscles.filter(function(m){return acts[m]>=30;});

  var [pulsePhase, setPulsePhase] = useState(0);
  useEffect(function(){
    var t = setInterval(function(){
      setPulsePhase(function(p){return (p+1)%60;});
    }, 40);
    return function(){clearInterval(t);};
  }, [exerciseName]);
  var pulse = 0.2 * Math.sin((pulsePhase/60)*2*Math.PI);

  // Front muscle overlays
  var frontOverlays = muscles.map(function(m){
    if (BACK_MUSCLES.has(m)) return null;
    var pd = MF[m]; if (!pd) return null;
    var pct = acts[m], col = MUSCLE_COLOR[m] || GC, isPrimary = pct >= 30;
    var op = 0.5 + (pct/100)*0.45 + (isPrimary ? pulse*0.25 : 0);
    return (
      <g key={m}>
        {isPrimary && <path d={pd} fill={col} opacity={0.3+Math.abs(pulse)*0.2}/>}
        <path d={pd} fill={col} opacity={op}
          stroke={isPrimary ? "#fff" : "none"}
          strokeWidth={isPrimary ? "0.6" : "0"}
          strokeOpacity="0.5"/>
        {isPrimary && <path d={pd} fill="none" stroke={col} strokeWidth="0.8" strokeOpacity="0.8"/>}
      </g>
    );
  });

  // Back muscle overlays
  var backOverlays = muscles.map(function(m){
    if (!BACK_MUSCLES.has(m)) return null;
    var pd = MB[m] || MB[m+"_back"]; if (!pd) return null;
    var pct = acts[m], col = MUSCLE_COLOR[m] || GC, isPrimary = pct >= 30;
    var op = 0.5 + (pct/100)*0.45 + (isPrimary ? pulse*0.25 : 0);
    return (
      <g key={m}>
        {isPrimary && <path d={pd} fill={col} opacity={0.3+Math.abs(pulse)*0.2}/>}
        <path d={pd} fill={col} opacity={op}
          stroke={isPrimary ? "#fff" : "none"}
          strokeWidth={isPrimary ? "0.6" : "0"}
          strokeOpacity="0.5"/>
        {isPrimary && <path d={pd} fill="none" stroke={col} strokeWidth="0.8" strokeOpacity="0.8"/>}
      </g>
    );
  });

  return (
    <div style={{background:"linear-gradient(160deg,#0e0e18,#070710)",borderRadius:16,padding:"16px",marginBottom:10,border:"1px solid #1e1e2a",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
      <div style={{fontSize:9,color:"#555",letterSpacing:1.5,marginBottom:12,textAlign:"center"}}>MUSCLE ACTIVATION</div>
      <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:14}}>
        {/* FRONT */}
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,color:"#555",marginBottom:5,letterSpacing:1,fontWeight:700}}>FRONT</div>
          <svg viewBox="0 0 60 170" width="90" height="245" style={{overflow:"visible",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.8))"}}>
            <defs>
              <linearGradient id="glF" x1="25%" y1="0%" x2="75%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.14"/>
                <stop offset="100%" stopColor="#000" stopOpacity="0.28"/>
              </linearGradient>
            </defs>
            {FB.map(function(p,i){return <path key={i} d={p.d} fill={p.f} stroke="#6a3820" strokeWidth="0.3" strokeOpacity="0.6"/>;}) }
            {FB.map(function(p,i){return <path key={"g"+i} d={p.d} fill="url(#glF)" opacity="0.55"/>;}) }
            {frontOverlays}
          </svg>
        </div>
        {/* BACK */}
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,color:"#555",marginBottom:5,letterSpacing:1,fontWeight:700}}>BACK</div>
          <svg viewBox="0 0 60 170" width="90" height="245" style={{overflow:"visible",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.8))"}}>
            <defs>
              <linearGradient id="glB" x1="75%" y1="0%" x2="25%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.14"/>
                <stop offset="100%" stopColor="#000" stopOpacity="0.28"/>
              </linearGradient>
            </defs>
            {BB.map(function(p,i){return <path key={i} d={p.d} fill={p.f} stroke="#6a3820" strokeWidth="0.3" strokeOpacity="0.6"/>;}) }
            {BB.map(function(p,i){return <path key={"g"+i} d={p.d} fill="url(#glB)" opacity="0.55"/>;}) }
            {backOverlays}
          </svg>
        </div>
      </div>

      {/* Muscle list */}
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {muscles.map(function(m){
          var pct = acts[m], col = MUSCLE_COLOR[m] || GC;
          var isPrimary = pct >= 30, isSec = pct >= 15 && pct < 30;
          return (
            <div key={m}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:9,height:9,borderRadius:3,background:col,boxShadow:isPrimary?"0 0 8px "+col+"cc":"none",flexShrink:0}}/>
                  <span style={{fontSize:11,color:isPrimary?"#e8e4dc":"#888",fontWeight:isPrimary?"700":"400"}}>{m}</span>
                  {isPrimary && <span style={{fontSize:7,background:col+"22",color:col,borderRadius:4,padding:"1px 5px",fontWeight:700,border:"1px solid "+col+"55"}}>PRIMARY</span>}
                  {isSec && <span style={{fontSize:7,background:"#1e1e2a",color:"#666",borderRadius:4,padding:"1px 5px"}}>SECONDARY</span>}
                </div>
                <span style={{fontSize:11,fontWeight:700,color:col}}>{pct}%</span>
              </div>
              <div style={{background:"#0d0d15",borderRadius:99,height:6,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,"+col+"88,"+col+")",width:pct+"%",transition:"width .6s ease",boxShadow:isPrimary?"0 0 8px "+col+"66":"none"}}/>
              </div>
            </div>
          );
        })}
      </div>

      {primaryMuscles.length > 0 && (
        <div style={{marginTop:12,padding:"8px 11px",background:GC+"0a",border:"1px solid "+GC+"22",borderRadius:9,display:"flex",gap:6,alignItems:"center"}}>
          <div style={{width:6,height:6,borderRadius:3,background:GC,boxShadow:"0 0 8px "+GC,flexShrink:0}}/>
          <div style={{fontSize:10,color:GC}}><strong>Primary:</strong> {primaryMuscles.join(" \u00b7 ")}</div>
        </div>
      )}
    </div>
  );
}
