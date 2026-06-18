import { useState, useRef, useEffect } from "react";

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


//  Detailed muscle activation data 
// Keys are individual muscle heads for maximum anatomical detail
var MUSCLE_ACT = {
  // CHEST
  "Bench Press":         {"Pec Major (Sternal)":55,"Pec Major (Clavicular)":20,"Ant Deltoid":15,"Tricep Long Head":10},
  "Incline DB Press":    {"Pec Major (Clavicular)":50,"Pec Major (Sternal)":20,"Ant Deltoid":20,"Tricep Lateral Head":10},
  "Decline Bench Press": {"Pec Major (Sternal)":65,"Pec Minor":15,"Tricep Long Head":12,"Ant Deltoid":8},
  "Cable Fly":           {"Pec Major (Sternal)":60,"Pec Major (Clavicular)":25,"Pec Minor":10,"Bicep Short Head":5},
  "Pec Deck":            {"Pec Major (Sternal)":65,"Pec Major (Clavicular)":25,"Pec Minor":10},
  "Push-ups":            {"Pec Major (Sternal)":45,"Pec Major (Clavicular)":15,"Tricep Long Head":20,"Ant Deltoid":15,"Serratus Anterior":5},
  "Chest Dips":          {"Pec Major (Sternal)":50,"Pec Minor":15,"Tricep Long Head":20,"Ant Deltoid":10,"Rhomboids":5},
  "DB Pullover":         {"Pec Major (Sternal)":35,"Lat Dorsi":30,"Tricep Long Head":20,"Teres Major":15},
  "Landmine Press":      {"Pec Major (Clavicular)":45,"Ant Deltoid":30,"Tricep Lateral Head":15,"Serratus Anterior":10},
  // BACK
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
  // SHOULDERS
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
  // BICEP - most detailed
  "Barbell Curl":        {"Bicep Long Head":45,"Bicep Short Head":35,"Brachialis":15,"Brachioradialis":5},
  "Incline DB Curl":     {"Bicep Long Head":55,"Bicep Short Head":25,"Brachialis":15,"Brachioradialis":5},
  "Hammer Curl":         {"Brachioradialis":40,"Brachialis":30,"Bicep Long Head":20,"Bicep Short Head":10},
  "Concentration Curl":  {"Bicep Short Head":55,"Bicep Long Head":30,"Brachialis":15},
  "Cable Curl":          {"Bicep Long Head":40,"Bicep Short Head":35,"Brachialis":15,"Brachioradialis":10},
  "Preacher Curl":       {"Bicep Short Head":50,"Bicep Long Head":30,"Brachialis":20},
  "Spider Curl":         {"Bicep Long Head":50,"Bicep Short Head":30,"Brachialis":20},
  "Reverse Curl":        {"Brachioradialis":50,"Brachialis":25,"Bicep Long Head":15,"Ext Carpi Radialis":10},
  "21s Curl":            {"Bicep Long Head":40,"Bicep Short Head":35,"Brachialis":15,"Brachioradialis":10},
  // TRICEP - detailed heads
  "Tricep Pushdown":     {"Tricep Lateral Head":50,"Tricep Medial Head":30,"Tricep Long Head":20},
  "Skull Crushers":      {"Tricep Long Head":45,"Tricep Lateral Head":30,"Tricep Medial Head":25},
  "Overhead Tricep Ext": {"Tricep Long Head":65,"Tricep Lateral Head":20,"Tricep Medial Head":15},
  "Tricep Dips":         {"Tricep Long Head":35,"Tricep Lateral Head":25,"Pec Major (Sternal)":25,"Ant Deltoid":15},
  "Close-Grip Bench":    {"Tricep Lateral Head":35,"Tricep Medial Head":25,"Tricep Long Head":20,"Pec Major (Sternal)":20},
  "Rope Pushdown":       {"Tricep Lateral Head":45,"Tricep Medial Head":35,"Tricep Long Head":20},
  "Kickback":            {"Tricep Long Head":40,"Tricep Lateral Head":35,"Tricep Medial Head":25},
  "Diamond Push-up":     {"Tricep Lateral Head":35,"Tricep Long Head":30,"Tricep Medial Head":20,"Pec Major (Sternal)":15},
  "Tate Press":          {"Tricep Long Head":50,"Tricep Lateral Head":30,"Tricep Medial Head":20},
  // FOREARM
  "Wrist Curl":          {"Flex Carpi Radialis":40,"Flex Carpi Ulnaris":35,"Palmaris Longus":25},
  "Reverse Wrist Curl":  {"Ext Carpi Radialis":45,"Ext Carpi Ulnaris":35,"Brachioradialis":20},
  "Farmers Carry":       {"Flex Digitorum":30,"Brachioradialis":25,"Upper Trap":20,"Rhomboids":15,"Obliques":10},
  "Dead Hang":           {"Flex Digitorum":35,"Brachioradialis":25,"Lat Dorsi":25,"Teres Major":15},
  "Plate Pinch":         {"Flex Digitorum":50,"Lumbricals":30,"Interossei":20},
  "Towel Pull-up":       {"Flex Digitorum":35,"Brachioradialis":20,"Lat Dorsi":25,"Bicep Long Head":20},
  "Pronation/Supination":{"Pronator Teres":45,"Supinator":40,"Brachioradialis":15},
  "Barbell Finger Roll":  {"Flex Digitorum":55,"Lumbricals":25,"Palmaris Longus":20},
  "Rice Bucket":         {"Ext Digitorum":35,"Flex Digitorum":30,"Interossei":20,"Lumbricals":15},
  // GLUTE - detailed
  "Hip Thrust":          {"Glute Max":60,"Glute Med":15,"Bicep Femoris (Long)":15,"Erector Spinae":10},
  "Glute Bridge":        {"Glute Max":65,"Glute Med":15,"Bicep Femoris (Long)":15,"Transverse Abdominis":5},
  "Cable Kickback":      {"Glute Max":70,"Glute Med":15,"Bicep Femoris (Long)":15},
  "Sumo Squat":          {"Glute Max":35,"Glute Med":20,"Adductor Magnus":20,"Quad (Vastus Med)":15,"Bicep Femoris (Short)":10},
  "Bulgarian Split Squat":{"Glute Max":40,"Quad (Rectus Femoris)":30,"Bicep Femoris (Long)":20,"Glute Med":10},
  "Donkey Kick":         {"Glute Max":75,"Glute Med":15,"Bicep Femoris (Long)":10},
  "Step Up":             {"Glute Max":35,"Quad (Vastus Lat)":30,"Glute Med":20,"Bicep Femoris (Long)":15},
  "Lateral Band Walk":   {"Glute Med":55,"Glute Min":25,"TFL":15,"Glute Max":5},
  // HAMSTRING - detailed
  "Lying Leg Curl":      {"Bicep Femoris (Short)":35,"Bicep Femoris (Long)":30,"Semimembranosus":20,"Semitendinosus":15},
  "Romanian Deadlift":   {"Bicep Femoris (Long)":35,"Semimembranosus":25,"Glute Max":25,"Erector Spinae":15},
  "Nordic Curl":         {"Bicep Femoris (Long)":35,"Semimembranosus":30,"Semitendinosus":20,"Glute Max":15},
  "Seated Leg Curl":     {"Bicep Femoris (Short)":30,"Semimembranosus":30,"Semitendinosus":25,"Bicep Femoris (Long)":15},
  "Good Morning":        {"Bicep Femoris (Long)":30,"Semimembranosus":25,"Erector Spinae":25,"Glute Max":20},
  "Stability Ball Curl": {"Bicep Femoris (Long)":30,"Semimembranosus":25,"Semitendinosus":25,"Glute Max":20},
  "Single Leg RDL":      {"Bicep Femoris (Long)":35,"Semimembranosus":25,"Glute Max":25,"Erector Spinae":15},
  "Sumo Deadlift":       {"Glute Max":30,"Bicep Femoris (Long)":25,"Adductor Magnus":20,"Erector Spinae":15,"Quad (Vastus Med)":10},
  "Glute Ham Raise":     {"Bicep Femoris (Long)":40,"Semimembranosus":25,"Semitendinosus":20,"Glute Max":15},
  // QUAD - detailed
  "Squat":               {"Quad (Vastus Lat)":20,"Quad (Rectus Femoris)":15,"Quad (Vastus Med)":15,"Glute Max":25,"Bicep Femoris (Long)":15,"Erector Spinae":10},
  "Leg Press":           {"Quad (Vastus Lat)":25,"Quad (Rectus Femoris)":15,"Quad (Vastus Med)":15,"Glute Max":25,"Bicep Femoris (Short)":20},
  "Leg Extension":       {"Quad (Rectus Femoris)":35,"Quad (Vastus Lat)":25,"Quad (Vastus Med)":25,"Quad (Vastus Int)":15},
  "Hack Squat":          {"Quad (Vastus Med)":30,"Quad (Rectus Femoris)":25,"Quad (Vastus Lat)":25,"Glute Max":20},
  "Walking Lunge":       {"Quad (Rectus Femoris)":25,"Glute Max":25,"Quad (Vastus Lat)":20,"Bicep Femoris (Long)":15,"Glute Med":15},
  "Front Squat":         {"Quad (Rectus Femoris)":30,"Quad (Vastus Med)":25,"Quad (Vastus Lat)":25,"Glute Max":20},
  "Bulgarian Split Squat":{"Quad (Rectus Femoris)":30,"Glute Max":30,"Quad (Vastus Lat)":20,"Bicep Femoris (Long)":20},
  "Sissy Squat":         {"Quad (Rectus Femoris)":45,"Quad (Vastus Lat)":25,"Quad (Vastus Med)":20,"Quad (Vastus Int)":10},
  "Step Up":             {"Quad (Vastus Lat)":30,"Glute Max":25,"Quad (Rectus Femoris)":25,"Glute Med":20},
  // CALF - detailed
  "Standing Calf Raise": {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Seated Calf Raise":   {"Soleus":65,"Gastrocnemius (Med)":20,"Gastrocnemius (Lat)":15},
  "Single-Leg Raise":    {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Donkey Calf Raise":   {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":30,"Soleus":25},
  "Box Jump":            {"Gastrocnemius (Med)":25,"Gastrocnemius (Lat)":20,"Quad (Vastus Lat)":25,"Glute Max":20,"Soleus":10},
  "Leg Press Calf Raise":{"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Smith Calf Raise":    {"Gastrocnemius (Med)":45,"Gastrocnemius (Lat)":35,"Soleus":20},
  "Ankle Hops":          {"Gastrocnemius (Med)":40,"Gastrocnemius (Lat)":30,"Soleus":20,"Tibialis Anterior":10},
  // CORE - detailed
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
  // CARDIO
  "Treadmill Run":       {"Quad (Rectus Femoris)":25,"Gastrocnemius (Med)":20,"Glute Max":20,"Bicep Femoris (Long)":20,"Soleus":15},
  "Rowing Machine":      {"Erector Spinae":25,"Quad (Vastus Lat)":20,"Bicep Femoris (Long)":15,"Rhomboids":20,"Bicep Short Head":10,"Obliques":10},
  "Jump Rope":           {"Gastrocnemius (Med)":30,"Soleus":25,"Quad (Vastus Lat)":20,"Mid Deltoid":15,"Obliques":10},
  "Bike Intervals":      {"Quad (Rectus Femoris)":30,"Quad (Vastus Lat)":20,"Bicep Femoris (Long)":20,"Glute Max":20,"Gastrocnemius (Med)":10},
  "Stair Climber":       {"Glute Max":30,"Quad (Vastus Lat)":25,"Bicep Femoris (Long)":20,"Gastrocnemius (Med)":15,"Glute Med":10},
  "Romanian Deadlift":   {"Bicep Femoris (Long)":35,"Semimembranosus":25,"Glute Max":25,"Erector Spinae":15},
};

// Color map: group anatomically related muscles by color family
var MUSCLE_COLOR = {
  // Chest family - orange
  "Pec Major (Sternal)":"#ff6b35","Pec Major (Clavicular)":"#ff8c5a","Pec Minor":"#ffb07a","Serratus Anterior":"#ffcc99",
  // Back family - blue
  "Lat Dorsi":"#3eb8f5","Rhomboids":"#5cc8ff","Erector Spinae":"#2a9fd6","Trap (Mid)":"#7dd8ff","Trap (Upper)":"#a0e4ff","Lower Trap":"#1a7fa6","Teres Major":"#4fb0e0","Teres Minor":"#80c8e8","Infraspinatus":"#2288bb",
  // Shoulder family - purple
  "Ant Deltoid":"#b03ef5","Mid Deltoid":"#c86aff","Post Deltoid":"#8a20d4","Supraspinatus":"#d490ff","Upper Trap":"#9040d0","Levator Scapulae":"#bb70ff",
  // Bicep family - green shades
  "Bicep Long Head":"#c8f53e","Bicep Short Head":"#a8d420","Brachialis":"#7aaa10","Brachioradialis":"#e8ff70","Bicep Short Head":"#b8e030",
  // Tricep family - yellow shades
  "Tricep Long Head":"#f5c842","Tricep Lateral Head":"#ffd966","Tricep Medial Head":"#e0aa20",
  // Forearm family - amber
  "Flex Carpi Radialis":"#e8a83e","Flex Carpi Ulnaris":"#d49020","Palmaris Longus":"#f0b850","Ext Carpi Radialis":"#ffa020","Ext Carpi Ulnaris":"#cc8010","Pronator Teres":"#e09830","Supinator":"#f5b040","Flex Digitorum":"#d08020","Ext Digitorum":"#c07010","Lumbricals":"#b06010","Interossei":"#a05010",
  // Quad family - red shades
  "Quad (Rectus Femoris)":"#ff4040","Quad (Vastus Lat)":"#ff6060","Quad (Vastus Med)":"#ff2020","Quad (Vastus Int)":"#e03030","Adductor Magnus":"#ff8080",
  // Hamstring family - teal
  "Bicep Femoris (Long)":"#3ef5b0","Bicep Femoris (Short)":"#20d490","Semimembranosus":"#10b070","Semitendinosus":"#60ffc0",
  // Glute family - pink
  "Glute Max":"#f53eb0","Glute Med":"#ff60c0","Glute Min":"#e020a0","TFL":"#ff80d0",
  // Calf family - red
  "Gastrocnemius (Med)":"#f53e3e","Gastrocnemius (Lat)":"#ff6060","Soleus":"#cc2020","Tibialis Anterior":"#ff8080",
  // Core family - cyan
  "Rectus Abdominis":"#3ef5f5","Obliques":"#20d4d4","Transverse Abdominis":"#10b0b0","Hip Flexors":"#60ffff",
};

// SVG path data for detailed anatomical diagram - dual view (front + back side by side)
var SVG_PATHS = {
  //  FRONT VIEW (left side of SVG, x: 2-52) 
  // Head
  head_front: "M22,2 Q27,-1 32,2 Q36,5 36,12 Q36,20 27,22 Q18,20 18,12 Q18,5 22,2 Z",
  neck_front: "M23,22 Q27,21 31,22 L30,27 Q27,28 24,27 Z",
  // Chest
  "Pec Major (Clavicular)": "M10,30 Q27,26 33,30 L32,40 Q27,42 18,40 Q12,38 10,33 Z",
  "Pec Major (Sternal)":    "M10,33 Q18,40 32,40 L31,52 Q27,54 18,52 Q11,49 10,43 Z",
  "Pec Minor":              "M18,35 Q27,32 33,35 L32,45 Q27,46 19,45 Z",
  "Serratus Anterior":      "M9,38 L13,38 L12,55 L8,52 Z M33,38 L37,38 L36,55 L32,52 Z",
  // Shoulders (front)
  "Ant Deltoid":    "M6,28 Q10,24 14,27 L14,38 Q9,40 5,37 Z M38,28 Q42,24 46,27 L46,38 Q41,40 37,37 Z",
  "Mid Deltoid":    "M3,36 Q7,32 10,36 L9,46 Q5,48 2,45 Z M43,36 Q47,32 50,36 L49,46 Q45,48 42,45 Z",
  // Core/Abs
  "Rectus Abdominis":"M17,52 Q27,50 34,52 L33,72 Q27,74 20,72 Z",
  "Obliques":       "M10,50 Q17,52 17,72 L14,76 Q7,70 8,55 Z M37,50 Q44,55 43,76 L40,72 Q40,52 34,52 Z",
  "Transverse Abdominis":"M17,62 Q27,60 34,62 L33,72 Q27,73 20,72 Z",
  // Bicep (front)
  "Bicep Long Head":  "M3,44 Q6,42 8,44 L9,60 Q6,62 3,60 Z M44,44 Q47,42 49,44 L48,60 Q45,62 43,60 Z",
  "Bicep Short Head": "M6,44 Q9,42 11,45 L11,60 Q8,62 6,60 Z M41,44 Q44,42 46,45 L45,60 Q42,62 41,60 Z",
  "Brachialis":       "M4,58 Q8,56 11,59 L10,66 Q7,67 4,65 Z M41,58 Q45,56 48,59 L47,66 Q44,67 41,65 Z",
  // Forearm (front)
  "Brachioradialis":       "M4,64 Q7,62 10,65 L9,80 Q6,81 3,79 Z M42,64 Q45,62 48,65 L47,80 Q44,81 41,79 Z",
  "Flex Carpi Radialis":   "M5,78 Q7,76 9,78 L8,90 Q6,91 4,89 Z M43,78 Q45,76 47,78 L46,90 Q44,91 42,89 Z",
  "Flex Carpi Ulnaris":    "M3,78 Q5,76 6,79 L5,90 Q3,91 2,89 Z M46,78 Q48,76 49,79 L48,90 Q46,91 45,89 Z",
  "Palmaris Longus":       "M6,80 Q8,78 9,80 L8,90 Q7,91 6,90 Z M43,80 Q45,78 46,80 L45,90 Q44,91 43,90 Z",
  "Ext Carpi Radialis":    "M6,64 Q8,62 10,65 L10,80 Q8,81 6,79 Z M42,64 Q44,62 46,65 L45,80 Q43,81 42,79 Z",
  "Pronator Teres":        "M7,64 Q10,62 12,65 L11,72 Q8,73 6,71 Z M40,64 Q43,62 45,65 L44,72 Q41,73 40,71 Z",
  "Flex Digitorum":        "M4,88 Q7,86 10,88 L9,96 Q6,97 3,95 Z M42,88 Q45,86 48,88 L47,96 Q44,97 41,95 Z",
  "Ext Digitorum":         "M5,88 Q7,86 9,88 L8,96 Q6,97 5,95 Z M43,88 Q45,86 47,88 L46,96 Q44,97 43,95 Z",
  // Quads (front)
  "Quad (Rectus Femoris)": "M19,78 Q22,76 25,78 L24,104 Q21,106 18,104 Z M27,78 Q30,76 33,78 L32,104 Q29,106 26,104 Z",
  "Quad (Vastus Lat)":     "M15,80 Q19,78 21,82 L20,108 Q16,110 13,107 Z M31,80 Q35,78 37,82 L36,108 Q32,110 29,107 Z",
  "Quad (Vastus Med)":     "M22,90 Q25,88 28,90 L27,110 Q24,112 21,110 Z",
  "Quad (Vastus Int)":     "M20,80 Q23,78 26,80 L25,104 Q22,106 19,104 Z",
  "Adductor Magnus":       "M21,80 Q24,79 27,80 L26,104 Q23,106 20,104 Z",
  // Calf (front)
  "Gastrocnemius (Med)":  "M19,110 Q22,108 25,110 L24,130 Q21,132 18,129 Z M27,110 Q30,108 33,110 L32,130 Q29,132 26,129 Z",
  "Gastrocnemius (Lat)":  "M15,112 Q19,110 21,114 L20,132 Q16,134 13,131 Z M31,112 Q35,110 37,114 L36,132 Q32,134 29,131 Z",
  "Soleus":               "M17,126 Q22,124 29,124 L28,140 Q22,142 17,140 Z",
  "Tibialis Anterior":    "M14,110 Q17,108 19,112 L18,130 Q15,132 13,129 Z M33,110 Q36,108 38,112 L37,130 Q34,132 32,129 Z",
  "Hip Flexors":          "M17,72 Q22,70 29,70 L28,82 Q22,84 17,82 Z",

  //  BACK VIEW (right side of SVG, x: 54-104) 
  head_back: "M72,2 Q77,-1 82,2 Q86,5 86,12 Q86,20 77,22 Q68,20 68,12 Q68,5 72,2 Z",
  neck_back: "M73,22 Q77,21 81,22 L80,27 Q77,28 74,27 Z",
  // Traps / Upper back
  "Trap (Upper)":    "M60,26 Q77,22 94,26 L92,36 Q77,38 62,36 Z",
  "Trap (Mid)":      "M62,36 Q77,38 92,36 L90,50 Q77,52 64,50 Z",
  "Lower Trap":      "M64,50 Q77,52 90,50 L88,62 Q77,64 66,62 Z",
  "Rhomboids":       "M66,34 Q77,30 88,34 L87,52 Q77,54 67,52 Z",
  // Lat
  "Lat Dorsi":       "M60,38 Q67,34 70,40 L68,70 Q62,72 58,66 Z M94,38 Q87,34 84,40 L86,70 Q92,72 96,66 Z",
  "Teres Major":     "M60,38 Q64,34 68,38 L67,48 Q63,50 59,47 Z M94,38 Q90,34 86,38 L87,48 Q91,50 95,47 Z",
  "Teres Minor":     "M60,32 Q64,28 67,33 L66,40 Q62,42 59,40 Z M94,32 Q90,28 87,33 L88,40 Q92,42 95,40 Z",
  "Infraspinatus":   "M63,30 Q77,26 91,30 L90,42 Q77,44 64,42 Z",
  // Erector Spinae
  "Erector Spinae":  "M72,34 Q74,32 76,34 L75,70 Q73,71 71,70 Z M78,34 Q80,32 82,34 L81,70 Q79,71 77,70 Z",
  // Glutes (back)
  "Glute Max":       "M62,72 Q77,68 92,72 L91,92 Q77,96 63,92 Z",
  "Glute Med":       "M60,62 Q70,58 77,62 L76,76 Q68,78 59,74 Z M94,62 Q84,58 77,62 L78,76 Q86,78 95,74 Z",
  "Glute Min":       "M62,66 Q70,62 77,66 L76,76 Q68,78 61,74 Z M92,66 Q84,62 77,66 L78,76 Q86,78 93,74 Z",
  "TFL":             "M60,68 Q65,64 68,70 L67,82 Q62,84 59,80 Z M94,68 Q89,64 86,70 L87,82 Q92,84 95,80 Z",
  // Hamstrings (back)
  "Bicep Femoris (Long)":  "M79,94 Q83,92 87,94 L86,122 Q82,124 78,122 Z M67,94 Q63,92 59,94 L60,122 Q64,124 68,122 Z",
  "Bicep Femoris (Short)": "M79,108 Q82,106 85,108 L85,124 Q82,126 79,124 Z M65,108 Q62,106 59,108 L59,124 Q62,126 65,124 Z",
  "Semimembranosus":       "M73,94 Q77,92 80,94 L79,122 Q76,124 72,122 Z",
  "Semitendinosus":        "M68,94 Q72,92 75,94 L74,122 Q71,124 67,122 Z",
  // Back of calf
  "Gastrocnemius (Med)_back":  "M73,124 Q76,122 79,124 L78,144 Q75,146 72,144 Z",
  "Gastrocnemius (Lat)_back":  "M67,124 Q70,122 73,124 L72,144 Q69,146 66,144 Z M79,124 Q82,122 85,124 L84,144 Q81,146 78,144 Z",
  "Soleus_back":               "M67,138 Q77,136 87,136 L86,150 Q77,152 68,150 Z",
  // Shoulder back
  "Post Deltoid":  "M56,30 Q61,26 64,32 L63,44 Q58,46 55,42 Z M98,30 Q93,26 90,32 L91,44 Q96,46 99,42 Z",
  // Tricep (back of arm)
  "Tricep Long Head":    "M55,42 Q58,40 61,43 L60,62 Q57,64 54,61 Z M99,42 Q96,40 93,43 L94,62 Q97,64 100,61 Z",
  "Tricep Lateral Head": "M52,44 Q55,42 58,45 L57,62 Q54,64 51,61 Z M102,44 Q99,42 96,45 L97,62 Q100,64 103,61 Z",
  "Tricep Medial Head":  "M55,52 Q58,50 60,53 L59,62 Q57,63 54,61 Z M99,52 Q96,50 94,53 L95,62 Q97,63 100,61 Z",
  // Back forearm
  "Ext Carpi Ulnaris":   "M51,60 Q54,58 57,61 L56,76 Q53,77 50,75 Z M103,60 Q100,58 97,61 L98,76 Q101,77 104,75 Z",
  "Levator Scapulae":    "M65,22 Q68,20 70,24 L69,34 Q66,35 64,32 Z M89,22 Q86,20 84,24 L85,34 Q88,35 90,32 Z",
  "Supraspinatus":       "M64,26 Q77,22 90,26 L89,34 Q77,36 65,34 Z",
};

// Which paths to show for each muscle name (some muscles use back-view paths)
var BACK_VIEW_MUSCLES = new Set([
  "Lat Dorsi","Rhomboids","Erector Spinae","Trap (Mid)","Trap (Upper)","Lower Trap",
  "Teres Major","Teres Minor","Infraspinatus","Post Deltoid","Glute Max","Glute Med",
  "Glute Min","TFL","Bicep Femoris (Long)","Bicep Femoris (Short)","Semimembranosus",
  "Semitendinosus","Tricep Long Head","Tricep Lateral Head","Tricep Medial Head",
  "Ext Carpi Ulnaris","Levator Scapulae","Supraspinatus",
]);

// Detailed muscle diagram component
function MuscleDiagram({exerciseName,color}){
  var acts = MUSCLE_ACT[exerciseName] || {};
  var muscles = Object.keys(acts).sort(function(a,b){return acts[b]-acts[a];});
  if(!muscles.length) return null;

  var GC = color || "#c8f53e";

  // Body shape paths (static silhouette)
  var bodyFront = [
    // Torso
    "M14,28 Q27,24 40,28 L40,72 Q27,75 14,72 Z",
    // Upper arms
    "M4,28 Q10,26 14,30 L13,66 Q8,68 3,65 Z",
    "M40,28 Q46,26 50,30 L49,66 Q44,68 39,65 Z",
    // Lower arms
    "M3,64 Q7,62 12,65 L11,92 Q6,93 2,90 Z",
    "M40,64 Q44,62 49,65 L48,92 Q43,93 39,90 Z",
    // Thighs
    "M14,72 Q22,70 27,72 L26,110 Q20,112 13,110 Z",
    "M27,72 Q32,70 40,72 L39,110 Q33,112 26,110 Z",
    // Lower legs
    "M13,108 Q20,106 26,108 L25,145 Q19,147 12,145 Z",
    "M26,108 Q32,106 39,108 L38,145 Q32,147 25,145 Z",
  ];
  var bodyBack = [
    "M64,28 Q77,24 90,28 L90,72 Q77,75 64,72 Z",
    "M54,28 Q60,26 64,30 L63,66 Q58,68 53,65 Z",
    "M90,28 Q96,26 100,30 L99,66 Q94,68 89,65 Z",
    "M53,64 Q57,62 62,65 L61,92 Q56,93 52,90 Z",
    "M90,64 Q94,62 99,65 L98,92 Q93,93 89,90 Z",
    "M64,72 Q72,70 77,72 L76,110 Q70,112 63,110 Z",
    "M77,72 Q82,70 90,72 L89,110 Q83,112 76,110 Z",
    "M63,108 Q70,106 76,108 L75,145 Q69,147 62,145 Z",
    "M76,108 Q82,106 89,108 L88,145 Q82,147 75,145 Z",
  ];

  return (
    <div style={{background:"#0a0a0f",borderRadius:14,padding:"14px",marginBottom:10,border:"1px solid #1a1a22"}}>
      <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:10,textAlign:"center"}}>MUSCLE ACTIVATION BREAKDOWN</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {/* SVG Body - front and back */}
        <div style={{display:"flex",justifyContent:"center",gap:16}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:8,color:"#444",marginBottom:4,letterSpacing:1}}>FRONT</div>
            <svg viewBox="0 0 54 155" width="72" height="207">
              {bodyFront.map(function(d,i){return <path key={i} d={d} fill="#1e1e2a" stroke="#2a2a3a" strokeWidth="0.8"/>;})}
              <ellipse cx="27" cy="12" rx="11" ry="12" fill="#1e1e2a" stroke="#2a2a3a" strokeWidth="0.8"/>
              {muscles.map(function(m){
                if(BACK_VIEW_MUSCLES.has(m)) return null;
                var path = SVG_PATHS[m];
                if(!path) return null;
                var pct = acts[m];
                var col = MUSCLE_COLOR[m] || GC;
                var opacity = 0.35 + (pct/100)*0.60;
                return <path key={m} d={path} fill={col} opacity={opacity} stroke={col} strokeWidth="0.4" strokeOpacity="0.9"/>;
              })}
            </svg>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:8,color:"#444",marginBottom:4,letterSpacing:1}}>BACK</div>
            <svg viewBox="54 0 54 155" width="72" height="207">
              {bodyBack.map(function(d,i){return <path key={i} d={d} fill="#1e1e2a" stroke="#2a2a3a" strokeWidth="0.8"/>;})}
              <ellipse cx="77" cy="12" rx="11" ry="12" fill="#1e1e2a" stroke="#2a2a3a" strokeWidth="0.8"/>
              {muscles.map(function(m){
                if(!BACK_VIEW_MUSCLES.has(m)) return null;
                var pathKey = m+"_back";
                var path = SVG_PATHS[pathKey] || SVG_PATHS[m];
                if(!path) return null;
                var pct = acts[m];
                var col = MUSCLE_COLOR[m] || GC;
                var opacity = 0.35 + (pct/100)*0.60;
                return <path key={m} d={path} fill={col} opacity={opacity} stroke={col} strokeWidth="0.4" strokeOpacity="0.9"/>;
              })}
            </svg>
          </div>
        </div>
        {/* Activation bars */}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {muscles.map(function(m){
            var pct = acts[m];
            var col = MUSCLE_COLOR[m] || GC;
            var isPrimary = pct >= 30;
            return (
              <div key={m}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:7,height:7,borderRadius:2,background:col,flexShrink:0}}/>
                    <span style={{fontSize:10,color:isPrimary?"#e8e4dc":"#888",fontWeight:isPrimary?"700":"400"}}>{m}</span>
                    {isPrimary && <span style={{fontSize:7,background:col+"22",color:col,borderRadius:4,padding:"1px 4px",fontWeight:700}}>PRIMARY</span>}
                  </div>
                  <span style={{fontSize:10,fontWeight:700,color:col}}>{pct}%</span>
                </div>
                <div style={{background:"#1e1e2a",borderRadius:99,height:5,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,"+col+"aa,"+col+")",width:pct+"%",transition:"width .5s ease"}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// Exercise animation data
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

function ExerciseAnimation({exerciseName,color}){
  var anim=EX_ANIMS[exerciseName]||DEFAULT_ANIM;
  var [frame,setFrame]=useState(0);
  var [playing,setPlaying]=useState(true);
  var [speed,setSpeed]=useState(900);
  var GC=color||anim.color||"#c8f53e";

  useEffect(function(){
    setFrame(0);setPlaying(true);
  },[exerciseName]);

  useEffect(function(){
    if(!playing)return;
    var t=setInterval(function(){setFrame(function(f){return(f+1)%anim.frames.length;});},speed);
    return function(){clearInterval(t);};
  },[playing,speed,exerciseName]);

  var cue=anim.cues[frame%anim.cues.length];
  var phase=anim.phases[frame%anim.phases.length];

  return(
    <div style={{background:"#0a0a0f",borderRadius:14,padding:"12px",marginBottom:10,border:"1px solid #1a1a22"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:9,color:"#555",letterSpacing:1}}>HOW TO DO IT</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={function(){setSpeed(function(s){return s===600?1100:600;});}} style={{background:"#1e1e2a",border:"none",color:"#888",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>{speed===600?"Slow":"Fast"}</button>
          <button onClick={function(){setPlaying(function(p){return!p;});}} style={{background:GC+"22",border:"1px solid "+GC+"44",color:GC,borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"inherit"}}>{playing?"Pause":"Play"}</button>
        </div>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{flexShrink:0,background:"#13131a",borderRadius:10,padding:"6px",border:"1px solid "+GC+"33"}}>
          <svg viewBox="0 0 100 100" width="108" height="108" dangerouslySetInnerHTML={{__html:anim.frames[frame]}}/>
          <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:5}}>
            {anim.frames.map(function(_,i){return <div key={i} style={{width:6,height:6,borderRadius:3,background:i===frame?GC:"#2a2a3a",transition:"background .2s"}}/>;}) }
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{background:GC+"11",border:"1px solid "+GC+"33",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
            <div style={{fontSize:8,color:GC,fontWeight:700,letterSpacing:1,marginBottom:3}}>{phase.toUpperCase()}</div>
            <div style={{fontSize:11,color:"#e8e4dc",lineHeight:1.4}}>{cue}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {anim.cues.map(function(c,i){
              var active=i===(frame%anim.cues.length);
              return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,opacity:active?1:0.35,transition:"opacity .25s"}}>
                  <div style={{width:5,height:5,borderRadius:3,background:active?GC:"#2a2a3a",flexShrink:0}}/>
                  <div style={{fontSize:10,color:active?"#e8e4dc":"#666"}}>{c}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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

export default function App({user, supabase}){
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
  var barRef=useRef(null);

  var wKg=profile.wLbs?+profile.wLbs*0.453592:0;
  var hCm=(+profile.hFt*30.48)+(+profile.hIn*2.54);
  var bmr=calcBMR(+profile.age,wKg,hCm,profile.sex);
  var tdee=calcTDEE(bmr,profile.activ);
  var sugCal=tdee?calcGoalCal(tdee,goal):0;
  var goalObj=GOALS.find(function(g){return g.id===goal;})||GOALS[2];
  var GC=goalObj.color;
  var IC={low:"#3eb8f5",moderate:"#e8a83e",high:"#ff6b35"};

  useEffect(function(){if(!macLocked)setMacros(calcMacros(calGoal,goal));},[goal,calGoal,macLocked]);

  var calB=workouts.reduce(function(s,w){return s+w.cal;},0);
  var calE=meals.reduce(function(s,m){return s+m.cal;},0);
  var pE=meals.reduce(function(s,m){return s+(m.protein||0);},0);
  var cE=meals.reduce(function(s,m){return s+(m.carbs||0);},0);
  var fE=meals.reduce(function(s,m){return s+(m.fat||0);},0);
  var netCal=calE-calB;
  var calLeft=calGoal-netCal;
  var ring=Math.min((netCal/calGoal)*100,100);

  function applyS(){setCalGoal(sugCal);setMacros(calcMacros(sugCal,goal));setMacLocked(false);}
  function closeEx(){setShowEx(false);setSelEx(null);setExDur(30);setExTab("log");setCustEx({name:"",dur:30,cal:0});}
  function addW(){if(!selEx)return;var c=Math.round(selEx.caloriesPerMin*exDur);setWorkouts(workouts.concat([{id:Date.now(),name:selEx.name,em:selEx.em,dur:exDur,cal:c,cat:selEx.category,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]));closeEx();}
  function addCW(){if(!custEx.name)return;setWorkouts(workouts.concat([{id:Date.now(),name:custEx.name,em:EM.medal,dur:+custEx.dur,cal:+custEx.cal,cat:"Custom",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]));closeEx();}

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
  function saveW(){
    var ts=moves.reduce(function(s,m){return s+m.sets.length;},0);
    var ds=moves.reduce(function(s,m){return s+m.sets.filter(function(x){return x.done;}).length;},0);
    var c=Math.round((timer.elapsed/60)*7);
    setWorkouts(workouts.concat([{id:Date.now(),name:recName||"Recorded Workout",em:EM.lift,dur:Math.max(1,Math.round(timer.elapsed/60)),cal:c,cat:"Strength",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),moves:moves,totalSets:ts,doneSets:ds}]));
    setShowRec(false);setMoves([]);setRecName("");setActiveIdx(null);setRestSecs(null);timer.reset();
  }
  function exportH(w){
    var end=new Date(),start=new Date(end-((w.dur||1)*60000));
    function fmt(d){return d.toISOString().replace(/\.\d{3}Z/,"+00:00");}
    var xml='<?xml version="1.0"?>\n<HealthData locale="en_US">\n  <ExportDate value="'+fmt(new Date())+'"/>\n  <Workout workoutActivityType="HKWorkoutActivityTypeTraditionalStrengthTraining" duration="'+(w.dur||1)+'" durationUnit="min" totalEnergyBurned="'+(w.cal||0)+'" totalEnergyBurnedUnit="kcal" sourceName="Lock In" startDate="'+fmt(start)+'" endDate="'+fmt(end)+'">\n  </Workout>\n</HealthData>';
    var blob=new Blob([xml],{type:"application/xml"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download=(w.name||"w").replace(/\s+/g,"_")+"_Health.xml";a.click();URL.revokeObjectURL(url);
  }

  async function lookupBarcode(code){
    if(!code||code.length<6)return;
    setBarState("scanning");setBarResult(null);
    try{
      var res=await fetch("https://world.openfoodfacts.org/api/v0/product/"+code.trim()+".json");
      var data=await res.json();
      if(data.status!==1||!data.product){setBarState("notfound");return;}
      var p=data.product,n=p.nutriments||{};
      setBarResult({
        name:p.product_name||p.generic_name||"Unknown Product",
        brand:p.brands||"",
        calories:Math.round(n["energy-kcal_serving"]||n["energy-kcal_100g"]||0),
        protein:Math.round((n["proteins_serving"]||n["proteins_100g"]||0)*10)/10,
        carbs:Math.round((n["carbohydrates_serving"]||n["carbohydrates_100g"]||0)*10)/10,
        fat:Math.round((n["fat_serving"]||n["fat_100g"]||0)*10)/10,
        fiber:Math.round((n["fiber_serving"]||n["fiber_100g"]||0)*10)/10,
        serving:p.serving_size||"per serving",
        image:p.image_front_small_url||null,
      });
      setBarSrv(1);setBarState("result");
    }catch(err){setBarState("error");}
  }

  function closeFood(){setShowFood(false);setFoodTab("browse");setSelFood(null);setFoodSrv(1);setCustFood({name:"",cal:0,p:0,c:0,f:0});setBarState("idle");setBarResult(null);setBarInput("");setBarSrv(1);}
  function addMeal(food,srv){setMeals(meals.concat([{id:Date.now(),name:food.name,em:food.em||EM.plate,cal:Math.round((food.calories||0)*srv),protein:Math.round((food.protein||0)*srv),carbs:Math.round((food.carbs||0)*srv),fat:Math.round((food.fat||0)*srv),servings:srv,per:food.per||"serving",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]));closeFood();}
  function addCM(){if(!custFood.name)return;setMeals(meals.concat([{id:Date.now(),name:custFood.name,em:EM.plate,cal:+custFood.cal,protein:+custFood.p,carbs:+custFood.c,fat:+custFood.f,servings:1,per:"serving",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]));closeFood();}
  function addSM(food){setMeals(meals.concat([{id:Date.now(),name:food.name,em:EM.plate,cal:food.calories,protein:food.protein,carbs:food.carbs,fat:food.fat,servings:1,per:"serving",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]));setShowSugs(false);}

  function MB(l,c,g,col){var p=Math.min((c/g)*100,100),ov=c>g;return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:"#666"}}>{l}</span><span style={{fontSize:10,fontWeight:700,color:ov?"#ff5555":"#e8e4dc"}}>{c}g <span style={{color:"#444"}}>/ {g}g</span></span></div><div style={{background:"#0a0a0f",borderRadius:99,height:5,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:ov?"#ff5555":col,width:p+"%",transition:"width .4s"}}/></div></div>;}

  var css="@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Bebas+Neue&display=swap');"
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
    +"@keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}";

  var base={minHeight:"100vh",background:"#0a0a0f",color:"#e8e4dc",fontFamily:"DM Sans,sans-serif",maxWidth:480,margin:"0 auto"};

  if(screen==="profile") return (
    <div style={base}><style>{css}</style>
      <div style={{padding:"18px 16px 80px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button onClick={()=>setScreen("main")} style={{background:"#1e1e2a",border:"none",color:"#e8e4dc",borderRadius:9,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Back</button>
          <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:22,letterSpacing:1,color:GC}}>MY PROFILE</div>
        </div>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:52,marginBottom:8}}>{AVATARS[profile.avatar]}</div>
          <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
            {AVATARS.map(function(a,i){return <button key={i} onClick={()=>setProfile(Object.assign({},profile,{avatar:i}))} style={{fontSize:20,background:profile.avatar===i?"#1e1e2a":"transparent",border:"1px solid "+(profile.avatar===i?GC:"#2a2a3a"),borderRadius:9,padding:"5px 9px",cursor:"pointer"}}>{a}</button>;})}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
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
          <button className="btn" onClick={()=>setScreen("main")} style={{background:"#1e1e2a",color:"#e8e4dc",border:"1px solid #2a2a3a"}}>Save and Return</button>
        </div>
      </div>
    </div>
  );

  if(screen==="share") return (
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
        <div style={{fontSize:12,color:"#555",textAlign:"center",marginBottom:14}}>Screenshot and share with friends</div>
        {["Lets go! Check my stats!","Crushing my "+goalObj.label+" goals today","Another day another grind. Who is training?","Feeling strong. Come join me!"].map(function(msg,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#13131a",border:"1px solid #1e1e2a",borderRadius:9,padding:"9px 13px",marginBottom:7}}><span style={{fontSize:12,color:"#888"}}>{msg}</span><button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(msg)} style={{background:GC+"22",border:"none",color:GC,borderRadius:7,padding:"4px 9px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:10}}>Copy</button></div>;})}
      </div>
    </div>
  );

  if(showRec){
    var ts2=moves.reduce(function(s,m){return s+m.sets.length;},0);
    var ds2=moves.reduce(function(s,m){return s+m.sets.filter(function(x){return x.done;}).length;},0);
    return (
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
            return (<div key={mi} style={{marginBottom:9}}>
              <button onClick={()=>setActiveIdx(isA?null:mi)} style={{width:"100%",background:isA?"#1a1f12":"#13131a",border:"1px solid "+(isA?GC:"#1e1e2a"),borderRadius:isA?"12px 12px 0 0":"12px",padding:"10px 13px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:10,fontWeight:700,color:GC,background:GC+"22",borderRadius:5,padding:"1px 6px"}}>{mi+1}</span><span style={{fontWeight:700,fontSize:13,color:"#e8e4dc"}}>{move.name}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:10,color:dc===move.sets.length&&move.sets.length>0?"#c8f53e":"#555"}}>{dc}/{move.sets.length} done</span><button onClick={function(e){e.stopPropagation();remMove(mi);}} className="del">x</button></div>
              </button>
              {isA&&(<div style={{background:"#0d0d14",border:"1px solid "+GC,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"11px 13px"}}>
                <div style={{display:"grid",gridTemplateColumns:"26px 1fr 1fr 50px auto",gap:5,marginBottom:5}}>
                  {["#","Reps","Weight","Note",""].map(function(h,i){return <div key={i} style={{fontSize:9,color:"#444",fontWeight:700}}>{h}</div>;})}
                </div>
                {move.sets.length===0&&<div style={{fontSize:11,color:"#444",textAlign:"center",padding:"6px 0"}}>No sets yet</div>}
                {move.sets.map(function(set,si){return (
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

  return (
    <div style={base}><style>{css}</style>
      <div style={{padding:"14px 14px 9px",position:"sticky",top:0,background:"#0a0a0f",zIndex:10,borderBottom:"1px solid #1a1a22"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:24,letterSpacing:2,color:GC,lineHeight:1}}>LOCK IN</div><div style={{fontSize:10,color:"#444",marginTop:1}}>{TODAY}</div></div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <div style={{background:"#13131a",border:"1px solid #2a2a3a",borderRadius:9,padding:"5px 9px"}}>
              <div style={{fontSize:8,color:"#444"}}>GOAL</div>
              <div style={{display:"flex",alignItems:"center",gap:3}}><input type="number" value={calGoal} onChange={e=>setCalGoal(+e.target.value)} style={{width:48,fontSize:13,fontWeight:700,textAlign:"right"}}/><span style={{fontSize:8,color:"#444"}}>kcal</span></div>
            </div>
            <button onClick={()=>setScreen("profile")} style={{fontSize:24,background:"#13131a",border:"2px solid #2a2a3a",borderRadius:"50%",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>{AVATARS[profile.avatar]}</button>
          </div>
        </div>
        <div style={{display:"flex",gap:3,marginTop:9}}>
          {[["dashboard","Overview"],["workouts","Exercise"],["nutrition","Nutrition"],["goals","Goals"]].map(function(x){return <button key={x[0]} onClick={()=>setTab(x[0])} style={{flex:1,padding:"6px 0",borderRadius:7,border:"none",cursor:"pointer",background:tab===x[0]?GC:"transparent",color:tab===x[0]?"#0a0a0f":"#555",fontFamily:"inherit",fontWeight:700,fontSize:10,letterSpacing:0.5,textTransform:"uppercase",transition:"all .2s"}}>{x[1]}</button>;})}
        </div>
      </div>

      <div style={{padding:"14px",paddingBottom:80}}>
        {tab==="dashboard"&&(<div style={{display:"flex",flexDirection:"column",gap:11}}>
          {profile.name&&(<div style={{display:"flex",alignItems:"center",gap:9,background:"#13131a",border:"1px solid "+GC+"22",borderRadius:13,padding:"9px 13px"}}><span style={{fontSize:24}}>{AVATARS[profile.avatar]}</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{profile.name}</div>{profile.bio&&<div style={{fontSize:10,color:"#555"}}>{profile.bio}</div>}</div><div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#555"}}>{goalObj.em} {goalObj.label}</div>{sugCal>0&&calGoal!==sugCal&&<button onClick={applyS} style={{background:"none",border:"none",color:GC,fontSize:9,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Use {sugCal}?</button>}</div></div>)}
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
          {(workouts.length>0||meals.length>0)&&(<div>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:7}}>TODAY</div>
            {workouts.concat(meals.map(function(m){return Object.assign({},m,{type:"meal"});})).slice(-6).reverse().map(function(item){return <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,background:"#13131a",border:"1px solid #1e1e2a",borderRadius:9,padding:"8px 11px",marginBottom:5}}><span style={{fontSize:15}}>{item.em}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{item.name}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:11,fontWeight:700,color:item.type==="meal"?"#e8a83e":GC}}>{item.type==="meal"?"+":"-"}{item.cal}</div><div style={{fontSize:8,color:"#555"}}>kcal</div></div></div>;})}
          </div>)}
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
            {(wSug.exercises||[]).map(function(ex,i){return (
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
          {workouts.map(function(w){return (
            <div key={w.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:13,padding:"11px 13px"}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <span style={{fontSize:20}}>{w.em}</span>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{w.name}</div><div style={{fontSize:10,color:"#555"}}>{w.dur} min - {w.time} - {w.cat}</div>{w.moves&&<div style={{fontSize:10,color:"#555"}}>{w.moves.length} exercises - {w.totalSets} sets</div>}</div>
                <div style={{textAlign:"right"}}><div style={{color:GC,fontWeight:700,fontSize:13}}>-{w.cal}</div><div style={{fontSize:8,color:"#555"}}>kcal</div></div>
                <button className="del" onClick={()=>setWorkouts(workouts.filter(function(x){return x.id!==w.id;}))}>x</button>
              </div>
              {w.moves&&w.moves.length>0&&(<div style={{marginTop:9,paddingTop:9,borderTop:"1px solid #1e1e2a"}}>
                {w.moves.map(function(mv,mi){return <div key={mi} style={{marginBottom:7}}><div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:3}}>{mv.name}</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{mv.sets.map(function(s,si){return <div key={si} style={{background:"#0a0a0f",borderRadius:6,padding:"3px 7px",fontSize:9,color:s.done?GC:"#555"}}>{s.reps||"-"}{s.weight?" @ "+s.weight:""}</div>;})}</div></div>;})}
                <button onClick={()=>exportH(w)} style={{marginTop:5,background:"none",border:"1px solid #2a2a3a",color:"#555",borderRadius:7,padding:"4px 11px",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:600}}>Export to Apple Health</button>
              </div>)}
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
          {meals.length===0?<div style={{textAlign:"center",padding:"26px 0",color:"#333",fontSize:12}}>No meals logged</div>
          :meals.map(function(m){return (
            <div key={m.id} style={{background:"#13131a",border:"1px solid #1e1e2a",borderRadius:13,padding:"11px 13px"}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <span style={{fontSize:20}}>{m.em}</span>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{m.name}</div><div style={{fontSize:10,color:"#555"}}>{m.servings}x {m.per} - {m.time}</div></div>
                <div style={{textAlign:"right"}}><div style={{color:"#e8a83e",fontWeight:700,fontSize:13}}>+{m.cal}</div><div style={{fontSize:8,color:"#555"}}>kcal</div></div>
                <button className="del" onClick={()=>setMeals(meals.filter(function(x){return x.id!==m.id;}))}>x</button>
              </div>
              <div style={{display:"flex",gap:4,marginTop:7}}>
                {[["P",m.protein,"#c8f53e"],["C",m.carbs,"#e8a83e"],["F",m.fat,"#3eb8f5"]].map(function(x){return <div key={x[0]} style={{flex:1,background:"#0a0a0f",borderRadius:6,padding:"3px 0",textAlign:"center"}}><div style={{fontSize:7,color:"#555"}}>{x[0]}</div><div style={{fontSize:11,fontWeight:700,color:x[2]}}>{x[1]}g</div></div>;})}
              </div>
            </div>
          );})}
        </div>)}

        {tab==="goals"&&(<div style={{display:"flex",flexDirection:"column",gap:13}}>
          <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:1}}>FITNESS GOAL</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {GOALS.map(function(g){return <div key={g.id} onClick={()=>setGoal(g.id)} style={{padding:"10px",borderRadius:11,border:"2px solid "+(goal===g.id?g.color:"#1e1e2a"),cursor:"pointer",textAlign:"center",background:"#13131a",transition:"all .15s"}}><div style={{fontSize:22,marginBottom:3}}>{g.em}</div><div style={{fontWeight:700,fontSize:13,color:goal===g.id?g.color:"#e8e4dc"}}>{g.label}</div><div style={{fontSize:9,color:"#555",marginTop:2}}>{g.desc}</div><div style={{fontSize:8,color:g.color,marginTop:2}}>{g.calMod>=0?"+":""}{g.calMod} kcal</div></div>;})}
          </div>
          <button className="btn" onClick={()=>setScreen("profile")} style={{background:GC+"11",border:"1px solid "+GC+"33",color:GC}}>{tdee>0?"TDEE: "+tdee+" kcal - Suggested: "+sugCal+" kcal":"Set up profile for TDEE calculator"}</button>
          {tdee>0&&calGoal!==sugCal&&<button className="btn" onClick={applyS} style={{background:GC,color:"#0a0a0f"}}>Apply {sugCal} kcal + Auto Macros</button>}
          <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:18,letterSpacing:1}}>MACRO TARGETS</div>
          <div style={{fontSize:10,color:"#555",marginTop:-8}}>{macLocked?"Manually adjusted":"Auto-set by goal"}</div>
          {[["Protein","protein","#c8f53e",50,350],["Carbs","carbs","#e8a83e",30,600],["Fat","fat","#3eb8f5",20,200]].map(function(x){return (
            <div key={x[1]} className="card" style={{padding:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#888"}}>{x[0]} (g)</span><span style={{fontWeight:700,color:x[2],fontSize:13}}>{macros[x[1]]}g</span></div>
              <input type="range" min={x[3]} max={x[4]} step={5} value={macros[x[1]]} style={{accentColor:x[2]}} onChange={function(e){setMacros(Object.assign({},macros,{[x[1]]:+e.target.value}));setMacLocked(true);}}/>
            </div>
          );})}
          {macLocked&&<button className="btn" onClick={()=>{setMacros(calcMacros(calGoal,goal));setMacLocked(false);}} style={{background:"#1e1e2a",color:"#888",border:"1px dashed #2a2a3a",fontSize:11}}>Reset to goal defaults</button>}
          <div className="card" style={{padding:11}}>
            <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:7}}>MACRO SPLIT</div>
            <div style={{display:"flex",borderRadius:99,overflow:"hidden",height:9,marginBottom:9}}>
              {[["p",macros.protein*4,"#c8f53e"],["c",macros.carbs*4,"#e8a83e"],["f",macros.fat*9,"#3eb8f5"]].map(function(x){var t=macros.protein*4+macros.carbs*4+macros.fat*9;return <div key={x[0]} style={{background:x[2],width:((x[1]/t)*100)+"%",transition:"width .4s"}}/>;})}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
              {[["Protein",macros.protein*4,"#c8f53e"],["Carbs",macros.carbs*4,"#e8a83e"],["Fat",macros.fat*9,"#3eb8f5"]].map(function(x){return <div key={x[0]} style={{textAlign:"center"}}><div style={{fontSize:8,color:"#555"}}>{x[0].toUpperCase()}</div><div style={{fontWeight:700,color:x[2],fontSize:11}}>{x[1]} kcal</div><div style={{fontSize:8,color:"#555"}}>{calGoal>0?Math.round((x[1]/calGoal)*100):0}%</div></div>;})}
            </div>
          </div>
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
            {[["browse","Browse"],["barcode","Barcode"],["custom","Custom"]].map(function(x){return <button key={x[0]} className="seg" onClick={()=>setFoodTab(x[0])} style={{background:foodTab===x[0]?(x[0]==="barcode"?"#e8a83e":"#1e1e2a"):"transparent",color:foodTab===x[0]?(x[0]==="barcode"?"#0a0a0f":"#e8e4dc"):"#555"}}>{x[1]}</button>;})}
          </div>

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
            <button className="btn" onClick={()=>addMeal(selFood,foodSrv)} disabled={!selFood} style={{background:selFood?"#e8a83e":"#1e1e2a",color:selFood?"#0a0a0f":"#555"}}>Add Meal</button>
          </div>)}

          {foodTab==="barcode"&&(<div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div style={{fontSize:11,color:"#888",textAlign:"center",lineHeight:1.6}}>Look up any packaged food by barcode number. Uses Open Food Facts - 5M+ products worldwide.</div>
            <div style={{display:"flex",gap:8}}>
              <input className="inp" type="number" inputMode="numeric" placeholder="Enter barcode number..." value={barInput} onChange={function(e){setBarInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")lookupBarcode(barInput);}} style={{flex:1}}/>
              <button onClick={function(){lookupBarcode(barInput);}} style={{background:"#e8a83e",border:"none",color:"#0a0a0f",borderRadius:9,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,flexShrink:0}}>Search</button>
            </div>
            <div style={{display:"flex",gap:8}}>
              <input ref={barRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={function(e){
                var file=e.target.files&&e.target.files[0];if(!file)return;
                if(typeof BarcodeDetector!=="undefined"){
                  var img=new Image();
                  img.onload=function(){
                    var bd=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128","code_39"]});
                    bd.detect(img).then(function(codes){if(codes&&codes.length>0){setBarInput(codes[0].rawValue);lookupBarcode(codes[0].rawValue);}else setBarState("notfound");}).catch(function(){setBarState("error");});
                    URL.revokeObjectURL(img.src);
                  };
                  img.src=URL.createObjectURL(file);
                }else{setBarState("nosupport");}
              }}/>
              <button onClick={function(){if(barRef.current){barRef.current.setAttribute("capture","environment");barRef.current.click();}}} style={{flex:1,background:"#1e1e2a",border:"1px solid #2a2a3a",color:"#e8e4dc",borderRadius:9,padding:"10px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12}}>Camera Scan</button>
            </div>
            {barState==="scanning"&&(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"20px 0"}}><div style={{width:28,height:28,border:"3px solid #2a2a3a",borderTopColor:"#e8a83e",borderRadius:"50%",animation:"spin .8s linear infinite"}}/><div style={{fontSize:12,color:"#555"}}>Looking up product...</div></div>)}
            {barState==="notfound"&&(<div style={{background:"#2a2010",border:"1px solid #e8a83e44",borderRadius:11,padding:"12px 14px",textAlign:"center"}}><div style={{fontWeight:700,fontSize:13,color:"#e8a83e",marginBottom:4}}>Product not found</div><div style={{fontSize:11,color:"#888"}}>Try the number printed below the barcode. Or use Custom tab to enter manually.</div></div>)}
            {barState==="error"&&(<div style={{background:"#2a1515",border:"1px solid #ff555544",borderRadius:11,padding:"12px 14px",textAlign:"center"}}><div style={{fontWeight:700,fontSize:13,color:"#ff8888",marginBottom:4}}>Lookup failed</div><div style={{fontSize:11,color:"#888"}}>Check your internet connection and try again.</div></div>)}
            {barState==="nosupport"&&(<div style={{background:"#1e1e2a",border:"1px solid #2a2a3a",borderRadius:11,padding:"12px 14px",textAlign:"center"}}><div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Camera scan not supported</div><div style={{fontSize:11,color:"#888"}}>Type the barcode number manually above instead.</div></div>)}
            {barState==="result"&&barResult&&(<div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{background:"#0a0a0f",borderRadius:12,padding:13}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                  {barResult.image&&<img src={barResult.image} alt="" style={{width:52,height:52,borderRadius:8,objectFit:"contain",background:"#fff",padding:2,flexShrink:0}}/>}
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{barResult.name}</div>{barResult.brand&&<div style={{fontSize:11,color:"#555"}}>{barResult.brand}</div>}<div style={{fontSize:10,color:"#555",marginTop:2}}>Per: {barResult.serving}</div></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
                  {[["KCAL",Math.round(barResult.calories*barSrv),"#e8a83e"],["P",Math.round(barResult.protein*barSrv*10)/10+"g","#c8f53e"],["C",Math.round(barResult.carbs*barSrv*10)/10+"g","#e8a83e"],["F",Math.round(barResult.fat*barSrv*10)/10+"g","#3eb8f5"]].map(function(x){return <div key={x[0]} style={{background:"#13131a",borderRadius:8,padding:"6px",textAlign:"center"}}><div style={{fontSize:8,color:"#555"}}>{x[0]}</div><div style={{fontSize:13,fontWeight:700,color:x[2]}}>{x[1]}</div></div>;})}
                </div>
                {barResult.fiber>0&&<div style={{fontSize:10,color:"#555",marginTop:6,textAlign:"center"}}>Fiber: {Math.round(barResult.fiber*barSrv*10)/10}g</div>}
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
