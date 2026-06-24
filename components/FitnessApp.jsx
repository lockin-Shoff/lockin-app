import { useState, useRef, useEffect } from "react";
import { supabase as sbClient } from "../lib/supabase";

var EM = {
  run:"\uD83C\uDFC3",bike:"\uD83D\uDEB4",swim:"\uD83C\uDFCA",lift:"\uD83C\uDFCB",
  yoga:"\uD83E\uDDD8",bolt:"\u26A1",rope:"\uD83E\uDEA2",flex:"\uD83D\uDCAA",
  stretch:"\uD83E\uDD38",box:"\uD83E\uDD4A",chicken:"\uD83C\uDF57",rice:"\uD83C\uDF5A",
  salad:"\uD83E\uDD57",banana:"\uD83C\uDF4C",yogurt:"\uD83E\uDD5B",egg:"\uD83E\uDD5A",
  avo:"\uD83E\uDD51",oat:"\uD83E\uDD63",nut:"\uD83E\uDD5C",chocbar:"\uD83C\uDF6B",
  fire:"\uD83D\uDD25",medal:"\uD83C\uDFC5",plate:"\uD83C\uDF7D",
  bulk:"\uD83D\uDCAA",shred:"\uD83D\uDD25",bal:"\u2696",endur:"\uD83C\uDFC3",
  a1:"\uD83D\uDCAA",a2:"\uD83C\uDFCB",a3:"\uD83C\uDFC3",a4:"\uD83E\uDD38",
  a5:"\uD83E\uDD4A",a6:"\uD83D\uDEB4",a7:"\uD83C\uDFCA",a8:"\u26A1",
  a9:"\uD83D\uDD25",a10:"\uD83E\uDDD8",
};

var MUSCLE_ACT = {
  "Bench Press":         {"Pec Major (Sternal)":55,"Pec Major (Clavicular)":20,"Ant Deltoid":15,"Tricep Long Head":10},
  "Incline DB Press":    {"Pec Major (Clavicular)":50,"Pec Major (Sternal)":20,"Ant Deltoid":20,"Tricep Lateral Head":10},
  "Decline Bench Press": {"Pec Major (Sternal)":65,"Pec Minor":15,"Tricep Long Head":12,"Ant Deltoid":8},
  "Cable Fly":           {"Pec Major (Sternal)":60,"Pec Major (Clavicular)":25,"Pec Minor":10,"Bicep Short Head":5},
  "Pec Deck":            {"Pec Major (Sternal)":65,"Pec Major (Clavicular)":25,"Pec Minor":10},
  "Push-ups":            {"Pec Major (Sternal)":45,"Pec Major (Clavicular)":15,"Tricep Long Head":20,"Ant Deltoid":15,"Serratus Anterior":5},
  "Chest Dips":          {"Pec Major (Sternal)":50,"Pec Minor":15,"Tricep Long Head":20,"Ant Deltoid":10,"Rhomboids":5},
  "DB Pullover":         {"Pec Major (Sternal)":35,"Lat Dorsi":30,"Tricep Long Head":20,"Teres Major":15},
  "Landmine Press":      {"Pec Major (Clavicular)":45,"Ant Deltoid":30,"Tricep Lateral Head":15,"Serratus Anterior":10},
  "Deadlift":            {"Erector Spinae":30,"Glute Max":25,"Bicep Femoris (Long)":15,"Trap (Mid)":10,"Lat Dorsi":10,"Quad (Vastus Lat)":10},
  "Pull-ups":            {"Lat Dorsi":45,"Teres Major":15,"Bicep Long Head":15,"Bicep Short Head":10,"Rhomboids":10,"Lower Trap":5},
  "Barbell Row":         {"Lat Dorsi":35,"Rhomboids":20,"Trap (Mid)":15,"Bicep Long Head":15,"Erector Spinae":10,"Teres Major":5},
  "Lat Pulldown":        {"Lat Dorsi":50,"Teres Major":15,"Bicep Short Head":15,"Rhomboids":10,"Lower Trap":10},
  "Seated Cable Row":    {"Rhomboids":30,"Lat Dorsi":25,"Trap (Mid)":20,"Bicep Short Head":15,"Erector Spinae":10},
  "T-Bar Row":           {"Lat Dorsi":30,"Rhomboids":25,"Trap (Mid)":20,"Bicep Long Head":15,"Erector Spinae":10},
  "Single Arm DB Row":   {"Lat Dorsi":40,"Rhomboids":20,"Bicep Long Head":15,"Trap (Mid)":15,"Obliques":10},
  "Chest Supported Row": {"Rhomboids":35,"Trap (Mid)":25,"Lat Dorsi":20,"Bicep Short Head":15,"Lower Trap":5},
  "Straight Arm Pulldown":{"Lat Dorsi":55,"Teres Major":20,"Tricep Long Head":15,"Post Deltoid":10},
  "Rack Pull":           {"Erector Spinae":40,"Trap (Upper)":20,"Glute Max":20,"Bicep Femoris (Long)":10,"Rhomboids":10},
  "Overhead Press":      {"Ant Deltoid":40,"Mid Deltoid":25,"Tricep Lateral Head":20,"Tricep Long Head":10,"Upper Trap":5},
  "Lateral Raise":       {"Mid Deltoid":75,"Ant Deltoid":15,"Supraspinatus":10},
  "Face Pull":           {"Post Deltoid":40,"Infraspinatus":25,"Teres Minor":15,"Rhomboids":10,"Trap (Mid)":10},
  "Arnold Press":        {"Ant Deltoid":35,"Mid Deltoid":30,"Tricep Long Head":15,"Tricep Lateral Head":10,"Post Deltoid":10},
  "Upright Row":         {"Mid Deltoid":40,"Ant Deltoid":20,"Upper Trap":20,"Bicep Short Head":10,"Supraspinatus":10},
  "Rear Delt Fly":       {"Post Deltoid":55,"Infraspinatus":20,"Teres Minor":15,"Rhomboids":10},
  "Cable Lateral Raise": {"Mid Deltoid":80,"Supraspinatus":10,"Ant Deltoid":10},
  "Push Press":          {"Ant Deltoid":35,"Mid Deltoid":25,"Tricep Lateral Head":20,"Upper Trap":10,"Tricep Long Head":10},
  "Shrugs":              {"Upper Trap":60,"Mid Trap":25,"Levator Scapulae":15},
  "Landmine Lateral":    {"Mid Deltoid":60,"Post Deltoid":20,"Supraspinatus":10,"Upper Trap":10},
  "Barbell Curl":        {"Bicep Long Head":45,"Bicep Short Head":35,"Brachialis":15,"Brachioradialis":5},
  "Incline DB Curl":     {"Bicep Long Head":55,"Bicep Short Head":25,"Brachialis":15,"Brachioradialis":5},
  "Hammer Curl":         {"Brachioradialis":40,"Brachialis":30,"Bicep Long Head":20,"Bicep Short Head":10},
  "Concentration Curl":  {"Bicep Short Head":55,"Bicep Long Head":30,"Brachialis":15},
  "Cable Curl":          {"Bicep Long Head":40,"Bicep Short Head":35,"Brachialis":15,"Brachioradialis":10},
  "Preacher Curl":       {"Bicep Short Head":50,"Bicep Long Head":30,"Brachialis":20},
  "Spider Curl":         {"Bicep Long Head":50,"Bicep Short Head":30,"Brachialis":20},
  "Reverse Curl":        {"Brachioradialis":50,"Brachialis":25,"Bicep Long Head":15,"Ext Carpi Radialis":10},
  "21s Curl":            {"Bicep Long Head":40,"Bicep Short Head":35,"Brachialis":15,"Brachioradialis":10},
  "Tricep Pushdown":     {"Tricep Lateral Head":50,"Tricep Medial Head":30,"Tricep Long Head":20},
  "Skull Crushers":      {"Tricep Long Head":45,"Tricep Lateral Head":30,"Tricep Medial Head":25},
  "Overhead Tricep Ext": {"Tricep Long Head":65,"Tricep Lateral Head":20,"Tricep Medial Head":15},
  "Tricep Dips":         {"Tricep Long Head":35,"Tricep Lateral Head":25,"Pec Major (Sternal)":25,"Ant Deltoid":15},
  "Close-Grip Bench":    {"Tricep Lateral Head":35,"Tricep Medial Head":25,"Tricep Long Head":20,"Pec Major (Sternal)":20},
  "Rope Pushdown":       {"Tricep Lateral Head":45,"Tricep Medial Head":35,"Tricep Long Head":20},
  "Kickback":            {"Tricep Long Head":40,"Tricep Lateral Head":35,"Tricep Medial Head":25},
  "Diamond Push-up":     {"Tricep Lateral Head":35,"Tricep Long Head":30,"Tricep Medial Head":20,"Pec Major (Sternal)":15},
  "Tate Press":          {"Tricep Long Head":50,"Tricep Lateral Head":30,"Tricep Medial Head":20},
  "Wrist Curl":          {"Flex Carpi Radialis":40,"Flex Carpi Ulnaris":35,"Palmaris Longus":25},
  "Reverse Wrist Curl":  {"Ext Carpi Radialis":45,"Ext Carpi Ulnaris":35,"Brachioradialis":20},
  "Farmers Carry":       {"Flex Digitorum":30,"Brachioradialis":25,"Upper Trap":20,"Rhomboids":15,"Obliques":10},
  "Dead Hang":           {"Flex Digitorum":35,"Brachioradialis":25,"Lat Dorsi":25,"Teres Major":15},
  "Plate Pinch":         {"Flex Digitorum":50,"Lumbricals":30,"Interossei":20},
  "Towel Pull-up":       {"Flex Digitorum":35,"Brachioradialis":20,"Lat Dorsi":25,"Bicep Long Head":20},
  "Pronation/Supination":{"Pronator Teres":45,"Supinator":40,"Brachioradialis":15},
  "Barbell Finger Roll":  {"Flex Digitorum":55,"Lumbricals":25,"Palmaris Longus":20},
  "Rice Bucket":         {"Ext Digitorum":35,"Flex Digitorum":30,"Interossei":20,"Lumbricals":15},
  "Hip Thrust":          {"Glute Max":60,"Glute Med":15,"Bicep Femoris (Long)":15,"Erector Spinae":10},
  "Glute Bridge":        {"Glute Max":65,"Glute Med":15,"Bicep Femoris (Long)":15,"Transverse Abdominis":5},
  "Cable Kickback":      {"Glute Max":70,"Glute Med":15,"Bicep Femoris (Long)":15},
  "Sumo Squat":          {"Glute Max":35,"Glute Med":20,"Adductor Magnus":20,"Quad (Vastus Med)":15,"Bicep Femoris (Short)":10},
  "Bulgarian Split Squat":{"Glute Max":40,"Quad (Rectus Femoris)":30,"Bicep Femoris (Long)":20,"Glute Med":10},
  "Donkey Kick":         {"Glute Max":75,"Glute Med":15,"Bicep Femoris (Long)":10},
  "Step Up":             {"Glute Max":35,"Quad (Vastus Lat)":30,"Glute Med":20,"Bicep Femoris (Long)":15},
  "Lateral Band Walk":   {"Glute Med":55,"Glute Min":25,"TFL":15,"Glute Max":5},
  "Lying Leg Curl":      {"Bicep Femoris (Short)":35,"Bicep Femoris (Long)":30,"Semimembranosus":20,"Semitendinosus":15},
  "Romanian Deadlift":   {"Bicep Femoris (Long)":35,"Semimembranosus":25,"Glute Max":25,"Erector Spinae":15},
  "Nordic Curl":         {"Bicep Femoris (Long)":35,"Semimembranosus":30,"Semitendinosus":20,"Glute Max":15},
  "Seated Leg Curl":     {"Bicep Femoris (Short)":30,"Semimembranosus":30,"Semitendinosus":25,"Bicep Femoris (Long)":15},
  "Good Morning":        {"Bicep Femoris (Long)":30,"Semimembranosus":25,"Erector Spinae":25,"Glute Max":20},
  "Stability Ball Curl": {"Bicep Femoris (Long)":30,"Semimembranosus":25,"Semitendinosus":25,"Glute Max":20},
  "Single Leg RDL":      {"Bicep Femoris (Long)":35,"Semimembranosus":25,"Glute Max":25,"Erector Spinae":15},
  "Sumo Deadlift":       {"Glute Max":30,"Bicep Femoris (Long)":25,"Adductor Magnus":20,"Erector Spinae":15,"Quad (Vastus Med)":10},
  "Glute Ham Raise":     {"Bicep Femoris (Long)":40,"Semimembranosus":25,"Semitendinosus":20,"Glute Max":15},
  "Squat":               {"Quad (Vastus Lat)":20,"Quad (Rectus Femoris)":15,"Quad (Vastus Med)":15,"Glute Max":25,"Bicep Femoris (Long)":15,"Erector Spinae":10},
  "Leg Press":           {"Quad (Vastus Lat)":25,"Quad (Rectus Femoris)":15,"Quad (Vastus Med)":15,"Glute Max":25,"Bicep Femoris (Short)":20},
  "Leg Extension":       {"Quad (Rectus Femoris)":35,"Quad (Vastus Lat)":25,"Quad (Vastus Med)":25,"Quad (Vastus Int)":15},
  "Hack Squat":          {"Quad (Vastus Med)":30,"Quad (Rectus Femoris)":25,"Quad (Vastus Lat)":25,"Glute Max":20},
  "Walking Lunge":       {"Quad (Rectus Femoris)":25,"Glute Max":25,"Quad (Vastus Lat)":20,"Bicep Femoris (Long)":15,"Glute Med":15},
  "Front Squat":         {"Quad (Rectus Femoris)":30,"Quad (Vastus Med)":25,"Quad (Vastus Lat)":25,"Glute Max":20},
  "Sissy Squat":         {"Quad (Rectus Femoris)":45,"Quad (Vastus Lat)":25,"Quad (Vastus Med)":20,"Quad (Vastus Int)":10},
  "Standing Calf Raise": {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Seated Calf Raise":   {"Soleus":65,"Gastrocnemius (Med)":20,"Gastrocnemius (Lat)":15},
  "Single-Leg Raise":    {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Donkey Calf Raise":   {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":30,"Soleus":25},
  "Box Jump":            {"Gastrocnemius (Med)":25,"Gastrocnemius (Lat)":20,"Quad (Vastus Lat)":25,"Glute Max":20,"Soleus":10},
  "Leg Press Calf Raise":{"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Smith Calf Raise":    {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Ankle Hops":          {"Gastrocnemius (Med)":40,"Gastrocnemius (Lat)":30,"Soleus":20,"Tibialis Anterior":10},
  "Plank":               {"Transverse Abdominis":40,"Rectus Abdominis":25,"Obliques":20,"Glute Max":15},
  "Cable Crunch":        {"Rectus Abdominis":60,"Obliques":25,"Transverse Abdominis":15},
  "Hanging Leg Raise":   {"Rectus Abdominis":40,"Hip Flexors":30,"Obliques":20,"Transverse Abdominis":10},
  "Russian Twist":       {"Obliques":55,"Rectus Abdominis":25,"Transverse Abdominis":20},
  "Ab Wheel Rollout":    {"Rectus Abdominis":35,"Transverse Abdominis":30,"Lat Dorsi":20,"Obliques":15},
  "V-Up":                {"Rectus Abdominis":50,"Hip Flexors":30,"Obliques":20},
  "Dead Bug":            {"Transverse Abdominis":50,"Rectus Abdominis":30,"Obliques":20},
  "Pallof Press":        {"Obliques":45,"Transverse Abdominis":35,"Rectus Abdominis":20},
  "Dragon Flag":         {"Rectus Abdominis":50,"Transverse Abdominis":25,"Obliques":15,"Hip Flexors":10},
  "Side Plank":          {"Obliques":50,"Transverse Abdominis":25,"Glute Med":15,"Quad (Vastus Lat)":10},
  "Treadmill Run":       {"Quad (Rectus Femoris)":25,"Gastrocnemius (Med)":20,"Glute Max":20,"Bicep Femoris (Long)":20,"Soleus":15},
  "Rowing Machine":      {"Erector Spinae":25,"Quad (Vastus Lat)":20,"Bicep Femoris (Long)":15,"Rhomboids":20,"Bicep Short Head":10,"Obliques":10},
  "Jump Rope":           {"Gastrocnemius (Med)":30,"Soleus":25,"Quad (Vastus Lat)":20,"Mid Deltoid":15,"Obliques":10},
  "Bike Intervals":      {"Quad (Rectus Femoris)":30,"Quad (Vastus Lat)":20,"Bicep Femoris (Long)":20,"Glute Max":20,"Gastrocnemius (Med)":10},
  "Stair Climber":       {"Glute Max":30,"Quad (Vastus Lat)":25,"Bicep Femoris (Long)":20,"Gastrocnemius (Med)":15,"Glute Med":10},
};

var MUSCLE_COLOR = {
  "Pec Major (Sternal)":"#ff6b35","Pec Major (Clavicular)":"#ff8c5a","Pec Minor":"#ffb07a","Serratus Anterior":"#ffcc99",
  "Lat Dorsi":"#3eb8f5","Rhomboids":"#5cc8ff","Erector Spinae":"#2a9fd6","Trap (Mid)":"#7dd8ff","Trap (Upper)":"#a0e4ff","Lower Trap":"#1a7fa6","Teres Major":"#4fb0e0","Teres Minor":"#80c8e8","Infraspinatus":"#2288bb",
  "Ant Deltoid":"#b03ef5","Mid Deltoid":"#c86aff","Post Deltoid":"#8a20d4","Supraspinatus":"#d490ff","Upper Trap":"#9040d0","Levator Scapulae":"#bb70ff",
  "Bicep Long Head":"#c8f53e","Bicep Short Head":"#b8e030","Brachialis":"#7aaa10","Brachioradialis":"#e8ff70",
  "Tricep Long Head":"#f5c842","Tricep Lateral Head":"#ffd966","Tricep Medial Head":"#e0aa20",
  "Flex Carpi Radialis":"#e8a83e","Flex Carpi Ulnaris":"#d49020","Palmaris Longus":"#f0b850","Ext Carpi Radialis":"#ffa020","Ext Carpi Ulnaris":"#cc8010","Pronator Teres":"#e09830","Supinator":"#f5b040","Flex Digitorum":"#d08020","Ext Digitorum":"#c07010","Lumbricals":"#b06010","Interossei":"#a05010",
  "Quad (Rectus Femoris)":"#ff4040","Quad (Vastus Lat)":"#ff6060","Quad (Vastus Med)":"#ff2020","Quad (Vastus Int)":"#e03030","Adductor Magnus":"#ff8080",
  "Bicep Femoris (Long)":"#3ef5b0","Bicep Femoris (Short)":"#20d490","Semimembranosus":"#10b070","Semitendinosus":"#60ffc0",
  "Glute Max":"#f53eb0","Glute Med":"#ff60c0","Glute Min":"#e020a0","TFL":"#ff80d0",
  "Gastrocnemius (Med)":"#f53e3e","Gastrocnemius (Lat)":"#ff6060","Soleus":"#cc2020","Tibialis Anterior":"#ff8080",
  "Rectus Abdominis":"#3ef5f5","Obliques":"#20d4d4","Transverse Abdominis":"#10b0b0","Hip Flexors":"#60ffff",
  "Mid Trap":"#6dc8ef",
};

var SVG_PATHS = {
  head_front: "M22,2 Q27,-1 32,2 Q36,5 36,12 Q36,20 27,22 Q18,20 18,12 Q18,5 22,2 Z",
  neck_front: "M23,22 Q27,21 31,22 L30,27 Q27,28 24,27 Z",
  "Pec Major (Clavicular)": "M10,30 Q27,26 33,30 L32,40 Q27,42 18,40 Q12,38 10,33 Z",
  "Pec Major (Sternal)":    "M10,33 Q18,40 32,40 L31,52 Q27,54 18,52 Q11,49 10,43 Z",
  "Pec Minor":              "M18,35 Q27,32 33,35 L32,45 Q27,46 19,45 Z",
  "Serratus Anterior":      "M9,38 L13,38 L12,55 L8,52 Z M33,38 L37,38 L36,55 L32,52 Z",
  "Ant Deltoid":    "M6,28 Q10,24 14,27 L14,38 Q9,40 5,37 Z M38,28 Q42,24 46,27 L46,38 Q41,40 37,37 Z",
  "Mid Deltoid":    "M3,36 Q7,32 10,36 L9,46 Q5,48 2,45 Z M43,36 Q47,32 50,36 L49,46 Q45,48 42,45 Z",
  "Rectus Abdominis":"M17,52 Q27,50 34,52 L33,72 Q27,74 20,72 Z",
  "Obliques":       "M10,50 Q17,52 17,72 L14,76 Q7,70 8,55 Z M37,50 Q44,55 43,76 L40,72 Q40,52 34,52 Z",
  "Transverse Abdominis":"M17,62 Q27,60 34,62 L33,72 Q27,73 20,72 Z",
  "Bicep Long Head":  "M3,44 Q6,42 8,44 L9,60 Q6,62 3,60 Z M44,44 Q47,42 49,44 L48,60 Q45,62 43,60 Z",
  "Bicep Short Head": "M6,44 Q9,42 11,45 L11,60 Q8,62 6,60 Z M41,44 Q44,42 46,45 L45,60 Q42,62 41,60 Z",
  "Brachialis":       "M4,58 Q8,56 11,59 L10,66 Q7,67 4,65 Z M41,58 Q45,56 48,59 L47,66 Q44,67 41,65 Z",
  "Brachioradialis":       "M4,64 Q7,62 10,65 L9,80 Q6,81 3,79 Z M42,64 Q45,62 48,65 L47,80 Q44,81 41,79 Z",
  "Flex Carpi Radialis":   "M5,78 Q7,76 9,78 L8,90 Q6,91 4,89 Z M43,78 Q45,76 47,78 L46,90 Q44,91 42,89 Z",
  "Flex Carpi Ulnaris":    "M3,78 Q5,76 6,79 L5,90 Q3,91 2,89 Z M46,78 Q48,76 49,79 L48,90 Q46,91 45,89 Z",
  "Palmaris Longus":       "M6,80 Q8,78 9,80 L8,90 Q7,91 6,90 Z M43,80 Q45,78 46,80 L45,90 Q44,91 43,90 Z",
  "Ext Carpi Radialis":    "M6,64 Q8,62 10,65 L10,80 Q8,81 6,79 Z M42,64 Q44,62 46,65 L45,80 Q43,81 42,79 Z",
  "Pronator Teres":        "M7,64 Q10,62 12,65 L11,72 Q8,73 6,71 Z M40,64 Q43,62 45,65 L44,72 Q41,73 40,71 Z",
  "Flex Digitorum":        "M4,88 Q7,86 10,88 L9,96 Q6,97 3,95 Z M42,88 Q45,86 48,88 L47,96 Q44,97 41,95 Z",
  "Ext Digitorum":         "M5,88 Q7,86 9,88 L8,96 Q6,97 5,95 Z M43,88 Q45,86 47,88 L46,96 Q44,97 43,95 Z",
  "Quad (Rectus Femoris)": "M19,78 Q22,76 25,78 L24,104 Q21,106 18,104 Z M27,78 Q30,76 33,78 L32,104 Q29,106 26,104 Z",
  "Quad (Vastus Lat)":     "M15,80 Q19,78 21,82 L20,108 Q16,110 13,107 Z M31,80 Q35,78 37,82 L36,108 Q32,110 29,107 Z",
  "Quad (Vastus Med)":     "M22,90 Q25,88 28,90 L27,110 Q24,112 21,110 Z",
  "Quad (Vastus Int)":     "M20,80 Q23,78 26,80 L25,104 Q22,106 19,104 Z",
  "Adductor Magnus":       "M21,80 Q24,79 27,80 L26,104 Q23,106 20,104 Z",
  "Gastrocnemius (Med)":  "M19,110 Q22,108 25,110 L24,130 Q21,132 18,129 Z M27,110 Q30,108 33,110 L32,130 Q29,132 26,129 Z",
  "Gastrocnemius (Lat)":  "M15,112 Q19,110 21,114 L20,132 Q16,134 13,131 Z M31,112 Q35,110 37,114 L36,132 Q32,134 29,131 Z",
  "Soleus":               "M17,126 Q22,124 29,124 L28,140 Q22,142 17,140 Z",
  "Tibialis Anterior":    "M14,110 Q17,108 19,112 L18,130 Q15,132 13,129 Z M33,110 Q36,108 38,112 L37,130 Q34,132 32,129 Z",
  "Hip Flexors":          "M17,72 Q22,70 29,70 L28,82 Q22,84 17,82 Z",
  head_back: "M72,2 Q77,-1 82,2 Q86,5 86,12 Q86,20 77,22 Q68,20 68,12 Q68,5 72,2 Z",
  neck_back: "M73,22 Q77,21 81,22 L80,27 Q77,28 74,27 Z",
  "Trap (Upper)":    "M60,26 Q77,22 94,26 L92,36 Q77,38 62,36 Z",
  "Trap (Mid)":      "M62,36 Q77,38 92,36 L90,50 Q77,52 64,50 Z",
  "Lower Trap":      "M64,50 Q77,52 90,50 L88,62 Q77,64 66,62 Z",
  "Rhomboids":       "M66,34 Q77,30 88,34 L87,52 Q77,54 67,52 Z",
  "Lat Dorsi":       "M60,38 Q67,34 70,40 L68,70 Q62,72 58,66 Z M94,38 Q87,34 84,40 L86,70 Q92,72 96,66 Z",
  "Teres Major":     "M60,38 Q64,34 68,38 L67,48 Q63,50 59,47 Z M94,38 Q90,34 86,38 L87,48 Q91,50 95,47 Z",
  "Teres Minor":     "M60,32 Q64,28 67,33 L66,40 Q62,42 59,40 Z M94,32 Q90,28 87,33 L88,40 Q92,42 95,40 Z",
  "Infraspinatus":   "M63,30 Q77,26 91,30 L90,42 Q77,44 64,42 Z",
  "Erector Spinae":  "M72,34 Q74,32 76,34 L75,70 Q73,71 71,70 Z M78,34 Q80,32 82,34 L81,70 Q79,71 77,70 Z",
  "Glute Max":       "M62,72 Q77,68 92,72 L91,92 Q77,96 63,92 Z",
  "Glute Med":       "M60,62 Q70,58 77,62 L76,76 Q68,78 59,74 Z M94,62 Q84,58 77,62 L78,76 Q86,78 95,74 Z",
  "Glute Min":       "M62,66 Q70,62 77,66 L76,76 Q68,78 61,74 Z M92,66 Q84,62 77,66 L78,76 Q86,78 93,74 Z",
  "TFL":             "M60,68 Q65,64 68,70 L67,82 Q62,84 59,80 Z M94,68 Q89,64 86,70 L87,82 Q92,84 95,80 Z",
  "Bicep Femoris (Long)":  "M79,94 Q83,92 87,94 L86,122 Q82,124 78,122 Z M67,94 Q63,92 59,94 L60,122 Q64,124 68,122 Z",
  "Bicep Femoris (Short)": "M79,108 Q82,106 85,108 L85,124 Q82,126 79,124 Z M65,108 Q62,106 59,108 L59,124 Q62,126 65,124 Z",
  "Semimembranosus":       "M73,94 Q77,92 80,94 L79,122 Q76,124 72,122 Z",
  "Semitendinosus":        "M68,94 Q72,92 75,94 L74,122 Q71,124 67,122 Z",
  "Gastrocnemius (Med)_back":  "M73,124 Q76,122 79,124 L78,144 Q75,146 72,144 Z",
  "Gastrocnemius (Lat)_back":  "M67,124 Q70,122 73,124 L72,144 Q69,146 66,144 Z M79,124 Q82,122 85,124 L84,144 Q81,146 78,144 Z",
  "Soleus_back":               "M67,138 Q77,136 87,136 L86,150 Q77,152 68,150 Z",
  "Post Deltoid":  "M56,30 Q61,26 64,32 L63,44 Q58,46 55,42 Z M98,30 Q93,26 90,32 L91,44 Q96,46 99,42 Z",
  "Tricep Long Head":    "M55,42 Q58,40 61,43 L60,62 Q57,64 54,61 Z M99,42 Q96,40 93,43 L94,62 Q97,64 100,61 Z",
  "Tricep Lateral Head": "M52,44 Q55,42 58,45 L57,62 Q54,64 51,61 Z M102,44 Q99,42 96,45 L97,62 Q100,64 103,61 Z",
  "Tricep Medial Head":  "M55,52 Q58,50 60,53 L59,62 Q57,63 54,61 Z M99,52 Q96,50 94,53 L95,62 Q97,63 100,61 Z",
  "Ext Carpi Ulnaris":   "M51,60 Q54,58 57,61 L56,76 Q53,77 50,75 Z M103,60 Q100,58 97,61 L98,76 Q101,77 104,75 Z",
  "Levator Scapulae":    "M65,22 Q68,20 70,24 L69,34 Q66,35 64,32 Z M89,22 Q86,20 84,24 L85,34 Q88,35 90,32 Z",
  "Supraspinatus":       "M64,26 Q77,22 90,26 L89,34 Q77,36 65,34 Z",
};

var BACK_VIEW_MUSCLES = new Set([
  "Lat Dorsi","Rhomboids","Erector Spinae","Trap (Mid)","Trap (Upper)","Lower Trap",
  "Teres Major","Teres Minor","Infraspinatus","Post Deltoid","Glute Max","Glute Med",
  "Glute Min","TFL","Bicep Femoris (Long)","Bicep Femoris (Short)","Semimembranosus",
  "Semitendinosus","Tricep Long Head","Tricep Lateral Head","Tricep Medial Head",
  "Ext Carpi Ulnaris","Levator Scapulae","Supraspinatus",
]);

function MuscleDiagram({exerciseName,color}){
  var acts=MUSCLE_ACT[exerciseName]||{};
  var muscles=Object.keys(acts).sort(function(a,b){return acts[b]-acts[a];});
  if(!muscles.length)return null;
  var GC=color||"#c8f53e";
  var primaryMuscles=muscles.filter(function(m){return acts[m]>=30;});
  var[pulsePhase,setPulsePhase]=useState(0);
  useEffect(function(){
    var t=setInterval(function(){setPulsePhase(function(p){return(p+1)%60;});},40);
    return function(){clearInterval(t);};
  },[exerciseName]);
  var pulse=0.15*Math.sin((pulsePhase/60)*2*Math.PI);
  var sk1="#c4845a",sk2="#b87348",sk3="#d4956a";
  var fb=[
    {d:"M16,28 Q20,25 27,24 Q34,25 38,28 L39,52 Q35,56 27,57 Q19,56 15,52 Z",f:sk2},
    {d:"M17,30 Q23,28 27,29 Q31,28 37,30 L36,42 Q31,44 27,44 Q23,44 18,42 Z",f:sk1},
    {d:"M20,52 Q27,50 34,52 L33,72 Q27,74 21,72 Z",f:sk1},
    {d:"M5,28 Q10,25 15,28 L14,50 Q9,53 4,50 Z",f:sk2},
    {d:"M39,28 Q44,25 49,28 L48,50 Q43,53 38,50 Z",f:sk2},
    {d:"M3,49 Q7,47 13,50 L12,78 Q7,80 2,77 Z",f:sk3},
    {d:"M39,49 Q45,47 49,50 L48,78 Q43,80 38,77 Z",f:sk3},
    {d:"M2,76 Q7,74 12,76 L11,88 Q6,90 1,87 Z",f:sk3},
    {d:"M38,76 Q43,74 48,76 L47,88 Q42,90 37,87 Z",f:sk3},
    {d:"M15,55 Q27,53 39,55 L38,70 Q27,72 16,70 Z",f:sk2},
    {d:"M14,68 Q20,66 26,68 L25,108 Q19,111 13,108 Z",f:sk2},
    {d:"M28,68 Q34,66 40,68 L39,108 Q33,111 27,108 Z",f:sk2},
    {d:"M14,104 Q20,102 26,104 L25,116 Q19,118 13,116 Z",f:sk3},
    {d:"M28,104 Q34,102 40,104 L39,116 Q33,118 27,116 Z",f:sk3},
    {d:"M13,114 Q19,112 25,114 L24,142 Q18,144 12,142 Z",f:sk2},
    {d:"M27,114 Q33,112 39,114 L38,142 Q32,144 26,142 Z",f:sk2},
    {d:"M19,2 Q27,-1 35,2 Q39,6 39,13 Q39,21 27,23 Q15,21 15,13 Q15,6 19,2 Z",f:sk1},
    {d:"M22,22 Q27,21 32,22 L31,28 Q27,29 23,28 Z",f:sk2},
  ];
  var bb=[
    {d:"M66,28 Q70,25 77,24 Q84,25 88,28 L89,52 Q85,56 77,57 Q69,56 65,52 Z",f:sk2},
    {d:"M67,30 Q73,27 77,28 Q81,27 87,30 L86,50 Q81,52 77,52 Q73,52 68,50 Z",f:sk1},
    {d:"M70,52 Q77,50 84,52 L83,72 Q77,74 71,72 Z",f:sk1},
    {d:"M55,28 Q60,25 65,28 L64,50 Q59,53 54,50 Z",f:sk2},
    {d:"M89,28 Q94,25 99,28 L98,50 Q93,53 88,50 Z",f:sk2},
    {d:"M53,49 Q57,47 63,50 L62,78 Q57,80 52,77 Z",f:sk3},
    {d:"M89,49 Q95,47 99,50 L98,78 Q93,80 88,77 Z",f:sk3},
    {d:"M52,76 Q57,74 62,76 L61,88 Q56,90 51,87 Z",f:sk3},
    {d:"M88,76 Q93,74 98,76 L97,88 Q92,90 87,87 Z",f:sk3},
    {d:"M65,55 Q77,53 89,55 L88,70 Q77,72 66,70 Z",f:sk2},
    {d:"M64,68 Q70,66 76,68 L75,108 Q69,111 63,108 Z",f:sk2},
    {d:"M78,68 Q84,66 90,68 L89,108 Q83,111 77,108 Z",f:sk2},
    {d:"M64,104 Q70,102 76,104 L75,116 Q69,118 63,116 Z",f:sk3},
    {d:"M78,104 Q84,102 90,104 L89,116 Q83,118 77,116 Z",f:sk3},
    {d:"M63,114 Q69,112 75,114 L74,142 Q68,144 62,142 Z",f:sk2},
    {d:"M77,114 Q83,112 89,114 L88,142 Q82,144 76,142 Z",f:sk2},
    {d:"M69,2 Q77,-1 85,2 Q89,6 89,13 Q89,21 77,23 Q65,21 65,13 Q65,6 69,2 Z",f:sk1},
    {d:"M72,22 Q77,21 82,22 L81,28 Q77,29 73,28 Z",f:sk2},
  ];
  var AF={
    "Pec Major (Sternal)":"M18,32 Q27,29 36,32 L35,44 Q27,47 19,44 Z",
    "Pec Major (Clavicular)":"M18,29 Q27,27 36,29 L35,35 Q27,36 19,35 Z",
    "Pec Minor":"M21,34 Q27,32 33,34 L32,43 Q27,44 22,43 Z",
    "Serratus Anterior":"M15,38 Q18,36 20,40 L18,52 Q15,53 13,50 Z M37,38 Q40,36 39,40 L41,52 Q39,53 37,50 Z",
    "Ant Deltoid":"M7,28 Q12,24 16,28 L15,40 Q10,43 6,39 Z M38,28 Q43,24 47,28 L46,40 Q41,43 37,39 Z",
    "Mid Deltoid":"M4,36 Q8,32 12,36 L11,48 Q6,51 3,47 Z M42,36 Q46,32 50,36 L49,48 Q44,51 41,47 Z",
    "Bicep Long Head":"M5,42 Q8,40 11,42 L10,58 Q7,60 4,58 Z M43,42 Q46,40 49,42 L48,58 Q45,60 42,58 Z",
    "Bicep Short Head":"M8,42 Q11,40 13,43 L12,58 Q9,60 7,58 Z M41,42 Q44,40 46,43 L45,58 Q42,60 40,58 Z",
    "Brachialis":"M5,56 Q9,54 12,57 L11,65 Q8,67 5,64 Z M42,56 Q46,54 49,57 L48,65 Q45,67 42,64 Z",
    "Brachioradialis":"M4,63 Q8,61 11,64 L10,78 Q7,80 3,77 Z M43,63 Q47,61 50,64 L49,78 Q46,80 42,77 Z",
    "Flex Carpi Radialis":"M4,77 Q7,75 10,77 L9,87 Q6,88 3,86 Z M44,77 Q47,75 50,77 L49,87 Q46,88 43,86 Z",
    "Flex Carpi Ulnaris":"M2,77 Q5,75 7,78 L6,87 Q3,88 1,86 Z M47,77 Q50,75 52,78 L51,87 Q48,88 46,86 Z",
    "Palmaris Longus":"M5,78 Q7,76 9,78 L8,87 Q6,88 5,87 Z M45,78 Q47,76 49,78 L48,87 Q46,88 45,87 Z",
    "Pronator Teres":"M6,62 Q10,60 13,63 L12,70 Q9,72 6,69 Z M41,62 Q45,60 48,63 L47,70 Q44,72 41,69 Z",
    "Flex Digitorum":"M3,86 Q6,84 10,86 L9,94 Q6,96 2,93 Z M44,86 Q47,84 51,86 L50,94 Q47,96 43,93 Z",
    "Rectus Abdominis":"M21,52 Q27,50 33,52 L32,70 Q27,72 22,70 Z",
    "Obliques":"M14,52 Q19,50 21,54 L20,70 Q16,72 13,68 Z M33,52 Q38,50 40,54 L39,70 Q36,72 34,68 Z",
    "Transverse Abdominis":"M20,60 Q27,58 34,60 L33,70 Q27,71 21,70 Z",
    "Hip Flexors":"M18,68 Q27,66 36,68 L35,76 Q27,78 19,76 Z",
    "Quad (Rectus Femoris)":"M20,70 Q24,68 28,70 L27,106 Q23,108 19,106 Z",
    "Quad (Vastus Lat)":"M15,72 Q20,70 23,74 L22,108 Q17,111 13,108 Z M31,72 Q36,70 39,74 L38,108 Q33,111 29,108 Z",
    "Quad (Vastus Med)":"M23,88 Q27,86 31,88 L30,110 Q26,112 22,110 Z",
    "Quad (Vastus Int)":"M21,72 Q25,70 29,72 L28,106 Q24,108 20,106 Z",
    "Adductor Magnus":"M22,70 Q27,68 32,70 L31,102 Q27,104 23,102 Z",
    "Gastrocnemius (Med)":"M19,114 Q23,112 27,114 L26,132 Q22,134 18,131 Z M27,114 Q31,112 35,114 L34,132 Q30,134 26,131 Z",
    "Gastrocnemius (Lat)":"M14,116 Q18,114 21,118 L20,134 Q15,136 12,133 Z M33,116 Q37,114 40,118 L39,134 Q34,136 31,133 Z",
    "Soleus":"M16,128 Q22,126 32,126 L31,142 Q22,144 15,142 Z",
    "Tibialis Anterior":"M13,114 Q16,112 19,116 L18,132 Q14,134 12,131 Z M35,114 Q38,112 41,116 L40,132 Q36,134 34,131 Z",
  };
  var AB={
    "Trap (Upper)":"M62,26 Q77,22 92,26 L91,36 Q77,38 63,36 Z",
    "Trap (Mid)":"M63,36 Q77,38 91,36 L90,50 Q77,52 64,50 Z",
    "Lower Trap":"M65,50 Q77,52 89,50 L88,60 Q77,62 66,60 Z",
    "Rhomboids":"M67,34 Q77,30 87,34 L86,52 Q77,54 68,52 Z",
    "Lat Dorsi":"M60,40 Q66,35 70,42 L68,70 Q62,73 57,67 Z M94,40 Q88,35 84,42 L86,70 Q92,73 97,67 Z",
    "Teres Major":"M60,38 Q65,33 69,38 L68,50 Q63,52 58,48 Z M94,38 Q89,33 85,38 L86,50 Q91,52 96,48 Z",
    "Teres Minor":"M60,32 Q64,28 68,33 L67,40 Q62,43 59,40 Z M94,32 Q90,28 86,33 L87,40 Q92,43 95,40 Z",
    "Infraspinatus":"M64,30 Q77,26 90,30 L89,43 Q77,45 65,43 Z",
    "Erector Spinae":"M73,34 Q75,32 77,34 L76,70 Q74,72 72,70 Z M79,34 Q81,32 83,34 L82,70 Q80,72 78,70 Z",
    "Post Deltoid":"M56,30 Q61,25 65,32 L64,44 Q58,47 54,43 Z M98,30 Q93,25 89,32 L90,44 Q96,47 100,43 Z",
    "Glute Max":"M63,72 Q77,68 91,72 L90,94 Q77,98 64,94 Z",
    "Glute Med":"M60,62 Q70,58 77,62 L76,76 Q68,79 59,75 Z M94,62 Q84,58 77,62 L78,76 Q86,79 95,75 Z",
    "Glute Min":"M63,66 Q70,62 77,66 L76,76 Q69,79 62,75 Z M91,66 Q84,62 77,66 L78,76 Q85,79 92,75 Z",
    "TFL":"M60,68 Q65,63 69,70 L68,83 Q62,86 58,81 Z M94,68 Q89,63 85,70 L86,83 Q92,86 96,81 Z",
    "Bicep Femoris (Long)":"M79,94 Q84,91 88,94 L87,122 Q83,125 79,122 Z M66,94 Q62,91 58,94 L59,122 Q63,125 67,122 Z",
    "Bicep Femoris (Short)":"M79,108 Q83,106 87,108 L86,124 Q83,127 79,124 Z M65,108 Q61,106 57,108 L58,124 Q62,127 66,124 Z",
    "Semimembranosus":"M73,94 Q77,91 81,94 L80,122 Q76,125 72,122 Z",
    "Semitendinosus":"M68,94 Q72,91 76,94 L75,122 Q71,125 67,122 Z",
    "Tricep Long Head":"M55,42 Q59,39 62,43 L61,63 Q57,65 54,62 Z M99,42 Q95,39 92,43 L93,63 Q97,65 100,62 Z",
    "Tricep Lateral Head":"M52,44 Q56,41 59,45 L58,63 Q54,65 51,62 Z M102,44 Q98,41 95,45 L96,63 Q100,65 103,62 Z",
    "Tricep Medial Head":"M55,52 Q58,50 61,53 L60,63 Q57,64 54,62 Z M99,52 Q96,50 93,53 L94,63 Q97,64 100,62 Z",
    "Supraspinatus":"M65,26 Q77,22 89,26 L88,34 Q77,36 66,34 Z",
    "Levator Scapulae":"M65,22 Q68,20 71,24 L70,34 Q67,36 64,33 Z M89,22 Q86,20 83,24 L84,34 Q87,36 90,33 Z",
    "Ext Carpi Ulnaris":"M51,60 Q55,57 58,61 L57,76 Q53,78 50,75 Z M103,60 Q99,57 96,61 L97,76 Q101,78 104,75 Z",
    "Gastrocnemius (Med)_back":"M73,124 Q76,122 80,124 L79,144 Q75,147 72,144 Z",
    "Gastrocnemius (Lat)_back":"M67,124 Q71,122 74,124 L73,144 Q69,147 66,144 Z M80,124 Q84,122 87,124 L86,144 Q82,147 79,144 Z",
    "Soleus_back":"M67,138 Q77,136 87,136 L86,150 Q77,152 68,150 Z",
  };
  var rm=function(isBack){
    return muscles.map(function(m){
      var isBM=BACK_VIEW_MUSCLES.has(m);
      if(isBack&&!isBM)return null;
      if(!isBack&&isBM)return null;
      var pd=isBack?(AB[m]||AB[m+"_back"]):(AF[m]);
      if(!pd)return null;
      var pct=acts[m],col=MUSCLE_COLOR[m]||GC,isPrimary=pct>=30;
      var op=(0.6+(pct/100)*0.35)+(isPrimary?pulse*0.2:0);
      var gs=isPrimary?{filter:"blur(3px)"}:{};
      return <g key={m}>{isPrimary&&<path d={pd} fill={col} opacity={0.2+Math.max(0,pulse)*0.3} style={gs}/>}<path d={pd} fill={col} opacity={op} stroke={isPrimary?"#fff":"none"} strokeWidth="0.3" strokeOpacity="0.3"/>{isPrimary&&<path d={pd} fill="url(#spec)" opacity="0.2"/>}</g>;
    });
  };
  return(
    <div style={{background:"linear-gradient(160deg,#0e0e18,#080810)",borderRadius:16,padding:"16px",marginBottom:10,border:"1px solid #1e1e2a",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
      <div style={{fontSize:9,color:"#555",letterSpacing:1.5,marginBottom:12,textAlign:"center"}}>MUSCLE ACTIVATION BREAKDOWN</div>
      <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:14}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,color:"#555",marginBottom:5,letterSpacing:1,fontWeight:700}}>FRONT</div>
          <svg viewBox="0 0 54 155" width="80" height="225" style={{overflow:"visible",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.8))"}}>
            <defs>
              <linearGradient id="bgl" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" stopColor="#fff" stopOpacity="0.12"/><stop offset="100%" stopColor="#000" stopOpacity="0.2"/></linearGradient>
              <linearGradient id="spec" x1="0%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stopColor="#fff" stopOpacity="0.4"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></linearGradient>
            </defs>
            {fb.map(function(p,i){return <path key={i} d={p.d} fill={p.f} stroke="#7a4a28" strokeWidth="0.4" strokeOpacity="0.6"/>;})}
            {fb.map(function(p,i){return <path key={"l"+i} d={p.d} fill="url(#bgl)" opacity="0.7"/>;})}
            {rm(false)}
          </svg>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,color:"#555",marginBottom:5,letterSpacing:1,fontWeight:700}}>BACK</div>
          <svg viewBox="54 0 54 155" width="80" height="225" style={{overflow:"visible",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.8))"}}>
            <defs>
              <linearGradient id="bgr" x1="80%" y1="0%" x2="20%" y2="100%"><stop offset="0%" stopColor="#fff" stopOpacity="0.1"/><stop offset="100%" stopColor="#000" stopOpacity="0.25"/></linearGradient>
            </defs>
            {bb.map(function(p,i){return <path key={i} d={p.d} fill={p.f} stroke="#7a4a28" strokeWidth="0.4" strokeOpacity="0.6"/>;})}
            {bb.map(function(p,i){return <path key={"l"+i} d={p.d} fill="url(#bgr)" opacity="0.7"/>;})}
            {rm(true)}
          </svg>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {muscles.map(function(m){
          var pct=acts[m],col=MUSCLE_COLOR[m]||GC,isPrimary=pct>=30,isSec=pct>=15&&pct<30;
          return(<div key={m}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:9,height:9,borderRadius:3,background:col,boxShadow:isPrimary?"0 0 8px "+col+"cc":"none",flexShrink:0}}/><span style={{fontSize:11,color:isPrimary?"#e8e4dc":"#888",fontWeight:isPrimary?"700":"400"}}>{m}</span>{isPrimary&&<span style={{fontSize:7,background:col+"22",color:col,borderRadius:4,padding:"1px 5px",fontWeight:700,border:"1px solid "+col+"55"}}>PRIMARY</span>}{isSec&&<span style={{fontSize:7,background:"#1e1e2a",color:"#666",borderRadius:4,padding:"1px 5px"}}>SECONDARY</span>}</div><span style={{fontSize:11,fontWeight:700,color:col}}>{pct}%</span></div><div style={{background:"#0d0d15",borderRadius:99,height:6,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,"+col+"88,"+col+")",width:pct+"%",transition:"width .6s ease",boxShadow:isPrimary?"0 0 8px "+col+"66":"none"}}/></div></div>);
        })}
      </div>
      {primaryMuscles.length>0&&(<div style={{marginTop:12,padding:"8px 11px",background:GC+"0a",border:"1px solid "+GC+"22",borderRadius:9,display:"flex",gap:6,alignItems:"center"}}><div style={{width:6,height:6,borderRadius:3,background:GC,boxShadow:"0 0 8px "+GC,flexShrink:0}}/><div style={{fontSize:10,color:GC}}><strong>Primary:</strong> {primaryMuscles.join(" \u00b7 ")}</div></div>)}
    </div>
  );
}

var EX_ANIMS = {
  "Bench Press":    {cues:["Lower bar to chest","Press explosively","Lock out at top","Control descent"],phases:["Eccentric","Concentric","Peak","Return"],color:"#ff6b35",
    frames:['<rect x="20" y="28" width="60" height="7" rx="3" fill="#c8f53e" opacity="0.9"/><circle cx="50" cy="18" r="7" fill="#888"/><line x1="50" y1="25" x2="50" y2="55" stroke="#888" strokeWidth="3"/><line x1="50" y1="33" x2="20" y2="33" stroke="#888" strokeWidth="3"/><line x1="50" y1="33" x2="80" y2="33" stroke="#888" strokeWidth="3"/><line x1="50" y1="55" x2="38" y2="72" stroke="#888" strokeWidth="3"/><line x1="50" y1="55" x2="62" y2="72" stroke="#888" strokeWidth="3"/><text x="50" y="85" textAnchor="middle" fill="#555" fontSize="8">ARMS EXTENDED</text>','<rect x="20" y="46" width="60" height="7" rx="3" fill="#ff6b35" opacity="0.9"/><circle cx="50" cy="18" r="7" fill="#888"/><line x1="50" y1="25" x2="50" y2="55" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="20" y2="47" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="36" x2="80" y2="47" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="55" x2="38" y2="72" stroke="#888" strokeWidth="3"/><line x1="50" y1="55" x2="62" y2="72" stroke="#888" strokeWidth="3"/><text x="50" y="85" textAnchor="middle" fill="#c8f53e" fontSize="8">BAR TO CHEST</text>']},
  "Push-ups":       {cues:["Hands shoulder-width","Lower chest to ground","Press back up","Core tight throughout"],phases:["Setup","Lowering","Push","Top"],color:"#ff6b35",
    frames:['<line x1="10" y1="62" x2="90" y2="62" stroke="#2a2a3a" strokeWidth="2"/><circle cx="50" cy="32" r="7" fill="#888"/><line x1="50" y1="39" x2="50" y2="55" stroke="#888" strokeWidth="3"/><line x1="14" y1="62" x2="50" y2="48" stroke="#888" strokeWidth="3"/><line x1="86" y1="62" x2="50" y2="48" stroke="#888" strokeWidth="3"/><line x1="50" y1="55" x2="40" y2="62" stroke="#888" strokeWidth="3"/><line x1="50" y1="55" x2="60" y2="62" stroke="#888" strokeWidth="3"/><text x="50" y="76" textAnchor="middle" fill="#555" fontSize="8">TOP</text>','<line x1="10" y1="70" x2="90" y2="70" stroke="#2a2a3a" strokeWidth="2"/><circle cx="50" cy="50" r="7" fill="#888"/><line x1="50" y1="57" x2="50" y2="66" stroke="#888" strokeWidth="3"/><line x1="14" y1="70" x2="38" y2="59" stroke="#c8f53e" strokeWidth="3"/><line x1="86" y1="70" x2="62" y2="59" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="66" x2="38" y2="70" stroke="#888" strokeWidth="3"/><line x1="50" y1="66" x2="62" y2="70" stroke="#888" strokeWidth="3"/><text x="50" y="82" textAnchor="middle" fill="#c8f53e" fontSize="8">CHEST DOWN</text>']},
  "Deadlift":       {cues:["Hinge at hips","Drive through heels","Lock hips at top","Neutral spine always"],phases:["Hinge","Pull","Midway","Lockout"],color:"#3eb8f5",
    frames:['<line x1="15" y1="82" x2="85" y2="82" stroke="#2a2a3a" strokeWidth="2"/><rect x="26" y="72" width="48" height="10" rx="3" fill="#3eb8f5" opacity="0.9"/><circle cx="50" cy="28" r="7" fill="#888"/><line x1="50" y1="35" x2="44" y2="72" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="35" x2="56" y2="72" stroke="#c8f53e" strokeWidth="3"/><line x1="46" y1="50" x2="28" y2="70" stroke="#888" strokeWidth="3"/><line x1="54" y1="50" x2="72" y2="70" stroke="#888" strokeWidth="3"/><text x="50" y="93" textAnchor="middle" fill="#555" fontSize="8">SETUP</text>','<line x1="15" y1="82" x2="85" y2="82" stroke="#2a2a3a" strokeWidth="2"/><rect x="26" y="44" width="48" height="10" rx="3" fill="#3eb8f5" opacity="0.9"/><circle cx="50" cy="16" r="7" fill="#888"/><line x1="50" y1="23" x2="50" y2="54" stroke="#888" strokeWidth="3"/><line x1="36" y1="54" x2="36" y2="80" stroke="#888" strokeWidth="3"/><line x1="64" y1="54" x2="64" y2="80" stroke="#888" strokeWidth="3"/><line x1="36" y1="38" x2="74" y2="48" stroke="#c8f53e" strokeWidth="3"/><line x1="64" y1="38" x2="26" y2="48" stroke="#c8f53e" strokeWidth="3"/><text x="50" y="93" textAnchor="middle" fill="#c8f53e" fontSize="8">LOCKOUT</text>']},
  "Pull-ups":       {cues:["Dead hang at bottom","Pull elbows to hips","Chin clears the bar","Lower under control"],phases:["Dead Hang","Initiate","Chin Up","Lower"],color:"#3eb8f5",
    frames:['<line x1="18" y1="10" x2="82" y2="10" stroke="#3eb8f5" strokeWidth="5"/><circle cx="50" cy="32" r="7" fill="#888"/><line x1="50" y1="39" x2="50" y2="62" stroke="#888" strokeWidth="3"/><line x1="22" y1="10" x2="42" y2="30" stroke="#c8f53e" strokeWidth="3"/><line x1="78" y1="10" x2="58" y2="30" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="62" x2="38" y2="80" stroke="#888" strokeWidth="3"/><line x1="50" y1="62" x2="62" y2="80" stroke="#888" strokeWidth="3"/><text x="50" y="92" textAnchor="middle" fill="#555" fontSize="8">DEAD HANG</text>','<line x1="18" y1="10" x2="82" y2="10" stroke="#3eb8f5" strokeWidth="5"/><circle cx="50" cy="14" r="7" fill="#888"/><line x1="50" y1="21" x2="50" y2="44" stroke="#888" strokeWidth="3"/><line x1="22" y1="10" x2="38" y2="20" stroke="#c8f53e" strokeWidth="3"/><line x1="78" y1="10" x2="62" y2="20" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="44" x2="38" y2="62" stroke="#888" strokeWidth="3"/><line x1="50" y1="44" x2="62" y2="62" stroke="#888" strokeWidth="3"/><text x="50" y="78" textAnchor="middle" fill="#c8f53e" fontSize="8">CHIN OVER BAR</text>']},
  "Squat":          {cues:["Knees track toes","Break parallel depth","Weight through heels","Drive hips up"],phases:["Standing","Descend","Parallel","Drive"],color:"#ff4040",
    frames:['<line x1="15" y1="88" x2="85" y2="88" stroke="#2a2a3a" strokeWidth="2"/><circle cx="50" cy="10" r="7" fill="#888"/><line x1="50" y1="17" x2="50" y2="50" stroke="#888" strokeWidth="3"/><rect x="20" y="28" width="60" height="7" rx="3" fill="#ff4040" opacity="0.6"/><line x1="50" y1="50" x2="36" y2="88" stroke="#888" strokeWidth="3"/><line x1="50" y1="50" x2="64" y2="88" stroke="#888" strokeWidth="3"/><text x="50" y="96" textAnchor="middle" fill="#555" fontSize="8">STANDING</text>','<line x1="15" y1="88" x2="85" y2="88" stroke="#2a2a3a" strokeWidth="2"/><circle cx="50" cy="30" r="7" fill="#888"/><line x1="50" y1="37" x2="46" y2="62" stroke="#888" strokeWidth="3"/><rect x="22" y="48" width="60" height="7" rx="3" fill="#ff4040" opacity="0.8"/><line x1="46" y1="62" x2="30" y2="88" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="62" x2="68" y2="88" stroke="#c8f53e" strokeWidth="3"/><line x1="30" y1="74" x2="16" y2="70" stroke="#888" strokeWidth="2"/><line x1="68" y1="74" x2="82" y2="70" stroke="#888" strokeWidth="2"/><text x="50" y="96" textAnchor="middle" fill="#c8f53e" fontSize="8">BELOW PARALLEL</text>']},
  "Overhead Press": {cues:["Bar at upper chest","Press straight overhead","Lock out fully","Control descent"],phases:["Rack","Press","Lockout","Return"],color:"#b03ef5",
    frames:['<circle cx="50" cy="20" r="7" fill="#888"/><line x1="50" y1="27" x2="50" y2="58" stroke="#888" strokeWidth="3"/><rect x="20" y="33" width="60" height="7" rx="3" fill="#b03ef5" opacity="0.9"/><line x1="50" y1="35" x2="20" y2="38" stroke="#888" strokeWidth="3"/><line x1="50" y1="35" x2="80" y2="38" stroke="#888" strokeWidth="3"/><line x1="50" y1="58" x2="38" y2="76" stroke="#888" strokeWidth="3"/><line x1="50" y1="58" x2="62" y2="76" stroke="#888" strokeWidth="3"/><text x="50" y="88" textAnchor="middle" fill="#555" fontSize="8">START</text>','<circle cx="50" cy="20" r="7" fill="#888"/><line x1="50" y1="27" x2="50" y2="58" stroke="#888" strokeWidth="3"/><rect x="22" y="8" width="56" height="7" rx="3" fill="#b03ef5" opacity="0.9"/><line x1="50" y1="27" x2="24" y2="12" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="27" x2="76" y2="12" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="58" x2="38" y2="76" stroke="#888" strokeWidth="3"/><line x1="50" y1="58" x2="62" y2="76" stroke="#888" strokeWidth="3"/><text x="50" y="88" textAnchor="middle" fill="#c8f53e" fontSize="8">LOCKOUT</text>']},
  "Lateral Raise":  {cues:["Start with dumbbells at sides","Lead with elbows not wrists","Raise to shoulder height","Lower in 3 seconds"],phases:["Start","Raise","Top","Lower"],color:"#b03ef5",
    frames:['<circle cx="50" cy="18" r="7" fill="#888"/><line x1="50" y1="25" x2="50" y2="56" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="30" y2="50" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="70" y2="50" stroke="#888" strokeWidth="3"/><circle cx="27" cy="52" r="5" fill="#b03ef5" opacity="0.9"/><circle cx="73" cy="52" r="5" fill="#b03ef5" opacity="0.9"/><line x1="50" y1="56" x2="38" y2="74" stroke="#888" strokeWidth="3"/><line x1="50" y1="56" x2="62" y2="74" stroke="#888" strokeWidth="3"/><text x="50" y="86" textAnchor="middle" fill="#555" fontSize="8">START</text>','<circle cx="50" cy="18" r="7" fill="#888"/><line x1="50" y1="25" x2="50" y2="56" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="16" y2="34" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="36" x2="84" y2="34" stroke="#c8f53e" strokeWidth="3"/><circle cx="13" cy="34" r="5" fill="#b03ef5" opacity="0.9"/><circle cx="87" cy="34" r="5" fill="#b03ef5" opacity="0.9"/><line x1="50" y1="56" x2="38" y2="74" stroke="#888" strokeWidth="3"/><line x1="50" y1="56" x2="62" y2="74" stroke="#888" strokeWidth="3"/><text x="50" y="86" textAnchor="middle" fill="#c8f53e" fontSize="8">SHOULDER HEIGHT</text>']},
  "Barbell Curl":   {cues:["Elbows pinned to sides","Curl bar to shoulder","Squeeze at top","Full stretch at bottom"],phases:["Bottom","Curl","Peak","Lower"],color:"#c8f53e",
    frames:['<circle cx="50" cy="16" r="7" fill="#888"/><line x1="50" y1="23" x2="50" y2="54" stroke="#888" strokeWidth="3"/><line x1="50" y1="38" x2="26" y2="64" stroke="#888" strokeWidth="3"/><line x1="50" y1="38" x2="74" y2="64" stroke="#888" strokeWidth="3"/><rect x="18" y="62" width="64" height="7" rx="3" fill="#c8f53e" opacity="0.9"/><line x1="50" y1="54" x2="36" y2="74" stroke="#888" strokeWidth="3"/><line x1="50" y1="54" x2="64" y2="74" stroke="#888" strokeWidth="3"/><text x="50" y="87" textAnchor="middle" fill="#555" fontSize="8">FULL EXTENSION</text>','<circle cx="50" cy="16" r="7" fill="#888"/><line x1="50" y1="23" x2="50" y2="54" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="24" y2="38" stroke="#c8f53e" strokeWidth="4"/><line x1="50" y1="36" x2="76" y2="38" stroke="#c8f53e" strokeWidth="4"/><rect x="18" y="33" width="64" height="7" rx="3" fill="#c8f53e" opacity="0.9"/><line x1="50" y1="54" x2="36" y2="74" stroke="#888" strokeWidth="3"/><line x1="50" y1="54" x2="64" y2="74" stroke="#888" strokeWidth="3"/><text x="50" y="87" textAnchor="middle" fill="#c8f53e" fontSize="8">PEAK CONTRACTION</text>']},
  "Hammer Curl":    {cues:["Neutral grip - thumbs up","Curl keeping wrist neutral","No forearm rotation","Full range both ways"],phases:["Bottom","Curl","Top","Lower"],color:"#c8f53e",
    frames:['<circle cx="50" cy="16" r="7" fill="#888"/><line x1="50" y1="23" x2="50" y2="54" stroke="#888" strokeWidth="3"/><line x1="50" y1="38" x2="26" y2="62" stroke="#888" strokeWidth="3"/><line x1="50" y1="38" x2="74" y2="62" stroke="#888" strokeWidth="3"/><rect x="22" y="58" width="9" height="18" rx="2" fill="#e8a83e" opacity="0.9"/><rect x="69" y="58" width="9" height="18" rx="2" fill="#e8a83e" opacity="0.9"/><line x1="50" y1="54" x2="36" y2="74" stroke="#888" strokeWidth="3"/><line x1="50" y1="54" x2="64" y2="74" stroke="#888" strokeWidth="3"/><text x="50" y="87" textAnchor="middle" fill="#555" fontSize="8">START</text>','<circle cx="50" cy="16" r="7" fill="#888"/><line x1="50" y1="23" x2="50" y2="54" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="22" y2="36" stroke="#c8f53e" strokeWidth="4"/><line x1="50" y1="36" x2="78" y2="36" stroke="#c8f53e" strokeWidth="4"/><rect x="18" y="28" width="9" height="18" rx="2" fill="#e8a83e" opacity="0.9"/><rect x="73" y="28" width="9" height="18" rx="2" fill="#e8a83e" opacity="0.9"/><line x1="50" y1="54" x2="36" y2="74" stroke="#888" strokeWidth="3"/><line x1="50" y1="54" x2="64" y2="74" stroke="#888" strokeWidth="3"/><text x="50" y="87" textAnchor="middle" fill="#c8f53e" fontSize="8">TOP</text>']},
  "Tricep Pushdown":{cues:["Elbows locked to sides","Push bar all the way down","Full lockout every rep","Slow on the way up"],phases:["Top","Push","Lockout","Return"],color:"#f5c842",
    frames:['<line x1="50" y1="5" x2="50" y2="22" stroke="#3eb8f5" strokeWidth="3"/><rect x="26" y="22" width="48" height="7" rx="3" fill="#f5c842" opacity="0.9"/><circle cx="50" cy="36" r="7" fill="#888"/><line x1="50" y1="43" x2="50" y2="66" stroke="#888" strokeWidth="3"/><line x1="50" y1="50" x2="26" y2="29" stroke="#888" strokeWidth="3"/><line x1="50" y1="50" x2="74" y2="29" stroke="#888" strokeWidth="3"/><line x1="50" y1="66" x2="38" y2="82" stroke="#888" strokeWidth="3"/><line x1="50" y1="66" x2="62" y2="82" stroke="#888" strokeWidth="3"/><text x="50" y="92" textAnchor="middle" fill="#555" fontSize="8">START</text>','<line x1="50" y1="5" x2="50" y2="22" stroke="#3eb8f5" strokeWidth="3"/><rect x="26" y="62" width="48" height="7" rx="3" fill="#f5c842" opacity="0.9"/><circle cx="50" cy="30" r="7" fill="#888"/><line x1="50" y1="37" x2="50" y2="62" stroke="#888" strokeWidth="3"/><line x1="50" y1="44" x2="26" y2="44" stroke="#c8f53e" strokeWidth="4"/><line x1="50" y1="44" x2="74" y2="44" stroke="#c8f53e" strokeWidth="4"/><line x1="50" y1="62" x2="38" y2="80" stroke="#888" strokeWidth="3"/><line x1="50" y1="62" x2="62" y2="80" stroke="#888" strokeWidth="3"/><text x="50" y="92" textAnchor="middle" fill="#c8f53e" fontSize="8">FULL LOCKOUT</text>']},
  "Hip Thrust":     {cues:["Shoulders on bench","Feet flat, drive through heels","Squeeze glutes hard at top","Lower under control"],phases:["Bottom","Drive","Peak","Return"],color:"#f53eb0",
    frames:['<rect x="8" y="48" width="28" height="14" rx="3" fill="#1e1e2a" stroke="#3a3a4a" strokeWidth="1.5"/><line x1="10" y1="82" x2="90" y2="82" stroke="#2a2a3a" strokeWidth="2"/><circle cx="26" cy="40" r="7" fill="#888"/><line x1="26" y1="47" x2="38" y2="60" stroke="#888" strokeWidth="3"/><line x1="38" y1="60" x2="54" y2="80" stroke="#c8f53e" strokeWidth="3"/><line x1="54" y1="80" x2="72" y2="82" stroke="#888" strokeWidth="3"/><rect x="32" y="55" width="46" height="8" rx="3" fill="#f53eb0" opacity="0.5"/><text x="50" y="93" textAnchor="middle" fill="#555" fontSize="8">BOTTOM</text>','<rect x="8" y="48" width="28" height="14" rx="3" fill="#1e1e2a" stroke="#3a3a4a" strokeWidth="1.5"/><line x1="10" y1="82" x2="90" y2="82" stroke="#2a2a3a" strokeWidth="2"/><circle cx="26" cy="40" r="7" fill="#888"/><line x1="26" y1="47" x2="40" y2="50" stroke="#888" strokeWidth="3"/><line x1="40" y1="50" x2="60" y2="50" stroke="#c8f53e" strokeWidth="4"/><line x1="60" y1="50" x2="72" y2="66" stroke="#888" strokeWidth="3"/><rect x="32" y="44" width="46" height="8" rx="3" fill="#f53eb0" opacity="0.95"/><text x="50" y="93" textAnchor="middle" fill="#c8f53e" fontSize="8">SQUEEZE GLUTES</text>']},
  "Plank":          {cues:["Forearms flat on ground","Neutral spine - no sag","Squeeze abs and glutes","Breathe - do not hold breath"],phases:["Setup","Hold","Breathe","Hold"],color:"#3ef5f5",
    frames:['<line x1="8" y1="72" x2="92" y2="72" stroke="#2a2a3a" strokeWidth="2"/><circle cx="20" cy="48" r="7" fill="#888"/><line x1="20" y1="55" x2="48" y2="64" stroke="#888" strokeWidth="3"/><line x1="8" y1="64" x2="48" y2="64" stroke="#3ef5f5" strokeWidth="4"/><line x1="48" y1="64" x2="88" y2="72" stroke="#888" strokeWidth="3"/><text x="50" y="84" textAnchor="middle" fill="#555" fontSize="8">HOLD POSITION</text>','<line x1="8" y1="72" x2="92" y2="72" stroke="#2a2a3a" strokeWidth="2"/><circle cx="20" cy="48" r="7" fill="#888"/><line x1="20" y1="55" x2="48" y2="64" stroke="#888" strokeWidth="3"/><line x1="8" y1="64" x2="48" y2="64" stroke="#3ef5f5" strokeWidth="4"/><line x1="48" y1="64" x2="88" y2="72" stroke="#888" strokeWidth="3"/><circle cx="50" cy="56" r="6" fill="none" stroke="#c8f53e" strokeWidth="1.5" opacity="0.7"/><text x="50" y="84" textAnchor="middle" fill="#c8f53e" fontSize="8">BREATHE OUT</text>']},
  "Standing Calf Raise":{cues:["Full stretch at bottom","Rise onto toes","2 second hold at top","Lower in 3 seconds"],phases:["Stretch","Rise","Peak","Lower"],color:"#f53e3e",
    frames:['<line x1="15" y1="88" x2="85" y2="88" stroke="#2a2a3a" strokeWidth="2"/><circle cx="50" cy="16" r="7" fill="#888"/><line x1="50" y1="23" x2="50" y2="55" stroke="#888" strokeWidth="3"/><rect x="22" y="32" width="56" height="7" rx="3" fill="#f53e3e" opacity="0.5"/><line x1="50" y1="55" x2="38" y2="86" stroke="#888" strokeWidth="3"/><line x1="50" y1="55" x2="62" y2="86" stroke="#888" strokeWidth="3"/><text x="50" y="96" textAnchor="middle" fill="#555" fontSize="8">FLAT FOOT</text>','<line x1="15" y1="88" x2="85" y2="88" stroke="#2a2a3a" strokeWidth="2"/><circle cx="50" cy="10" r="7" fill="#888"/><line x1="50" y1="17" x2="50" y2="50" stroke="#888" strokeWidth="3"/><rect x="22" y="24" width="56" height="7" rx="3" fill="#f53e3e" opacity="0.95"/><line x1="50" y1="50" x2="40" y2="76" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="50" x2="60" y2="76" stroke="#c8f53e" strokeWidth="3"/><line x1="40" y1="76" x2="40" y2="88" stroke="#c8f53e" strokeWidth="2"/><line x1="60" y1="76" x2="60" y2="88" stroke="#c8f53e" strokeWidth="2"/><text x="50" y="96" textAnchor="middle" fill="#c8f53e" fontSize="8">ON TOES</text>']},
  "Treadmill Run":  {cues:["Land midfoot under hips","Drive knee forward","Push off back foot","Arms at 90 degrees"],phases:["Strike","Drive","Push","Recover"],color:"#3eb8f5",
    frames:['<line x1="10" y1="82" x2="90" y2="82" stroke="#2a2a3a" strokeWidth="2"/><circle cx="44" cy="16" r="7" fill="#888"/><line x1="44" y1="23" x2="44" y2="54" stroke="#888" strokeWidth="3"/><line x1="44" y1="32" x2="28" y2="46" stroke="#3eb8f5" strokeWidth="3"/><line x1="44" y1="32" x2="62" y2="26" stroke="#888" strokeWidth="3"/><line x1="44" y1="54" x2="38" y2="76" stroke="#c8f53e" strokeWidth="3"/><line x1="44" y1="54" x2="58" y2="64" stroke="#888" strokeWidth="3"/><line x1="58" y1="64" x2="70" y2="54" stroke="#888" strokeWidth="3"/><text x="50" y="92" textAnchor="middle" fill="#555" fontSize="8">MID STRIDE</text>','<line x1="10" y1="82" x2="90" y2="82" stroke="#2a2a3a" strokeWidth="2"/><circle cx="50" cy="14" r="7" fill="#888"/><line x1="50" y1="21" x2="50" y2="52" stroke="#888" strokeWidth="3"/><line x1="50" y1="30" x2="66" y2="44" stroke="#3eb8f5" strokeWidth="3"/><line x1="50" y1="30" x2="32" y2="26" stroke="#888" strokeWidth="3"/><line x1="50" y1="52" x2="60" y2="76" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="52" x2="36" y2="62" stroke="#888" strokeWidth="3"/><line x1="36" y1="62" x2="26" y2="52" stroke="#888" strokeWidth="3"/><text x="50" y="92" textAnchor="middle" fill="#c8f53e" fontSize="8">DRIVE PHASE</text>']},
};

var DEFAULT_ANIM = {
  cues:["Control the movement","Full range of motion","Exhale on exertion","Stay in good form"],
  phases:["Start","Move","End","Return"],
  color:"#888",
  frames:['<circle cx="50" cy="18" r="7" fill="#888"/><line x1="50" y1="25" x2="50" y2="56" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="28" y2="50" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="72" y2="50" stroke="#888" strokeWidth="3"/><line x1="50" y1="56" x2="38" y2="76" stroke="#888" strokeWidth="3"/><line x1="50" y1="56" x2="62" y2="76" stroke="#888" strokeWidth="3"/><text x="50" y="88" textAnchor="middle" fill="#555" fontSize="8">PHASE 1</text>','<circle cx="50" cy="18" r="7" fill="#888"/><line x1="50" y1="25" x2="50" y2="56" stroke="#888" strokeWidth="3"/><line x1="50" y1="36" x2="22" y2="34" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="36" x2="78" y2="34" stroke="#c8f53e" strokeWidth="3"/><line x1="50" y1="56" x2="38" y2="76" stroke="#888" strokeWidth="3"/><line x1="50" y1="56" x2="62" y2="76" stroke="#888" strokeWidth="3"/><text x="50" y="88" textAnchor="middle" fill="#c8f53e" fontSize="8">PHASE 2</text>'],
};

var EX_DETAIL = {
  "Bench Press": {
    difficulty:"Intermediate",equipment:"Barbell + Bench",
    setup:["Lie flat, eyes directly under the bar","Grip just outside shoulder-width, thumbs wrapped","Retract and depress shoulder blades into the bench","Plant feet firmly — drive them into the floor"],
    execution:["Unrack with straight arms, bar over lower chest","Lower in a slight arc toward the nipple line — 2-3 sec","Touch chest lightly, no bounce","Press explosively back to lockout in same arc"],
    mistakes:["Flaring elbows 90deg out — keep them at ~45-75deg","Bouncing the bar off the chest","Losing leg drive / lifting feet","Not retracting scapula — causes shoulder impingement"],
    breathe:"Inhale on the descent, brace and exhale forcefully on the press",
    alternatives:["DB Bench Press","Push-ups","Cable Fly"],
  },
  "Deadlift": {
    difficulty:"Advanced",equipment:"Barbell",
    setup:["Bar over mid-foot — roughly 1 inch from shins","Hip-width stance, toes slightly out","Hinge down, grip just outside knees","Lat engagement: protect your armpits cue — big chest"],
    execution:["Push the floor away — legs extend first","Bar stays dragging against the shins the entire lift","Hips and shoulders rise at the same rate","Lock out with hips thrust forward, glutes squeezed"],
    mistakes:["Bar drifting away from body","Hips shooting up first (turning into an RDL)","Rounding the lumbar — never acceptable","Looking up aggressively — causes neck strain"],
    breathe:"Big breath at bottom, brace hard (Valsalva), exhale fully at lockout",
    alternatives:["Romanian Deadlift","Rack Pull","Trap Bar Deadlift"],
  },
  "Pull-ups": {
    difficulty:"Intermediate",equipment:"Pull-up bar",
    setup:["Pronated grip, slightly wider than shoulder-width","Dead hang — full arm extension, lats stretched","Depress shoulders slightly before pulling","Cross feet or keep them straight"],
    execution:["Lead with elbows pulling toward your hips","Drive elbows down and back — imagine bending the bar","Chin clears the bar at peak","Lower under full control — 2-3 sec descent"],
    mistakes:["Kipping to get reps — momentum replaces muscle","Not reaching full hang at bottom","Shrugging shoulders instead of depressing them","Partial reps — stopping when it gets hard"],
    breathe:"Exhale as you pull up, inhale on the way down",
    alternatives:["Lat Pulldown","Assisted Pull-up","Inverted Row"],
  },
  "Squat": {
    difficulty:"Intermediate",equipment:"Barbell + Squat Rack",
    setup:["Bar on upper traps (high bar) or rear delts (low bar)","Shoulder-width stance, toes out 15-30deg","Brace core 360deg — big breath before descent","Gaze forward or slightly down, neutral neck"],
    execution:["Break at hips and knees simultaneously","Knees track over toes — push them out","Hit parallel or below","Drive through heels, hips rise first then torso follows"],
    mistakes:["Knee cave (valgus collapse) on the way up","Heel rise — needs ankle mobility work","Butt wink at the bottom","Too much forward lean — often bar position issue"],
    breathe:"Full breath at top, hold through descent and ascent, exhale at lockout",
    alternatives:["Goblet Squat","Leg Press","Hack Squat"],
  },
  "Overhead Press": {
    difficulty:"Intermediate",equipment:"Barbell",
    setup:["Grip just outside shoulder-width, bar on upper chest","Elbows slightly in front of the bar","Squeeze glutes and abs — prevents rib flare","Feet shoulder-width or hip-width"],
    execution:["Press straight up — bar clears the head, then move head through","At lockout bar should be directly over mid-foot","Lower to upper chest under control","Keep wrists stacked over elbows throughout"],
    mistakes:["Pressing in front instead of slightly back","Hyperextending lower back — core not braced","Not locking out every rep"],
    breathe:"Inhale and brace before press, exhale at top",
    alternatives:["DB Shoulder Press","Arnold Press","Push Press"],
  },
  "Barbell Row": {
    difficulty:"Intermediate",equipment:"Barbell",
    setup:["Hip-width stance, grip just outside knees","Hinge to ~45deg torso angle","Retract scapula slightly before pulling","Arms hanging straight down"],
    execution:["Pull bar to lower chest / upper abdomen","Drive elbows back and up","Squeeze shoulder blades together at top — 1 sec hold","Lower under control"],
    mistakes:["Excessive body swing","Pulling to the stomach instead of lower chest","Rounded lower back from too much weight"],
    breathe:"Exhale on the pull, inhale on the lower",
    alternatives:["Seated Cable Row","T-Bar Row","Single Arm DB Row"],
  },
  "Lateral Raise": {
    difficulty:"Beginner",equipment:"Dumbbells",
    setup:["Stand with DBs at sides, slight forward lean (10-15deg)","Soft bend in the elbows","Thumbs slightly lower than pinkies — pour water grip","Brace core, neutral spine"],
    execution:["Lead with the elbows — not the wrists","Raise to shoulder height only","Pause briefly at top","3-second controlled lowering"],
    mistakes:["Using momentum / swinging torso","Raising above shoulder height — traps take over","Going too heavy — technique breaks down immediately"],
    breathe:"Exhale on the raise, inhale on the lower",
    alternatives:["Cable Lateral Raise","Landmine Lateral","Face Pull"],
  },
  "Barbell Curl": {
    difficulty:"Beginner",equipment:"Barbell (EZ or straight)",
    setup:["Underhand grip, hands shoulder-width","Elbows pinned to sides — they should not move","Stand tall, slight lean back is okay","Full extension at the bottom"],
    execution:["Curl bar toward chin in an arc","Supinate wrists at the top — pinky toward ceiling","Squeeze biceps hard at peak — 1 sec","Lower in 2-3 sec — the eccentric builds size"],
    mistakes:["Swinging with hips and lower back","Elbows drifting forward at the top","Not achieving full extension at bottom"],
    breathe:"Exhale on the curl, inhale on the descent",
    alternatives:["Incline DB Curl","Cable Curl","Preacher Curl"],
  },
  "Tricep Pushdown": {
    difficulty:"Beginner",equipment:"Cable Machine",
    setup:["Set cable to highest pulley","Grip with elbows at ~90deg at start","Elbows pinned tight to ribcage","Slight forward lean from the hips"],
    execution:["Push down until full lockout — arms straight","Squeeze triceps hard at lockout — 1 sec","Allow controlled return only to 90deg","With rope: spread handles apart at the bottom"],
    mistakes:["Letting elbows flare out as weight gets heavy","Using body weight to push down","Not reaching full lockout"],
    breathe:"Exhale on the push, inhale on the return",
    alternatives:["Skull Crushers","Overhead Tricep Ext","Diamond Push-up"],
  },
  "Hip Thrust": {
    difficulty:"Beginner",equipment:"Barbell + Bench",
    setup:["Upper back rests on bench edge — across shoulder blades","Feet flat, hip-width, toes slightly out","Bar padded, resting in hip crease","Chin tucked — watch your belly button"],
    execution:["Drive through heels, push hips up","Squeeze glutes maximally at top — posterior pelvic tilt","Shins vertical or slightly past vertical at top","Lower until hips are just above floor"],
    mistakes:["Hyperextending lumbar at top","Feet too close or too far","Using quads instead of glutes","Neck not neutral"],
    breathe:"Exhale forcefully at the top, inhale on descent",
    alternatives:["Glute Bridge","Cable Kickback","Bulgarian Split Squat"],
  },
  "Plank": {
    difficulty:"Beginner",equipment:"Bodyweight",
    setup:["Forearms flat, elbows under shoulders","Body in a straight line — head to heels","Toes shoulder-width apart","Don't hold breath — continuous breathing is the challenge"],
    execution:["Squeeze abs like bracing for a punch","Glutes tight — prevents hip sag","Push elbows into floor and drag them toward feet","Hold for prescribed time without compensation"],
    mistakes:["Hips too high","Hips too low — excessive lumbar compression","Holding breath","Looking up — strains cervical spine"],
    breathe:"Slow rhythmic breathing — exhale fully, inhale through nose",
    alternatives:["Dead Bug","Ab Wheel Rollout","Pallof Press"],
  },
  "Romanian Deadlift": {
    difficulty:"Intermediate",equipment:"Barbell or Dumbbells",
    setup:["Stand holding bar at hip height — start from rack","Hip-width stance, soft bend in knees","Neutral spine — chest tall, shoulder blades back","Bar stays close to body the entire movement"],
    execution:["Push hips back — not down","Bar slides down thighs as hips hinge","Feel stretch in hamstrings — lower to mid-shin","Drive hips forward to return, squeeze glutes at top"],
    mistakes:["Bending knees excessively — becomes a squat","Bar drifting away from body","Rounding the lower back to reach further"],
    breathe:"Inhale at top, brace, exhale at lockout",
    alternatives:["Single Leg RDL","Good Morning","Nordic Curl"],
  },
  "Standing Calf Raise": {
    difficulty:"Beginner",equipment:"Calf Raise Machine or Smith",
    setup:["Balls of feet on platform edge — heels hanging off","Shoulder-width foot position","Slight knee bend","Hands holding for balance only"],
    execution:["Lower heels below platform — full stretch, 2 sec hold","Rise as high as possible onto toes","2-second squeeze at peak","3-second controlled lowering"],
    mistakes:["Bouncing — using elastic energy not muscle","Partial range at bottom","Too fast — calves need time under tension"],
    breathe:"Exhale on the rise, inhale on the descent",
    alternatives:["Seated Calf Raise","Donkey Calf Raise","Single-Leg Raise"],
  },
  "Treadmill Run": {
    difficulty:"Beginner",equipment:"Treadmill",
    setup:["Warm up 2 min at walk","Stand tall — slight forward lean from ankles, not waist","Arms at 90deg — drive elbows back, hands relaxed","Look 20-30 ft ahead"],
    execution:["Land midfoot under center of gravity","Quick cadence — ~170-180 steps/min","Drive knee forward and up on each stride","Push off back foot fully before it leaves the belt"],
    mistakes:["Holding the handrails","Overstriding (heel striking far in front)","Too much vertical bounce"],
    breathe:"Nasal in for 2-3 steps, mouth out for 2-3 steps — find your rhythm",
    alternatives:["Bike Intervals","Stair Climber","Rowing Machine"],
  },
};

function ExerciseAnimation({exerciseName,color}){
  var anim=EX_ANIMS[exerciseName]||DEFAULT_ANIM;
  var detail=EX_DETAIL[exerciseName]||null;
  var[frame,setFrame]=useState(0);
  var[playing,setPlaying]=useState(true);
  var[speed,setSpeed]=useState(900);
  var[descTab,setDescTab]=useState("cues");
  var GC=color||anim.color||"#c8f53e";
  useEffect(function(){setFrame(0);setPlaying(true);},[exerciseName]);
  useEffect(function(){
    if(!playing)return;
    var t=setInterval(function(){setFrame(function(f){return(f+1)%anim.frames.length;});},speed);
    return function(){clearInterval(t);};
  },[playing,speed,exerciseName]);
  var cue=anim.cues[frame%anim.cues.length];
  var phase=anim.phases[frame%anim.phases.length];
  var diffColor={"Beginner":"#c8f53e","Intermediate":"#e8a83e","Advanced":"#ff6b35"};
  var dc=detail?(diffColor[detail.difficulty]||"#888"):null;
  return(
    <div style={{background:"linear-gradient(160deg,#0e0e18,#0a0a0f)",borderRadius:16,padding:"14px",marginBottom:10,border:"1px solid #1e1e2a",boxShadow:"0 4px 24px rgba(0,0,0,0.4)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
          <div style={{fontSize:9,color:"#555",letterSpacing:1}}>HOW TO DO IT</div>
          {detail&&<><span style={{fontSize:8,padding:"1px 6px",borderRadius:99,background:dc+"22",color:dc,fontWeight:700,border:"1px solid "+dc+"44"}}>{detail.difficulty}</span><span style={{fontSize:8,color:"#444"}}>{detail.equipment}</span></>}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={function(){setSpeed(function(s){return s===600?1100:600;});}} style={{background:"#1e1e2a",border:"none",color:"#888",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>{speed===600?"Slow":"Fast"}</button>
          <button onClick={function(){setPlaying(function(p){return!p;});}} style={{background:GC+"22",border:"1px solid "+GC+"44",color:GC,borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"inherit"}}>{playing?"Pause":"Play"}</button>
        </div>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}>
        <div style={{flexShrink:0,background:"#0d0d15",borderRadius:12,padding:"8px",border:"1px solid "+GC+"33"}}>
          <svg viewBox="0 0 100 100" width="110" height="110" dangerouslySetInnerHTML={{__html:anim.frames[frame]}}/>
          <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:6}}>
            {anim.frames.map(function(_,i){return<div key={i} style={{width:6,height:6,borderRadius:3,background:i===frame?GC:"#2a2a3a",transition:"background .2s",boxShadow:i===frame?"0 0 6px "+GC+"88":"none"}}/>;}) }
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{background:GC+"10",border:"1px solid "+GC+"33",borderRadius:9,padding:"9px 11px",marginBottom:9}}>
            <div style={{fontSize:8,color:GC,fontWeight:700,letterSpacing:1.5,marginBottom:4}}>{phase.toUpperCase()}</div>
            <div style={{fontSize:12,color:"#e8e4dc",lineHeight:1.5,fontWeight:600}}>{cue}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {anim.cues.map(function(c,i){var active=i===(frame%anim.cues.length);return(<div key={i} style={{display:"flex",alignItems:"center",gap:7,opacity:active?1:0.3,transition:"opacity .25s"}}><div style={{width:5,height:5,borderRadius:3,background:active?GC:"#2a2a3a",flexShrink:0}}/><div style={{fontSize:10,color:active?"#e8e4dc":"#666"}}>{c}</div></div>);})}
          </div>
        </div>
      </div>
      {detail&&(<div>
        <div style={{display:"flex",gap:3,background:"#0a0a0f",borderRadius:8,padding:3,marginBottom:10}}>
          {[["cues","Cues"],["setup","Setup"],["form","Mistakes"],["breathe","Breathe"]].map(function(x){return(<button key={x[0]} onClick={function(){setDescTab(x[0]);}} style={{flex:1,padding:"5px 0",borderRadius:6,border:"none",cursor:"pointer",background:descTab===x[0]?"#1e1e2a":"transparent",color:descTab===x[0]?GC:"#555",fontFamily:"inherit",fontWeight:700,fontSize:9,textTransform:"uppercase",transition:"all .15s"}}>{x[1]}</button>);})}
        </div>
        {descTab==="cues"&&(<div style={{display:"flex",flexDirection:"column",gap:6}}>{detail.execution.map(function(step,i){return(<div key={i} style={{display:"flex",gap:9,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:5,background:GC+"20",border:"1px solid "+GC+"44",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><span style={{fontSize:9,fontWeight:700,color:GC}}>{i+1}</span></div><div style={{fontSize:11,color:"#c0bdb5",lineHeight:1.5}}>{step}</div></div>);})}</div>)}
        {descTab==="setup"&&(<div style={{display:"flex",flexDirection:"column",gap:6}}><div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:2}}>BEFORE YOU BEGIN</div>{detail.setup.map(function(step,i){return(<div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",background:"#0d0d15",borderRadius:8,padding:"8px 10px"}}><span style={{fontSize:13,color:"#c8f53e"}}>✓</span><div style={{fontSize:11,color:"#c0bdb5",lineHeight:1.5}}>{step}</div></div>);})}{detail.alternatives&&(<div style={{marginTop:6}}><div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:5}}>ALTERNATIVES</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{detail.alternatives.map(function(alt){return<span key={alt} style={{fontSize:10,background:"#1e1e2a",borderRadius:99,padding:"3px 9px",color:"#888"}}>{alt}</span>;})}</div></div>)}</div>)}
        {descTab==="form"&&(<div style={{display:"flex",flexDirection:"column",gap:6}}><div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:2}}>COMMON MISTAKES TO AVOID</div>{detail.mistakes.map(function(m,i){return(<div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",background:"#1a0a0a",border:"1px solid #ff555522",borderRadius:8,padding:"8px 10px"}}><span style={{fontSize:11,color:"#ff7777",flexShrink:0}}>✕</span><div style={{fontSize:11,color:"#c0bdb5",lineHeight:1.5}}>{m}</div></div>);})}</div>)}
        {descTab==="breathe"&&(<div style={{background:"#0d1820",border:"1px solid #3eb8f533",borderRadius:10,padding:"14px 13px"}}><div style={{fontSize:9,color:"#3eb8f5",letterSpacing:1,marginBottom:8,fontWeight:700}}>BREATHING PATTERN</div><div style={{fontSize:12,color:"#c0bdb5",lineHeight:1.7}}>{detail.breathe}</div><div style={{marginTop:12,display:"flex",gap:8}}><div style={{flex:1,background:"#0a1822",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontSize:18,marginBottom:2}}>↓</div><div style={{fontSize:9,color:"#3eb8f5",fontWeight:700}}>INHALE</div><div style={{fontSize:9,color:"#555"}}>eccentric / setup</div></div><div style={{flex:1,background:"#0a1822",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontSize:18,marginBottom:2,color:GC}}>↑</div><div style={{fontSize:9,color:GC,fontWeight:700}}>EXHALE</div><div style={{fontSize:9,color:"#555"}}>concentric / effort</div></div></div></div>)}
      </div>)}
    </div>
  );
}

var EX_DB = {
  chest:[
    {name:"Bench Press",        sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"75-85% 1RM",shred:"60-70% 1RM",maintain:"65-75% 1RM",endurance:"50-60% 1RM"},tip:"Retract shoulder blades, plant feet firmly"},
    {name:"Incline DB Press",   sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"70-80% 1RM",shred:"55-65% 1RM",maintain:"60-70% 1RM",endurance:"45-55% 1RM"},tip:"30-45 degree incline, control the descent"},
    {name:"Decline Bench Press",sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"75-85% 1RM",shred:"60-70% 1RM",maintain:"65-75% 1RM",endurance:"50-60% 1RM"},tip:"Targets lower chest, controlled press"},
    {name:"Cable Fly",          sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20-25"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Slight bend in elbows throughout"},
    {name:"Pec Deck",           sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Squeeze chest at peak, slow negative"},
    {name:"Push-ups",           sets:{bulk:"4x8-12",shred:"4x15-20",maintain:"3x12-15",endurance:"5x20-25"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Full range of motion, core tight"},
    {name:"Chest Dips",         sets:{bulk:"4x6-10",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Lean forward slightly for chest emphasis"},
    {name:"DB Pullover",        sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"3x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Stretch lats and chest at bottom of arc"},
    {name:"Landmine Press",     sets:{bulk:"3x8-10",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"45s"},weight:{bulk:"Moderate",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Single arm, great for upper chest"},
  ],
  back:[
    {name:"Deadlift",           sets:{bulk:"4x4-6",shred:"3x10-12",maintain:"3x8-10",endurance:"3x12-15"},rest:{bulk:"4 min",shred:"90s",maintain:"2 min",endurance:"60s"},weight:{bulk:"80-90% 1RM",shred:"65-75% 1RM",maintain:"70-80% 1RM",endurance:"55-65% 1RM"},tip:"Neutral spine, drive through heels"},
    {name:"Pull-ups",           sets:{bulk:"4x6-8",shred:"4x10-15",maintain:"3x8-12",endurance:"5x15-20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"30s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Full hang at bottom, chin over bar"},
    {name:"Barbell Row",        sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"75-85% 1RM",shred:"60-70% 1RM",maintain:"65-75% 1RM",endurance:"50-60% 1RM"},tip:"Hinge at hips, pull to lower chest"},
    {name:"Lat Pulldown",       sets:{bulk:"4x8-10",shred:"3x12-15",maintain:"3x10-12",endurance:"4x15-20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Lean back slightly, squeeze lats at bottom"},
    {name:"Seated Cable Row",   sets:{bulk:"3x8-10",shred:"4x12-15",maintain:"3x10-12",endurance:"4x15-20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light"},tip:"Sit tall, pull to navel, pause and squeeze"},
    {name:"T-Bar Row",          sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Chest on pad, squeeze shoulder blades"},
    {name:"Single Arm DB Row",  sets:{bulk:"4x8-10",shred:"3x12-15",maintain:"3x10-12",endurance:"4x15-20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Row to hip, keep torso parallel to floor"},
    {name:"Chest Supported Row",sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"No momentum, pure back contraction"},
    {name:"Straight Arm Pulldown",sets:{bulk:"3x12-15",shred:"4x15-20",maintain:"3x15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Arms straight, hinge from shoulder joint"},
    {name:"Rack Pull",          sets:{bulk:"4x4-6",shred:"3x8-10",maintain:"3x6-8",endurance:"3x10-12"},rest:{bulk:"4 min",shred:"2 min",maintain:"3 min",endurance:"90s"},weight:{bulk:"85-95% 1RM",shred:"70-80% 1RM",maintain:"75-85% 1RM",endurance:"60-70% 1RM"},tip:"Pull from knee height, overhand grip"},
  ],
  shoulders:[
    {name:"Overhead Press",     sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"75-85% 1RM",shred:"60-70% 1RM",maintain:"65-75% 1RM",endurance:"50-60% 1RM"},tip:"Core tight, do not flare ribs"},
    {name:"Lateral Raise",      sets:{bulk:"4x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20-25"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Slight forward lean, lead with elbows"},
    {name:"Face Pull",          sets:{bulk:"3x12-15",shred:"4x15-20",maintain:"3x15",endurance:"4x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Pull to forehead, external rotation at end"},
    {name:"Arnold Press",       sets:{bulk:"4x8-10",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Rotate palms during press, full range"},
    {name:"Upright Row",        sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"3x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Wide grip, elbows above wrists"},
    {name:"Rear Delt Fly",      sets:{bulk:"4x12-15",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Light-Moderate",shred:"Light",maintain:"Light",endurance:"Light"},tip:"Bent over, lead with elbows back"},
    {name:"Cable Lateral Raise",sets:{bulk:"3x12-15",shred:"4x15-20",maintain:"3x15",endurance:"4x20"},rest:{bulk:"75s",shred:"30s",maintain:"45s",endurance:"30s"},weight:{bulk:"Light-Moderate",shred:"Light",maintain:"Light",endurance:"Light"},tip:"Constant tension vs dumbbells"},
    {name:"Push Press",         sets:{bulk:"4x5-6",shred:"3x10-12",maintain:"3x8-10",endurance:"3x12-15"},rest:{bulk:"3 min",shred:"75s",maintain:"2 min",endurance:"60s"},weight:{bulk:"80-90% 1RM",shred:"65-75% 1RM",maintain:"70-80% 1RM",endurance:"55-65% 1RM"},tip:"Slight leg drive, lock out overhead"},
    {name:"Shrugs",             sets:{bulk:"4x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Straight up and down, no rolling"},
    {name:"Landmine Lateral",   sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Light-Moderate",shred:"Light",maintain:"Light",endurance:"Light"},tip:"Arc the bar out to side, elbow soft"},
  ],
  bicep:[
    {name:"Barbell Curl",       sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"4x15-20"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"30s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"No swinging, full supination at top"},
    {name:"Incline DB Curl",    sets:{bulk:"3x8-10",shred:"3x12-15",maintain:"3x10-12",endurance:"4x15-20"},rest:{bulk:"90s",shred:"60s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Elbows behind torso for full stretch"},
    {name:"Hammer Curl",        sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"4x15-20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Neutral grip targets brachialis"},
    {name:"Concentration Curl", sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"60s",shred:"45s",maintain:"45s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Full stretch at bottom, peak squeeze at top"},
    {name:"Cable Curl",         sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Constant tension, elbows stay forward"},
    {name:"Preacher Curl",      sets:{bulk:"4x8-10",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"30s"},weight:{bulk:"Moderate-Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"No momentum, full stretch at bottom"},
    {name:"Spider Curl",        sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Chest on incline bench, elbows forward"},
    {name:"Reverse Curl",       sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Light-Moderate",shred:"Light",maintain:"Light",endurance:"Light"},tip:"Overhand grip, hits brachioradialis"},
    {name:"21s Curl",           sets:{bulk:"3x21",shred:"3x21",maintain:"3x21",endurance:"4x21"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"45s"},weight:{bulk:"Moderate",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"7 lower half, 7 upper half, 7 full reps"},
  ],
  tricep:[
    {name:"Tricep Pushdown",    sets:{bulk:"4x8-10",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20-25"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Elbows pinned to sides, full lockout"},
    {name:"Skull Crushers",     sets:{bulk:"4x8-10",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"90s",shred:"60s",maintain:"60s",endurance:"45s"},weight:{bulk:"Moderate",shred:"Light-Moderate",maintain:"Light-Moderate",endurance:"Light"},tip:"Lower to forehead, elbows stay fixed"},
    {name:"Overhead Tricep Ext",sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Full stretch at top, elbows close to head"},
    {name:"Tricep Dips",        sets:{bulk:"4x6-10",shred:"3x12-15",maintain:"3x10-12",endurance:"4x15-20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Upright torso to isolate triceps"},
    {name:"Close-Grip Bench",   sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"2 min",shred:"75s",maintain:"90s",endurance:"60s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Hands shoulder-width, elbows tucked"},
    {name:"Rope Pushdown",      sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Spread rope at bottom, full lockout"},
    {name:"Kickback",           sets:{bulk:"3x12-15",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Light-Moderate",shred:"Light",maintain:"Light",endurance:"Light"},tip:"Hinge forward, extend fully behind you"},
    {name:"Diamond Push-up",    sets:{bulk:"3x10-15",shred:"4x15-20",maintain:"3x12-15",endurance:"5x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Hands form diamond shape, elbows in"},
    {name:"Tate Press",         sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Flare elbows out, lower to chest"},
  ],
  forearm:[
    {name:"Wrist Curl",         sets:{bulk:"4x12-15",shred:"3x20-25",maintain:"3x15-20",endurance:"4x25"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Light-Moderate",shred:"Light",maintain:"Light",endurance:"Very Light"},tip:"Forearms on bench, full range of motion"},
    {name:"Reverse Wrist Curl", sets:{bulk:"3x12-15",shred:"3x20-25",maintain:"3x15-20",endurance:"3x25"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Light",shred:"Very Light",maintain:"Light",endurance:"Very Light"},tip:"Extensor focus, control the descent"},
    {name:"Farmers Carry",      sets:{bulk:"4x40m",shred:"4x50m",maintain:"3x40m",endurance:"5x50m"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"45s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Shoulders packed, walk tall"},
    {name:"Dead Hang",          sets:{bulk:"3x30s",shred:"4x45s",maintain:"3x40s",endurance:"5x60s"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"45s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Full grip engagement, relax shoulders"},
    {name:"Plate Pinch",        sets:{bulk:"3x20s",shred:"4x30s",maintain:"3x25s",endurance:"4x30s"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"45s"},weight:{bulk:"Moderate",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Pinch two plates together, hold for time"},
    {name:"Towel Pull-up",      sets:{bulk:"3x6-8",shred:"3x10-12",maintain:"3x8-10",endurance:"4x12-15"},rest:{bulk:"2 min",shred:"90s",maintain:"90s",endurance:"60s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Drape towel over bar, brutal grip challenge"},
    {name:"Pronation/Supination",sets:{bulk:"3x15ea",shred:"3x20ea",maintain:"3x15ea",endurance:"4x20ea"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Light",shred:"Very Light",maintain:"Light",endurance:"Very Light"},tip:"Dumbbell vertical, rotate palm up then down"},
    {name:"Barbell Finger Roll", sets:{bulk:"3x12-15",shred:"3x20",maintain:"3x15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Light-Moderate",shred:"Light",maintain:"Light",endurance:"Very Light"},tip:"Let bar roll to fingertips, curl back up"},
    {name:"Rice Bucket",        sets:{bulk:"3x60s",shred:"4x60s",maintain:"3x60s",endurance:"5x60s"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Dig and rotate hands through rice bucket"},
  ],
  glute:[
    {name:"Hip Thrust",         sets:{bulk:"4x8-10",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20-25"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Drive through heels, squeeze glutes at top"},
    {name:"Glute Bridge",       sets:{bulk:"4x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Light",endurance:"Bodyweight"},tip:"Posterior pelvic tilt at top, hold 1 second"},
    {name:"Cable Kickback",     sets:{bulk:"3x12-15",shred:"4x20-25",maintain:"3x15-20",endurance:"4x25"},rest:{bulk:"75s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Slight forward lean, extend fully at rear"},
    {name:"Sumo Squat",         sets:{bulk:"4x8-10",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Wide stance, toes out 45 degrees"},
    {name:"Romanian Deadlift",  sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"70-80% 1RM",shred:"55-65% 1RM",maintain:"60-70% 1RM",endurance:"50-60% 1RM"},tip:"Push hips back, feel hamstring stretch"},
    {name:"Bulgarian Split Squat",sets:{bulk:"4x8-10",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"2 min",shred:"75s",maintain:"90s",endurance:"60s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Bodyweight"},tip:"Front foot far forward, vertical torso"},
    {name:"Donkey Kick",        sets:{bulk:"3x15-20",shred:"4x20-25",maintain:"3x20",endurance:"4x25"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Light",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"On all fours, kick heel to ceiling, squeeze"},
    {name:"Step Up",            sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"45s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Bodyweight"},tip:"Drive through front heel, tall box"},
    {name:"Lateral Band Walk",  sets:{bulk:"3x20ea",shred:"4x25ea",maintain:"3x20ea",endurance:"4x30ea"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Heavy Band",shred:"Medium Band",maintain:"Medium Band",endurance:"Light Band"},tip:"Stay low, constant tension on band"},
  ],
  hamstring:[
    {name:"Lying Leg Curl",     sets:{bulk:"4x8-10",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20-25"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Control the negative, full contraction at top"},
    {name:"Romanian Deadlift",  sets:{bulk:"4x6-8",shred:"3x12-15",maintain:"3x10-12",endurance:"3x15-20"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"70-80% 1RM",shred:"55-65% 1RM",maintain:"60-70% 1RM",endurance:"50-60% 1RM"},tip:"Soft knee bend, drive hips back"},
    {name:"Nordic Curl",        sets:{bulk:"3x5-8",shred:"3x8-12",maintain:"3x6-10",endurance:"4x10-15"},rest:{bulk:"2 min",shred:"90s",maintain:"90s",endurance:"60s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Anchor feet, lower slowly with control"},
    {name:"Seated Leg Curl",    sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Full extension at start, pause at contraction"},
    {name:"Good Morning",       sets:{bulk:"3x10-12",shred:"3x12-15",maintain:"3x12",endurance:"3x15"},rest:{bulk:"2 min",shred:"75s",maintain:"90s",endurance:"60s"},weight:{bulk:"Light-Moderate",shred:"Light",maintain:"Light",endurance:"Very Light"},tip:"Hinge at hips, neutral spine throughout"},
    {name:"Stability Ball Curl",sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Heels on ball, curl toward glutes"},
    {name:"Single Leg RDL",     sets:{bulk:"3x8-10ea",shred:"3x12-15ea",maintain:"3x10-12ea",endurance:"4x15ea"},rest:{bulk:"2 min",shred:"75s",maintain:"90s",endurance:"60s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Slight knee bend, hinge until parallel"},
    {name:"Sumo Deadlift",      sets:{bulk:"4x4-6",shred:"3x10-12",maintain:"3x8-10",endurance:"3x12-15"},rest:{bulk:"4 min",shred:"90s",maintain:"2 min",endurance:"60s"},weight:{bulk:"80-90% 1RM",shred:"65-75% 1RM",maintain:"70-80% 1RM",endurance:"55-65% 1RM"},tip:"Wide stance, toes out, vertical shins"},
    {name:"Glute Ham Raise",    sets:{bulk:"4x6-10",shred:"3x10-15",maintain:"3x8-12",endurance:"4x12-15"},rest:{bulk:"2 min",shred:"75s",maintain:"90s",endurance:"60s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Lower under control, drive hips into pad"},
  ],
  quad:[
    {name:"Squat",              sets:{bulk:"4x4-6",shred:"4x12-15",maintain:"4x8-10",endurance:"4x15-20"},rest:{bulk:"4 min",shred:"90s",maintain:"2 min",endurance:"60s"},weight:{bulk:"80-90% 1RM",shred:"60-70% 1RM",maintain:"70-80% 1RM",endurance:"50-60% 1RM"},tip:"Knees track toes, depth below parallel"},
    {name:"Leg Press",          sets:{bulk:"4x8-10",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20-25"},rest:{bulk:"3 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Feet shoulder-width, full range of motion"},
    {name:"Leg Extension",      sets:{bulk:"4x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20-25"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Full lockout at top, 1 second squeeze"},
    {name:"Hack Squat",         sets:{bulk:"4x8-10",shred:"3x12-15",maintain:"3x10-12",endurance:"4x15-20"},rest:{bulk:"3 min",shred:"75s",maintain:"2 min",endurance:"60s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light-Moderate"},tip:"Heels elevated slightly, deep range"},
    {name:"Walking Lunge",      sets:{bulk:"3x10-12",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Light",endurance:"Bodyweight"},tip:"Long stride, knee just above floor"},
    {name:"Front Squat",        sets:{bulk:"4x4-6",shred:"3x12-15",maintain:"3x8-10",endurance:"4x15"},rest:{bulk:"4 min",shred:"90s",maintain:"2 min",endurance:"60s"},weight:{bulk:"75-85% 1RM",shred:"60-70% 1RM",maintain:"65-75% 1RM",endurance:"50-60% 1RM"},tip:"Elbows high, upright torso, quad dominant"},
    {name:"Bulgarian Split Squat",sets:{bulk:"4x8-10",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"2 min",shred:"75s",maintain:"90s",endurance:"60s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Bodyweight"},tip:"Rear foot elevated, vertical shin on front leg"},
    {name:"Sissy Squat",        sets:{bulk:"3x10-15",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"45s"},weight:{bulk:"Bodyweight+",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Lean back, knees forward past toes"},
    {name:"Step Up",            sets:{bulk:"3x10-12ea",shred:"4x15ea",maintain:"3x12ea",endurance:"4x20ea"},rest:{bulk:"90s",shred:"60s",maintain:"75s",endurance:"45s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Bodyweight"},tip:"Drive through front heel"},
  ],
  calf:[
    {name:"Standing Calf Raise",sets:{bulk:"5x8-12",shred:"4x20-25",maintain:"4x15-20",endurance:"5x25-30"},rest:{bulk:"90s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light"},tip:"Full stretch at bottom, hold peak 2 seconds"},
    {name:"Seated Calf Raise",  sets:{bulk:"4x12-15",shred:"4x20-25",maintain:"3x15-20",endurance:"5x25"},rest:{bulk:"75s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Targets soleus, slow 3-second tempo"},
    {name:"Single-Leg Raise",   sets:{bulk:"3x10-12",shred:"3x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Bodyweight+",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Hold something for balance, full ROM"},
    {name:"Donkey Calf Raise",  sets:{bulk:"4x12-15",shred:"4x20",maintain:"3x15",endurance:"4x25"},rest:{bulk:"75s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Moderate",shred:"Light",maintain:"Light-Moderate",endurance:"Light"},tip:"Hips hinged at 90 degrees, deep stretch"},
    {name:"Jump Rope",          sets:{bulk:"3x2 min",shred:"5x2 min",maintain:"4x2 min",endurance:"8x2 min"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Stay on balls of feet, minimal ground contact"},
    {name:"Box Jump",           sets:{bulk:"4x6-8",shred:"4x10-12",maintain:"3x8-10",endurance:"5x12-15"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Soft landing, step down rather than jump down"},
    {name:"Leg Press Calf Raise",sets:{bulk:"4x15-20",shred:"4x25-30",maintain:"3x20",endurance:"5x30"},rest:{bulk:"75s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light"},tip:"Toes on edge of platform, full plantarflexion"},
    {name:"Smith Calf Raise",   sets:{bulk:"4x10-15",shred:"4x20-25",maintain:"3x15-20",endurance:"5x25"},rest:{bulk:"75s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Heavy",shred:"Moderate",maintain:"Moderate",endurance:"Light"},tip:"Use a plate under toes for extra range"},
    {name:"Ankle Hops",         sets:{bulk:"3x20",shred:"4x30",maintain:"3x25",endurance:"5x30"},rest:{bulk:"75s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Minimal ground time, stiff ankles, rapid bounce"},
  ],
  core:[
    {name:"Plank",              sets:{bulk:"4x45s",shred:"4x60s",maintain:"3x45s",endurance:"5x60s"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"30s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Neutral spine, squeeze glutes and abs"},
    {name:"Cable Crunch",       sets:{bulk:"4x10-12",shred:"4x15-20",maintain:"3x15",endurance:"4x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate-Heavy",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Curl down with abs, not hip flexors"},
    {name:"Hanging Leg Raise",  sets:{bulk:"3x8-10",shred:"4x15-20",maintain:"3x12-15",endurance:"4x20"},rest:{bulk:"90s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"No swinging, control the descent"},
    {name:"Russian Twist",      sets:{bulk:"3x16",shred:"4x20",maintain:"3x20",endurance:"4x30"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"30s"},weight:{bulk:"Weighted",shred:"Light",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Lean back 45 degrees, rotate from core"},
    {name:"Ab Wheel Rollout",   sets:{bulk:"3x8-10",shred:"4x12-15",maintain:"3x10-12",endurance:"4x15"},rest:{bulk:"90s",shred:"60s",maintain:"60s",endurance:"45s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Keep hips in line, brace core throughout"},
    {name:"V-Up",               sets:{bulk:"3x12-15",shred:"4x20",maintain:"3x15",endurance:"4x25"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Reach hands to feet simultaneously"},
    {name:"Dead Bug",           sets:{bulk:"3x10ea",shred:"4x15ea",maintain:"3x12ea",endurance:"4x20ea"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"20s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Lower back pressed flat, breathe out on descent"},
    {name:"Pallof Press",       sets:{bulk:"3x12",shred:"4x15",maintain:"3x12",endurance:"4x15"},rest:{bulk:"75s",shred:"45s",maintain:"60s",endurance:"30s"},weight:{bulk:"Moderate",shred:"Light-Moderate",maintain:"Moderate",endurance:"Light"},tip:"Anti-rotation, resist the cable pull"},
    {name:"Dragon Flag",        sets:{bulk:"3x5-8",shred:"3x8-12",maintain:"3x6-10",endurance:"4x10-15"},rest:{bulk:"2 min",shred:"90s",maintain:"90s",endurance:"60s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Keep body rigid, lower slowly"},
    {name:"Side Plank",         sets:{bulk:"3x45s ea",shred:"4x60s ea",maintain:"3x45s ea",endurance:"4x60s ea"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"30s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Stack feet or stagger, keep hips lifted"},
  ],
  cardio:[
    {name:"Treadmill Run",      sets:{bulk:"1x20 min",shred:"1x35 min",maintain:"1x25 min",endurance:"1x45 min"},rest:{bulk:"N/A",shred:"N/A",maintain:"N/A",endurance:"N/A"},weight:{bulk:"Zone 2",shred:"Zone 3-4",maintain:"Zone 2-3",endurance:"Zone 3-4"},tip:"Maintain conversational pace for fat burn"},
    {name:"Rowing Machine",     sets:{bulk:"1x15 min",shred:"1x25 min",maintain:"1x20 min",endurance:"1x40 min"},rest:{bulk:"N/A",shred:"N/A",maintain:"N/A",endurance:"N/A"},weight:{bulk:"Moderate",shred:"Moderate-High",maintain:"Moderate",endurance:"Moderate-High"},tip:"Drive with legs first, then pull with arms"},
    {name:"Jump Rope",          sets:{bulk:"5x2 min",shred:"8x2 min",maintain:"5x3 min",endurance:"10x3 min"},rest:{bulk:"60s",shred:"30s",maintain:"45s",endurance:"30s"},weight:{bulk:"Bodyweight",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Stay on balls of feet, minimal jump height"},
    {name:"Bike Intervals",     sets:{bulk:"6x30s on/30s off",shred:"10x40s on/20s off",maintain:"8x30s on/30s off",endurance:"12x40s on/20s off"},rest:{bulk:"Between sets",shred:"Between sets",maintain:"Between sets",endurance:"Between sets"},weight:{bulk:"High resistance",shred:"Moderate",maintain:"Moderate",endurance:"Moderate-High"},tip:"Max effort during work intervals"},
    {name:"Stair Climber",      sets:{bulk:"1x15 min",shred:"1x30 min",maintain:"1x20 min",endurance:"1x40 min"},rest:{bulk:"N/A",shred:"N/A",maintain:"N/A",endurance:"N/A"},weight:{bulk:"Moderate",shred:"Moderate-High",maintain:"Moderate",endurance:"Moderate-High"},tip:"Do not lean on handles, upright posture"},
  ],
  "full body":[
    {name:"Squat",              sets:{bulk:"4x5",shred:"3x12",maintain:"3x10",endurance:"3x15"},rest:{bulk:"3 min",shred:"75s",maintain:"2 min",endurance:"60s"},weight:{bulk:"80% 1RM",shred:"65% 1RM",maintain:"70% 1RM",endurance:"55% 1RM"},tip:"Knees track toes, full depth"},
    {name:"Bench Press",        sets:{bulk:"4x5",shred:"3x12",maintain:"3x10",endurance:"3x15"},rest:{bulk:"3 min",shred:"75s",maintain:"2 min",endurance:"60s"},weight:{bulk:"80% 1RM",shred:"65% 1RM",maintain:"70% 1RM",endurance:"55% 1RM"},tip:"Retract scapula, controlled descent"},
    {name:"Barbell Row",        sets:{bulk:"4x5",shred:"3x12",maintain:"3x10",endurance:"3x15"},rest:{bulk:"3 min",shred:"75s",maintain:"2 min",endurance:"60s"},weight:{bulk:"80% 1RM",shred:"65% 1RM",maintain:"70% 1RM",endurance:"55% 1RM"},tip:"Neutral back, pull to lower chest"},
    {name:"Overhead Press",     sets:{bulk:"3x5",shred:"3x12",maintain:"3x10",endurance:"3x15"},rest:{bulk:"3 min",shred:"75s",maintain:"2 min",endurance:"60s"},weight:{bulk:"75% 1RM",shred:"60% 1RM",maintain:"65% 1RM",endurance:"50% 1RM"},tip:"Brace core, press in a straight line"},
    {name:"Romanian Deadlift",  sets:{bulk:"3x6",shred:"3x12",maintain:"3x10",endurance:"3x15"},rest:{bulk:"3 min",shred:"75s",maintain:"2 min",endurance:"60s"},weight:{bulk:"75% 1RM",shred:"60% 1RM",maintain:"65% 1RM",endurance:"50% 1RM"},tip:"Push hips back, soft knee bend"},
    {name:"Pull-ups",           sets:{bulk:"3x6",shred:"3x10",maintain:"3x8",endurance:"4x12"},rest:{bulk:"2 min",shred:"60s",maintain:"90s",endurance:"45s"},weight:{bulk:"Weighted",shred:"Bodyweight",maintain:"Bodyweight",endurance:"Bodyweight"},tip:"Full hang, chin over bar"},
  ],
};

var FOOD_SUGS = {
  high_protein:[
    {name:"Chicken Breast + Rice",calories:420,protein:45,carbs:40,fat:6,reason:"High protein complete meal"},
    {name:"Greek Yogurt + Berries",calories:180,protein:18,carbs:20,fat:2,reason:"Fast protein, low fat",isSnack:true},
    {name:"Eggs + Avocado Toast",calories:380,protein:22,carbs:28,fat:18,reason:"Quality protein and healthy fats"},
    {name:"Tuna + Crackers",calories:200,protein:25,carbs:15,fat:3,reason:"Lean protein, portable",isSnack:true},
    {name:"Cottage Cheese",calories:150,protein:20,carbs:6,fat:3,reason:"Slow-digesting casein protein",isSnack:true},
    {name:"Protein Shake + Banana",calories:280,protein:28,carbs:32,fat:3,reason:"Quick post-workout recovery",isSnack:true},
    {name:"Turkey Wrap",calories:350,protein:32,carbs:30,fat:8,reason:"Lean protein, balanced macros"},
    {name:"Salmon + Veggies",calories:440,protein:40,carbs:12,fat:22,reason:"Omega-3s and complete protein"},
  ],
  high_carb:[
    {name:"Oatmeal + Banana",calories:320,protein:8,carbs:62,fat:5,reason:"Sustained energy from complex carbs"},
    {name:"Sweet Potato + Chicken",calories:450,protein:38,carbs:48,fat:6,reason:"Complex carbs for endurance fuel"},
    {name:"Pasta + Tomato Sauce",calories:480,protein:16,carbs:82,fat:8,reason:"High carb for glycogen replenishment"},
    {name:"Rice Cakes + PB",calories:220,protein:6,carbs:28,fat:10,reason:"Quick carbs with healthy fat",isSnack:true},
    {name:"Fruit Salad",calories:150,protein:2,carbs:36,fat:1,reason:"Natural sugars for quick energy",isSnack:true},
    {name:"Whole Grain Bagel",calories:300,protein:10,carbs:58,fat:3,reason:"Dense carb source for fuel"},
    {name:"Trail Mix",calories:180,protein:5,carbs:22,fat:9,reason:"Portable carb and energy snack",isSnack:true},
  ],
  low_calorie:[
    {name:"Salad + Grilled Chicken",calories:280,protein:35,carbs:12,fat:8,reason:"Filling, low calorie, high protein"},
    {name:"Veggie Omelette",calories:220,protein:18,carbs:8,fat:12,reason:"Low calorie, nutrient dense"},
    {name:"Apple + Almond Butter",calories:190,protein:4,carbs:24,fat:9,reason:"Fiber keeps you full longer",isSnack:true},
    {name:"Cucumber + Hummus",calories:120,protein:4,carbs:14,fat:5,reason:"Low calorie, satisfying snack",isSnack:true},
    {name:"Zucchini Noodles",calories:180,protein:8,carbs:22,fat:6,reason:"Low carb pasta alternative"},
    {name:"String Cheese",calories:80,protein:7,carbs:1,fat:5,reason:"Low cal, high protein snack",isSnack:true},
    {name:"Smoothie Bowl",calories:300,protein:15,carbs:40,fat:7,reason:"Nutrient dense and filling"},
  ],
  balanced:[
    {name:"Grilled Salmon + Rice",calories:520,protein:42,carbs:45,fat:14,reason:"Perfect macro balance"},
    {name:"Chicken Stir Fry",calories:420,protein:38,carbs:35,fat:10,reason:"Balanced protein, carbs and veg"},
    {name:"Overnight Oats",calories:380,protein:18,carbs:52,fat:9,reason:"Great balanced breakfast"},
    {name:"Mixed Nuts + Fruit",calories:240,protein:6,carbs:24,fat:14,reason:"Balanced energy snack",isSnack:true},
    {name:"Quinoa Bowl",calories:460,protein:22,carbs:58,fat:12,reason:"Complete protein, complex carbs"},
    {name:"PB + Banana Wrap",calories:320,protein:10,carbs:42,fat:12,reason:"Quick balanced snack",isSnack:true},
    {name:"Beef + Sweet Potato",calories:490,protein:40,carbs:42,fat:14,reason:"Iron-rich protein with complex carbs"},
  ],
};

function getFoodSugs(remCal,remProt,goal){
  var pool=goal==="shred"?FOOD_SUGS.low_calorie:goal==="endurance"?FOOD_SUGS.high_carb:remProt>50?FOOD_SUGS.high_protein:FOOD_SUGS.balanced;
  var sh=pool.slice().sort(function(){return Math.random()-0.5;});
  var m=sh.filter(function(f){return !f.isSnack;}).slice(0,3);
  var s=sh.filter(function(f){return f.isSnack;}).slice(0,3);
  if(s.length<3)s=s.concat(FOOD_SUGS.balanced.filter(function(f){return f.isSnack;})).slice(0,3);
  return{meals:m,snacks:s};
}

var OV={bulk:"Focus on progressive overload with heavy compound lifts. Rest fully between sets to maximize strength output.",shred:"Higher reps with shorter rest keeps heart rate elevated for maximum calorie burn while preserving muscle.",maintain:"Balanced volume and intensity to sustain strength and muscle. Perfect for long-term consistency.",endurance:"High rep ranges and minimal rest build cardiovascular fitness and muscular endurance."};
var INTENS={bulk:"high",shred:"moderate",maintain:"moderate",endurance:"high"};

function getWorkoutPlan(goal,muscle){
  var exs=EX_DB[muscle]||EX_DB["full body"];
  return{exercises:exs.map(function(ex){return{name:ex.name,sets:ex.sets[goal]||ex.sets.maintain,rest:ex.rest[goal]||ex.rest.maintain,weight:ex.weight[goal]||ex.weight.maintain,tip:ex.tip,muscle:muscle};}),overview:OV[goal]||OV.maintain,intensity:INTENS[goal]||"moderate"};
}

var EX_DATA=[
  {name:"Running",caloriesPerMin:10,category:"Cardio",em:EM.run},
  {name:"Cycling",caloriesPerMin:8,category:"Cardio",em:EM.bike},
  {name:"Swimming",caloriesPerMin:9,category:"Cardio",em:EM.swim},
  {name:"Weight Lifting",caloriesPerMin:6,category:"Strength",em:EM.lift},
  {name:"Yoga",caloriesPerMin:3,category:"Flexibility",em:EM.yoga},
  {name:"HIIT",caloriesPerMin:12,category:"Cardio",em:EM.bolt},
  {name:"Jump Rope",caloriesPerMin:11,category:"Cardio",em:EM.rope},
  {name:"Push-ups",caloriesPerMin:7,category:"Strength",em:EM.flex},
  {name:"Pilates",caloriesPerMin:4,category:"Flexibility",em:EM.stretch},
  {name:"Boxing",caloriesPerMin:11,category:"Cardio",em:EM.box},
];
var FOOD_DATA=[
  {name:"Chicken Breast",calories:165,per:"100g",protein:31,carbs:0,fat:3.6,em:EM.chicken},
  {name:"Brown Rice",calories:216,per:"cup",protein:5,carbs:45,fat:1.8,em:EM.rice},
  {name:"Salad",calories:80,per:"bowl",protein:3,carbs:10,fat:4,em:EM.salad},
  {name:"Banana",calories:89,per:"medium",protein:1,carbs:23,fat:0.3,em:EM.banana},
  {name:"Greek Yogurt",calories:100,per:"100g",protein:10,carbs:6,fat:0.7,em:EM.yogurt},
  {name:"Eggs",calories:155,per:"2 large",protein:13,carbs:1,fat:11,em:EM.egg},
  {name:"Avocado",calories:234,per:"whole",protein:3,carbs:12,fat:21,em:EM.avo},
  {name:"Oatmeal",calories:150,per:"cup",protein:5,carbs:27,fat:2.5,em:EM.oat},
  {name:"Almonds",calories:164,per:"30g",protein:6,carbs:6,fat:14,em:EM.nut},
  {name:"Protein Bar",calories:200,per:"bar",protein:20,carbs:22,fat:7,em:EM.chocbar},
];
var GOALS=[
  {id:"bulk",label:"Bulk",em:EM.bulk,desc:"Build muscle mass",color:"#c8f53e",proteinPct:0.30,carbsPct:0.50,fatPct:0.20,calMod:500},
  {id:"shred",label:"Shred",em:EM.shred,desc:"Lose fat, keep muscle",color:"#ff6b35",proteinPct:0.40,carbsPct:0.30,fatPct:0.30,calMod:-400},
  {id:"maintain",label:"Maintain",em:EM.bal,desc:"Stay lean and strong",color:"#3eb8f5",proteinPct:0.30,carbsPct:0.40,fatPct:0.30,calMod:0},
  {id:"endurance",label:"Endurance",em:EM.endur,desc:"Cardio and stamina",color:"#b03ef5",proteinPct:0.20,carbsPct:0.60,fatPct:0.20,calMod:200},
];
var ACTIVITY=[
  {id:"sedentary",label:"Sedentary",mult:1.2},
  {id:"light",label:"Lightly Active",mult:1.375},
  {id:"moderate",label:"Moderately Active",mult:1.55},
  {id:"active",label:"Very Active",mult:1.725},
  {id:"extreme",label:"Athlete",mult:1.9},
];
var AVATARS=[EM.a1,EM.a2,EM.a3,EM.a4,EM.a5,EM.a6,EM.a7,EM.a8,EM.a9,EM.a10];
var TODAY=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

function calcBMR(age,wKg,hCm,sex){if(!age||!wKg||!hCm)return 0;return sex==="female"?10*wKg+6.25*hCm-5*age-161:10*wKg+6.25*hCm-5*age+5;}
function calcTDEE(bmr,a){return Math.round(bmr*((ACTIVITY.find(function(x){return x.id===a;})||ACTIVITY[2]).mult));}
function calcGoalCal(tdee,g){return Math.max(1200,tdee+((GOALS.find(function(x){return x.id===g;})||GOALS[2]).calMod));}
function calcMacros(k,g){var gl=GOALS.find(function(x){return x.id===g;})||GOALS[2];return{protein:Math.round(k*gl.proteinPct/4),carbs:Math.round(k*gl.carbsPct/4),fat:Math.round(k*gl.fatPct/9)};}

function useTimer(){
  var[e,sE]=useState(0),[run,sR]=useState(false),ref=useRef(null);
  useEffect(function(){if(run)ref.current=setInterval(function(){sE(function(x){return x+1;});},1000);else clearInterval(ref.current);return function(){clearInterval(ref.current);};},[run]);
  function fmt(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");}
  return{elapsed:e,running:run,setRunning:sR,reset:function(){sE(0);sR(false);},fmt};
}

function ProgressChart({workouts,exerciseName,GC}){
  if(!exerciseName)return null;
  // Extract max weight per session for this exercise
  var points=[];
  workouts.slice().reverse().forEach(function(w){
    if(!w.sets||!w.sets.length)return;
    var exSets=w.sets.filter(function(s){return s.exercise&&s.exercise.toLowerCase()===exerciseName.toLowerCase()&&s.weight&&parseFloat(s.weight)>0;});
    if(!exSets.length)return;
    var maxW=Math.max.apply(null,exSets.map(function(s){return parseFloat(s.weight)||0;}));
    var maxR=Math.max.apply(null,exSets.map(function(s){return parseFloat(s.reps)||0;}));
    if(maxW>0)points.push({date:w.date||w.time,weight:maxW,reps:maxR,logged_at:w.logged_at});
  });
  if(!points.length)return(
    <div style={{textAlign:"center",padding:"20px",color:"#555",fontSize:12}}>No weight data logged for {exerciseName} yet. Record a workout with weights to see progress.</div>
  );
  var maxW=Math.max.apply(null,points.map(function(p){return p.weight;}));
  var minW=Math.min.apply(null,points.map(function(p){return p.weight;}));
  var chartH=120,chartW=300,pad=30;
  var pr=points[points.length-1];
  var first=points[0];
  var diff=pr.weight-first.weight;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
        {[["Best",maxW+"lbs",GC],["Sessions",points.length,"#3eb8f5"],["Progress",(diff>=0?"+":"")+diff+"lbs",diff>=0?"#c8f53e":"#ff6b35"]].map(function(x){return(
          <div key={x[0]} style={{background:"#0a0a0f",borderRadius:9,padding:"8px",textAlign:"center"}}>
            <div style={{fontSize:8,color:"#555",marginBottom:3}}>{x[0]}</div>
            <div style={{fontSize:14,fontWeight:700,color:x[2]}}>{x[1]}</div>
          </div>
        );})}
      </div>
      <svg width="100%" viewBox={"0 0 "+(chartW+pad*2)+" "+(chartH+pad*2)} style={{overflow:"visible"}}>
        <defs>
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={GC} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={GC} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0,0.25,0.5,0.75,1].map(function(t){
          var y=pad+chartH*t;
          var val=Math.round(maxW-(maxW-minW)*t);
          return(<g key={t}>
            <line x1={pad} y1={y} x2={pad+chartW} y2={y} stroke="#1e1e2a" strokeWidth="1"/>
            <text x={pad-4} y={y+4} textAnchor="end" fill="#444" fontSize="9">{val}</text>
          </g>);
        })}
        {/* Area fill */}
        {points.length>1&&(()=>{
          var pts=points.map(function(p,i){
            var x=pad+(i/(points.length-1))*chartW;
            var y=pad+chartH-(((p.weight-minW)/(maxW-minW||1))*chartH);
            return x+","+y;
          });
          var area=pts.join(" ")+" "+(pad+chartW)+","+(pad+chartH)+" "+pad+","+(pad+chartH);
          return <polygon points={area} fill="url(#chartGrad)"/>;
        })()}
        {/* Line */}
        {points.length>1&&(()=>{
          var d=points.map(function(p,i){
            var x=pad+(i/(points.length-1))*chartW;
            var y=pad+chartH-(((p.weight-minW)/(maxW-minW||1))*chartH);
            return(i===0?"M":"L")+x+","+y;
          }).join(" ");
          return <path d={d} fill="none" stroke={GC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>;
        })()}
        {/* Dots + labels */}
        {points.map(function(p,i){
          var x=pad+(i/(points.length-1||1))*chartW;
          var y=pad+chartH-(((p.weight-minW)/(maxW-minW||1))*chartH);
          var isLast=i===points.length-1;
          return(<g key={i}>
            <circle cx={x} cy={y} r={isLast?5:3} fill={isLast?GC:"#0a0a0f"} stroke={GC} strokeWidth="2"/>
            {isLast&&<text x={x} y={y-10} textAnchor="middle" fill={GC} fontSize="10" fontWeight="700">{p.weight}lbs</text>}
          </g>);
        })}
        {/* X axis dates */}
        {points.filter(function(_,i){return i===0||i===points.length-1||i===Math.floor(points.length/2);}).map(function(p,i,arr){
          var origIdx=i===0?0:i===arr.length-1?points.length-1:Math.floor(points.length/2);
          var x=pad+(origIdx/(points.length-1||1))*chartW;
          return <text key={i} x={x} y={pad+chartH+16} textAnchor="middle" fill="#444" fontSize="8">{p.date}</text>;
        })}
      </svg>
      <div style={{marginTop:8}}>
        <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:6}}>RECENT SESSIONS</div>
        {points.slice(-5).reverse().map(function(p,i){return(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #1a1a22"}}>
            <div style={{fontSize:11,color:"#888"}}>{p.date}</div>
            <div style={{display:"flex",gap:12}}>
              <div style={{fontSize:11,fontWeight:700,color:GC}}>{p.weight} lbs</div>
              <div style={{fontSize:11,color:"#555"}}>{p.reps} reps</div>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}


// ── XP & Level System ────────────────────────────────────────
var LEVELS=[
  {min:0,max:499,level:1,title:"Rookie",em:"🥉",color:"#cd7f32"},
  {min:500,max:999,level:2,title:"Rookie",em:"🥉",color:"#cd7f32"},
  {min:1000,max:1999,level:3,title:"Rookie",em:"🥉",color:"#cd7f32"},
  {min:2000,max:3499,level:4,title:"Rookie",em:"🥉",color:"#cd7f32"},
  {min:3500,max:4999,level:5,title:"Rookie",em:"🥉",color:"#cd7f32"},
  {min:5000,max:7499,level:6,title:"Hustler",em:"💪",color:"#c0c0c0"},
  {min:7500,max:9999,level:7,title:"Hustler",em:"💪",color:"#c0c0c0"},
  {min:10000,max:12999,level:8,title:"Hustler",em:"💪",color:"#c0c0c0"},
  {min:13000,max:16999,level:9,title:"Hustler",em:"💪",color:"#c0c0c0"},
  {min:17000,max:21999,level:10,title:"Hustler",em:"💪",color:"#c0c0c0"},
  {min:22000,max:27999,level:11,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:28000,max:34999,level:12,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:35000,max:42999,level:13,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:43000,max:51999,level:14,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:52000,max:62999,level:15,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:63000,max:75999,level:16,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:76000,max:90999,level:17,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:91000,max:109999,level:18,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:110000,max:129999,level:19,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:130000,max:154999,level:20,title:"Grinder",em:"⚙️",color:"#3eb8f5"},
  {min:155000,max:184999,level:21,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:185000,max:219999,level:22,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:220000,max:259999,level:23,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:260000,max:304999,level:24,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:305000,max:354999,level:25,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:355000,max:409999,level:26,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:410000,max:469999,level:27,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:470000,max:534999,level:28,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:535000,max:604999,level:29,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:605000,max:699999,level:30,title:"Beast",em:"🔥",color:"#ff6b35"},
  {min:700000,max:799999,level:31,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:800000,max:909999,level:32,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:910000,max:1029999,level:33,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:1030000,max:1164999,level:34,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:1165000,max:1314999,level:35,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:1315000,max:1479999,level:36,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:1480000,max:1659999,level:37,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:1660000,max:1854999,level:38,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:1855000,max:2064999,level:39,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:2065000,max:2299999,level:40,title:"Elite",em:"⚡",color:"#b03ef5"},
  {min:2300000,max:2599999,level:41,title:"Legend",em:"👑",color:"#f5c842"},
  {min:2600000,max:2949999,level:42,title:"Legend",em:"👑",color:"#f5c842"},
  {min:2950000,max:3349999,level:43,title:"Legend",em:"👑",color:"#f5c842"},
  {min:3350000,max:3799999,level:44,title:"Legend",em:"👑",color:"#f5c842"},
  {min:3800000,max:4299999,level:45,title:"Legend",em:"👑",color:"#f5c842"},
  {min:4300000,max:4849999,level:46,title:"Legend",em:"👑",color:"#f5c842"},
  {min:4850000,max:5449999,level:47,title:"Legend",em:"👑",color:"#f5c842"},
  {min:5450000,max:6099999,level:48,title:"Legend",em:"👑",color:"#f5c842"},
  {min:6100000,max:6799999,level:49,title:"Legend",em:"👑",color:"#f5c842"},
  {min:6800000,max:Infinity,level:50,title:"Legend",em:"👑",color:"#f5c842"},
];

function getLevelInfo(xp){
  return LEVELS.find(function(l){return xp>=l.min&&xp<=l.max;})||LEVELS[0];
}

function getXPToNext(xp){
  var l=getLevelInfo(xp);
  if(l.max===Infinity)return 0;
  return l.max-xp+1;
}

function getXPProgress(xp){
  var l=getLevelInfo(xp);
  if(l.max===Infinity)return 100;
  var range=l.max-l.min+1;
  var prog=xp-l.min;
  return Math.round((prog/range)*100);
}


function ProfileLevelCard({xp,streak,streakFreezes}){
  var li=getLevelInfo(xp);
  return(<div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginBottom:10}}>
    <div style={{background:li.color+"22",border:"1px solid "+li.color+"44",borderRadius:10,padding:"6px 14px",textAlign:"center"}}>
      <div style={{fontSize:20}}>{li.em}</div>
      <div style={{fontSize:11,fontWeight:700,color:li.color}}>Lv.{li.level} {li.title}</div>
      <div style={{fontSize:9,color:"#555"}}>{xp.toLocaleString()} XP</div>
    </div>
    {streak>0&&<div style={{background:"#ff6b3522",border:"1px solid #ff6b3544",borderRadius:10,padding:"6px 14px",textAlign:"center"}}>
      <div style={{fontSize:20}}>🔥</div>
      <div style={{fontSize:14,fontWeight:700,color:"#ff6b35"}}>{streak}</div>
      <div style={{fontSize:9,color:"#555"}}>day streak</div>
    </div>}
    {streakFreezes>0&&<div style={{background:"#3eb8f522",border:"1px solid #3eb8f544",borderRadius:10,padding:"6px 14px",textAlign:"center"}}>
      <div style={{fontSize:20}}>🧊</div>
      <div style={{fontSize:14,fontWeight:700,color:"#3eb8f5"}}>{streakFreezes}</div>
      <div style={{fontSize:9,color:"#555"}}>freezes</div>
    </div>}
  </div>);
}


// ── Restaurant Menu Database ─────────────────────────────────
var RESTAURANT_MENUS = {
  "Chipotle": [
    {name:"Chicken Burrito Bowl",cal100:150,protein100:11,carbs100:14,fat100:4,brand:"Chipotle",per:"per 100g"},
    {name:"Steak Burrito Bowl",cal100:148,protein100:10,carbs100:14,fat100:4,brand:"Chipotle",per:"per 100g"},
    {name:"Carnitas Burrito Bowl",cal100:153,protein100:10,carbs100:13,fat100:5,brand:"Chipotle",per:"per 100g"},
    {name:"Chicken Burrito",cal100:218,protein100:12,carbs100:26,fat100:7,brand:"Chipotle",per:"per 100g"},
    {name:"Chicken Tacos (3)",cal100:149,protein100:10,carbs100:16,fat100:4,brand:"Chipotle",per:"per 100g"},
    {name:"White Rice",cal100:130,protein100:2,carbs100:28,fat100:1,brand:"Chipotle",per:"per 100g"},
    {name:"Brown Rice",cal100:130,protein100:3,carbs100:27,fat100:2,brand:"Chipotle",per:"per 100g"},
    {name:"Black Beans",cal100:120,protein100:6,carbs100:22,fat100:1,brand:"Chipotle",per:"per 100g"},
    {name:"Pinto Beans",cal100:115,protein100:6,carbs100:21,fat100:1,brand:"Chipotle",per:"per 100g"},
    {name:"Chicken",cal100:180,protein100:32,carbs100:1,fat100:7,brand:"Chipotle",per:"per 100g"},
    {name:"Steak",cal100:150,protein100:27,carbs100:1,fat100:5,brand:"Chipotle",per:"per 100g"},
    {name:"Carnitas",cal100:210,protein100:23,carbs100:0,fat100:13,brand:"Chipotle",per:"per 100g"},
    {name:"Sofritas (Tofu)",cal100:145,protein100:8,carbs100:11,fat100:8,brand:"Chipotle",per:"per 100g"},
    {name:"Guacamole",cal100:220,protein100:2,carbs100:9,fat100:20,brand:"Chipotle",per:"per 100g"},
    {name:"Sour Cream",cal100:120,protein100:2,carbs100:3,fat100:11,brand:"Chipotle",per:"per 100g"},
    {name:"Cheese",cal100:110,protein100:6,carbs100:1,fat100:9,brand:"Chipotle",per:"per 100g"},
    {name:"Chips",cal100:540,protein100:7,carbs100:72,fat100:24,brand:"Chipotle",per:"per 100g"},
  ],
  "McDonald's": [
    {name:"Big Mac",cal100:252,protein100:12,carbs100:24,fat100:12,brand:"McDonald's",per:"per 100g"},
    {name:"McDouble",cal100:248,protein100:14,carbs100:25,fat100:10,brand:"McDonald's",per:"per 100g"},
    {name:"Quarter Pounder with Cheese",cal100:271,protein100:15,carbs100:22,fat100:13,brand:"McDonald's",per:"per 100g"},
    {name:"Crispy Chicken Sandwich",cal100:265,protein100:14,carbs100:31,fat100:10,brand:"McDonald's",per:"per 100g"},
    {name:"McChicken",cal100:244,protein100:12,carbs100:27,fat100:10,brand:"McDonald's",per:"per 100g"},
    {name:"Filet-O-Fish",cal100:246,protein100:13,carbs100:27,fat100:9,brand:"McDonald's",per:"per 100g"},
    {name:"French Fries (Medium)",cal100:323,protein100:3,carbs100:44,fat100:15,brand:"McDonald's",per:"per 100g"},
    {name:"10pc McNuggets",cal100:225,protein100:14,carbs100:14,fat100:13,brand:"McDonald's",per:"per 100g"},
    {name:"Egg McMuffin",cal100:231,protein100:13,carbs100:25,fat100:9,brand:"McDonald's",per:"per 100g"},
    {name:"Sausage Burrito",cal100:218,protein100:9,carbs100:22,fat100:11,brand:"McDonald's",per:"per 100g"},
    {name:"Hotcakes (3)",cal100:243,protein100:5,carbs100:43,fat100:7,brand:"McDonald's",per:"per 100g"},
    {name:"Vanilla McFlurry",cal100:169,protein100:4,carbs100:27,fat100:5,brand:"McDonald's",per:"per 100g"},
  ],
  "Chick-fil-A": [
    {name:"Chick-fil-A Sandwich",cal100:247,protein100:17,carbs100:29,fat100:8,brand:"Chick-fil-A",per:"per 100g"},
    {name:"Spicy Deluxe Sandwich",cal100:265,protein100:17,carbs100:28,fat100:11,brand:"Chick-fil-A",per:"per 100g"},
    {name:"Grilled Chicken Sandwich",cal100:180,protein100:18,carbs100:18,fat100:4,brand:"Chick-fil-A",per:"per 100g"},
    {name:"8pc Nuggets",cal100:229,protein100:20,carbs100:10,fat100:12,brand:"Chick-fil-A",per:"per 100g"},
    {name:"8pc Grilled Nuggets",cal100:130,protein100:25,carbs100:2,fat100:3,brand:"Chick-fil-A",per:"per 100g"},
    {name:"Waffle Fries (Medium)",cal100:306,protein100:4,carbs100:40,fat100:15,brand:"Chick-fil-A",per:"per 100g"},
    {name:"Mac & Cheese",cal100:183,protein100:7,carbs100:17,fat100:10,brand:"Chick-fil-A",per:"per 100g"},
    {name:"Chicken Wrap",cal100:222,protein100:15,carbs100:22,fat100:8,brand:"Chick-fil-A",per:"per 100g"},
    {name:"Grilled Market Salad",cal100:68,protein100:7,carbs100:6,fat100:2,brand:"Chick-fil-A",per:"per 100g"},
    {name:"Frosted Lemonade",cal100:131,protein100:2,carbs100:26,fat100:3,brand:"Chick-fil-A",per:"per 100g"},
  ],
  "Starbucks": [
    {name:"Caffe Latte (Grande)",cal100:65,protein100:3,carbs100:8,fat100:2,brand:"Starbucks",per:"per 100ml"},
    {name:"Caramel Macchiato (Grande)",cal100:88,protein100:3,carbs100:14,fat100:2,brand:"Starbucks",per:"per 100ml"},
    {name:"Iced Brown Sugar Oat Latte",cal100:83,protein100:1,carbs100:14,fat100:2,brand:"Starbucks",per:"per 100ml"},
    {name:"Vanilla Sweet Cream Cold Brew",cal100:79,protein100:1,carbs100:10,fat100:4,brand:"Starbucks",per:"per 100ml"},
    {name:"Frappuccino (Mocha Grande)",cal100:142,protein100:2,carbs100:24,fat100:4,brand:"Starbucks",per:"per 100ml"},
    {name:"Egg Bites (Bacon & Gruyere)",cal100:182,protein100:13,carbs100:9,fat100:11,brand:"Starbucks",per:"per 100g"},
    {name:"Spinach & Feta Wrap",cal100:173,protein100:9,carbs100:21,fat100:6,brand:"Starbucks",per:"per 100g"},
    {name:"Cheese Danish",cal100:380,protein100:7,carbs100:44,fat100:20,brand:"Starbucks",per:"per 100g"},
    {name:"Banana Nut Bread",cal100:309,protein100:4,carbs100:44,fat100:13,brand:"Starbucks",per:"per 100g"},
    {name:"Protein Box (Eggs & Cheese)",cal100:148,protein100:9,carbs100:14,fat100:6,brand:"Starbucks",per:"per 100g"},
  ],
  "Subway": [
    {name:"6in Turkey Breast",cal100:191,protein100:14,carbs100:30,fat100:3,brand:"Subway",per:"per 100g"},
    {name:"6in Chicken Teriyaki",cal100:210,protein100:16,carbs100:32,fat100:3,brand:"Subway",per:"per 100g"},
    {name:"6in Meatball Marinara",cal100:266,protein100:12,carbs100:33,fat100:10,brand:"Subway",per:"per 100g"},
    {name:"6in Steak & Cheese",cal100:229,protein100:16,carbs100:28,fat100:7,brand:"Subway",per:"per 100g"},
    {name:"6in Spicy Italian",cal100:280,protein100:12,carbs100:27,fat100:13,brand:"Subway",per:"per 100g"},
    {name:"6in Tuna",cal100:278,protein100:13,carbs100:28,fat100:13,brand:"Subway",per:"per 100g"},
    {name:"Veggie Delite 6in",cal100:148,protein100:6,carbs100:29,fat100:2,brand:"Subway",per:"per 100g"},
    {name:"Rotisserie Chicken Bowl",cal100:142,protein100:18,carbs100:12,fat100:4,brand:"Subway",per:"per 100g"},
  ],
  "Panera": [
    {name:"Broccoli Cheddar Soup (Bowl)",cal100:114,protein100:4,carbs100:10,fat100:7,brand:"Panera",per:"per 100g"},
    {name:"Chicken Noodle Soup (Bowl)",cal100:60,protein100:5,carbs100:7,fat100:1,brand:"Panera",per:"per 100g"},
    {name:"Turkey Sandwich",cal100:205,protein100:13,carbs100:25,fat100:5,brand:"Panera",per:"per 100g"},
    {name:"Fuji Apple Chicken Salad",cal100:97,protein100:7,carbs100:8,fat100:4,brand:"Panera",per:"per 100g"},
    {name:"Mac & Cheese (Bowl)",cal100:186,protein100:7,carbs100:22,fat100:8,brand:"Panera",per:"per 100g"},
    {name:"Bagel with Cream Cheese",cal100:265,protein100:8,carbs100:46,fat100:6,brand:"Panera",per:"per 100g"},
    {name:"Avocado, Egg & Cheese",cal100:218,protein100:10,carbs100:20,fat100:11,brand:"Panera",per:"per 100g"},
  ],
  "Dominos": [
    {name:"Pepperoni Pizza (2 slices)",cal100:266,protein100:12,carbs100:30,fat100:11,brand:"Dominos",per:"per 100g"},
    {name:"Cheese Pizza (2 slices)",cal100:241,protein100:11,carbs100:31,fat100:8,brand:"Dominos",per:"per 100g"},
    {name:"BBQ Chicken Pizza (2 slices)",cal100:250,protein100:13,carbs100:32,fat100:8,brand:"Dominos",per:"per 100g"},
    {name:"Chicken Wings (4pc)",cal100:238,protein100:20,carbs100:6,fat100:15,brand:"Dominos",per:"per 100g"},
    {name:"Cheesy Bread",cal100:290,protein100:11,carbs100:36,fat100:12,brand:"Dominos",per:"per 100g"},
    {name:"Pasta Primavera",cal100:135,protein100:6,carbs100:18,fat100:5,brand:"Dominos",per:"per 100g"},
  ],
  "Sweetgreen": [
    {name:"Harvest Bowl",cal100:118,protein100:6,carbs100:14,fat100:5,brand:"Sweetgreen",per:"per 100g"},
    {name:"Guacamole Greens",cal100:105,protein100:4,carbs100:9,fat100:7,brand:"Sweetgreen",per:"per 100g"},
    {name:"Chicken Pesto Parm",cal100:122,protein100:9,carbs100:10,fat100:5,brand:"Sweetgreen",per:"per 100g"},
    {name:"Shroomami Bowl",cal100:108,protein100:5,carbs100:14,fat100:4,brand:"Sweetgreen",per:"per 100g"},
    {name:"Crispy Rice Bowl",cal100:140,protein100:7,carbs100:17,fat100:5,brand:"Sweetgreen",per:"per 100g"},
  ],
  "Chili's": [
    {name:"Classic Bacon Burger",cal100:262,protein100:13,carbs100:22,fat100:13,brand:"Chili's",per:"per 100g"},
    {name:"Chicken Fajitas",cal100:148,protein100:14,carbs100:12,fat100:5,brand:"Chili's",per:"per 100g"},
    {name:"Baby Back Ribs (Half Rack)",cal100:280,protein100:19,carbs100:10,fat100:19,brand:"Chili's",per:"per 100g"},
    {name:"Crispy Chicken Crispers",cal100:285,protein100:14,carbs100:24,fat100:15,brand:"Chili's",per:"per 100g"},
    {name:"Chicken Enchilada Soup",cal100:88,protein100:6,carbs100:9,fat100:4,brand:"Chili's",per:"per 100g"},
  ],
  "Olive Garden": [
    {name:"Spaghetti & Meatballs",cal100:148,protein100:7,carbs100:18,fat100:5,brand:"Olive Garden",per:"per 100g"},
    {name:"Chicken Parmigiana",cal100:195,protein100:16,carbs100:14,fat100:8,brand:"Olive Garden",per:"per 100g"},
    {name:"Fettuccine Alfredo",cal100:185,protein100:6,carbs100:20,fat100:9,brand:"Olive Garden",per:"per 100g"},
    {name:"Chicken & Shrimp Carbonara",cal100:172,protein100:10,carbs100:16,fat100:8,brand:"Olive Garden",per:"per 100g"},
    {name:"Breadstick",cal100:264,protein100:9,carbs100:42,fat100:7,brand:"Olive Garden",per:"per 100g"},
    {name:"Minestrone Soup",cal100:44,protein100:2,carbs100:8,fat100:1,brand:"Olive Garden",per:"per 100g"},
  ],
};

function getRestaurantResults(name){
  return (RESTAURANT_MENUS[name]||[]).map(function(item,i){
    return Object.assign({},item,{id:"rest_"+name+"_"+i});
  });
}

export default function App({user,supabase}){
  var[screen,setScreen]=useState("main");
  var[tab,setTab]=useState("dashboard");
  var[goal,setGoal]=useState("maintain");
  var[workouts,setWorkouts]=useState([]);
  var[meals,setMeals]=useState([]);
  var[calGoal,setCalGoal]=useState(2000);
  var[macros,setMacros]=useState({protein:150,carbs:200,fat:65});
  var[macLocked,setMacLocked]=useState(false);
  var[profile,setProfile]=useState({name:"",age:"",sex:"male",wLbs:"",hFt:"",hIn:"",activ:"moderate",bio:"",avatar:0});
  var[showEx,setShowEx]=useState(false);
  var[exTab,setExTab]=useState("log");
  var[selEx,setSelEx]=useState(null);
  var[exDur,setExDur]=useState(30);
  var[custEx,setCustEx]=useState({name:"",dur:30,cal:0});
  var[muscle,setMuscle]=useState("full body");
  var[wSug,setWSug]=useState(null);
  var[showRec,setShowRec]=useState(false);
  var[recName,setRecName]=useState("");
  var[moves,setMoves]=useState([]);
  var[curMove,setCurMove]=useState("");
  var[activeIdx,setActiveIdx]=useState(null);
  var[restSecs,setRestSecs]=useState(null);
  var restRef=useRef(null);
  var timer=useTimer();
  var[showFood,setShowFood]=useState(false);
  var[foodTab,setFoodTab]=useState("browse");
  var[selFood,setSelFood]=useState(null);
  var[foodSrv,setFoodSrv]=useState(1);
  var[custFood,setCustFood]=useState({name:"",cal:0,p:0,c:0,f:0});
  var[sugs,setSugs]=useState(null);
  var[showSugs,setShowSugs]=useState(false);
  var[barInput,setBarInput]=useState("");
  var[barState,setBarState]=useState("idle");
  var[barResult,setBarResult]=useState(null);
  var[barSrv,setBarSrv]=useState(1);
  var[foodSearch,setFoodSearch]=useState("");
  var[foodSearchResults,setFoodSearchResults]=useState([]);
  var[foodSearchLoading,setFoodSearchLoading]=useState(false);
  var[selSearchFood,setSelSearchFood]=useState(null);
  var[searchGrams,setSearchGrams]=useState(100);
  var[searchUnit,setSearchUnit]=useState("g");
  var[mealType,setMealType]=useState("other");
  var[recentFoods,setRecentFoods]=useState([]);
  var[quickAddCal,setQuickAddCal]=useState("");
  var[quickAddName,setQuickAddName]=useState("");
  var[quickAddP,setQuickAddP]=useState("");
  var[searchServingSize,setSearchServingSize]=useState(null);
  var[dbLoaded,setDbLoaded]=useState(false);
  // Social state
  var[socialTab,setSocialTab]=useState("discover");
  var[matches,setMatches]=useState([]);
  var[pendingIn,setPendingIn]=useState([]);
  var[pendingOut,setPendingOut]=useState([]);
  var[suggested,setSuggested]=useState([]);
  var[activeChat,setActiveChat]=useState(null);
  var[chatMessages,setChatMessages]=useState([]);
  var[msgInput,setMsgInput]=useState("");
  var[socialLoaded,setSocialLoaded]=useState(false);
  var msgEndRef=useRef(null);
  var barRef=useRef(null);
  var[showProgress,setShowProgress]=useState(false);
  var[progressEx,setProgressEx]=useState("");
  var[historyTab,setHistoryTab]=useState("calories");
  var[historyRange,setHistoryRange]=useState(30);
  var[xp,setXp]=useState(0);
  var[darkMode,setDarkMode]=useState(true);
  var[refCode,setRefCode]=useState("");
  var[refCopied,setRefCopied]=useState(false);
  var[showFeedback,setShowFeedback]=useState(false);
  var[feedbackText,setFeedbackText]=useState("");
  var[feedbackType,setFeedbackType]=useState("feedback");
  var[feedbackSent,setFeedbackSent]=useState(false);
  var[refCount,setRefCount]=useState(0);
  var[streak,setStreak]=useState(0);
  var[streakFreezes,setStreakFreezes]=useState(0);
  var[xpAnim,setXpAnim]=useState(null);

  var wKg=profile.wLbs?+profile.wLbs*0.453592:0;
  var hCm=(+profile.hFt*30.48)+(+profile.hIn*2.54);
  var bmr=calcBMR(+profile.age,wKg,hCm,profile.sex);
  var tdee=calcTDEE(bmr,profile.activ);
  var sugCal=tdee?calcGoalCal(tdee,goal):0;
  var goalObj=GOALS.find(function(g){return g.id===goal;})||GOALS[2];
  var GC=goalObj.color;
  var IC={low:"#3eb8f5",moderate:"#e8a83e",high:"#ff6b35"};

  // Load from Supabase on mount
  useEffect(function(){
    if(!user||!supabase){setDbLoaded(true);return;}
    // Load dark mode preference
    try{var dm=localStorage.getItem("lockin_darkmode");if(dm!==null)setDarkMode(dm!=="false");}catch(e){}
    // Load recent foods
    try{var rf=localStorage.getItem("lockin_recent_foods");if(rf)setRecentFoods(JSON.parse(rf));}catch(e){}
    async function loadAll(){
      var sb=supabase||sbClient;
      // Load from localStorage cache first for instant display
      try{
        var cached=localStorage.getItem("lockin_profile_"+user.id);
        if(cached){
          var cp=JSON.parse(cached);
          setProfile({name:cp.name||"",age:cp.age||"",sex:cp.sex||"male",wLbs:cp.wLbs||"",hFt:cp.hFt||"",hIn:cp.hIn||"",activ:cp.activ||"moderate",bio:cp.bio||"",avatar:cp.avatar||0});
          if(cp.goal)setGoal(cp.goal);
          if(cp.calGoal)setCalGoal(cp.calGoal);
          if(cp.macros)setMacros(cp.macros);
        }
      }catch(e){}
      // Then load from Supabase and update
      var p=null;
      for(var attempt=0;attempt<3;attempt++){
        var{data:pd}=await sb.from("profiles").select("*").eq("id",user.id).single();
        if(pd){p=pd;break;}
        if(attempt<2)await new Promise(function(r){setTimeout(r,600);});
      }
      if(p){
        var prof={name:p.display_name||p.username||"",age:p.age||"",sex:p.sex||"male",wLbs:p.weight_lbs||"",hFt:p.height_ft||"",hIn:p.height_in||"",activ:p.activity_level||"moderate",bio:p.bio||"",avatar:p.avatar_index||0};
        setProfile(prof);
        if(p.goal)setGoal(p.goal);
        if(p.cal_goal)setCalGoal(p.cal_goal);
        if(p.xp)setXp(p.xp);
        if(p.streak)setStreak(p.streak);
        if(p.streak_freezes)setStreakFreezes(p.streak_freezes);
        var mac=null;
        if(p.macro_protein||p.macro_carbs||p.macro_fat){
          mac={protein:p.macro_protein||150,carbs:p.macro_carbs||200,fat:p.macro_fat||65};
          setMacros(mac);setMacLocked(true);
        }
        // Cache to localStorage for instant load next time
        try{
          localStorage.setItem("lockin_profile_"+user.id,JSON.stringify({
            name:prof.name,age:prof.age,sex:prof.sex,wLbs:prof.wLbs,hFt:prof.hFt,hIn:prof.hIn,
            activ:prof.activ,bio:prof.bio,avatar:prof.avatar,
            goal:p.goal,calGoal:p.cal_goal,macros:mac,
          }));
        }catch(e){}
      }
      var today=new Date().toISOString().split("T")[0];
      // Load workouts for last 365 days with sets for progress tracking
      var d365=new Date();d365.setDate(d365.getDate()-365);
      var{data:ws}=await sb.from("workouts").select("*, workout_sets(*)").eq("user_id",user.id).gte("logged_at",d365.toISOString()).order("logged_at",{ascending:false}).limit(200);
      if(ws&&ws.length)setWorkouts(ws.map(function(w){
        var localDate=new Date(w.logged_at);
        var localDateStr=localDate.getFullYear()+"-"+String(localDate.getMonth()+1).padStart(2,"0")+"-"+String(localDate.getDate()).padStart(2,"0");
        return{id:w.id,name:w.name,em:EM.lift,dur:w.duration,cal:w.calories,cat:w.category||"Strength",logged_at:localDateStr,time:localDate.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:localDate.toLocaleDateString([],{month:"short",day:"numeric"}),sets:w.workout_sets||[],moves:[]};
      }));
      // Meals load last 60 days
      var d60=new Date();d60.setDate(d60.getDate()-60);
      var{data:ms}=await sb.from("meals").select("*").eq("user_id",user.id).gte("logged_at",d60.toISOString()).order("logged_at",{ascending:false});
      if(ms&&ms.length)setMeals(ms.map(function(m){
        var localDate=new Date(m.logged_at);
        var localDateStr=localDate.getFullYear()+"-"+String(localDate.getMonth()+1).padStart(2,"0")+"-"+String(localDate.getDate()).padStart(2,"0");
        return{id:m.id,name:m.name,em:EM.plate,cal:m.calories,protein:m.protein||0,carbs:m.carbs||0,fat:m.fat||0,servings:m.servings||1,per:m.per_unit||"serving",logged_at:localDateStr,time:localDate.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
      }));
      setDbLoaded(true);
      handleReferralOnSignup();
    }
    loadAll();
  },[user]);

  // Load social
  useEffect(function(){
    if(!user||!supabase||!dbLoaded)return;
    loadSocial();
  },[user,dbLoaded]);

  async function loadSocial(){
    var sb=supabase||sbClient;
    try{
      var{data:sugg}=await sb.rpc("get_suggested_matches",{limit_count:30});
      setSuggested(sugg||[]);
      var{data:acc}=await sb.from("match_requests")
        .select("*, from_user:profiles!match_requests_from_user_id_fkey(id,display_name,username,avatar_index,goal,bio), to_user:profiles!match_requests_to_user_id_fkey(id,display_name,username,avatar_index,goal,bio)")
        .or("from_user_id.eq."+user.id+",to_user_id.eq."+user.id).eq("status","accepted");
      setMatches((acc||[]).map(function(m){return Object.assign({},m,{partner:m.from_user_id===user.id?m.to_user:m.from_user});}));
      var{data:pin}=await sb.from("match_requests")
        .select("*, from_user:profiles!match_requests_from_user_id_fkey(id,display_name,username,avatar_index,goal,bio)")
        .eq("to_user_id",user.id).eq("status","pending");
      setPendingIn(pin||[]);
      var{data:pout}=await sb.from("match_requests")
        .select("*, to_user:profiles!match_requests_to_user_id_fkey(id,display_name,username,avatar_index,goal,bio)")
        .eq("from_user_id",user.id).eq("status","pending");
      setPendingOut(pout||[]);
    }catch(e){console.log("Social load error:",e);}
    setSocialLoaded(true);
    loadReferralData();
  }

  // ── Referral System ──────────────────────────────────────
  async function loadReferralData(){
    var sb=supabase||sbClient;
    if(!user)return;
    // Use username as ref code (clean, memorable)
    try{
      var{data:p}=await sb.from("profiles").select("username,display_name,ref_count").eq("id",user.id).single();
      if(p){
        var code=p.username||p.display_name||user.id.slice(0,8);
        setRefCode(code.toLowerCase().replace(/[^a-z0-9]/g,""));
        setRefCount(p.ref_count||0);
      }
    }catch(e){}
  }

  async function handleReferralOnSignup(){
    // Check URL for ?ref= param and credit the referrer
    var sb=supabase||sbClient;
    try{
      var params=new URLSearchParams(window.location.search);
      var ref=params.get("ref");
      if(!ref||!user)return;
      // Find the referrer by username
      var{data:referrer}=await sb.from("profiles").select("id,ref_count,xp").ilike("username",ref).single();
      if(!referrer||referrer.id===user.id)return;
      // Give referrer +100 XP and increment count
      var newXp=(referrer.xp||0)+100;
      var newCount=(referrer.ref_count||0)+1;
      await sb.from("profiles").update({xp:newXp,ref_count:newCount}).eq("id",referrer.id);
      // Give new user +50 XP bonus
      await sb.from("profiles").update({xp:50,ref_bonus:true}).eq("id",user.id);
      // Clear ref param from URL
      window.history.replaceState({},"",window.location.pathname);
    }catch(e){}
  }

  function copyRefLink(){
    var url="https://lockin-app-psi.vercel.app?ref="+refCode;
    if(navigator.clipboard){
      navigator.clipboard.writeText(url).then(function(){
        setRefCopied(true);
        setTimeout(function(){setRefCopied(false);},2500);
      });
    }
  }

  function shareRefLink(){
    var url="https://lockin-app-psi.vercel.app?ref="+refCode;
    var text="I've been using Lock In to track my workouts and stay accountable. Join me — "+url;
    if(navigator.share){
      navigator.share({title:"Lock In",text:text,url:url});
    } else {
      copyRefLink();
    }
  }

  async function submitFeedback(){
    var sb=supabase||sbClient;
    if(!feedbackText.trim())return;
    try{
      await sb.from("feedback").insert({
        user_id:user?user.id:null,
        type:feedbackType,
        message:feedbackText.trim(),
        created_at:new Date().toISOString(),
      });
    }catch(e){
      // Table may not exist yet - still show success to user
      console.log("Feedback error:",e);
    }
    setFeedbackSent(true);
    setFeedbackText("");
    setTimeout(function(){setShowFeedback(false);setFeedbackSent(false);},2000);
  }

  async function sendMatchReq(toUserId){
    var sb=supabase||sbClient;
    if(!user){console.log("No user");return;}
    try{
      // Optimistically remove from suggestions immediately
      setSuggested(function(prev){return prev.filter(function(s){return s.id!==toUserId;});});
      var{error}=await sb.from("match_requests").insert({from_user_id:user.id,to_user_id:toUserId,status:"pending"});
      if(error){
        console.log("Match req error:",error.message,error.code);
        // Re-add to suggestions if failed
        loadSocial();
        return;
      }
      loadSocial();
    }catch(e){console.log("Match req exception:",e);loadSocial();}
  }

  async function respondMatch(matchId,accept){
    var sb=supabase||sbClient;
    try{await sb.from("match_requests").update({status:accept?"accepted":"declined"}).eq("id",matchId);loadSocial();}catch(e){}
  }

  async function openChat(match){
    var sb=supabase||sbClient;
    setActiveChat(match);
    var{data:msgs}=await sb.from("messages").select("*").eq("match_id",match.id).order("created_at",{ascending:true});
    setChatMessages(msgs||[]);
    sb.channel("chat:"+match.id)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:"match_id=eq."+match.id},
        function(payload){setChatMessages(function(prev){return prev.concat([payload.new]);});})
      .subscribe();
    setTimeout(function(){if(msgEndRef.current)msgEndRef.current.scrollIntoView();},200);
  }

  async function sendMsg(){
    var sb=supabase||sbClient;
    if(!msgInput.trim()||!activeChat)return;
    var txt=msgInput.trim();setMsgInput("");
    try{await sb.from("messages").insert({match_id:activeChat.id,sender_id:user.id,content:txt});}catch(e){}
  }

  function getGoalColor(g){return g==="bulk"?"#c8f53e":g==="shred"?"#ff6b35":g==="endurance"?"#b03ef5":"#3eb8f5";}
  function getGoalLabel(g){return g==="bulk"?"Bulk":g==="shred"?"Shred":g==="endurance"?"Endurance":"Maintain";}

  async function earnXP(amount,reason){
    var sb=supabase||sbClient;
    var newXp=xp+amount;
    setXp(newXp);
    setXpAnim({amount,reason});
    setTimeout(function(){setXpAnim(null);},2500);
    // Update streak - check if already active today
    var todayLocal=new Date();
    var todayStr2=todayLocal.getFullYear()+"-"+String(todayLocal.getMonth()+1).padStart(2,"0")+"-"+String(todayLocal.getDate()).padStart(2,"0");
    var newLevel=getLevelInfo(newXp).level;
    try{
      await sb.from("profiles").update({
        xp:newXp,
        level:newLevel,
        last_active:todayStr2,
      }).eq("id",user.id);
    }catch(e){console.log("XP save error:",e);}
  }

  async function checkAndUpdateStreak(){
    var sb=supabase||sbClient;
    try{
      var{data:p}=await sb.from("profiles").select("last_active,streak,streak_freezes").eq("id",user.id).single();
      if(!p)return;
      var today=new Date();
      var todayStr3=today.getFullYear()+"-"+String(today.getMonth()+1).padStart(2,"0")+"-"+String(today.getDate()).padStart(2,"0");
      var yesterday=new Date(today);yesterday.setDate(yesterday.getDate()-1);
      var yStr=yesterday.getFullYear()+"-"+String(yesterday.getMonth()+1).padStart(2,"0")+"-"+String(yesterday.getDate()).padStart(2,"0");
      var last=p.last_active;
      var newStreak=p.streak||0;
      var newFreezes=p.streak_freezes||0;
      if(last===todayStr3){return;}// Already active today
      else if(last===yStr){newStreak+=1;}// Consecutive day
      else if(last&&newFreezes>0){newStreak+=1;newFreezes-=1;}// Use freeze
      else{newStreak=1;}// Reset
      // Award freeze every 7 days
      if(newStreak>0&&newStreak%7===0)newFreezes=Math.min(newFreezes+1,3);
      setStreak(newStreak);
      setStreakFreezes(newFreezes);
      await sb.from("profiles").update({streak:newStreak,streak_freezes:newFreezes,last_active:todayStr3}).eq("id",user.id);
      // Streak XP bonus
      var streakXp=20*Math.min(newStreak,10);
      earnXP(streakXp,"🔥 Streak day "+newStreak+"!");
    }catch(e){console.log("Streak error:",e);}
  }
  function getGoalLabel(g){return g==="bulk"?"Bulk":g==="shred"?"Shred":g==="endurance"?"Endurance":"Maintain";}

  useEffect(function(){if(!macLocked)setMacros(calcMacros(calGoal,goal));},[goal,calGoal,macLocked]);

  async function saveProfile(p,g,cg,mac){
    var sb=supabase||sbClient;
    if(!user||!sb)return;
    var nm=p.name||"";
    var goalVal=g||goal;
    var cgVal=cg||calGoal;
    var macVal=mac||{protein:macros.protein,carbs:macros.carbs,fat:macros.fat};
    // Save each field individually to avoid column permission issues
    var fields=[
      ["display_name", nm],
      ["username", nm],
      ["bio", p.bio||null],
      ["avatar_index", p.avatar||0],
      ["age", p.age?+p.age:null],
      ["sex", p.sex||"male"],
      ["weight_lbs", p.wLbs?+p.wLbs:null],
      ["height_ft", p.hFt?+p.hFt:null],
      ["height_in", p.hIn?+p.hIn:null],
      ["activity_level", p.activ||"moderate"],
      ["goal", goalVal],
      ["cal_goal", cgVal],
      ["macro_protein", macVal.protein],
      ["macro_carbs", macVal.carbs],
      ["macro_fat", macVal.fat],
    ];
    for(var i=0;i<fields.length;i++){
      var row={};
      row[fields[i][0]]=fields[i][1];
      var{error}=await sb.from("profiles").update(row).eq("id",user.id);
      if(error)console.log("Failed to save "+fields[i][0]+":",error.message);
      else console.log("Saved "+fields[i][0]+":",fields[i][1]);
    }
    // Cache locally
    try{
      localStorage.setItem("lockin_profile_"+user.id,JSON.stringify({
        name:nm,age:p.age,sex:p.sex,wLbs:p.wLbs,hFt:p.hFt,hIn:p.hIn,
        activ:p.activ,bio:p.bio,avatar:p.avatar,
        goal:goalVal,calGoal:cgVal,macros:macVal,
      }));
    }catch(e){}
  }

  var _tn=new Date();
  var todayStr=_tn.getFullYear()+"-"+String(_tn.getMonth()+1).padStart(2,"0")+"-"+String(_tn.getDate()).padStart(2,"0");
  var todayWorkouts=workouts.filter(function(w){return w.logged_at&&w.logged_at.startsWith(todayStr);});
  var todayMeals=meals.filter(function(m){return m.logged_at&&m.logged_at.startsWith(todayStr);});
  var calB=todayWorkouts.reduce(function(s,w){return s+w.cal;},0);
  var calE=todayMeals.reduce(function(s,m){return s+m.cal;},0);
  var pE=todayMeals.reduce(function(s,m){return s+(m.protein||0);},0);
  var cE=todayMeals.reduce(function(s,m){return s+(m.carbs||0);},0);
  var fE=todayMeals.reduce(function(s,m){return s+(m.fat||0);},0);
  var netCal=calE-calB;
  var calLeft=calGoal-netCal;
  var ring=Math.min((netCal/calGoal)*100,100);

  function applyS(){var nm=calcMacros(sugCal,goal);setCalGoal(sugCal);setMacros(nm);setMacLocked(false);saveProfile(profile,goal,sugCal,nm);}
  function closeEx(){setShowEx(false);setSelEx(null);setExDur(30);setExTab("log");setCustEx({name:"",dur:30,cal:0});}

  async function addW(){
    if(!selEx)return;var c=Math.round(selEx.caloriesPerMin*exDur);
    var nowIso=new Date().toISOString();
    setWorkouts(workouts.concat([{id:Date.now(),name:selEx.name,em:selEx.em,dur:exDur,cal:c,cat:selEx.category,logged_at:nowIso,date:new Date().toLocaleDateString([],{month:"short",day:"numeric"}),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),sets:[]}]));
    closeEx();
    try{
      var{error:we}=await (supabase||sbClient).from("workouts").insert({user_id:user.id,name:selEx.name,category:selEx.category,duration:exDur,calories:c,logged_at:new Date().toISOString()});
      if(we)console.log("Workout save error:",we.message);
      else{
        var xpAmt=50+(exDur>=30?25:0);
        earnXP(xpAmt,"💪 Logged "+selEx.name+"!");
        checkAndUpdateStreak();
      }
    }catch(e){console.log("Workout save exception:",e);}
  }

  async function addCW(){
    if(!custEx.name)return;
    var nowIso2=new Date().toISOString();
    setWorkouts(workouts.concat([{id:Date.now(),name:custEx.name,em:EM.medal,dur:+custEx.dur,cal:+custEx.cal,cat:"Custom",logged_at:nowIso2,date:new Date().toLocaleDateString([],{month:"short",day:"numeric"}),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),sets:[]}]));
    closeEx();
    if(user&&supabase)try{await (supabase||sbClient).from("workouts").insert({user_id:user.id,name:custEx.name,category:"Custom",duration:+custEx.dur,calories:+custEx.cal});}catch(e){}
  }

  function addMove(){if(!curMove.trim())return;var nm=moves.concat([{name:curMove.trim(),sets:[]}]);setMoves(nm);setCurMove("");setActiveIdx(nm.length-1);}
  function addSet(mi){var m=moves.map(function(x){return{name:x.name,sets:x.sets.slice()};});var prev=m[mi].sets[m[mi].sets.length-1];m[mi].sets.push({reps:prev?prev.reps:"",weight:prev?prev.weight:"",note:"",done:false});setMoves(m);}
  function updSet(mi,si,f,v){var m=moves.map(function(x){return{name:x.name,sets:x.sets.map(function(s){return Object.assign({},s);})};});m[mi].sets[si][f]=v;setMoves(m);}
  function doneSet(mi,si){
    var m=moves.map(function(x){return{name:x.name,sets:x.sets.map(function(s){return Object.assign({},s);})};});
    m[mi].sets[si].done=!m[mi].sets[si].done;setMoves(m);
    if(!m[mi].sets[si].done)return;
    clearInterval(restRef.current);var s=90;setRestSecs(s);
    restRef.current=setInterval(function(){s--;if(s<=0){clearInterval(restRef.current);setRestSecs(null);}else setRestSecs(s);},1000);
  }
  function remMove(mi){setMoves(moves.filter(function(_,i){return i!==mi;}));if(activeIdx===mi)setActiveIdx(null);}

  async function saveW(){
    var ts=moves.reduce(function(s,m){return s+m.sets.length;},0);
    var ds=moves.reduce(function(s,m){return s+m.sets.filter(function(x){return x.done;}).length;},0);
    var c=Math.round((timer.elapsed/60)*7);
    var recNow=new Date().toISOString();
    setWorkouts(workouts.concat([{id:Date.now(),name:recName||"Recorded Workout",em:EM.lift,dur:Math.max(1,Math.round(timer.elapsed/60)),cal:c,cat:"Strength",logged_at:recNow,date:new Date().toLocaleDateString([],{month:"short",day:"numeric"}),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),moves:moves,sets:(()=>{var s=[];moves.forEach(function(mv){mv.sets.forEach(function(st){s.push(Object.assign({exercise:mv.name},st));});});return s;})(),totalSets:ts,doneSets:ds}]));
    setShowRec(false);setMoves([]);setRecName("");setActiveIdx(null);setRestSecs(null);timer.reset();
    if(user&&supabase){
      try{
        var{data:wd}=await (supabase||sbClient).from("workouts").insert({user_id:user.id,name:recName||"Recorded Workout",category:"Strength",duration:Math.max(1,Math.round(timer.elapsed/60)),calories:c}).select().single();
        if(wd){var setRows=[];moves.forEach(function(mv){mv.sets.forEach(function(s,i){setRows.push({workout_id:wd.id,exercise:mv.name,set_number:i+1,reps:s.reps,weight:s.weight,note:s.note,done:s.done});});});if(setRows.length)await (supabase||sbClient).from("workout_sets").insert(setRows);}
      }catch(e){}
    }
  }

  function exportH(w){
    var end=new Date(),start=new Date(end-((w.dur||1)*60000));
    function fmt(d){return d.toISOString().replace(/\.\d{3}Z/,"+00:00");}
    var xml='<?xml version="1.0"?>\n<HealthData locale="en_US">\n  <Workout workoutActivityType="HKWorkoutActivityTypeTraditionalStrengthTraining" duration="'+(w.dur||1)+'" durationUnit="min" totalEnergyBurned="'+(w.cal||0)+'" totalEnergyBurnedUnit="kcal" sourceName="Lock In" startDate="'+fmt(start)+'" endDate="'+fmt(end)+'">\n  </Workout>\n</HealthData>';
    var blob=new Blob([xml],{type:"application/xml"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download=(w.name||"w").replace(/\s+/g,"_")+"_Health.xml";a.click();URL.revokeObjectURL(url);
  }

  async function lookupBarcode(code){
    if(!code||code.length<6)return;setBarState("scanning");setBarResult(null);
    try{
      var res=await fetch("https://world.openfoodfacts.org/api/v0/product/"+code.trim()+".json");
      var data=await res.json();
      if(data.status!==1||!data.product){setBarState("notfound");return;}
      var p=data.product,n=p.nutriments||{};
      setBarResult({name:p.product_name||p.generic_name||"Unknown Product",brand:p.brands||"",calories:Math.round(n["energy-kcal_serving"]||n["energy-kcal_100g"]||0),protein:Math.round((n["proteins_serving"]||n["proteins_100g"]||0)*10)/10,carbs:Math.round((n["carbohydrates_serving"]||n["carbohydrates_100g"]||0)*10)/10,fat:Math.round((n["fat_serving"]||n["fat_100g"]||0)*10)/10,fiber:Math.round((n["fiber_serving"]||n["fiber_100g"]||0)*10)/10,serving:p.serving_size||"per serving",image:p.image_front_small_url||null});
      setBarSrv(1);setBarState("result");
    }catch(err){setBarState("error");}
  }

  function closeFood(){
    setShowFood(false);setFoodTab("browse");setSelFood(null);setFoodSrv(1);
    setCustFood({name:"",cal:0,p:0,c:0,f:0});setBarState("idle");setBarResult(null);
    setBarInput("");setBarSrv(1);setFoodSearch("");setFoodSearchResults([]);
    setSelSearchFood(null);setSearchGrams(100);setSearchUnit("g");setMealType("other");
    setQuickAddCal("");setQuickAddName("");setQuickAddP("");setSearchServingSize(null);
  }

  function saveRecentFood(food,grams,unit,cal,protein,carbs,fat){
    try{
      var entry={
        id:"recent_"+Date.now(),
        name:food.name,brand:food.brand||"",
        cal100:food.cal100||Math.round((cal/grams)*100),
        protein100:food.protein100||Math.round((protein/grams)*100),
        carbs100:food.carbs100||Math.round((carbs/grams)*100),
        fat100:food.fat100||Math.round((fat/grams)*100),
        lastGrams:grams,lastUnit:unit,
        lastCal:cal,lastProtein:protein,lastCarbs:carbs,lastFat:fat,
        loggedAt:Date.now(),
      };
      var updated=[entry].concat(recentFoods.filter(function(f){
        return f.name!==food.name;
      })).slice(0,20);
      setRecentFoods(updated);
      localStorage.setItem("lockin_recent_foods",JSON.stringify(updated));
    }catch(e){}
  }

  function getServingSizes(food){
    // Generate smart serving size options based on food name
    var name=(food.name||"").toLowerCase();
    var sizes=[{label:"100g",grams:100,unit:"g"}];
    if(name.includes("pizza")||name.includes("slice")) sizes.unshift({label:"1 slice (~107g)",grams:107,unit:"g"});
    if(name.includes("egg")) sizes.unshift({label:"1 egg (50g)",grams:50,unit:"g"});
    if(name.includes("banana")||name.includes("apple")||name.includes("orange")) sizes.unshift({label:"1 medium (120g)",grams:120,unit:"g"});
    if(name.includes("chicken breast")) sizes.unshift({label:"1 breast (174g)",grams:174,unit:"g"});
    if(name.includes("bread")||name.includes("slice")) sizes.unshift({label:"1 slice (30g)",grams:30,unit:"g"});
    if(name.includes("cup")||name.includes("rice")||name.includes("oat")) sizes.unshift({label:"1 cup (240ml)",grams:185,unit:"g"});
    if(name.includes("tbsp")||name.includes("tablespoon")||name.includes("butter")||name.includes("oil")) sizes.unshift({label:"1 tbsp (15g)",grams:15,unit:"g"});
    if(name.includes("oz")||name.includes("steak")||name.includes("beef")) sizes.unshift({label:"3 oz (85g)",grams:85,unit:"g"});
    if(name.includes("scoop")||name.includes("protein")||name.includes("whey")) sizes.unshift({label:"1 scoop (30g)",grams:30,unit:"g"});
    if(name.includes("bar")) sizes.unshift({label:"1 bar (45g)",grams:45,unit:"g"});
    // Always add oz option
    sizes.push({label:"1 oz (28g)",grams:28,unit:"g"});
    return sizes.slice(0,5);
  }

  async function searchFoods(q){
    if(!q||q.length<2){setFoodSearchResults([]);return;}
    setFoodSearchLoading(true);
    try{
      // Search with more results and better fields
      var url="https://world.openfoodfacts.org/cgi/search.pl?search_terms="+encodeURIComponent(q)+"&search_simple=1&action=process&json=1&page_size=24&fields=product_name,brands,nutriments,serving_size,image_front_small_url,_id,countries_tags,popularity_key";
      var res=await fetch(url);
      var data=await res.json();
      var ql=q.toLowerCase();
      var results=(data.products||[]).filter(function(p){return p.product_name&&p.nutriments;}).map(function(p){
        var n=p.nutriments||{};
        var cal=Math.round(n["energy-kcal_100g"]||0);
        var name=p.product_name||"";
        // Score for ranking: exact name match > starts with > contains, US products > others
        var score=0;
        var nl=name.toLowerCase();
        if(nl===ql)score+=100;
        else if(nl.startsWith(ql))score+=60;
        else if(nl.includes(ql))score+=30;
        if(p.countries_tags&&p.countries_tags.includes("en:united-states"))score+=20;
        if(p.popularity_key)score+=Math.min(p.popularity_key/1000000,10);
        // Penalize very generic/incomplete entries
        if(!n["proteins_100g"]&&!n["carbohydrates_100g"])score-=20;
        return{id:p._id,name:name,brand:p.brands||"",image:p.image_front_small_url||null,
          cal100:cal,
          protein100:Math.round((n["proteins_100g"]||0)*10)/10,
          carbs100:Math.round((n["carbohydrates_100g"]||0)*10)/10,
          fat100:Math.round((n["fat_100g"]||0)*10)/10,
          score:score};
      }).filter(function(p){return p.cal100>0;})
        .sort(function(a,b){return b.score-a.score;})
        .slice(0,15);
      setFoodSearchResults(results);
    }catch(e){setFoodSearchResults([]);}
    setFoodSearchLoading(false);
  }

  function calcSearchMacros(food,grams,unit){
    var g=unit==="oz"?grams*28.3495:grams;
    var ratio=g/100;
    return{cal:Math.round(food.cal100*ratio),protein:Math.round(food.protein100*ratio*10)/10,
      carbs:Math.round(food.carbs100*ratio*10)/10,fat:Math.round(food.fat100*ratio*10)/10};
  }

  async function addMeal(food,srv){
    var nowIso3=new Date().toISOString();
    var newM={id:Date.now(),name:food.name,em:food.em||EM.plate,cal:Math.round((food.calories||0)*srv),protein:Math.round((food.protein||0)*srv),carbs:Math.round((food.carbs||0)*srv),fat:Math.round((food.fat||0)*srv),servings:srv,per:food.per||"serving",meal_type:mealType,logged_at:nowIso3,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
    setMeals(meals.concat([newM]));closeFood();
    try{
      var{error:me}=await (supabase||sbClient).from("meals").insert({user_id:user.id,name:food.name,calories:Math.round((food.calories||0)*srv),protein:Math.round((food.protein||0)*srv),carbs:Math.round((food.carbs||0)*srv),fat:Math.round((food.fat||0)*srv),servings:srv,per_unit:food.per||"serving",meal_type:mealType,logged_at:new Date().toISOString()});
      if(me)console.log("Meal save error:",me.message);
      else{
        earnXP(10,"🍽 Logged "+food.name+"!");
        saveRecentFood(food,srv,food.per||"serving",
          Math.round((food.calories||0)*srv),Math.round((food.protein||0)*srv),
          Math.round((food.carbs||0)*srv),Math.round((food.fat||0)*srv));
      }
    }catch(e){console.log("Meal save exception:",e);}
  }

  async function addCM(){
    if(!custFood.name)return;
    var nowIso4=new Date().toISOString();
    setMeals(meals.concat([{id:Date.now(),name:custFood.name,em:EM.plate,cal:+custFood.cal,protein:+custFood.p,carbs:+custFood.c,fat:+custFood.f,servings:1,per:"serving",logged_at:nowIso4,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]));closeFood();
    if(user&&supabase)try{await (supabase||sbClient).from("meals").insert({user_id:user.id,name:custFood.name,calories:+custFood.cal,protein:+custFood.p,carbs:+custFood.c,fat:+custFood.f,servings:1,per_unit:"serving"});}catch(e){}
  }

  function addSM(food){addMeal(Object.assign({},food,{calories:food.calories,per:"serving"}),1);setShowSugs(false);}
  async function removeWorkout(id){setWorkouts(workouts.filter(function(x){return x.id!==id;}));if(user&&supabase)try{await (supabase||sbClient).from("workouts").delete().eq("id",id).eq("user_id",user.id);}catch(e){}}
  async function removeMeal(id){setMeals(meals.filter(function(x){return x.id!==id;}));if(user&&supabase)try{await (supabase||sbClient).from("meals").delete().eq("id",id).eq("user_id",user.id);}catch(e){}}

  function MB(l,c,g,col){var p=Math.min((c/g)*100,100),ov=c>g;return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:"#666"}}>{l}</span><span style={{fontSize:10,fontWeight:700,color:ov?"#ff5555":"#e8e4dc"}}>{c}g <span style={{color:"#444"}}>/ {g}g</span></span></div><div style={{background:"#0a0a0f",borderRadius:99,height:5,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:ov?"#ff5555":col,width:p+"%",transition:"width .4s"}}/></div></div>;}

  var css="@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Bebas+Neue&display=swap');"
    +"html{padding-top:env(safe-area-inset-top,0px)}"
    +"*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:0}"
    +"input{outline:none;background:transparent;border:none;color:#e8e4dc;font-family:inherit}input::placeholder{color:#3a3a4a}"
    +"input[type=range]{width:100%;accent-color:"+GC+"}"
    +".card{background:#13131a;border:1px solid #1e1e2a;border-radius:14px;padding:13px}"
    +".exc{background:#13131a;border:1px solid #1e1e2a;border-radius:11px;padding:10px 12px;cursor:pointer;transition:all .15s}"
    +".exc:hover,.exc.on{border-color:"+GC+";background:#151e12}"
    +".del{background:none;border:none;color:#3a3a4a;cursor:pointer;font-size:13px;padding:2px 6px;border-radius:6px}"
    +".del:hover{color:#ff5555;background:#2a1515}"
    +".overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:50;display:flex;align-items:flex-end;justify-content:center}"
    +".modal{background:#13131a;border-radius:22px 22px 0 0;padding:20px 16px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;border-top:1px solid #2a2a3a}"
    +".btn{padding:11px;border-radius:11px;border:none;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;transition:all .15s;width:100%}"
    +".btn:active{transform:scale(.98)}"
    +".inp{background:#0a0a0f;border:1px solid #2a2a3a;border-radius:9px;padding:9px 12px;width:100%;color:#e8e4dc;font-size:14px;font-family:inherit}"
    +".inp:focus{border-color:"+GC+";outline:none}"
    +".seg{flex:1;padding:7px 0;border-radius:8px;border:none;cursor:pointer;font-family:inherit;font-weight:700;font-size:10px;letter-spacing:.5px;text-transform:uppercase;transition:all .15s}"
    +".chip{padding:5px 11px;border-radius:99px;border:1px solid #2a2a3a;background:#0a0a0f;cursor:pointer;font-size:11px;color:#666;transition:all .15s;font-family:inherit}"
    +".chip.on{border-color:"+GC+";color:"+GC+";background:#151e12}"
    +".sug{background:#0a0a0f;border:1px solid #1e1e2a;border-radius:11px;padding:10px;margin-bottom:7px}"
    +"@keyframes spin{to{transform:rotate(360deg)}}"
    +"@supports(padding-top:env(safe-area-inset-top)){.safe-top{padding-top:calc(env(safe-area-inset-top) + 14px)!important}}"
    +(darkMode?"":"@media all{body,#__next>div{background:#f4f4f8!important;color:#111118!important}.card{background:#ffffff!important;border-color:#e0e0ee!important}.modal{background:#ffffff!important;border-color:#e0e0ee!important}.inp{background:#f0f0f8!important;border-color:#d0d0e0!important;color:#111118!important}.chip{background:#f0f0f8!important;border-color:#d0d0e0!important;color:#666!important}.exc{background:#ffffff!important;border-color:#e0e0ee!important}.sug{background:#f8f8ff!important;border-color:#e0e0ee!important}}")
    +"@keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}";

  var base={minHeight:"100vh",background:"#0a0a0f",color:"#e8e4dc",fontFamily:"DM Sans,sans-serif",maxWidth:480,margin:"0 auto"};


  // ── History Screen ──────────────────────────────────────────
  if(screen==="history"){
    var hTab=historyTab;
    var ranges=[["1M",30],["3M",90],["6M",180],["1Y",365]];
    var cutoff=new Date();cutoff.setDate(cutoff.getDate()-historyRange);
    var cutStr=cutoff.toISOString().split("T")[0];

    // Filter workouts/meals to selected range
    var rngWorkouts=workouts.filter(function(w){return w.logged_at&&w.logged_at>=cutStr;});
    var rngMeals=meals.filter(function(m){return m.logged_at&&m.logged_at>=cutStr;});

    // Group workouts by date
    var wByDate={};
    rngWorkouts.forEach(function(w){
      var d=w.logged_at?w.logged_at.split("T")[0]:"";
      if(!wByDate[d])wByDate[d]=[];
      wByDate[d].push(w);
    });

    // Group meals by date
    var mByDate={};
    rngMeals.forEach(function(m){
      var d=m.logged_at?m.logged_at.split("T")[0]:"";
      if(!mByDate[d])mByDate[d]=[];
      mByDate[d].push(m);
    });

    // Build chart data - calories per day for last N days
    var chartDays=[];
    for(var di=historyRange-1;di>=0;di--){
      var dd=new Date();dd.setDate(dd.getDate()-di);
      var ds=dd.toISOString().split("T")[0];
      var wCal=(wByDate[ds]||[]).reduce(function(s,w){return s+w.cal;},0);
      var mCal=(mByDate[ds]||[]).reduce(function(s,m){return s+m.cal;},0);
      chartDays.push({date:ds,label:dd.toLocaleDateString([],{month:"short",day:"numeric"}),burned:wCal,eaten:mCal,net:mCal-wCal});
    }

    // Chart dims
    var cW=320,cH=100,cPad=28;
    var maxCal=Math.max.apply(null,chartDays.map(function(d){return Math.max(d.eaten,d.burned,1);}));
    function cx(i){return cPad+(i/(chartDays.length-1||1))*cW;}
    function cy(v){return cPad+cH-(v/maxCal)*cH;}

    // All dates combined for list view
    var allDates=[...new Set(
      Object.keys(wByDate).concat(Object.keys(mByDate))
    )].sort().reverse();

    return(
      <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e8e4dc",fontFamily:"DM Sans,sans-serif",maxWidth:480,margin:"0 auto"}}>
        <style>{css}</style>
        <div style={{position:"sticky",top:0,background:"#0a0a0f",borderBottom:"1px solid #1a1a22",padding:"12px 14px",zIndex:10}}>
          <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:22,letterSpacing:1,color:GC,marginBottom:10}}>HISTORY</div>
          {/* Range selector */}
          <div style={{display:"flex",gap:4}}>
            {ranges.map(function(r){return(
              <button key={r[0]} onClick={()=>setHistoryRange(r[1])} style={{flex:1,padding:"6px 0",borderRadius:7,border:"1px solid "+(historyRange===r[1]?GC:"#2a2a3a"),background:historyRange===r[1]?GC+"22":"transparent",color:historyRange===r[1]?GC:"#555",fontFamily:"inherit",fontWeight:700,fontSize:11,cursor:"pointer"}}>{r[0]}</button>
            );})}
          </div>
        </div>

        <div style={{padding:"14px",paddingBottom:100}}>
          {/* Tab selector */}
          <div style={{display:"flex",gap:3,background:"#0a0a0f",borderRadius:8,padding:3,marginBottom:14,border:"1px solid #1a1a22"}}>
            {[["calories","Calories"],["workouts","Workouts"],["nutrition","Nutrition"]].map(function(x){return(
              <button key={x[0]} onClick={()=>setHistoryTab(x[0])} style={{flex:1,padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",background:hTab===x[0]?"#1e1e2a":"transparent",color:hTab===x[0]?GC:"#555",fontFamily:"inherit",fontWeight:700,fontSize:10,textTransform:"uppercase",transition:"all .15s"}}>{x[1]}</button>
            );})}
          </div>

          {/* CALORIES GRAPH TAB */}
          {hTab==="calories"&&(<div>
            <div style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:14,padding:14,marginBottom:12}}>
              <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:10}}>DAILY CALORIES</div>
              <svg width="100%" viewBox={"0 0 "+(cW+cPad*2)+" "+(cH+cPad*2+10)} style={{overflow:"visible"}}>
                <defs>
                  <linearGradient id="eatGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#e8a83e" stopOpacity="0.4"/><stop offset="100%" stopColor="#e8a83e" stopOpacity="0"/></linearGradient>
                  <linearGradient id="burnGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={GC} stopOpacity="0.4"/><stop offset="100%" stopColor={GC} stopOpacity="0"/></linearGradient>
                </defs>
                {/* Grid */}
                {[0,0.5,1].map(function(t){
                  var y=cPad+cH*t;
                  return <line key={t} x1={cPad} y1={y} x2={cPad+cW} y2={y} stroke="#1e1e2a" strokeWidth="1"/>;
                })}
                {/* Eaten area */}
                {chartDays.length>1&&(()=>{
                  var pts=chartDays.map(function(d,i){return cx(i)+","+cy(d.eaten);});
                  var area=pts.join(" ")+" "+(cPad+cW)+","+(cPad+cH)+" "+cPad+","+(cPad+cH);
                  return <polygon points={area} fill="url(#eatGrad)"/>;
                })()}
                {/* Burned area */}
                {chartDays.length>1&&(()=>{
                  var pts=chartDays.map(function(d,i){return cx(i)+","+cy(d.burned);});
                  var area=pts.join(" ")+" "+(cPad+cW)+","+(cPad+cH)+" "+cPad+","+(cPad+cH);
                  return <polygon points={area} fill="url(#burnGrad)"/>;
                })()}
                {/* Eaten line */}
                {chartDays.length>1&&(()=>{
                  var d=chartDays.map(function(p,i){return(i===0?"M":"L")+cx(i)+","+cy(p.eaten);}).join(" ");
                  return <path d={d} fill="none" stroke="#e8a83e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>;
                })()}
                {/* Burned line */}
                {chartDays.length>1&&(()=>{
                  var d=chartDays.map(function(p,i){return(i===0?"M":"L")+cx(i)+","+cy(p.burned);}).join(" ");
                  return <path d={d} fill="none" stroke={GC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>;
                })()}
                {/* X labels - show a few */}
                {chartDays.filter(function(_,i){var step=Math.floor(chartDays.length/4);return i===0||i===chartDays.length-1||(step>0&&i%step===0);}).map(function(d,i){
                  var origIdx=chartDays.indexOf(d);
                  return <text key={i} x={cx(origIdx)} y={cPad+cH+18} textAnchor="middle" fill="#444" fontSize="8">{d.label}</text>;
                })}
              </svg>
              <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:4}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:3,background:"#e8a83e",borderRadius:2}}/><span style={{fontSize:9,color:"#888"}}>Eaten</span></div>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:3,background:GC,borderRadius:2}}/><span style={{fontSize:9,color:"#888"}}>Burned</span></div>
              </div>
            </div>
            {/* Summary stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:14}}>
              {[
                ["Avg Eaten",Math.round(rngMeals.reduce(function(s,m){return s+m.cal;},0)/(rngWorkouts.length||1))+" kcal","#e8a83e"],
                ["Avg Burned",Math.round(rngWorkouts.reduce(function(s,w){return s+w.cal;},0)/(rngWorkouts.length||1))+" kcal",GC],
                ["Active Days",Object.keys(wByDate).length,"#3eb8f5"],
              ].map(function(x){return(
                <div key={x[0]} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:8,color:"#555",marginBottom:4}}>{x[0]}</div>
                  <div style={{fontSize:14,fontWeight:700,color:x[2]}}>{x[1]}</div>
                </div>
              );})}
            </div>
            {/* Daily list */}
            {allDates.slice(0,30).map(function(d){
              var dw=wByDate[d]||[];
              var dm=mByDate[d]||[];
              var dc=dm.reduce(function(s,m){return s+m.cal;},0);
              var db=dw.reduce(function(s,w){return s+w.cal;},0);
              var label=new Date(d+"T12:00:00").toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"});
              return(
                <div key={d} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:11,padding:"11px 13px",marginBottom:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:dw.length>0||dm.length>0?8:0}}>
                    <div style={{fontWeight:700,fontSize:13}}>{label}</div>
                    <div style={{display:"flex",gap:10}}>
                      {dc>0&&<span style={{fontSize:11,color:"#e8a83e",fontWeight:700}}>+{dc}</span>}
                      {db>0&&<span style={{fontSize:11,color:GC,fontWeight:700}}>-{db}</span>}
                    </div>
                  </div>
                  {dw.map(function(w){return(
                    <div key={w.id} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0"}}>
                      <span style={{fontSize:13}}>{w.em}</span>
                      <span style={{fontSize:11,color:"#888",flex:1}}>{w.name}</span>
                      <span style={{fontSize:10,color:GC}}>{w.dur}min</span>
                      <span style={{fontSize:10,color:GC,fontWeight:700}}>-{w.cal}</span>
                    </div>
                  );})}
                  {dm.map(function(m){return(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0"}}>
                      <span style={{fontSize:13}}>{m.em}</span>
                      <span style={{fontSize:11,color:"#888",flex:1}}>{m.name}</span>
                      <span style={{fontSize:10,color:"#e8a83e",fontWeight:700}}>+{m.cal}</span>
                    </div>
                  );})}
                </div>
              );
            })}
          </div>)}

          {/* WORKOUTS TAB */}
          {hTab==="workouts"&&(<div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
              {[["Sessions",rngWorkouts.length,GC],["Total Burned",rngWorkouts.reduce(function(s,w){return s+w.cal;},0)+" kcal","#e8a83e"],["Avg Duration",Math.round(rngWorkouts.reduce(function(s,w){return s+w.dur;},0)/(rngWorkouts.length||1))+" min","#3eb8f5"],["Active Days",Object.keys(wByDate).length,"#b03ef5"]].map(function(x){return(
                <div key={x[0]} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:8,color:"#555",marginBottom:4}}>{x[0]}</div>
                  <div style={{fontSize:16,fontWeight:700,color:x[2]}}>{x[1]}</div>
                </div>
              );})}
            </div>
            {rngWorkouts.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#555",fontSize:12}}>No workouts in this period</div>}
            {rngWorkouts.map(function(w){return(
              <div key={w.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:11,padding:"11px 13px",marginBottom:7}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <span style={{fontSize:20}}>{w.em}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13}}>{w.name}</div>
                    <div style={{fontSize:10,color:"#555"}}>{w.date||w.time} &bull; {w.dur} min &bull; {w.cat}</div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{color:GC,fontWeight:700}}>{w.cal}</div><div style={{fontSize:8,color:"#555"}}>kcal</div></div>
                </div>
                {w.sets&&w.sets.length>0&&(<div style={{marginTop:8,paddingTop:8,borderTop:"1px solid #1a1a22"}}>
                  {(()=>{
                    var exs={};
                    w.sets.forEach(function(s){if(s.exercise){if(!exs[s.exercise])exs[s.exercise]=[];exs[s.exercise].push(s);}});
                    return Object.keys(exs).map(function(ex){return(
                      <div key={ex} style={{marginBottom:5}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:3}}>{ex}</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          {exs[ex].map(function(s,i){return <div key={i} style={{background:"#0a0a0f",borderRadius:5,padding:"2px 7px",fontSize:9,color:s.done?GC:"#555"}}>{s.reps||"-"}{s.weight?" @ "+s.weight+" lbs":""}</div>;})}
                        </div>
                      </div>
                    );});
                  })()}
                </div>)}
              </div>
            );})}
          </div>)}

          {/* NUTRITION TAB */}
          {hTab==="nutrition"&&(<div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
              {[["Total Meals",rngMeals.length,"#e8a83e"],["Total Calories",rngMeals.reduce(function(s,m){return s+m.cal;},0),"#e8a83e"],["Avg Protein",Math.round(rngMeals.reduce(function(s,m){return s+(m.protein||0);},0)/(Object.keys(mByDate).length||1))+"g/day","#c8f53e"],["Avg Carbs",Math.round(rngMeals.reduce(function(s,m){return s+(m.carbs||0);},0)/(Object.keys(mByDate).length||1))+"g/day","#3eb8f5"]].map(function(x){return(
                <div key={x[0]} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:8,color:"#555",marginBottom:4}}>{x[0]}</div>
                  <div style={{fontSize:16,fontWeight:700,color:x[2]}}>{x[1]}</div>
                </div>
              );})}
            </div>
            {rngMeals.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#555",fontSize:12}}>No meals logged in this period</div>}
            {allDates.filter(function(d){return mByDate[d];}).map(function(d){
              var dm=mByDate[d]||[];
              var dc=dm.reduce(function(s,m){return s+m.cal;},0);
              var dp=Math.round(dm.reduce(function(s,m){return s+(m.protein||0);},0));
              var label=new Date(d+"T12:00:00").toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"});
              return(
                <div key={d} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:11,padding:"11px 13px",marginBottom:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontWeight:700,fontSize:13}}>{label}</div>
                    <div style={{display:"flex",gap:10}}>
                      <span style={{fontSize:10,color:"#e8a83e",fontWeight:700}}>{dc} kcal</span>
                      <span style={{fontSize:10,color:"#c8f53e"}}>{dp}g P</span>
                    </div>
                  </div>
                  {dm.map(function(m){return(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0",borderBottom:"1px solid #0f0f18"}}>
                      <span style={{fontSize:14}}>{m.em}</span>
                      <span style={{fontSize:11,color:"#c0bdb5",flex:1}}>{m.name}</span>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color:"#e8a83e",fontWeight:700}}>{m.cal} kcal</div>
                        <div style={{fontSize:9,color:"#555"}}>P:{m.protein}g C:{m.carbs}g F:{m.fat}g</div>
                      </div>
                    </div>
                  );})}
                </div>
              );
            })}
          </div>)}
        </div>
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#0a0a0f",borderTop:"1px solid #1a1a22",padding:"12px 14px"}}>
          <button onClick={()=>setScreen("main")} style={{width:"100%",background:"#1e1e2a",border:"1px solid #2a2a3a",color:"#e8e4dc",borderRadius:11,padding:"12px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14}}>Back</button>
        </div>
      </div>
    );
  }

  // Chat screen
  if(activeChat) return(
    <div style={base}><style>{css}</style>
      <div style={{position:"sticky",top:0,zIndex:20,background:"#0a0a0f",borderBottom:"1px solid #1a1a22",padding:"12px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setActiveChat(null)} style={{background:"#1e1e2a",border:"none",color:"#e8e4dc",borderRadius:9,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Back</button>
          <div style={{fontSize:24}}>{AVATARS[activeChat.partner.avatar_index||0]}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14}}>{activeChat.partner.display_name||activeChat.partner.username||"User"}</div>
            <div style={{fontSize:10,color:getGoalColor(activeChat.partner.goal)}}>{getGoalLabel(activeChat.partner.goal)}</div>
          </div>
        </div>
      </div>
      <div style={{padding:"14px",paddingBottom:80,display:"flex",flexDirection:"column",gap:8,minHeight:"calc(100vh - 120px)"}}>
        {chatMessages.length===0&&<div style={{textAlign:"center",color:"#333",fontSize:12,padding:"40px 0"}}>No messages yet. Say hi!</div>}
        {chatMessages.map(function(msg){
          var isMe=msg.sender_id===user.id;
          return(<div key={msg.id} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"75%",background:isMe?GC:"#1e1e2a",color:isMe?"#0a0a0f":"#e8e4dc",borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"9px 13px",fontSize:13}}>
              {msg.content}
              <div style={{fontSize:9,color:isMe?"#0a0a0f88":"#555",marginTop:3,textAlign:"right"}}>{new Date(msg.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
            </div>
          </div>);
        })}
        <div ref={msgEndRef}/>
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#0a0a0f",borderTop:"1px solid #1a1a22",padding:"10px 14px",display:"flex",gap:9}}>
        <input className="inp" placeholder="Message..." value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} style={{flex:1}}/>
        <button onClick={sendMsg} style={{background:GC,border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px 16px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14}}>Send</button>
      </div>
    </div>
  );

  if(!dbLoaded) return(
    <div style={{...base,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{css}</style>
      <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:28,color:GC,letterSpacing:4}}>LOCK IN</div>
      <div style={{width:28,height:28,border:"3px solid #1e1e2a",borderTopColor:GC,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );

  if(screen==="profile") return(
    <div style={base}><style>{css}</style>
      <div style={{padding:"18px 16px 80px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button onClick={()=>setScreen("main")} style={{background:"#1e1e2a",border:"none",color:"#e8e4dc",borderRadius:9,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Back</button>
          <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:22,letterSpacing:1,color:GC}}>MY PROFILE</div>
        </div>
        <div style={{textAlign:"center",marginBottom:18}}>
          <ProfileLevelCard xp={xp} streak={streak} streakFreezes={streakFreezes}/>
          <div style={{fontSize:52,marginBottom:8}}>{AVATARS[profile.avatar]}</div>
          <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
            {AVATARS.map(function(a,i){return <button key={i} onClick={()=>setProfile(Object.assign({},profile,{avatar:i}))} style={{fontSize:20,background:profile.avatar===i?"#1e1e2a":"transparent",border:"1px solid "+(profile.avatar===i?GC:"#2a2a3a"),borderRadius:9,padding:"5px 9px",cursor:"pointer"}}>{a}</button>;})}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {/* Dark / Light mode toggle */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#13131a",border:"1px solid #1e1e2a",borderRadius:11,padding:"11px 14px"}}>
            <div>
              <div style={{fontWeight:700,fontSize:13}}>{darkMode?"Dark Mode":"Light Mode"}</div>
              <div style={{fontSize:10,color:"#555",marginTop:1}}>App appearance</div>
            </div>
            <button onClick={function(){
              var next=!darkMode;
              setDarkMode(next);
              try{localStorage.setItem("lockin_darkmode",String(next));}catch(e){}
            }} style={{
              width:48,height:26,borderRadius:99,border:"none",cursor:"pointer",
              background:darkMode?"#c8f53e":"#555",
              position:"relative",transition:"background .2s",flexShrink:0,
            }}>
              <div style={{
                position:"absolute",top:3,
                left:darkMode?24:3,
                width:20,height:20,borderRadius:"50%",
                background:"#0a0a0f",
                transition:"left .2s",
                boxShadow:"0 1px 4px rgba(0,0,0,0.4)",
              }}/>
            </button>
          </div>
          {/* Feedback Button */}
          <button onClick={()=>setShowFeedback(true)} style={{display:"flex",alignItems:"center",gap:10,background:"#13131a",border:"1px solid #1e1e2a",borderRadius:11,padding:"11px 14px",width:"100%",cursor:"pointer",fontFamily:"inherit"}}>
            <div style={{fontSize:18}}>&#128172;</div>
            <div style={{flex:1,textAlign:"left"}}>
              <div style={{fontWeight:700,fontSize:13,color:"#e8e4dc"}}>Contact / Feedback</div>
              <div style={{fontSize:10,color:"#555",marginTop:1}}>Report an issue or send feedback</div>
            </div>
            <div style={{fontSize:12,color:"#555"}}>&#8594;</div>
          </button>
          {/* Feedback Modal */}
          {showFeedback&&(<div className="overlay" onClick={function(e){if(e.target===e.currentTarget){setShowFeedback(false);setFeedbackSent(false);}}}>
            <div className="modal">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:1}}>CONTACT US</div>
                <button onClick={()=>setShowFeedback(false)} style={{background:"#1e1e2a",border:"none",color:"#e8e4dc",borderRadius:7,padding:"4px 9px",cursor:"pointer"}}>x</button>
              </div>
              {feedbackSent?(<div style={{textAlign:"center",padding:"30px 0"}}>
                <div style={{fontSize:36,marginBottom:10}}>&#10003;</div>
                <div style={{fontWeight:700,fontSize:16,color:GC}}>Message sent!</div>
                <div style={{fontSize:12,color:"#555",marginTop:6}}>We'll look into it and reach out if needed.</div>
              </div>):(<div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",gap:6}}>
                  {[["feedback","Feedback"],["bug","Bug Report"],["delete","Delete Account"]].map(function(t){return(
                    <button key={t[0]} onClick={()=>setFeedbackType(t[0])} style={{flex:1,padding:"7px 4px",borderRadius:8,border:"1px solid "+(feedbackType===t[0]?GC:"#2a2a3a"),background:feedbackType===t[0]?GC+"22":"transparent",color:feedbackType===t[0]?GC:"#555",fontFamily:"inherit",fontWeight:700,fontSize:10,cursor:"pointer"}}>{t[1]}</button>
                  );})}
                </div>
                <textarea value={feedbackText} onChange={function(e){setFeedbackText(e.target.value);}} placeholder={feedbackType==="delete"?"Please describe why you'd like to delete your account. We will process your request within 30 days.":feedbackType==="bug"?"Describe what happened and what you expected...":"What's on your mind?"} style={{background:"#0a0a0f",border:"1px solid #2a2a3a",borderRadius:9,padding:"10px 12px",color:"#e8e4dc",fontFamily:"inherit",fontSize:13,resize:"none",height:120,outline:"none",lineHeight:1.6}}/>
                <button onClick={submitFeedback} disabled={!feedbackText.trim()} style={{background:feedbackText.trim()?GC:"#1e1e2a",color:feedbackText.trim()?"#0a0a0f":"#555",border:"none",borderRadius:11,padding:"12px",cursor:feedbackText.trim()?"pointer":"default",fontFamily:"inherit",fontWeight:700,fontSize:14}}>Send Message</button>
              </div>)}
            </div>
          </div>)}
          {/* Referral Card */}
          {refCode&&(<div style={{background:"#13131a",border:"1px solid "+GC+"44",borderRadius:13,padding:"13px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{fontSize:20}}>&#127381;</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13}}>Invite Friends</div>
                <div style={{fontSize:10,color:"#555"}}>You both get bonus XP when they sign up</div>
              </div>
              {refCount>0&&<div style={{background:GC+"22",border:"1px solid "+GC+"44",borderRadius:8,padding:"4px 9px",textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:700,color:GC}}>{refCount}</div>
                <div style={{fontSize:8,color:"#555"}}>invited</div>
              </div>}
            </div>
            <div style={{background:"#0a0a0f",borderRadius:9,padding:"9px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,fontSize:11,color:"#888",fontFamily:"monospace",wordBreak:"break-all"}}>
                lockin-app-psi.vercel.app?ref={refCode}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={copyRefLink} style={{flex:1,background:refCopied?GC+"33":"#1e1e2a",border:"1px solid "+(refCopied?GC:"#2a2a3a"),color:refCopied?GC:"#e8e4dc",borderRadius:9,padding:"9px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,transition:"all .2s"}}>
                {refCopied?"Copied!":"Copy Link"}
              </button>
              <button onClick={shareRefLink} style={{flex:1,background:GC,border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12}}>
                Share &#128279;
              </button>
            </div>
          </div>)}
          <input className="inp" placeholder="Your name" value={profile.name} onChange={e=>setProfile(Object.assign({},profile,{name:e.target.value}))}/>
          <input className="inp" placeholder="Bio" value={profile.bio} onChange={e=>setProfile(Object.assign({},profile,{bio:e.target.value}))}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <input className="inp" type="number" placeholder="Age" value={profile.age} onChange={e=>setProfile(Object.assign({},profile,{age:e.target.value}))}/>
            <select className="inp" value={profile.sex} onChange={e=>setProfile(Object.assign({},profile,{sex:e.target.value}))} style={{cursor:"pointer"}}><option value="male">Male</option><option value="female">Female</option></select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
            <input className="inp" type="number" placeholder="Weight lbs" value={profile.wLbs} onChange={e=>setProfile(Object.assign({},profile,{wLbs:e.target.value}))}/>
            <input className="inp" type="number" placeholder="Ft" value={profile.hFt} onChange={e=>setProfile(Object.assign({},profile,{hFt:e.target.value}))}/>
            <input className="inp" type="number" placeholder="In" value={profile.hIn} onChange={e=>setProfile(Object.assign({},profile,{hIn:e.target.value}))}/>
          </div>
          <div style={{fontSize:11,color:"#555"}}>ACTIVITY LEVEL</div>
          {ACTIVITY.map(function(a){return <button key={a.id} onClick={()=>setProfile(Object.assign({},profile,{activ:a.id}))} style={{padding:"9px 13px",borderRadius:9,border:"1px solid "+(profile.activ===a.id?GC:"#2a2a3a"),background:profile.activ===a.id?"#151e12":"#13131a",color:profile.activ===a.id?GC:"#888",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:13,textAlign:"left"}}>{a.label}</button>;})}
          {tdee>0&&(<div className="card" style={{borderColor:GC+"44"}}>
            <div style={{fontSize:10,color:"#555",marginBottom:8}}>YOUR ESTIMATED NEEDS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
              {[["BMR",Math.round(bmr),"base kcal/day"],["TDEE",tdee,"maintenance kcal"]].map(function(x){return <div key={x[0]} style={{background:"#0a0a0f",borderRadius:9,padding:"8px 11px"}}><div style={{fontSize:8,color:"#555"}}>{x[0]}</div><div style={{fontWeight:700,fontSize:15}}>{x[1]}</div><div style={{fontSize:9,color:"#555"}}>{x[2]}</div></div>;})}
            </div>
            <div style={{background:GC+"11",borderRadius:9,padding:"9px 13px",marginBottom:9}}>
              <div style={{fontSize:11,color:"#888"}}>Suggested for {goalObj.label}</div>
              <div style={{fontWeight:700,fontSize:18,color:GC}}>{sugCal} kcal/day</div>
              <div style={{fontSize:10,color:"#555"}}>{goalObj.calMod>=0?"+":""}{goalObj.calMod} from TDEE</div>
            </div>
            <button className="btn" onClick={()=>{applyS();setScreen("main");}} style={{background:GC,color:"#0a0a0f"}}>Apply {sugCal} kcal + Auto Macros</button>
          </div>)}
          <button className="btn" onClick={()=>{saveProfile(profile,goal,calGoal,macros);setScreen("main");}} style={{background:GC,color:"#0a0a0f"}}>Save Profile</button>
          <button className="btn" onClick={()=>setScreen("main")} style={{background:"#1e1e2a",color:"#e8e4dc",border:"1px solid #2a2a3a"}}>Cancel</button>
          <a href="/privacy-policy.html" target="_blank" style={{textAlign:"center",fontSize:11,color:"#555",display:"block",marginTop:4,textDecoration:"none"}}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );

  if(screen==="share") return(
    <div style={base}><style>{css}</style>
      <div style={{padding:"18px 16px 80px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button onClick={()=>setScreen("main")} style={{background:"#1e1e2a",border:"none",color:"#e8e4dc",borderRadius:9,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Back</button>
          <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:22,letterSpacing:1,color:GC}}>SHARE STATS</div>
        </div>
        <div style={{background:"#13131a",border:"2px solid "+GC+"33",borderRadius:18,padding:18,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:2,color:GC}}>LOCK IN</div><div style={{fontWeight:700,fontSize:15}}>{profile.name||"Athlete"}</div><div style={{fontSize:10,color:"#555"}}>{goalObj.em} {goalObj.label} - {TODAY}</div></div>
            <div style={{textAlign:"center",background:"#0a0a0f",borderRadius:11,padding:"9px 13px"}}><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:26,color:GC,lineHeight:1}}>{netCal}</div><div style={{fontSize:8,color:"#555",letterSpacing:1}}>NET KCAL</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
            {[["Burned",calB+"kcal",GC],["Eaten",calE+"kcal","#e8a83e"],["Protein",pE+"g","#c8f53e"],["Sessions",workouts.length,"#3eb8f5"]].map(function(x){return <div key={x[0]} style={{background:"#0a0a0f",borderRadius:9,padding:"7px 5px",textAlign:"center"}}><div style={{fontWeight:700,color:x[2],fontSize:13}}>{x[1]}</div><div style={{fontSize:8,color:"#555"}}>{x[0]}</div></div>;})}
          </div>
        </div>
        {["Lets go! Check my stats!","Crushing my "+goalObj.label+" goals today","Another day another grind. Who is training?","Feeling strong. Come join me!"].map(function(msg,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#13131a",border:"1px solid #1e1e2a",borderRadius:9,padding:"9px 13px",marginBottom:7}}><span style={{fontSize:12,color:"#888"}}>{msg}</span><button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(msg)} style={{background:GC+"22",border:"none",color:GC,borderRadius:7,padding:"4px 9px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:10}}>Copy</button></div>;})}
      </div>
    </div>
  );

  if(showRec){
    var ts2=moves.reduce(function(s,m){return s+m.sets.length;},0);
    var ds2=moves.reduce(function(s,m){return s+m.sets.filter(function(x){return x.done;}).length;},0);
    return(
      <div style={base}><style>{css}</style>
        <div style={{position:"sticky",top:0,zIndex:20,background:"#0a0a0f",borderBottom:"1px solid #1a1a22",padding:"12px 14px 9px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
            <button onClick={()=>{if(window.confirm("Discard workout?")){setShowRec(false);setMoves([]);setRecName("");timer.reset();setActiveIdx(null);setRestSecs(null);}}} style={{background:"#1e1e2a",border:"none",color:"#888",borderRadius:8,padding:"6px 11px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:11}}>Discard</button>
            <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:18,letterSpacing:1,color:GC}}>RECORD WORKOUT</div>
            <button onClick={saveW} style={{background:GC,border:"none",color:"#0a0a0f",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:11}}>Save</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:30,color:timer.running?GC:"#333",letterSpacing:3,lineHeight:1,minWidth:86}}>{timer.fmt(timer.elapsed)}</div>
            <button onClick={()=>timer.setRunning(!timer.running)} style={{background:timer.running?"#ff6b3522":GC+"22",border:"1px solid "+(timer.running?"#ff6b35":GC),color:timer.running?"#ff6b35":GC,borderRadius:8,padding:"5px 13px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:11}}>{timer.running?"Pause":"Start"}</button>
            <div style={{flex:1}}/><div style={{fontSize:10,color:"#555",textAlign:"right"}}><div>{ds2}/{ts2} sets</div><div>{moves.length} exercises</div></div>
          </div>
        </div>
        {restSecs!==null&&(<div style={{position:"fixed",bottom:72,left:"50%",transform:"translateX(-50%)",background:"#13131a",border:"2px solid "+GC,borderRadius:14,padding:"11px 18px",zIndex:100,display:"flex",alignItems:"center",gap:11,maxWidth:320,width:"90%"}}>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:32,color:GC,lineHeight:1}}>{restSecs}s</div><div style={{fontSize:9,color:"#555"}}>REST</div></div>
          <div style={{flex:1}}><div style={{background:"#0a0a0f",borderRadius:99,height:5,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",borderRadius:99,background:GC,width:((restSecs/90)*100)+"%",transition:"width 1s linear"}}/></div><div style={{fontSize:11,color:"#888"}}>Rest period</div></div>
          <button onClick={()=>{clearInterval(restRef.current);setRestSecs(null);}} style={{background:"#1e1e2a",border:"none",color:"#888",borderRadius:7,padding:"5px 9px",cursor:"pointer",fontFamily:"inherit",fontSize:11}}>Skip</button>
        </div>)}
        <div style={{padding:"13px 14px 110px"}}>
          <input className="inp" placeholder="Workout name (e.g. Push Day)" value={recName} onChange={e=>setRecName(e.target.value)} style={{marginBottom:10}}/>
          <div style={{display:"flex",gap:7,marginBottom:12}}>
            <input className="inp" placeholder="Add exercise (e.g. Bench Press)" value={curMove} onChange={e=>setCurMove(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addMove()} style={{flex:1}}/>
            <button onClick={addMove} style={{background:GC,color:"#0a0a0f",border:"none",borderRadius:9,padding:"9px 15px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:15}}>+</button>
          </div>
          {moves.length===0&&<div style={{textAlign:"center",color:"#333",padding:"34px 0",fontSize:13}}>Add your first exercise above</div>}
          {moves.map(function(move,mi){
            var isA=activeIdx===mi,dc=move.sets.filter(function(s){return s.done;}).length;
            return(<div key={mi} style={{marginBottom:9}}>
              <button onClick={()=>setActiveIdx(isA?null:mi)} style={{width:"100%",background:isA?"#1a1f12":"#13131a",border:"1px solid "+(isA?GC:"#1e1e2a"),borderRadius:isA?"12px 12px 0 0":"12px",padding:"10px 13px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:10,fontWeight:700,color:GC,background:GC+"22",borderRadius:5,padding:"1px 6px"}}>{mi+1}</span><span style={{fontWeight:700,fontSize:13,color:"#e8e4dc"}}>{move.name}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:10,color:dc===move.sets.length&&move.sets.length>0?"#c8f53e":"#555"}}>{dc}/{move.sets.length} done</span><button onClick={function(e){e.stopPropagation();remMove(mi);}} className="del">x</button></div>
              </button>
              {isA&&(<div style={{background:"#0d0d14",border:"1px solid "+GC,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"11px 13px"}}>
                <div style={{display:"grid",gridTemplateColumns:"26px 1fr 1fr 50px auto",gap:5,marginBottom:5}}>
                  {["#","Reps","Weight","Note",""].map(function(h,i){return <div key={i} style={{fontSize:9,color:"#444",fontWeight:700}}>{h}</div>;})}
                </div>
                {move.sets.length===0&&<div style={{fontSize:11,color:"#444",textAlign:"center",padding:"6px 0"}}>No sets yet</div>}
                {move.sets.map(function(set,si){return(
                  <div key={si} style={{display:"grid",gridTemplateColumns:"26px 1fr 1fr 50px auto",gap:5,marginBottom:5,alignItems:"center",opacity:set.done?0.65:1}}>
                    <div style={{fontSize:10,color:"#555",textAlign:"center",fontWeight:700}}>{si+1}</div>
                    <input className="inp" type="number" inputMode="numeric" placeholder="10" value={set.reps} onChange={e=>updSet(mi,si,"reps",e.target.value)} style={{background:"#13131a",border:"1px solid "+(set.done?GC+"55":"#2a2a3a"),borderRadius:7,padding:"6px 8px",fontSize:12}}/>
                    <input className="inp" type="text" placeholder="lbs/bw" value={set.weight} onChange={e=>updSet(mi,si,"weight",e.target.value)} style={{background:"#13131a",border:"1px solid "+(set.done?GC+"55":"#2a2a3a"),borderRadius:7,padding:"6px 8px",fontSize:12}}/>
                    <input className="inp" type="text" placeholder="note" value={set.note} onChange={e=>updSet(mi,si,"note",e.target.value)} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:7,padding:"6px 6px",fontSize:10}}/>
                    <button onClick={()=>doneSet(mi,si)} style={{width:28,height:28,borderRadius:7,border:"2px solid "+(set.done?GC:"#2a2a3a"),background:set.done?GC:"transparent",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",color:set.done?"#0a0a0f":"#555",flexShrink:0}}>{set.done?"v":""}</button>
                  </div>
                );})}
                <button onClick={()=>addSet(mi)} style={{width:"100%",background:"transparent",border:"1px dashed "+GC+"55",color:GC,borderRadius:8,padding:"7px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:11,marginTop:3}}>+ Add Set</button>
              </div>)}
              {!isA&&move.sets.length>0&&(<div style={{background:"#0a0a0f",border:"1px solid #1a1a22",borderTop:"none",borderRadius:"0 0 12px 12px",padding:"7px 13px",display:"flex",gap:4,flexWrap:"wrap"}}>
                {move.sets.map(function(s,si){return <div key={si} style={{background:s.done?"#1a2a12":"#13131a",border:"1px solid "+(s.done?GC+"55":"#2a2a3a"),borderRadius:6,padding:"2px 7px",fontSize:9,color:s.done?GC:"#555"}}>{s.reps||"-"}{s.weight?" @ "+s.weight:""}</div>;})}
              </div>)}
            </div>);
          })}
        </div>
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#0a0a0f",borderTop:"1px solid #1a1a22",padding:"10px 14px",display:"flex",gap:9}}>
          <div style={{flex:1}}><div style={{fontSize:10,color:"#555"}}>~{Math.round(timer.elapsed/60*7)} kcal - {ds2} sets done</div><div style={{fontSize:11,color:"#888"}}>{timer.fmt(timer.elapsed)} elapsed</div></div>
          <button onClick={saveW} style={{background:GC,border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px 20px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13}}>Finish and Save</button>
        </div>
      </div>
    );
  }

  return(
    <div style={base}><style>{css}</style>
      <div className="safe-top" style={{padding:"50px 14px 9px",position:"sticky",top:0,background:"#0a0a0f",zIndex:10,borderBottom:"1px solid #1a1a22"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:24,letterSpacing:2,color:GC,lineHeight:1}}>LOCK IN</div><div style={{fontSize:10,color:"#444",marginTop:1}}>{TODAY}</div></div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <div style={{background:"#13131a",border:"1px solid #2a2a3a",borderRadius:9,padding:"5px 9px"}}>
              <div style={{fontSize:8,color:"#444"}}>GOAL</div>
              <div style={{display:"flex",alignItems:"center",gap:3}}><input type="number" value={calGoal} onChange={e=>setCalGoal(+e.target.value)} style={{width:48,fontSize:13,fontWeight:700,textAlign:"right"}}/><span style={{fontSize:8,color:"#444"}}>kcal</span></div>
            </div>
            <button onClick={()=>setScreen("profile")} style={{fontSize:24,background:"#13131a",border:"2px solid "+(pendingIn.length>0?"#ff6b35":"#2a2a3a"),borderRadius:"50%",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,position:"relative"}}>
              {AVATARS[profile.avatar]}
              {pendingIn.length>0&&<div style={{position:"absolute",top:-2,right:-2,width:14,height:14,borderRadius:"50%",background:"#ff6b35",border:"2px solid #0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#fff"}}>{pendingIn.length}</div>}
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:3,marginTop:9}}>
          {[["dashboard","Overview"],["workouts","Exercise"],["nutrition","Nutrition"],["goals","Goals"],["social","Social"]].map(function(x){return <button key={x[0]} onClick={()=>setTab(x[0])} style={{flex:1,padding:"6px 0",borderRadius:7,border:"none",cursor:"pointer",background:tab===x[0]?GC:"transparent",color:tab===x[0]?"#0a0a0f":"#555",fontFamily:"inherit",fontWeight:700,fontSize:9,letterSpacing:0.3,textTransform:"uppercase",transition:"all .2s",position:"relative"}}>
            {x[1]}
            {x[0]==="social"&&pendingIn.length>0&&<div style={{position:"absolute",top:2,right:4,width:6,height:6,borderRadius:"50%",background:"#ff6b35"}}/>}
          </button>;})}
        </div>
      </div>

      <div style={{padding:"14px",paddingBottom:80}}>

        {tab==="dashboard"&&(<div style={{display:"flex",flexDirection:"column",gap:11}}>
          {/* XP popup animation */}
          {xpAnim&&(<div style={{position:"fixed",top:"20%",left:"50%",transform:"translateX(-50%)",zIndex:200,background:"#13131a",border:"2px solid "+GC,borderRadius:14,padding:"10px 20px",textAlign:"center",animation:"up .3s ease",pointerEvents:"none"}}>
            <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:28,color:GC,lineHeight:1}}>+{xpAnim.amount} XP</div>
            <div style={{fontSize:11,color:"#888",marginTop:2}}>{xpAnim.reason}</div>
          </div>)}
          {profile.name&&(()=>{
            var li=getLevelInfo(xp);
            var prog=getXPProgress(xp);
            return(<div style={{background:"#13131a",border:"1px solid "+GC+"22",borderRadius:13,padding:"9px 13px"}}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
                <span style={{fontSize:24}}>{AVATARS[profile.avatar]}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{profile.name}</div>
                  {profile.bio&&<div style={{fontSize:10,color:"#555"}}>{profile.bio}</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end"}}>
                    <span style={{fontSize:16}}>{li.em}</span>
                    <div style={{background:li.color+"22",border:"1px solid "+li.color+"44",borderRadius:7,padding:"2px 8px"}}>
                      <span style={{fontSize:9,fontWeight:700,color:li.color}}>Lv.{li.level} {li.title}</span>
                    </div>
                  </div>
                  {streak>0&&<div style={{display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end",marginTop:3}}><span style={{fontSize:11}}>🔥</span><span style={{fontSize:10,fontWeight:700,color:"#ff6b35"}}>{streak} day streak</span></div>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{flex:1,background:"#0a0a0f",borderRadius:99,height:5,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,"+li.color+"88,"+li.color+")",width:prog+"%",transition:"width .6s ease"}}/>
                </div>
                <span style={{fontSize:9,color:"#555",flexShrink:0}}>{xp.toLocaleString()} XP</span>
              </div>
            </div>);
          })()}
          <div className="card" style={{display:"flex",alignItems:"center",gap:13}}>
            <div style={{position:"relative",flexShrink:0}}>
              <svg width="100" height="100" style={{transform:"rotate(-90deg)"}}>
                <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" stroke="#1e1e2a"/>
                <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" strokeLinecap="round" stroke={netCal>calGoal?"#ff5555":GC} strokeDasharray={2*Math.PI*42} strokeDashoffset={2*Math.PI*42*(1-ring/100)} style={{transition:"stroke-dashoffset .6s ease"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,color:netCal>calGoal?"#ff5555":GC,lineHeight:1}}>{netCal}</div>
                <div style={{fontSize:7,color:"#555",letterSpacing:1}}>NET KCAL</div>
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:700,color:calLeft<0?"#ff5555":"#e8e4dc",marginBottom:5}}>{Math.abs(calLeft)} <span style={{fontSize:9,color:"#555",fontWeight:400}}>{calLeft>=0?"kcal left":"kcal over"}</span></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:7}}>
                {[["EATEN",calE,"#e8a83e"],["BURNED",calB,GC]].map(function(x){return <div key={x[0]} style={{background:"#0a0a0f",borderRadius:7,padding:"5px 7px"}}><div style={{fontSize:7,color:"#555"}}>{x[0]}</div><div style={{fontWeight:700,color:x[2],fontSize:12}}>{x[1]}</div></div>;})}
              </div>
            </div>
          </div>
          <div className="card" style={{display:"flex",flexDirection:"column",gap:7}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1}}>MACROS TODAY</div>
            {MB("PROTEIN",pE,macros.protein,"#c8f53e")}
            {MB("CARBS",cE,macros.carbs,"#e8a83e")}
            {MB("FAT",fE,macros.fat,"#3eb8f5")}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
            <button className="btn" onClick={()=>setShowEx(true)} style={{background:GC,color:"#0a0a0f",fontSize:11}}>+ Exercise</button>
            <button className="btn" onClick={()=>setShowFood(true)} style={{background:"#1e1e2a",color:"#e8e4dc",border:"1px solid #2a2a3a",fontSize:11}}>+ Meal</button>
            <button className="btn" onClick={()=>setScreen("share")} style={{background:"#1e1e2a",color:"#e8e4dc",border:"1px solid #2a2a3a",fontSize:11}}>Share</button>
          </div>
          <button className="btn" onClick={()=>{setSugs(getFoodSugs(Math.max(0,calLeft),Math.max(0,macros.protein-pE),goal));setShowSugs(true);}} style={{background:GC+"11",border:"1px solid "+GC+"33",color:GC}}>Smart Food Suggestions</button>
          {showSugs&&sugs&&(<div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:9,color:"#555",letterSpacing:1}}>SUGGESTIONS FOR YOU</div><button onClick={()=>setShowSugs(false)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:11}}>hide</button></div>
            <div style={{fontSize:10,color:"#888",marginBottom:4}}>Meal Ideas</div>
            {(sugs.meals||[]).map(function(m,i){return <div key={i} className="sug"><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:12}}>{m.name}</div><div style={{fontSize:10,color:"#555"}}>{m.reason}</div></div><div style={{textAlign:"right",flexShrink:0,marginLeft:7}}><div style={{color:"#e8a83e",fontWeight:700,fontSize:11}}>{m.calories} kcal</div><div style={{fontSize:9,color:"#555"}}>P:{m.protein}g C:{m.carbs}g F:{m.fat}g</div><button onClick={()=>addSM(m)} style={{background:GC+"22",border:"none",color:GC,borderRadius:6,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",fontSize:9,fontWeight:700,marginTop:3}}>+ Log</button></div></div></div>;})}
            <div style={{fontSize:10,color:"#888",marginTop:4,marginBottom:4}}>Snack Ideas</div>
            {(sugs.snacks||[]).map(function(s,i){return <div key={i} className="sug"><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:12}}>{s.name}</div><div style={{fontSize:10,color:"#555"}}>{s.reason}</div></div><div style={{textAlign:"right",flexShrink:0,marginLeft:7}}><div style={{color:"#e8a83e",fontWeight:700,fontSize:11}}>{s.calories} kcal</div><div style={{fontSize:9,color:"#555"}}>P:{s.protein}g C:{s.carbs}g F:{s.fat}g</div><button onClick={()=>addSM(s)} style={{background:GC+"22",border:"none",color:GC,borderRadius:6,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",fontSize:9,fontWeight:700,marginTop:3}}>+ Log</button></div></div></div>;})}
          </div>)}
          {(todayWorkouts.length>0||todayMeals.length>0)&&(<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
              <div style={{fontSize:9,color:"#555",letterSpacing:1}}>TODAY</div>
              <button onClick={()=>setScreen("history")} style={{background:"none",border:"none",color:GC,fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>History &rarr;</button>
            </div>
            {todayWorkouts.concat(todayMeals.map(function(m){return Object.assign({},m,{type:"meal"});})).slice(-6).reverse().map(function(item){return <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,background:"#13131a",border:"1px solid #1e1e2a",borderRadius:9,padding:"8px 11px",marginBottom:5}}><span style={{fontSize:15}}>{item.em}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{item.name}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:11,fontWeight:700,color:item.type==="meal"?"#e8a83e":GC}}>{item.type==="meal"?"+":"-"}{item.cal}</div><div style={{fontSize:8,color:"#555"}}>kcal</div></div></div>;})}
          </div>)}
          {todayWorkouts.length===0&&todayMeals.length===0&&(<div style={{textAlign:"center"}}><button onClick={()=>setScreen("history")} style={{background:"none",border:"none",color:"#555",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>View history &rarr;</button></div>)}
        </div>)}

        {tab==="workouts"&&(<div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:1}}>WORKOUTS</div><div style={{fontSize:10,color:"#555"}}>{workouts.length} sessions - {calB} kcal</div></div>
            <div style={{display:"flex",gap:7}}>
              <button className="btn" onClick={()=>setShowRec(true)} style={{background:GC+"22",border:"1px solid "+GC+"44",color:GC,width:"auto",padding:"7px 11px",fontSize:11}}>Record</button>
              <button className="btn" onClick={()=>setShowEx(true)} style={{background:GC,color:"#0a0a0f",width:"auto",padding:"7px 11px",fontSize:11}}>+ Log</button>
            </div>
          </div>
          <div className="card" style={{padding:11}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:7}}>WORKOUT PLAN - {goalObj.label.toUpperCase()}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:9}}>
              {["full body","chest","back","shoulders","quad","hamstring","glute","calf","bicep","tricep","forearm","core","cardio"].map(function(m){return <button key={m} className={"chip "+(muscle===m?"on":"")} onClick={()=>setMuscle(m)}>{m}</button>;})}
            </div>
            <button className="btn" onClick={()=>setWSug(getWorkoutPlan(goal,muscle))} style={{background:GC,color:"#0a0a0f"}}>Generate {goalObj.label} Plan</button>
          </div>
          {wSug&&(<div style={{display:"flex",flexDirection:"column",gap:9}}>
            <div style={{background:"#0a0a0f",borderRadius:11,padding:"11px 13px",borderLeft:"3px solid "+GC}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{fontSize:11,fontWeight:700}}>{goalObj.em} {goalObj.label} - {muscle}</div><span style={{fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:99,background:(IC[wSug.intensity]||"#888")+"22",color:IC[wSug.intensity]||"#888"}}>{(wSug.intensity||"").toUpperCase()}</span></div>
              <div style={{fontSize:11,color:"#666"}}>{wSug.overview}</div>
            </div>
            {(wSug.exercises||[]).map(function(ex,i){return(
              <div key={i} className="card" style={{padding:11,animation:"up .15s ease "+(i*0.04)+"s both"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                  <div><div style={{fontWeight:700,fontSize:14}}>{ex.name}</div><div style={{fontSize:10,color:"#555",textTransform:"capitalize"}}>{ex.muscle}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,color:GC,lineHeight:1}}>{ex.sets}</div><div style={{fontSize:8,color:"#555"}}>sets x reps</div></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:7}}>
                  {[["REST",ex.rest],["WEIGHT",ex.weight]].map(function(x){return <div key={x[0]} style={{background:"#0a0a0f",borderRadius:7,padding:"5px 8px"}}><div style={{fontSize:8,color:"#555"}}>{x[0]}</div><div style={{fontSize:11,fontWeight:600}}>{x[1]}</div></div>;})}
                </div>
                <ExerciseAnimation exerciseName={ex.name} color={GC}/>
                <MuscleDiagram exerciseName={ex.name} color={GC}/>
                <div style={{background:GC+"11",borderRadius:7,padding:"5px 8px",fontSize:10,color:GC}}>Tip: {ex.tip}</div>
              </div>
            );})}
          </div>)}
          {workouts.length===0&&!wSug&&<div style={{textAlign:"center",padding:"26px 0",color:"#333",fontSize:12}}>No workouts logged yet</div>}

          {/* Exercise Progress Tracker */}
          {workouts.length>0&&(<div className="card" style={{padding:13,marginBottom:4}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:9}}>EXERCISE PROGRESS</div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input className="inp" placeholder="Search exercise (e.g. Bench Press)" value={progressEx} onChange={e=>setProgressEx(e.target.value)} style={{flex:1,fontSize:13}}/>
              <button onClick={()=>setShowProgress(!showProgress)} style={{background:GC,border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,flexShrink:0}}>{showProgress?"Hide":"Track"}</button>
            </div>
            {/* Quick exercise chips from logged workouts */}
            {(()=>{
              var exNames={};
              workouts.forEach(function(w){(w.sets||[]).forEach(function(s){if(s.exercise)exNames[s.exercise]=true;});});
              var names=Object.keys(exNames).slice(0,8);
              if(!names.length)return null;
              return(<div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                {names.map(function(n){return <button key={n} onClick={()=>{setProgressEx(n);setShowProgress(true);}} style={{background:progressEx===n?"#1a2a12":"#0a0a0f",border:"1px solid "+(progressEx===n?GC:"#2a2a3a"),color:progressEx===n?GC:"#666",borderRadius:99,padding:"3px 9px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{n}</button>;})}</div>);
            })()}
            {showProgress&&progressEx&&(<ProgressChart workouts={workouts} exerciseName={progressEx} GC={GC}/>)}
          </div>)}

          {workouts.map(function(w){return(
            <div key={w.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:13,padding:"11px 13px"}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <span style={{fontSize:20}}>{w.em}</span>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{w.name}</div><div style={{fontSize:10,color:"#555"}}>{w.dur} min - {w.time} - {w.cat}</div></div>
                <div style={{textAlign:"right"}}><div style={{color:GC,fontWeight:700,fontSize:13}}>-{w.cal}</div><div style={{fontSize:8,color:"#555"}}>kcal</div></div>
                <button className="del" onClick={()=>removeWorkout(w.id)}>x</button>
              </div>
            </div>
          );})}
        </div>)}

        {tab==="nutrition"&&(<div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:1}}>NUTRITION</div><div style={{fontSize:10,color:"#555"}}>{meals.length} meals - {calE} kcal</div></div>
            <button className="btn" onClick={()=>setShowFood(true)} style={{background:"#e8a83e",color:"#0a0a0f",width:"auto",padding:"7px 13px"}}>+ Add</button>
          </div>
          <div className="card" style={{display:"flex",flexDirection:"column",gap:7}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:9,color:"#555",letterSpacing:1}}>CALORIES</span><span style={{fontSize:9,fontWeight:700}}>{calE} / {calGoal}</span></div>
            <div style={{background:"#0a0a0f",borderRadius:99,height:6,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:calE>calGoal?"#ff5555":"linear-gradient(90deg,#e8a83e,#f5c842)",width:Math.min((calE/calGoal)*100,100)+"%",transition:"width .4s"}}/></div>
            {MB("PROTEIN",pE,macros.protein,"#c8f53e")}
            {MB("CARBS",cE,macros.carbs,"#e8a83e")}
            {MB("FAT",fE,macros.fat,"#3eb8f5")}
          </div>
          {todayMeals.length===0&&<div style={{textAlign:"center",padding:"26px 0",color:"#333",fontSize:12}}>No meals logged today</div>}
          {todayMeals.length>0&&(()=>{
            var MT=[["breakfast","&#9728;","Breakfast"],["lunch","&#127780;","Lunch"],["dinner","&#127771;","Dinner"],["snack","&#127822;","Snack"],["other","&#127869;","Other"]];
            return MT.map(function(mt){
              var grp=todayMeals.filter(function(m){return(m.meal_type||"other")===mt[0];});
              if(!grp.length)return null;
              var gc=grp.reduce(function(s,m){return s+m.cal;},0);
              var gp=Math.round(grp.reduce(function(s,m){return s+(m.protein||0);},0));
              return(<div key={mt[0]} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span dangerouslySetInnerHTML={{__html:mt[1]}} style={{fontSize:13}}/>
                    <span style={{fontSize:12,fontWeight:700}}>{mt[2]}</span>
                  </div>
                  <div style={{display:"flex",gap:8}}><span style={{fontSize:10,color:"#e8a83e",fontWeight:700}}>{gc} kcal</span><span style={{fontSize:10,color:"#c8f53e"}}>{gp}g P</span></div>
                </div>
                {grp.map(function(m){return(
                  <div key={m.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:11,padding:"10px 12px",marginBottom:5}}>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <span style={{fontSize:18}}>{m.em}</span>
                      <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div><div style={{fontSize:10,color:"#555"}}>{m.servings}x {m.per} &middot; {m.time}</div></div>
                      <div style={{textAlign:"right",flexShrink:0}}><div style={{color:"#e8a83e",fontWeight:700,fontSize:13}}>+{m.cal}</div><div style={{fontSize:8,color:"#555"}}>kcal</div></div>
                      <button className="del" onClick={()=>removeMeal(m.id)}>x</button>
                    </div>
                    <div style={{display:"flex",gap:4,marginTop:7}}>
                      {[["P",m.protein,"#c8f53e"],["C",m.carbs,"#e8a83e"],["F",m.fat,"#3eb8f5"]].map(function(x){return <div key={x[0]} style={{flex:1,background:"#0a0a0f",borderRadius:6,padding:"3px 0",textAlign:"center"}}><div style={{fontSize:7,color:"#555"}}>{x[0]}</div><div style={{fontSize:11,fontWeight:700,color:x[2]}}>{x[1]}g</div></div>;})}
                    </div>
                  </div>
                );})}
              </div>);
            });
          })()}
        </div>)}

        {tab==="goals"&&(<div style={{display:"flex",flexDirection:"column",gap:13}}>
          <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:1}}>FITNESS GOAL</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {GOALS.map(function(g){return <div key={g.id} onClick={()=>{setGoal(g.id);saveProfile(profile,g.id,calGoal,macros);}} style={{padding:"10px",borderRadius:11,border:"2px solid "+(goal===g.id?g.color:"#1e1e2a"),cursor:"pointer",textAlign:"center",background:"#13131a",transition:"all .15s"}}><div style={{fontSize:22,marginBottom:3}}>{g.em}</div><div style={{fontWeight:700,fontSize:13,color:goal===g.id?g.color:"#e8e4dc"}}>{g.label}</div><div style={{fontSize:9,color:"#555",marginTop:2}}>{g.desc}</div><div style={{fontSize:8,color:g.color,marginTop:2}}>{g.calMod>=0?"+":""}{g.calMod} kcal</div></div>;})}
          </div>
          <button className="btn" onClick={()=>setScreen("profile")} style={{background:GC+"11",border:"1px solid "+GC+"33",color:GC}}>{tdee>0?"TDEE: "+tdee+" kcal - Suggested: "+sugCal+" kcal":"Set up profile for TDEE calculator"}</button>
          {tdee>0&&calGoal!==sugCal&&<button className="btn" onClick={applyS} style={{background:GC,color:"#0a0a0f"}}>Apply {sugCal} kcal + Auto Macros</button>}
          <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:18,letterSpacing:1}}>MACRO TARGETS</div>
          <div style={{fontSize:10,color:"#555",marginTop:-8}}>{macLocked?"Manually adjusted":"Auto-set by goal"}</div>
          {[["Protein","protein","#c8f53e",50,350],["Carbs","carbs","#e8a83e",30,600],["Fat","fat","#3eb8f5",20,200]].map(function(x){return(
            <div key={x[1]} className="card" style={{padding:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#888"}}>{x[0]} (g)</span><span style={{fontWeight:700,color:x[2],fontSize:13}}>{macros[x[1]]}g</span></div>
              <input type="range" min={x[3]} max={x[4]} step={5} value={macros[x[1]]} style={{accentColor:x[2]}} onChange={function(e){var nm=Object.assign({},macros,{[x[1]]:+e.target.value});setMacros(nm);setMacLocked(true);saveProfile(profile,goal,calGoal,nm);}}/>
            </div>
          );})}
          {macLocked&&<button className="btn" onClick={()=>{var nm=calcMacros(calGoal,goal);setMacros(nm);setMacLocked(false);saveProfile(profile,goal,calGoal,nm);}} style={{background:"#1e1e2a",color:"#888",border:"1px dashed #2a2a3a",fontSize:11}}>Reset to goal defaults</button>}
          <div className="card" style={{padding:11}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:7}}>MACRO SPLIT</div>
            <div style={{display:"flex",borderRadius:99,overflow:"hidden",height:9,marginBottom:9}}>
              {[["p",macros.protein*4,"#c8f53e"],["c",macros.carbs*4,"#e8a83e"],["f",macros.fat*9,"#3eb8f5"]].map(function(x){var t=macros.protein*4+macros.carbs*4+macros.fat*9;return <div key={x[0]} style={{background:x[2],width:((x[1]/t)*100)+"%",transition:"width .4s"}}/>;})}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
              {[["Protein",macros.protein*4,"#c8f53e"],["Carbs",macros.carbs*4,"#e8a83e"],["Fat",macros.fat*9,"#3eb8f5"]].map(function(x){return <div key={x[0]} style={{textAlign:"center"}}><div style={{fontSize:8,color:"#555"}}>{x[0].toUpperCase()}</div><div style={{fontWeight:700,color:x[2],fontSize:11}}>{x[1]} kcal</div><div style={{fontSize:8,color:"#555"}}>{calGoal>0?Math.round((x[1]/calGoal)*100):0}%</div></div>;})}
            </div>
          </div>
        </div>)}

        {tab==="social"&&(<div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:1}}>SOCIAL</div><div style={{fontSize:10,color:"#555"}}>{matches.length} matches</div></div>
            <button onClick={loadSocial} style={{background:"#1e1e2a",border:"none",color:"#888",borderRadius:8,padding:"6px 11px",cursor:"pointer",fontFamily:"inherit",fontSize:11}}>Refresh</button>
          </div>

          {/* Sub tabs */}
          <div style={{display:"flex",gap:3,background:"#0a0a0f",borderRadius:8,padding:3}}>
            {[["discover","Discover"],["matches","Matches"+(matches.length>0?" ("+matches.length+")":"")],["requests","Requests"+(pendingIn.length>0?" ("+pendingIn.length+")":"")]].map(function(x){return <button key={x[0]} onClick={()=>setSocialTab(x[0])} style={{flex:1,padding:"6px 0",borderRadius:6,border:"none",cursor:"pointer",background:socialTab===x[0]?"#1e1e2a":"transparent",color:socialTab===x[0]?GC:"#555",fontFamily:"inherit",fontWeight:700,fontSize:9,textTransform:"uppercase",transition:"all .15s"}}>{x[1]}</button>;})}
          </div>

          {/* DISCOVER */}
          {socialTab==="discover"&&(<div>
            {!socialLoaded&&<div style={{textAlign:"center",padding:"30px 0",color:"#555",fontSize:12}}>Loading...</div>}
            {socialLoaded&&suggested.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#555",fontSize:12}}>No new people to discover right now. Check back later!</div>}
            {suggested.map(function(u){return(
               <div key={u.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:13,padding:"13px",marginBottom:9}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:28,background:"#0a0a0f",borderRadius:"50%",width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
                    {AVATARS[u.avatar_index||0]}
                    <div style={{position:"absolute",bottom:-4,right:-4,background:getLevelInfo(u.xp||0).color,borderRadius:99,padding:"1px 5px",fontSize:8,fontWeight:700,color:"#0a0a0f",border:"1px solid #0a0a0f"}}>{getLevelInfo(u.xp||0).em}{getLevelInfo(u.xp||0).level}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{u.display_name||u.username||"User"}</div>
                    {u.bio&&<div style={{fontSize:11,color:"#666",marginTop:1}}>{u.bio}</div>}
                    <div style={{display:"flex",alignItems:"center",gap:5,marginTop:4,flexWrap:"wrap"}}>
                      <span style={{fontSize:9,background:getGoalColor(u.goal)+"22",color:getGoalColor(u.goal),borderRadius:99,padding:"2px 7px",fontWeight:700}}>{getGoalLabel(u.goal)}</span>
                      <span style={{fontSize:9,background:getLevelInfo(u.xp||0).color+"22",color:getLevelInfo(u.xp||0).color,borderRadius:99,padding:"2px 7px",fontWeight:700}}>{getLevelInfo(u.xp||0).title}</span>
                      {(u.streak||0)>0&&<span style={{fontSize:9,color:"#ff6b35"}}>🔥{u.streak}</span>}
                    </div>
                  </div>
                  <button onClick={()=>sendMatchReq(u.id)} style={{background:GC,border:"none",color:"#0a0a0f",borderRadius:9,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,flexShrink:0}}>Connect</button>
                </div>
              </div>
            );})}
          </div>)}

          {/* MATCHES */}
          {socialTab==="matches"&&(<div>
            {matches.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#555",fontSize:12}}>No matches yet. Discover people on the Discover tab!</div>}
            {matches.map(function(m){return(
              <div key={m.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:13,padding:"13px",marginBottom:9,cursor:"pointer"}} onClick={()=>openChat(m)}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:28,background:"#0a0a0f",borderRadius:"50%",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{AVATARS[m.partner.avatar_index||0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{m.partner.display_name||m.partner.username||"User"}</div>
                    {m.partner.bio&&<div style={{fontSize:11,color:"#666",marginTop:1}}>{m.partner.bio}</div>}
                    <span style={{fontSize:9,background:getGoalColor(m.partner.goal)+"22",color:getGoalColor(m.partner.goal),borderRadius:99,padding:"2px 7px",fontWeight:700,marginTop:4,display:"inline-block"}}>{getGoalLabel(m.partner.goal)}</span>
                  </div>
                  <div style={{fontSize:11,color:GC,fontWeight:700}}>Chat &rarr;</div>
                </div>
              </div>
            );})}
          </div>)}

          {/* REQUESTS */}
          {socialTab==="requests"&&(<div>
            {pendingIn.length>0&&(<div>
              <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:8}}>INCOMING REQUESTS</div>
              {pendingIn.map(function(r){return(
                <div key={r.id} style={{background:"#13131a",border:"1px solid "+GC+"33",borderRadius:13,padding:"13px",marginBottom:9}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{fontSize:28,background:"#0a0a0f",borderRadius:"50%",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{AVATARS[r.from_user.avatar_index||0]}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:14}}>{r.from_user.display_name||r.from_user.username||"User"}</div>
                      {r.from_user.bio&&<div style={{fontSize:11,color:"#666"}}>{r.from_user.bio}</div>}
                      <span style={{fontSize:9,background:getGoalColor(r.from_user.goal)+"22",color:getGoalColor(r.from_user.goal),borderRadius:99,padding:"2px 7px",fontWeight:700,marginTop:4,display:"inline-block"}}>{getGoalLabel(r.from_user.goal)}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>respondMatch(r.id,true)} style={{flex:1,background:GC,border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13}}>Accept</button>
                    <button onClick={()=>respondMatch(r.id,false)} style={{flex:1,background:"#1e1e2a",border:"1px solid #2a2a3a",color:"#888",borderRadius:9,padding:"9px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13}}>Decline</button>
                  </div>
                </div>
              );})}
            </div>)}
            {pendingOut.length>0&&(<div style={{marginTop:pendingIn.length>0?16:0}}>
              <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:8}}>SENT REQUESTS</div>
              {pendingOut.map(function(r){return(
                <div key={r.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:13,padding:"13px",marginBottom:9}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:28,background:"#0a0a0f",borderRadius:"50%",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{AVATARS[r.to_user.avatar_index||0]}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:14}}>{r.to_user.display_name||r.to_user.username||"User"}</div>
                      <span style={{fontSize:9,color:"#555"}}>Pending...</span>
                    </div>
                  </div>
                </div>
              );})}
            </div>)}
            {pendingIn.length===0&&pendingOut.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:"#555",fontSize:12}}>No pending requests</div>}
          </div>)}
        </div>)}

      </div>

      {showEx&&(<div className="overlay" onClick={function(e){if(e.target===e.currentTarget)closeEx();}}>
        <div className="modal">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:1}}>LOG EXERCISE</div><button onClick={closeEx} style={{background:"#1e1e2a",border:"none",color:"#e8e4dc",borderRadius:7,padding:"4px 9px",cursor:"pointer"}}>x</button></div>
          <div style={{display:"flex",gap:3,background:"#0a0a0f",borderRadius:8,padding:3,marginBottom:12}}>
            {[["log","Quick Log"],["custom","Custom"]].map(function(x){return <button key={x[0]} className="seg" onClick={()=>setExTab(x[0])} style={{background:exTab===x[0]?"#1e1e2a":"transparent",color:exTab===x[0]?"#e8e4dc":"#555"}}>{x[1]}</button>;})}
          </div>
          {exTab==="log"&&(<div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:11}}>
              {EX_DATA.map(function(ex){return <div key={ex.name} className={"exc "+(selEx&&selEx.name===ex.name?"on":"")} onClick={()=>setSelEx(ex)}><div style={{fontSize:17,marginBottom:2}}>{ex.em}</div><div style={{fontSize:11,fontWeight:700}}>{ex.name}</div><div style={{fontSize:9,color:"#555"}}>{ex.caloriesPerMin} kcal/min</div></div>;})}
            </div>
            {selEx&&(<div style={{marginBottom:11}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#555"}}>Duration</span><span style={{fontWeight:700,fontSize:12}}>{exDur} min - ~{Math.round(selEx.caloriesPerMin*exDur)} kcal</span></div><input type="range" min={5} max={120} step={5} value={exDur} onChange={e=>setExDur(+e.target.value)}/></div>)}
            <button className="btn" onClick={addW} disabled={!selEx} style={{background:selEx?GC:"#1e1e2a",color:selEx?"#0a0a0f":"#555"}}>Add Workout</button>
          </div>)}
          {exTab==="custom"&&(<div style={{display:"flex",flexDirection:"column",gap:8}}>
            <input className="inp" placeholder="Exercise name" value={custEx.name} onChange={e=>setCustEx(Object.assign({},custEx,{name:e.target.value}))}/>
            <input className="inp" type="number" placeholder="Duration (min)" value={custEx.dur} onChange={e=>setCustEx(Object.assign({},custEx,{dur:e.target.value}))}/>
            <input className="inp" type="number" placeholder="Calories burned" value={custEx.cal} onChange={e=>setCustEx(Object.assign({},custEx,{cal:e.target.value}))}/>
            <button className="btn" onClick={addCW} style={{background:GC,color:"#0a0a0f"}}>Add</button>
          </div>)}
        </div>
      </div>)}

      {showFood&&(<div className="overlay" onClick={function(e){if(e.target===e.currentTarget)closeFood();}}>
        <div className="modal">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:1}}>LOG MEAL</div><button onClick={closeFood} style={{background:"#1e1e2a",border:"none",color:"#e8e4dc",borderRadius:7,padding:"4px 9px",cursor:"pointer"}}>x</button></div>
          <div style={{display:"flex",gap:3,background:"#0a0a0f",borderRadius:8,padding:3,marginBottom:12}}>
            {[["recent","Recent"],["search","Search"],["browse","Browse"],["barcode","Barcode"],["custom","Custom"]].map(function(x){return <button key={x[0]} className="seg" onClick={()=>setFoodTab(x[0])} style={{background:foodTab===x[0]?(x[0]==="barcode"?"#e8a83e":x[0]==="search"||x[0]==="recent"?GC:"#1e1e2a"):"transparent",color:foodTab===x[0]?(x[0]==="barcode"||x[0]==="search"||x[0]==="recent"?"#0a0a0f":"#e8e4dc"):"#555",fontSize:9}}>{x[1]}</button>;})}
          </div>
          {foodTab==="recent"&&(<div style={{display:"flex",flexDirection:"column",gap:10}}>
            {/* Copy yesterday button */}
            {(()=>{
              var yest=new Date();yest.setDate(yest.getDate()-1);
              var yStr=yest.getFullYear()+"-"+String(yest.getMonth()+1).padStart(2,"0")+"-"+String(yest.getDate()).padStart(2,"0");
              var yMeals=meals.filter(function(m){return m.logged_at&&m.logged_at.startsWith(yStr);});
              if(!yMeals.length)return null;
              return(<button onClick={async function(){
                for(var i=0;i<yMeals.length;i++){
                  var m=yMeals[i];
                  var nowIso=new Date().toISOString();
                  var nm={id:Date.now()+i,name:m.name,em:m.em||EM.plate,cal:m.cal,protein:m.protein||0,carbs:m.carbs||0,fat:m.fat||0,servings:m.servings||1,per:m.per||"serving",meal_type:m.meal_type||"other",logged_at:nowIso,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
                  setMeals(function(prev){return prev.concat([nm]);});
                  try{await (supabase||sbClient).from("meals").insert({user_id:user.id,name:m.name,calories:m.cal,protein:m.protein||0,carbs:m.carbs||0,fat:m.fat||0,servings:m.servings||1,per_unit:m.per||"serving",meal_type:m.meal_type||"other",logged_at:nowIso});}catch(e){}
                }
                closeFood();
              }} style={{background:GC+"22",border:"1px solid "+GC+"44",color:GC,borderRadius:11,padding:"11px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,width:"100%"}}>
                Copy Yesterday ({yMeals.length} meals) &#8594;
              </button>);
            })()}
            {/* Quick Add */}
            <div style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:12,padding:"12px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#888",letterSpacing:1,marginBottom:8}}>QUICK ADD</div>
              <div style={{display:"flex",gap:7,marginBottom:7}}>
                <input className="inp" placeholder="Food name (optional)" value={quickAddName} onChange={function(e){setQuickAddName(e.target.value);}} style={{flex:2,fontSize:12}}/>
                <input className="inp" type="number" inputMode="numeric" placeholder="Calories" value={quickAddCal} onChange={function(e){setQuickAddCal(e.target.value);}} style={{flex:1,fontSize:12}}/>
              </div>
              <div style={{display:"flex",gap:7,marginBottom:8}}>
                <input className="inp" type="number" inputMode="decimal" placeholder="Protein g" value={quickAddP} onChange={function(e){setQuickAddP(e.target.value);}} style={{flex:1,fontSize:12}}/>
                <div style={{flex:2,fontSize:10,color:"#555",display:"flex",alignItems:"center"}}>Carbs & fat optional</div>
              </div>
              <button onClick={function(){
                if(!quickAddCal)return;
                addMeal({name:quickAddName||"Quick Add",em:EM.plate,calories:+quickAddCal,protein:+quickAddP||0,carbs:0,fat:0,per:"serving"},1);
              }} style={{width:"100%",background:"#e8a83e",border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13}}>
                Quick Add {quickAddCal?quickAddCal+" kcal":""}
              </button>
            </div>
            {/* Recent foods list */}
            <div style={{fontSize:10,fontWeight:700,color:"#555",letterSpacing:1}}>RECENTLY LOGGED</div>
            {recentFoods.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#555",fontSize:12}}>Foods you log will appear here for quick re-logging.</div>}
            {recentFoods.map(function(f){
              var sm=calcSearchMacros(f,f.lastGrams||100,"g");
              return(<div key={f.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:11,padding:"10px 12px",display:"flex",alignItems:"center",gap:9}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
                  {f.brand&&<div style={{fontSize:10,color:"#555"}}>{f.brand}</div>}
                  <div style={{fontSize:9,color:"#888",marginTop:2}}>{f.lastGrams}g &middot; {f.lastCal} kcal &middot; P:{f.lastProtein}g</div>
                </div>
                <button onClick={function(){
                  addMeal({name:f.name,em:EM.plate,calories:f.lastCal,protein:f.lastProtein,carbs:f.lastCarbs,fat:f.lastFat,per:f.lastGrams+"g"},1);
                }} style={{background:GC,border:"none",color:"#0a0a0f",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:11,flexShrink:0}}>Log Again</button>
              </div>);
            })}
          </div>)}
          {foodTab==="search"&&(<div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:8}}>
              <input className="inp" placeholder="Search any food or restaurant item..." value={foodSearch}
                onChange={function(e){setFoodSearch(e.target.value);}}
                onKeyDown={function(e){if(e.key==="Enter")searchFoods(foodSearch);}}
                style={{flex:1}}/>
              <button onClick={function(){searchFoods(foodSearch);}} style={{background:GC,border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,flexShrink:0}}>Go</button>
            </div>
            {/* Restaurant quick chips */}
            {!selSearchFood&&(<div>
              <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:6}}>POPULAR RESTAURANTS</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                {[
                  {name:"Chipotle",icon:"&#127798;"},
                  {name:"McDonald's",icon:"&#127828;"},
                  {name:"Chick-fil-A",icon:"&#127831;"},
                  {name:"Starbucks",icon:"&#9749;"},
                  {name:"Subway",icon:"&#129365;"},
                  {name:"Panera",icon:"&#127838;"},
                  {name:"Dominos",icon:"&#127829;"},
                  {name:"Chili's",icon:"&#127798;"},
                  {name:"Olive Garden",icon:"&#127837;"},
                  {name:"Sweetgreen",icon:"&#129367;"},
                ].map(function(r){return(
                  <button key={r.name} onClick={function(){
                    setFoodSearch(r.name);
                    // Use local menu DB if available, otherwise search API
                    var localResults=getRestaurantResults(r.name);
                    if(localResults.length>0){
                      setFoodSearchResults(localResults);
                      setFoodSearchLoading(false);
                    } else {
                      searchFoods(r.name);
                    }
                  }} style={{
                    display:"flex",alignItems:"center",gap:4,
                    background:foodSearch===r.name?"#1e1e2a":"#13131a",
                    border:"1px solid "+(foodSearch===r.name?GC:"#2a2a3a"),
                    color:foodSearch===r.name?GC:"#888",
                    borderRadius:99,padding:"5px 10px",cursor:"pointer",
                    fontFamily:"inherit",fontWeight:600,fontSize:11,
                    transition:"all .15s",
                  }}>
                    <span dangerouslySetInnerHTML={{__html:r.icon}}/>
                    {r.name}
                  </button>
                );})}
              </div>
              <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:6}}>COMMON FOODS</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                {["Chicken Breast","Greek Yogurt","Eggs","Oatmeal","Salmon","Ground Beef","Cottage Cheese","Protein Shake","Sweet Potato","Avocado"].map(function(f){return(
                  <button key={f} onClick={function(){
                    setFoodSearch(f);
                    searchFoods(f);
                  }} style={{
                    background:"#13131a",border:"1px solid #2a2a3a",
                    color:"#888",borderRadius:99,padding:"5px 10px",
                    cursor:"pointer",fontFamily:"inherit",fontSize:11,
                    transition:"all .15s",
                  }}>{f}</button>
                );})}
              </div>
            </div>)}
            {foodSearchLoading&&<div style={{textAlign:"center",padding:"20px 0",color:"#555",fontSize:12}}>Searching...</div>}
            {!foodSearchLoading&&foodSearch.length>1&&foodSearchResults.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#555",fontSize:12}}>No results. Try a different term.</div>}
            {foodSearchResults.length>0&&!selSearchFood&&(<div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:320,overflowY:"auto"}}>
              {foodSearchResults.map(function(f){return(
                <div key={f.id} onClick={function(){setSelSearchFood(f);setSearchGrams(100);setSearchUnit("g");}}
                  style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:11,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:9}}>
                  {f.image?<img src={f.image} alt="" style={{width:36,height:36,borderRadius:7,objectFit:"contain",background:"#fff",padding:2,flexShrink:0}}/>:<div style={{width:36,height:36,borderRadius:7,background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>&#127869;</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
                    {f.brand&&<div style={{fontSize:10,color:"#555"}}>{f.brand}</div>}
                    <div style={{fontSize:9,color:"#888",marginTop:2}}>per 100g: {f.cal100} kcal &middot; P:{f.protein100}g &middot; C:{f.carbs100}g &middot; F:{f.fat100}g</div>
                  </div>
                  <div style={{fontSize:10,fontWeight:700,color:"#e8a83e",flexShrink:0,textAlign:"right"}}>{f.cal100}<br/><span style={{fontSize:8,color:"#555",fontWeight:400}}>kcal/100g</span></div>
                </div>
              );})}
            </div>)}
            {selSearchFood&&(()=>{
              var sm=calcSearchMacros(selSearchFood,searchGrams,searchUnit);
              return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{background:"#0a0a0f",borderRadius:12,padding:13}}>
                  <div style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:10}}>
                    {selSearchFood.image?<img src={selSearchFood.image} alt="" style={{width:44,height:44,borderRadius:8,objectFit:"contain",background:"#fff",padding:2,flexShrink:0}}/>:<div style={{width:44,height:44,borderRadius:8,background:"#13131a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>&#127869;</div>}
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13}}>{selSearchFood.name}</div>
                      {selSearchFood.brand&&<div style={{fontSize:10,color:"#555"}}>{selSearchFood.brand}</div>}
                    </div>
                    <button onClick={function(){setSelSearchFood(null);}} style={{background:"#1e1e2a",border:"none",color:"#888",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontFamily:"inherit",fontSize:11}}>Back</button>
                  </div>
                  {/* Smart serving size quick buttons */}
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                    {getServingSizes(selSearchFood).map(function(sz){
                      var isActive=searchGrams===sz.grams&&searchUnit===sz.unit;
                      return(<button key={sz.label} onClick={function(){setSearchGrams(sz.grams);setSearchUnit(sz.unit);}} style={{background:isActive?GC+"22":"#13131a",border:"1px solid "+(isActive?GC:"#2a2a3a"),color:isActive?GC:"#888",borderRadius:99,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:isActive?700:400}}>{sz.label}</button>);
                    })}
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:9,color:"#555",marginBottom:4}}>CUSTOM AMOUNT</div>
                      <input className="inp" type="number" inputMode="decimal" value={searchGrams}
                        onChange={function(e){setSearchGrams(Math.max(1,+e.target.value||1));}}
                        style={{fontSize:20,fontWeight:700,textAlign:"center",padding:"8px",borderColor:GC}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {["g","oz"].map(function(u){return(
                        <button key={u} onClick={function(){
                          if(u===searchUnit)return;
                          var ng=u==="oz"?Math.round(searchGrams/28.35*10)/10:Math.round(searchGrams*28.35);
                          setSearchGrams(ng);setSearchUnit(u);
                        }} style={{background:searchUnit===u?GC:"#1e1e2a",border:"1px solid "+(searchUnit===u?GC:"#2a2a3a"),color:searchUnit===u?"#0a0a0f":"#888",borderRadius:7,padding:"5px 14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13}}>{u}</button>
                      );})}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:10}}>
                    {[["KCAL",sm.cal,"#e8a83e"],["P",sm.protein+"g","#c8f53e"],["C",sm.carbs+"g","#e8a83e"],["F",sm.fat+"g","#3eb8f5"]].map(function(x){return(
                      <div key={x[0]} style={{background:"#13131a",borderRadius:8,padding:"8px",textAlign:"center"}}>
                        <div style={{fontSize:8,color:"#555",marginBottom:2}}>{x[0]}</div>
                        <div style={{fontSize:15,fontWeight:700,color:x[2]}}>{x[1]}</div>
                      </div>
                    );})}
                  </div>
                  <div style={{fontSize:9,color:"#555",textAlign:"center",marginBottom:10}}>{searchGrams}{searchUnit} of {selSearchFood.name}</div>
                  <div style={{display:"flex",gap:4,marginBottom:4}}>
                    {["breakfast","lunch","dinner","snack","other"].map(function(t){return(
                      <button key={t} onClick={()=>setMealType(t)} style={{flex:1,padding:"4px 0",borderRadius:6,border:"1px solid "+(mealType===t?"#e8a83e":"#2a2a3a"),background:mealType===t?"#e8a83e22":"transparent",color:mealType===t?"#e8a83e":"#555",fontFamily:"inherit",fontWeight:700,fontSize:8,textTransform:"capitalize",cursor:"pointer"}}>{t}</button>
                    );})}
                  </div>
                </div>
                <button className="btn" onClick={function(){
                  var sm2=calcSearchMacros(selSearchFood,searchGrams,searchUnit);
                  saveRecentFood(selSearchFood,searchGrams,searchUnit,sm2.cal,sm2.protein,sm2.carbs,sm2.fat);
                  addMeal({name:selSearchFood.name+(selSearchFood.brand?" ("+selSearchFood.brand+")":""),em:EM.plate,calories:sm2.cal,protein:sm2.protein,carbs:sm2.carbs,fat:sm2.fat,per:searchGrams+searchUnit},1);
                }} style={{background:"#e8a83e",color:"#0a0a0f"}}>Log {sm.cal} kcal &rarr;</button>
              </div>);
            })()}
          </div>)}
          {foodTab==="browse"&&(<div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:11}}>
              {FOOD_DATA.map(function(f){return <div key={f.name} className={"exc "+(selFood&&selFood.name===f.name?"on":"")} onClick={()=>setSelFood(f)}><div style={{fontSize:17,marginBottom:2}}>{f.em}</div><div style={{fontSize:11,fontWeight:700}}>{f.name}</div><div style={{fontSize:9,color:"#555"}}>{f.calories} kcal/{f.per}</div></div>;})}
            </div>
            {selFood&&(<div style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#555"}}>Servings</span><span style={{fontWeight:700,fontSize:12}}>{foodSrv}x - {Math.round(selFood.calories*foodSrv)} kcal</span></div>
              <input type="range" min={0.5} max={5} step={0.5} value={foodSrv} onChange={e=>setFoodSrv(+e.target.value)}/>
              <div style={{display:"flex",gap:4,marginTop:7}}>
                {[["P",Math.round(selFood.protein*foodSrv),"#c8f53e"],["C",Math.round(selFood.carbs*foodSrv),"#e8a83e"],["F",Math.round(selFood.fat*foodSrv),"#3eb8f5"]].map(function(x){return <div key={x[0]} style={{flex:1,background:"#0a0a0f",borderRadius:7,padding:"5px",textAlign:"center"}}><div style={{fontSize:8,color:"#555"}}>{x[0]}</div><div style={{fontSize:12,fontWeight:700,color:x[2]}}>{x[1]}g</div></div>;})}
              </div>
            </div>)}
            <div style={{display:"flex",gap:4,marginBottom:8}}>
              {["breakfast","lunch","dinner","snack","other"].map(function(t){return(
                <button key={t} onClick={()=>setMealType(t)} style={{flex:1,padding:"4px 0",borderRadius:6,border:"1px solid "+(mealType===t?"#e8a83e":"#2a2a3a"),background:mealType===t?"#e8a83e22":"transparent",color:mealType===t?"#e8a83e":"#555",fontFamily:"inherit",fontWeight:700,fontSize:8,textTransform:"capitalize",cursor:"pointer"}}>{t}</button>
              );})}
            </div>
            <button className="btn" onClick={()=>addMeal(selFood,foodSrv)} disabled={!selFood} style={{background:selFood?"#e8a83e":"#1e1e2a",color:selFood?"#0a0a0f":"#555"}}>Add Meal</button>
          </div>)}
          {foodTab==="barcode"&&(<div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div style={{fontSize:11,color:"#888",textAlign:"center",lineHeight:1.6}}>Look up any packaged food by barcode number.</div>
            <div style={{display:"flex",gap:8}}>
              <input className="inp" type="number" inputMode="numeric" placeholder="Enter barcode number..." value={barInput} onChange={function(e){setBarInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")lookupBarcode(barInput);}} style={{flex:1}}/>
              <button onClick={function(){lookupBarcode(barInput);}} style={{background:"#e8a83e",border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,flexShrink:0}}>Search</button>
            </div>
            <div style={{display:"flex",gap:8}}>
              <input ref={barRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={function(e){
                var file=e.target.files&&e.target.files[0];if(!file)return;
                setBarState("scanning");
                // Try BarcodeDetector API first (Chrome/Android)
                if(typeof BarcodeDetector!=="undefined"){
                  var img=new Image();
                  img.onload=function(){
                    var bd=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128","code_39","itf"]});
                    bd.detect(img).then(function(codes){
                      if(codes&&codes.length>0){setBarInput(codes[0].rawValue);lookupBarcode(codes[0].rawValue);}
                      else{setBarState("nosupport");}
                    }).catch(function(){setBarState("nosupport");});
                    URL.revokeObjectURL(img.src);
                  };
                  img.onerror=function(){setBarState("error");};
                  img.src=URL.createObjectURL(file);
                } else {
                  // BarcodeDetector not available (Safari/iOS) - show manual entry hint
                  setBarState("nosupport");
                }
              }}/>
              <button onClick={function(){
                if(barRef.current){
                  barRef.current.value="";
                  barRef.current.click();
                }
              }} style={{flex:1,background:"#1e1e2a",border:"1px solid #2a2a3a",color:"#e8e4dc",borderRadius:9,padding:"10px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12}}>📷 Scan Barcode</button>
            </div>
            {barState==="nosupport"&&(<div style={{background:"#1a1a2a",border:"1px solid #3eb8f544",borderRadius:11,padding:"12px 14px"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:4,color:"#3eb8f5"}}>Camera scan not supported on Safari</div>
              <div style={{fontSize:11,color:"#888",lineHeight:1.6}}>iPhone Safari doesn't support barcode detection. Find the barcode number printed under the lines on your product and type it above — it's usually 12-13 digits.</div>
            </div>)}
            {barState==="scanning"&&<div style={{textAlign:"center",padding:"20px 0",color:"#555",fontSize:12}}>Looking up product...</div>}
            {barState==="notfound"&&<div style={{background:"#2a2010",border:"1px solid #e8a83e44",borderRadius:11,padding:"12px 14px",textAlign:"center",fontSize:12,color:"#e8a83e"}}>Product not found</div>}
            {barState==="error"&&<div style={{background:"#2a1515",border:"1px solid #ff555544",borderRadius:11,padding:"12px 14px",textAlign:"center",fontSize:12,color:"#ff8888"}}>Lookup failed</div>}
            {barState==="result"&&barResult&&(<div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{background:"#0a0a0f",borderRadius:12,padding:13}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                  {barResult.image&&<img src={barResult.image} alt="" style={{width:52,height:52,borderRadius:8,objectFit:"contain",background:"#fff",padding:2,flexShrink:0}}/>}
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{barResult.name}</div>{barResult.brand&&<div style={{fontSize:11,color:"#555"}}>{barResult.brand}</div>}<div style={{fontSize:10,color:"#555",marginTop:2}}>Per: {barResult.serving}</div></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
                  {[["KCAL",Math.round(barResult.calories*barSrv),"#e8a83e"],["P",Math.round(barResult.protein*barSrv*10)/10+"g","#c8f53e"],["C",Math.round(barResult.carbs*barSrv*10)/10+"g","#e8a83e"],["F",Math.round(barResult.fat*barSrv*10)/10+"g","#3eb8f5"]].map(function(x){return <div key={x[0]} style={{background:"#13131a",borderRadius:8,padding:"6px",textAlign:"center"}}><div style={{fontSize:8,color:"#555"}}>{x[0]}</div><div style={{fontSize:13,fontWeight:700,color:x[2]}}>{x[1]}</div></div>;})}
                </div>
              </div>
              <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#555"}}>Servings</span><span style={{fontWeight:700,fontSize:12}}>{barSrv}x</span></div><input type="range" min={0.5} max={10} step={0.5} value={barSrv} onChange={function(e){setBarSrv(+e.target.value);}} style={{accentColor:"#e8a83e",width:"100%"}}/></div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn" onClick={function(){addMeal({name:barResult.name,em:EM.plate,calories:barResult.calories,protein:barResult.protein,carbs:barResult.carbs,fat:barResult.fat,per:barResult.serving},barSrv);}} style={{background:"#e8a83e",color:"#0a0a0f",flex:2}}>Log {Math.round(barResult.calories*barSrv)} kcal</button>
                <button className="btn" onClick={function(){setBarState("idle");setBarResult(null);setBarInput("");}} style={{background:"#1e1e2a",color:"#888",flex:1}}>Clear</button>
              </div>
            </div>)}
          </div>)}
          {foodTab==="custom"&&(<div style={{display:"flex",flexDirection:"column",gap:8}}>
            <input className="inp" placeholder="Food name" value={custFood.name} onChange={e=>setCustFood(Object.assign({},custFood,{name:e.target.value}))}/>
            <input className="inp" type="number" placeholder="Calories" value={custFood.cal||""} onChange={e=>setCustFood(Object.assign({},custFood,{cal:e.target.value}))}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
              <input className="inp" type="number" placeholder="Protein g" value={custFood.p||""} onChange={e=>setCustFood(Object.assign({},custFood,{p:e.target.value}))}/>
              <input className="inp" type="number" placeholder="Carbs g" value={custFood.c||""} onChange={e=>setCustFood(Object.assign({},custFood,{c:e.target.value}))}/>
              <input className="inp" type="number" placeholder="Fat g" value={custFood.f||""} onChange={e=>setCustFood(Object.assign({},custFood,{f:e.target.value}))}/>
            </div>
            <button className="btn" onClick={addCM} style={{background:"#e8a83e",color:"#0a0a0f"}}>Add Meal</button>
          </div>)}
        </div>
      </div>)}
    </div>
  );
}
