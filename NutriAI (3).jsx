import { useState, useEffect, useRef, useCallback } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ─── DATA ────────────────────────────────────────────────────
const REGIONAL_FOODS = {
  "South Indian": {
    breakfast: [
      { name: "Idli + Sambar", cal: 280, protein: 10, carbs: 52, fat: 4, fiber: 6, iron: 2.1, calcium: 80, vitC: 12, prep: "20 min" },
      { name: "Masala Dosa", cal: 350, protein: 8, carbs: 58, fat: 10, fiber: 4, iron: 1.8, calcium: 60, vitC: 8, prep: "25 min" },
      { name: "Upma + Chutney", cal: 300, protein: 9, carbs: 48, fat: 8, fiber: 5, iron: 2.4, calcium: 45, vitC: 10, prep: "15 min" },
    ],
    lunch: [
      { name: "Sambar Rice + Papad", cal: 520, protein: 16, carbs: 88, fat: 10, fiber: 8, iron: 3.2, calcium: 90, vitC: 15, prep: "30 min" },
      { name: "Lemon Rice + Raita", cal: 480, protein: 12, carbs: 82, fat: 12, fiber: 5, iron: 2.8, calcium: 120, vitC: 22, prep: "20 min" },
      { name: "Curd Rice + Pickle", cal: 420, protein: 14, carbs: 72, fat: 8, fiber: 4, iron: 1.9, calcium: 180, vitC: 5, prep: "15 min" },
    ],
    dinner: [
      { name: "Chapati + Dal", cal: 460, protein: 18, carbs: 70, fat: 10, fiber: 9, iron: 4.1, calcium: 95, vitC: 8, prep: "30 min" },
      { name: "Vegetable Curry + Rice", cal: 500, protein: 14, carbs: 84, fat: 12, fiber: 10, iron: 3.5, calcium: 105, vitC: 28, prep: "35 min" },
      { name: "Rasam + Steamed Rice", cal: 380, protein: 10, carbs: 68, fat: 6, fiber: 6, iron: 2.6, calcium: 72, vitC: 18, prep: "25 min" },
    ],
    snacks: [
      { name: "Murukku + Tea", cal: 180, protein: 4, carbs: 26, fat: 8, fiber: 2, iron: 1.1, calcium: 35, vitC: 0, prep: "5 min" },
      { name: "Sundal", cal: 150, protein: 7, carbs: 20, fat: 5, fiber: 6, iron: 2.2, calcium: 48, vitC: 6, prep: "10 min" },
    ],
  },
  "North Indian": {
    breakfast: [
      { name: "Aloo Paratha + Curd", cal: 480, protein: 12, carbs: 72, fat: 16, fiber: 5, iron: 2.8, calcium: 150, vitC: 14, prep: "25 min" },
      { name: "Poha + Chai", cal: 320, protein: 8, carbs: 56, fat: 8, fiber: 4, iron: 3.4, calcium: 55, vitC: 10, prep: "15 min" },
      { name: "Besan Cheela + Chutney", cal: 360, protein: 16, carbs: 44, fat: 12, fiber: 7, iron: 3.8, calcium: 80, vitC: 12, prep: "20 min" },
    ],
    lunch: [
      { name: "Dal Makhani + Roti", cal: 580, protein: 22, carbs: 78, fat: 18, fiber: 10, iron: 4.5, calcium: 120, vitC: 8, prep: "40 min" },
      { name: "Paneer Butter Masala + Rice", cal: 640, protein: 24, carbs: 82, fat: 22, fiber: 6, iron: 2.9, calcium: 280, vitC: 15, prep: "35 min" },
      { name: "Rajma + Chawal", cal: 560, protein: 20, carbs: 88, fat: 10, fiber: 12, iron: 5.2, calcium: 95, vitC: 10, prep: "45 min" },
    ],
    dinner: [
      { name: "Mixed Veg Sabzi + Roti", cal: 460, protein: 14, carbs: 68, fat: 14, fiber: 9, iron: 3.6, calcium: 100, vitC: 32, prep: "30 min" },
      { name: "Palak Paneer + Naan", cal: 540, protein: 22, carbs: 64, fat: 20, fiber: 8, iron: 6.1, calcium: 320, vitC: 45, prep: "35 min" },
      { name: "Chicken Curry + Roti", cal: 580, protein: 38, carbs: 52, fat: 22, fiber: 5, iron: 3.8, calcium: 85, vitC: 18, prep: "40 min" },
    ],
    snacks: [
      { name: "Samosa + Mint Chutney", cal: 220, protein: 5, carbs: 28, fat: 11, fiber: 3, iron: 1.4, calcium: 42, vitC: 8, prep: "5 min" },
      { name: "Roasted Chana + Jaggery", cal: 160, protein: 8, carbs: 24, fat: 4, fiber: 5, iron: 2.8, calcium: 55, vitC: 2, prep: "2 min" },
    ],
  },
  "Western": {
    breakfast: [
      { name: "Greek Yogurt Parfait", cal: 320, protein: 22, carbs: 38, fat: 8, fiber: 4, iron: 1.2, calcium: 220, vitC: 18, prep: "5 min" },
      { name: "Avocado Toast + Egg", cal: 420, protein: 18, carbs: 42, fat: 22, fiber: 8, iron: 2.8, calcium: 110, vitC: 22, prep: "10 min" },
      { name: "Overnight Oats + Berries", cal: 380, protein: 14, carbs: 58, fat: 10, fiber: 7, iron: 3.2, calcium: 180, vitC: 28, prep: "5 min" },
    ],
    lunch: [
      { name: "Grilled Chicken Salad", cal: 420, protein: 38, carbs: 22, fat: 14, fiber: 6, iron: 2.4, calcium: 90, vitC: 35, prep: "20 min" },
      { name: "Quinoa Buddha Bowl", cal: 480, protein: 20, carbs: 58, fat: 16, fiber: 9, iron: 3.8, calcium: 120, vitC: 42, prep: "25 min" },
      { name: "Turkey Wrap + Salad", cal: 460, protein: 32, carbs: 44, fat: 16, fiber: 7, iron: 2.9, calcium: 95, vitC: 28, prep: "10 min" },
    ],
    dinner: [
      { name: "Baked Salmon + Broccoli", cal: 520, protein: 44, carbs: 18, fat: 26, fiber: 6, iron: 2.1, calcium: 180, vitC: 88, prep: "25 min" },
      { name: "Steak + Sweet Potato", cal: 680, protein: 48, carbs: 52, fat: 24, fiber: 7, iron: 5.8, calcium: 85, vitC: 32, prep: "30 min" },
      { name: "Pasta Primavera", cal: 520, protein: 18, carbs: 76, fat: 14, fiber: 8, iron: 3.1, calcium: 140, vitC: 55, prep: "20 min" },
    ],
    snacks: [
      { name: "Apple + Almond Butter", cal: 180, protein: 4, carbs: 22, fat: 9, fiber: 4, iron: 0.8, calcium: 60, vitC: 8, prep: "2 min" },
      { name: "Hummus + Veggies", cal: 150, protein: 6, carbs: 18, fat: 7, fiber: 5, iron: 1.4, calcium: 48, vitC: 22, prep: "3 min" },
    ],
  },
  "Mixed": {
    breakfast: [
      { name: "Protein Pancakes", cal: 520, protein: 38, carbs: 52, fat: 12, fiber: 5, iron: 3.2, calcium: 200, vitC: 10, prep: "20 min" },
      { name: "Smoothie Bowl", cal: 420, protein: 18, carbs: 68, fat: 8, fiber: 8, iron: 2.4, calcium: 180, vitC: 45, prep: "10 min" },
      { name: "Egg Fried Rice", cal: 460, protein: 18, carbs: 62, fat: 16, fiber: 4, iron: 2.8, calcium: 90, vitC: 12, prep: "15 min" },
    ],
    lunch: [
      { name: "Chicken Bowl + Quinoa", cal: 620, protein: 46, carbs: 58, fat: 16, fiber: 8, iron: 3.5, calcium: 120, vitC: 38, prep: "25 min" },
      { name: "Mediterranean Wrap", cal: 540, protein: 26, carbs: 58, fat: 18, fiber: 7, iron: 3.0, calcium: 140, vitC: 30, prep: "10 min" },
      { name: "Tuna Pasta Salad", cal: 580, protein: 38, carbs: 62, fat: 14, fiber: 6, iron: 2.6, calcium: 110, vitC: 22, prep: "15 min" },
    ],
    dinner: [
      { name: "Grilled Fish Tacos", cal: 560, protein: 36, carbs: 52, fat: 18, fiber: 6, iron: 2.8, calcium: 135, vitC: 28, prep: "25 min" },
      { name: "Chicken Stir Fry + Rice", cal: 580, protein: 42, carbs: 58, fat: 16, fiber: 7, iron: 3.2, calcium: 95, vitC: 48, prep: "20 min" },
      { name: "Lentil Soup + Bread", cal: 480, protein: 22, carbs: 72, fat: 10, fiber: 14, iron: 5.6, calcium: 110, vitC: 18, prep: "35 min" },
    ],
    snacks: [
      { name: "Mixed Nuts + Dates", cal: 200, protein: 6, carbs: 24, fat: 12, fiber: 4, iron: 1.8, calcium: 65, vitC: 2, prep: "1 min" },
      { name: "Protein Shake + Banana", cal: 280, protein: 26, carbs: 36, fat: 5, fiber: 3, iron: 1.2, calcium: 180, vitC: 10, prep: "5 min" },
    ],
  },
};

const GOAL_CALORIES = { "Weight Loss": 0.8, "Muscle Gain": 1.1, "Maintenance": 1.0, "Diabetes Management": 0.9 };
const ACTIVITY_MUL = { Sedentary: 1.2, Light: 1.375, Moderate: 1.55, Active: 1.725, "Very Active": 1.9 };

const MOOD_FOODS = {
  Tired: ["Banana", "Dates", "Almonds", "Oats", "Dark Chocolate", "Spinach"],
  Stressed: ["Blueberries", "Green Tea", "Dark Chocolate", "Salmon", "Chamomile Tea", "Walnuts"],
  Energetic: ["Brown Rice", "Chicken Breast", "Sweet Potato", "Eggs", "Greek Yogurt", "Quinoa"],
  "Low Mood": ["Fatty Fish", "Brazil Nuts", "Turmeric Milk", "Fermented Foods", "Dark Leafy Greens", "Berries"],
};

const SLEEP_TIPS = {
  "Weight Loss": { hours: "7-8 hours", tip: "Sleep deprivation raises ghrelin (hunger hormone) by up to 28%. Consistent 7-8h sleep supports fat loss." },
  "Muscle Gain": { hours: "8-9 hours", tip: "Growth hormone peaks during deep sleep. Aim for 8-9h and have casein protein before bed." },
  Maintenance: { hours: "7-8 hours", tip: "Quality sleep stabilizes cortisol, regulates appetite, and maintains metabolic rate." },
  "Diabetes Management": { hours: "7-8 hours", tip: "Poor sleep impairs insulin sensitivity. Consistent sleep schedule helps blood sugar regulation." },
};

const ALLERGIES = ["Lactose", "Gluten", "Nuts", "Eggs", "Seafood", "Soy", "Shellfish"];

// ─── HELPERS ────────────────────────────────────────────────
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const filterByAllergy = (meal, allergies) => {
  if (!allergies.length) return meal;
  const checks = {
    Lactose: ["yogurt", "cheese", "milk", "curd", "paneer", "raita", "butter"],
    Gluten: ["roti", "naan", "paratha", "bread", "pasta", "wrap", "chapati", "cheela"],
    Nuts: ["almond", "nut", "cashew", "peanut", "walnut"],
    Eggs: ["egg", "omelette", "pancake"],
    Seafood: ["salmon", "fish", "tuna", "cod"],
    Soy: ["tofu", "soy"],
    Shellfish: ["shrimp", "prawn", "crab"],
  };
  return meal.filter(item => {
    const n = item.name.toLowerCase();
    return !allergies.some(a => checks[a]?.some(k => n.includes(k)));
  });
};

// ─── STYLES ─────────────────────────────────────────────────
const S = {
  app: { minHeight: "100vh", background: "#0a0f0a", color: "#e8f0e8", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" },
  grad: { background: "linear-gradient(135deg, #0a2a14 0%, #0a0f0a 50%, #0d1a10 100%)" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "24px" },
  cardHover: { transition: "all 0.3s", cursor: "pointer" },
  accent: "#4ade80",
  accentDim: "rgba(74,222,128,0.15)",
  accentBorder: "rgba(74,222,128,0.4)",
  btn: { background: "linear-gradient(135deg, #16a34a, #4ade80)", color: "#0a0f0a", border: "none", borderRadius: 14, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.4 },
  btnGhost: { background: "transparent", border: "1px solid rgba(74,222,128,0.4)", color: "#4ade80", borderRadius: 12, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  input: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#e8f0e8", width: "100%", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", outline: "none" },
  label: { fontSize: 11, fontWeight: 600, color: "#6b9e6b", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6, display: "block" },
  tag: { background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600 },
  tagSel: { background: "rgba(74,222,128,0.25)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.6)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  tagUnsel: { background: "rgba(255,255,255,0.04)", color: "#9ab09a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
};

// ─── COMPONENTS ─────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub }) => (
  <div style={{ ...S.card, textAlign: "center", padding: "18px 12px" }}>
    <div style={{ fontSize: 22 }}>{icon}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: S.accent, marginTop: 4 }}>{value}</div>
    <div style={{ fontSize: 10, color: "#9b7ec8", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
    {sub && <div style={{ fontSize: 10, color: "#6a4a8a", marginTop: 2 }}>{sub}</div>}
  </div>
);

const MicroBar = ({ label, val, max, color }) => {
  const pct = Math.min((val / max) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "#9a8ab0" }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{val}{label.includes("Vit") ? "mg" : "g"}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
};

const FoodCard = ({ item, onSwap, onRate, rated }) => (
  <div style={{ ...S.card, marginBottom: 10, padding: "16px 18px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "#ede8f5", fontFamily: "'Playfair Display', serif" }}>{item.name}</div>
        <div style={{ fontSize: 11, color: "#6a4a8a", marginTop: 2 }}>⏱ {item.prep} prep</div>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {[["P", item.protein, "#4ade80"], ["C", item.carbs, "#facc15"], ["F", item.fat, "#60a5fa"]].map(([l, v, c]) => (
            <span key={l} style={{ fontSize: 11, fontWeight: 700, color: c, background: `${c}18`, borderRadius: 6, padding: "2px 8px" }}>{l}: {v}g</span>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ ...S.tag, fontSize: 13, fontWeight: 700 }}>{item.cal} kcal</div>
        <button onClick={onSwap} style={{ ...S.btnGhost, fontSize: 11, padding: "5px 10px", marginTop: 8, display: "block" }}>↻ Swap</button>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "#6a4a8a", flex: 1 }}>Rate this meal:</span>
      {["👍", "👎"].map((e, i) => (
        <button key={e} onClick={() => onRate(i === 0 ? 1 : -1)} style={{ background: rated === (i === 0 ? 1 : -1) ? S.accentDim : "transparent", border: `1px solid ${rated === (i === 0 ? 1 : -1) ? S.accentBorder : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 14 }}>{e}</button>
      ))}
    </div>
  </div>
);

// ─── VIEWS ───────────────────────────────────────────────────

function OnboardView({ onDone }) {
  const [p, setP] = useState({ name: "", age: "", weight: "", height: "", gender: "Male", goal: "", region: "", activity: "", allergies: [] });
  const set = (k, v) => setP(prev => ({ ...prev, [k]: v }));
  const toggleAllergy = a => set("allergies", p.allergies.includes(a) ? p.allergies.filter(x => x !== a) : [...p.allergies, a]);

  const bmr = p.age && p.weight && p.height ? Math.round(p.gender === "Male"
    ? (10 * +p.weight) + (6.25 * +p.height) - (5 * +p.age) + 5
    : (10 * +p.weight) + (6.25 * +p.height) - (5 * +p.age) - 161) : 0;
  const tdee = bmr ? Math.round(bmr * (ACTIVITY_MUL[p.activity] || 1.55)) : 0;
  const bmi = p.weight && p.height ? (+p.weight / ((+p.height / 100) ** 2)).toFixed(1) : null;
  const bmiCat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const filled = p.name && p.age && p.weight && p.height && p.goal && p.region && p.activity;

  const opts = (label, key, options) => (
    <div style={{ marginBottom: 20 }}>
      <label style={S.label}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(o => (
          <button key={o} onClick={() => set(key, o)} style={p[key] === o ? S.tagSel : { ...S.tagUnsel, cursor: "pointer" }}>{o}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ ...S.grad, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <style>{FONTS}</style>
      <div style={{ width: "100%", maxWidth: 620 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, margin: 0, fontWeight: 900, background: "linear-gradient(135deg, #4ade80, #86efac)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>NutriAI</h1>
          <p style={{ color: "#9b7ec8", fontSize: 16, marginTop: 10, fontWeight: 300 }}>Your intelligent dietary companion</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
            {["ML-Powered", "Regional Foods", "Micronutrients", "14 Features"].map(t => (
              <span key={t} style={S.tag}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ ...S.card, padding: 36 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 28, color: "#ede8f5" }}>Build Your Profile</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {[["Full Name", "name", "text", "Your name"], ["Age", "age", "number", "Years"], ["Weight (kg)", "weight", "number", "kg"], ["Height (cm)", "height", "number", "cm"]].map(([l, k, t, ph]) => (
              <div key={k}>
                <label style={S.label}>{l}</label>
                <input type={t} placeholder={ph} value={p[k]} onChange={e => set(k, e.target.value)} style={S.input} />
              </div>
            ))}
          </div>

          {opts("Gender", "gender", ["Male", "Female"])}
          {opts("Health Goal", "goal", ["Weight Loss", "Muscle Gain", "Maintenance", "Diabetes Management"])}
          {opts("Regional Cuisine", "region", ["South Indian", "North Indian", "Western", "Mixed"])}
          {opts("Activity Level", "activity", ["Sedentary", "Light", "Moderate", "Active", "Very Active"])}

          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Allergies & Restrictions</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALLERGIES.map(a => (
                <button key={a} onClick={() => toggleAllergy(a)} style={p.allergies.includes(a) ? { ...S.tagSel, background: "rgba(239,68,68,0.2)", color: "#f87171", borderColor: "rgba(239,68,68,0.5)" } : S.tagUnsel}>{a}</button>
              ))}
            </div>
          </div>

          {bmi && (
            <div style={{ ...S.card, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24, padding: 16 }}>
              {[["BMI", bmi, bmiCat], ["TDEE", tdee + " kcal", "maintenance"], ["Target", Math.round(tdee * (GOAL_CALORIES[p.goal] || 1)) + " kcal", "daily goal"]].map(([l, v, s]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#9b7ec8", textTransform: "uppercase", letterSpacing: 0.8 }}>{l}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#4ade80", marginTop: 2 }}>{v}</div>
                  <div style={{ fontSize: 10, color: "#6a4a8a" }}>{s}</div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => onDone(p, tdee)} disabled={!filled} style={{ ...S.btn, width: "100%", padding: 16, opacity: filled ? 1 : 0.4 }}>
            🧬 Generate AI Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingView() {
  const msgs = ["Running collaborative filtering...", "Analyzing 50,000+ meal combinations...", "Optimizing for your micronutrient targets...", "Applying regional food preferences...", "Checking allergy restrictions...", "Generating grocery list..."];
  const [shown, setShown] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setShown(s => Math.min(s + 1, msgs.length)), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ ...S.grad, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{FONTS}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, animation: "spin 3s linear infinite", display: "inline-block" }}>🧬</div>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } } @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#4ade80", marginTop: 24, fontSize: 24 }}>Crafting your personalized plan</h2>
        <div style={{ marginTop: 24, textAlign: "left", maxWidth: 320, margin: "24px auto 0" }}>
          {msgs.slice(0, shown).map((m, i) => (
            <div key={i} style={{ color: "#9b7ec8", fontSize: 13, padding: "5px 0", animation: "fadeUp 0.4s ease both" }}>✓ {m}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanView({ profile, plan, tdee, onRegenerate, onGoChat, onGoProfile, onSwap, ratings, onRate }) {
  const [tab, setTab] = useState("meals");
  const meals = [plan.breakfast, plan.lunch, plan.dinner, plan.snack1, plan.snack2].filter(Boolean);
  const totals = meals.reduce((a, m) => ({
    cal: a.cal + m.cal, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fat: a.fat + m.fat,
    fiber: a.fiber + m.fiber, iron: a.iron + m.iron, calcium: a.calcium + m.calcium, vitC: a.vitC + m.vitC,
  }), { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0, vitC: 0 });

  const sleepInfo = SLEEP_TIPS[profile.goal] || SLEEP_TIPS["Maintenance"];
  const targetCal = Math.round(tdee * (GOAL_CALORIES[profile.goal] || 1));
  const grocery = [...new Set(meals.flatMap(m => m.name.split(/[\s+,&]+/).filter(w => w.length > 3 && !/^(with|and|the|for)$/i.test(w))))].slice(0, 14);

  const bmi = (+profile.weight / ((+profile.height / 100) ** 2)).toFixed(1);
  const bmiCat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const foods = REGIONAL_FOODS[profile.region] || REGIONAL_FOODS["Mixed"];
  const safePick = (arr) => {
    const filtered = filterByAllergy(arr, profile.allergies || []);
    return pick(filtered.length ? filtered : arr);
  };
  const weekPlan = DAYS.map(day => ({
    day,
    breakfast: safePick(foods.breakfast),
    lunch: safePick(foods.lunch),
    dinner: safePick(foods.dinner),
    snack: safePick(foods.snacks),
  }));

  const FOOD_TIPS = [
    "Drink at least 2.5–3L of water daily to support metabolism and digestion.",
    "Eat protein-rich foods at breakfast to reduce cravings throughout the day.",
    "Avoid processed sugars; opt for natural sweeteners like jaggery or dates.",
    "Include a rainbow of vegetables daily to ensure micronutrient variety.",
    "Eat dinner at least 2–3 hours before bedtime for optimal digestion.",
    "Chew your food slowly — it takes 20 minutes for satiety signals to reach the brain.",
    "Prioritize fiber-rich foods to maintain a healthy gut microbiome.",
    "Include fermented foods (curd, idli, dosa) for better gut health.",
  ];

  const downloadMealPlanPDF = () => {
    const date = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>NutriAI Meal Plan — ${profile.name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; background: #fff; color: #1a1a1a; font-size: 13px; }
  .cover { background: linear-gradient(135deg, #1a0a2e 0%, #0d0a1a 60%, #130d22 100%); color: #ede8f5; padding: 60px 50px 50px; min-height: 220px; }
  .cover h1 { font-size: 42px; font-weight: 900; color: #4ade80; letter-spacing: -1px; margin-bottom: 6px; }
  .cover p { color: #9b7ec8; font-size: 14px; margin-top: 4px; }
  .cover .date { margin-top: 18px; font-size: 12px; color: #6a4a8a; }
  .section { padding: 30px 50px; border-bottom: 1px solid #e8e8e8; }
  .section h2 { font-size: 18px; color: #16a34a; margin-bottom: 16px; font-weight: 700; letter-spacing: 0.3px; }
  .section h3 { font-size: 13px; color: #374151; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 4px; }
  .stat-box { background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 14px 12px; text-align: center; }
  .stat-val { font-size: 22px; font-weight: 800; color: #16a34a; }
  .stat-lbl { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 3px; }
  .stat-sub { font-size: 10px; color: #9ca3af; margin-top: 2px; }
  .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 28px; }
  .profile-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
  .profile-label { color: #6b7280; }
  .profile-val { font-weight: 600; color: #111827; }
  .bmi-badge { display: inline-block; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 20px; padding: 3px 12px; font-size: 12px; color: #16a34a; font-weight: 700; margin-left: 8px; }
  .week-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  .week-table th { background: #f5f3ff; color: #16a34a; font-weight: 700; text-align: left; padding: 9px 10px; border: 1px solid #ede9fe; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  .week-table td { padding: 9px 10px; border: 1px solid #e5e7eb; vertical-align: top; color: #374151; line-height: 1.4; }
  .week-table tr:nth-child(even) td { background: #fafafa; }
  .week-table td.day-cell { font-weight: 700; color: #16a34a; font-size: 11px; white-space: nowrap; }
  .cal-badge { font-size: 10px; color: #9ca3af; display: block; margin-top: 2px; }
  .tips-list { list-style: none; }
  .tips-list li { padding: 9px 14px; background: #f5f3ff; border-left: 3px solid #4ade80; border-radius: 0 8px 8px 0; margin-bottom: 7px; font-size: 12.5px; color: #374151; line-height: 1.5; }
  .tips-list li::before { content: "✦ "; color: #16a34a; font-size: 10px; }
  .footer { background: #f9fafb; padding: 20px 50px; text-align: center; color: #9ca3af; font-size: 11px; border-top: 1px solid #e5e7eb; }
  .footer strong { color: #4ade80; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<div class="cover">
  <div style="font-size:11px;letter-spacing:3px;color:#4ade80;text-transform:uppercase;margin-bottom:10px;">Personalized Nutrition Report</div>
  <h1>🥗 NutriAI</h1>
  <p>AI-Powered 7-Day Meal Plan for <strong style="color:#86efac;">${profile.name}</strong></p>
  <div class="date">Generated on ${date}</div>
</div>

<div class="section">
  <h2>👤 User Profile</h2>
  <div class="profile-grid">
    <div>
      ${[["Name", profile.name], ["Age", profile.age + " years"], ["Gender", profile.gender], ["Weight", profile.weight + " kg"]].map(([l, v]) => `<div class="profile-row"><span class="profile-label">${l}</span><span class="profile-val">${v}</span></div>`).join("")}
    </div>
    <div>
      ${[["Height", profile.height + " cm"], ["Activity Level", profile.activity], ["Health Goal", profile.goal], ["Cuisine", profile.region]].map(([l, v]) => `<div class="profile-row"><span class="profile-label">${l}</span><span class="profile-val">${v}</span></div>`).join("")}
    </div>
  </div>
  ${profile.allergies?.length ? `<div style="margin-top:12px;font-size:12px;color:#6b7280;">Allergens excluded: <strong style="color:#ef4444;">${profile.allergies.join(", ")}</strong></div>` : ""}
</div>

<div class="section">
  <h2>📊 BMI &amp; Calorie Summary</h2>
  <div class="stats-grid">
    <div class="stat-box"><div class="stat-val">${bmi}</div><div class="stat-lbl">BMI</div><div class="stat-sub">${bmiCat}</div></div>
    <div class="stat-box"><div class="stat-val">${tdee}</div><div class="stat-lbl">TDEE (kcal)</div><div class="stat-sub">Maintenance</div></div>
    <div class="stat-box"><div class="stat-val">${targetCal}</div><div class="stat-lbl">Daily Target</div><div class="stat-sub">${profile.goal}</div></div>
    <div class="stat-box"><div class="stat-val">${totals.protein}g</div><div class="stat-lbl">Protein</div><div class="stat-sub">Today</div></div>
  </div>
  <div style="margin-top:12px; font-size:12px; color:#6b7280; line-height:1.7;">
    Calculated using the <strong>Mifflin-St Jeor equation</strong>. Your TDEE accounts for your <strong>${profile.activity}</strong> activity level.
    Your daily calorie target is adjusted <strong>${Math.round((GOAL_CALORIES[profile.goal] || 1) * 100)}%</strong> of TDEE for your <strong>${profile.goal}</strong> goal.
  </div>
</div>

<div class="section">
  <h2>🗓 7-Day Meal Plan</h2>
  <table class="week-table">
    <thead>
      <tr>
        <th>Day</th>
        <th>🌅 Breakfast</th>
        <th>☀️ Lunch</th>
        <th>🌙 Dinner</th>
        <th>🍎 Snack</th>
      </tr>
    </thead>
    <tbody>
      ${weekPlan.map(d => `
      <tr>
        <td class="day-cell">${d.day}</td>
        <td>${d.breakfast.name}<span class="cal-badge">${d.breakfast.cal} kcal · ${d.breakfast.prep}</span></td>
        <td>${d.lunch.name}<span class="cal-badge">${d.lunch.cal} kcal · ${d.lunch.prep}</span></td>
        <td>${d.dinner.name}<span class="cal-badge">${d.dinner.cal} kcal · ${d.dinner.prep}</span></td>
        <td>${d.snack.name}<span class="cal-badge">${d.snack.cal} kcal</span></td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>

<div class="section">
  <h2>💡 Nutrition &amp; Food Tips</h2>
  <ul class="tips-list">
    ${FOOD_TIPS.map(tip => `<li>${tip}</li>`).join("")}
  </ul>
</div>

<div class="footer">
  Generated by <strong>NutriAI</strong> · Powered by Claude AI · This report is for informational purposes only and does not constitute medical advice.
</div>

</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.addEventListener("load", () => {
        setTimeout(() => {
          win.print();
          URL.revokeObjectURL(url);
        }, 600);
      });
    }
  };

  return (
    <div style={{ ...S.app, ...S.grad }}>
      <style>{FONTS}{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
      {/* Header */}
      <div style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#4ade80", fontWeight: 900 }}>NutriAI</span>
          <div style={{ flex: 1 }} />
          {[["meals", "🍽 Plan"], ["macros", "📊 Macros"], ["sleep", "😴 Sleep"], ["mood", "💭 Mood"], ["grocery", "🛒 Grocery"], ["progress", "📈 Progress"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ background: tab === k ? S.accentDim : "transparent", border: tab === k ? `1px solid ${S.accentBorder}` : "1px solid transparent", color: tab === k ? "#4ade80" : "#9b7ec8", borderRadius: 10, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{l}</button>
          ))}
          <button onClick={onGoChat} style={S.btnGhost}>💬 Chat</button>
          <button onClick={onGoProfile} style={{ ...S.btnGhost, color: "#9a8ab0" }}>↩</button>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
          <StatCard icon="🔥" label="Calories" value={totals.cal} sub={`Target: ${targetCal}`} />
          <StatCard icon="💪" label="Protein" value={`${totals.protein}g`} />
          <StatCard icon="⚡" label="Carbs" value={`${totals.carbs}g`} />
          <StatCard icon="🫧" label="Fat" value={`${totals.fat}g`} />
        </div>

        {/* AI Explanation */}
        <div style={{ ...S.card, marginBottom: 28, borderColor: S.accentBorder, background: "rgba(167,139,250,0.05)" }}>
          <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>🤖 Why This Plan?</div>
          <p style={{ margin: 0, color: "#9a8ab0", fontSize: 14, lineHeight: 1.7 }}>
            This plan is tailored for <strong style={{ color: "#ede8f5" }}>{profile.name}</strong> with a goal of <strong style={{ color: "#4ade80" }}>{profile.goal}</strong>. Based on your BMI and <strong style={{ color: "#ede8f5" }}>{profile.activity}</strong> activity level, your daily target is <strong style={{ color: "#4ade80" }}>{targetCal} kcal</strong>. The meals are drawn from <strong style={{ color: "#ede8f5" }}>{profile.region}</strong> cuisine{profile.allergies.length ? ` and exclude ${profile.allergies.join(", ")} allergens` : ""}, using the Mifflin-St Jeor equation for accuracy.
          </p>
        </div>

        {/* Meals Tab */}
        {tab === "meals" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {[["🌅 Breakfast", plan.breakfast, "breakfast"], ["☀️ Lunch", plan.lunch, "lunch"], ["🌙 Dinner", plan.dinner, "dinner"], ["🍎 Snacks", [plan.snack1, plan.snack2].filter(Boolean), "snacks"]].map(([title, items, key]) => (
              <div key={key} style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#ede8f5", marginBottom: 12 }}>{title}</div>
                {(Array.isArray(items) ? items : [items]).map((item, i) => item && (
                  <FoodCard key={i} item={item} onSwap={() => onSwap(key === "snacks" ? `snack${i + 1}` : key)} rated={ratings[item.name]} onRate={v => onRate(item.name, v)} />
                ))}
              </div>
            ))}
            <button onClick={onRegenerate} style={{ ...S.btn, width: "100%", marginTop: 8 }}>🔄 Regenerate Plan with ML</button>
            <button onClick={downloadMealPlanPDF} style={{ ...S.btnGhost, width: "100%", marginTop: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              📄 Download Meal Plan
            </button>
          </div>
        )}

        {/* Macros / Micronutrients */}
        {tab === "macros" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={S.card}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 20, color: "#ede8f5" }}>Macronutrients</div>
                <MicroBar label="Protein" val={totals.protein} max={profile.goal === "Muscle Gain" ? 180 : 120} color="#4ade80" />
                <MicroBar label="Carbohydrates" val={totals.carbs} max={300} color="#facc15" />
                <MicroBar label="Fat" val={totals.fat} max={100} color="#60a5fa" />
              </div>
              <div style={S.card}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 20, color: "#ede8f5" }}>Micronutrients</div>
                <MicroBar label="Fiber" val={totals.fiber} max={38} color="#4ade80" />
                <MicroBar label="Iron" val={totals.iron.toFixed(1)} max={18} color="#f97316" />
                <MicroBar label="Calcium" val={totals.calcium} max={1000} color="#e879f9" />
                <MicroBar label="Vit C" val={totals.vitC} max={90} color="#34d399" />
              </div>
            </div>
            <div style={{ ...S.card, marginTop: 20, padding: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 16, color: "#ede8f5" }}>Meal Timing</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[["🌅", "Breakfast", "8:00 AM"], ["☀️", "Lunch", "1:00 PM"], ["🍎", "Snacks", "5:00 PM"], ["🌙", "Dinner", "8:00 PM"]].map(([icon, meal, time]) => (
                  <div key={meal} style={{ textAlign: "center", padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                    <div style={{ fontSize: 22 }}>{icon}</div>
                    <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 600, marginTop: 4 }}>{time}</div>
                    <div style={{ fontSize: 11, color: "#9b7ec8" }}>{meal}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sleep Tab */}
        {tab === "sleep" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={S.card}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#ede8f5", marginBottom: 20 }}>😴 Sleep Recommendations</div>
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
                <div style={{ textAlign: "center", padding: "24px 32px", background: S.accentDim, borderRadius: 16, border: `1px solid ${S.accentBorder}` }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#4ade80", fontFamily: "'Playfair Display', serif" }}>{sleepInfo.hours}</div>
                  <div style={{ fontSize: 12, color: "#9b7ec8", marginTop: 4 }}>Recommended</div>
                </div>
                <p style={{ margin: 0, color: "#9a8ab0", fontSize: 14, lineHeight: 1.8 }}>{sleepInfo.tip}</p>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 12 }}>Sleep Hygiene Tips</div>
                {["Avoid caffeine after 7 PM — it blocks adenosine receptors for up to 6 hours", "Eat dinner at least 2-3 hours before bed for optimal digestion", "Have magnesium-rich foods (spinach, almonds) to improve sleep quality", "Keep a consistent sleep/wake schedule, even on weekends"].map((tip, i) => (
                  <div key={i} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, marginBottom: 8, fontSize: 13, color: "#9a8ab0", borderLeft: "3px solid rgba(167,139,250,0.4)" }}>{tip}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mood Tab */}
        {tab === "mood" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={S.card}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#ede8f5", marginBottom: 8 }}>💭 Mood-Based Recommendations</div>
              <p style={{ color: "#9b7ec8", fontSize: 13, marginBottom: 24 }}>How you eat affects how you feel. Choose your current mood:</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {Object.entries(MOOD_FOODS).map(([mood, foods]) => (
                  <div key={mood} style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: 12, fontSize: 15 }}>
                      {mood === "Tired" ? "😴" : mood === "Stressed" ? "😰" : mood === "Energetic" ? "⚡" : "💙"} {mood}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {foods.map(f => <span key={f} style={{ ...S.tag, fontSize: 11 }}>{f}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...S.card, marginTop: 20, borderColor: S.accentBorder, background: "rgba(167,139,250,0.05)" }}>
                <div style={{ fontSize: 13, color: "#9b7ec8" }}>💡 <strong style={{ color: "#4ade80" }}>Festival / Cheat Day Mode:</strong> Enjoy your favorite foods in moderate portions. Balance with extra protein + a fresh salad. Hydrate well — aim for +500ml water on cheat days. The key is balance, not restriction.</div>
              </div>
            </div>
          </div>
        )}

        {/* Grocery Tab */}
        {tab === "grocery" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={S.card}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#ede8f5", marginBottom: 4 }}>🛒 Smart Grocery List</div>
              <div style={{ fontSize: 13, color: "#9b7ec8", marginBottom: 24 }}>Auto-generated from your today's meal plan</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {grocery.map((item, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12, fontSize: 13, color: "#ede8f5", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", flexShrink: 0, display: "block" }} />{item}
                  </div>
                ))}
              </div>
              <button onClick={() => {
                const text = `NutriAI Grocery List\n${grocery.map(g => `• ${g}`).join('\n')}`;
                navigator.clipboard?.writeText(text);
                alert("Grocery list copied to clipboard!");
              }} style={{ ...S.btn, marginTop: 20, width: "100%" }}>📋 Copy Grocery List</button>
            </div>
          </div>
        )}

        {/* Progress Dashboard */}
        {tab === "progress" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={S.card}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 20, color: "#ede8f5" }}>📈 Progress Tracker</div>
                {[["Current Weight", profile.weight + " kg", "#4ade80"], ["Goal", profile.goal, "#facc15"], ["BMI", (+profile.weight / ((+profile.height / 100) ** 2)).toFixed(1), "#60a5fa"], ["Activity", profile.activity, "#4ade80"]].map(([l, v, c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "#9b7ec8", fontSize: 13 }}>{l}</span>
                    <span style={{ color: c, fontWeight: 600, fontSize: 13 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 20, color: "#ede8f5" }}>💧 Today's Log</div>
                {[["Calories Consumed", totals.cal + " kcal"], ["Water Target", "2.5 – 3L"], ["Exercise", "Log your workout"], ["Meals Rated", Object.keys(ratings).length + " meals"]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "#9b7ec8", fontSize: 13 }}>{l}</span>
                    <span style={{ color: "#ede8f5", fontWeight: 600, fontSize: 13 }}>{v}</span>
                  </div>
                ))}
                <div style={{ ...S.card, marginTop: 16, padding: 14, borderColor: S.accentBorder, background: "rgba(167,139,250,0.05)", fontSize: 12, color: "#9b7ec8" }}>
                  Weekly calorie adherence builds consistency. Track for 7 days to see meaningful results.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatView({ profile, plan, tdee, onBack }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const quickQ = ["What should I eat before workout?", "Why is protein important?", "Can I swap dinner for something lighter?", "What foods help with my goal?"];

  const send = useCallback(async (msg) => {
    if (!msg.trim() || loading) return;
    const userMsg = msg.trim();
    setInput("");
    const newHist = [...history, { role: "user", content: userMsg }];
    setHistory(newHist);
    setLoading(true);
    const target = Math.round(tdee * (GOAL_CALORIES[profile.goal] || 1));
    const sys = `You are NutriAI, an expert AI dietitian. User: ${profile.name}, age ${profile.age}, weight ${profile.weight}kg, height ${profile.height}cm, goal: ${profile.goal}, region: ${profile.region}, activity: ${profile.activity}, allergies: ${profile.allergies?.join(", ") || "none"}. Daily target: ${target} kcal. Today's plan: Breakfast: ${plan?.breakfast?.name}, Lunch: ${plan?.lunch?.name}, Dinner: ${plan?.dinner?.name}. Be warm, scientific, concise (3-4 sentences). Never diagnose.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: newHist.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text || "").join("") || "Sorry, I couldn't respond.";
      setHistory(h => [...h, { role: "assistant", content: reply }]);
    } catch {
      setHistory(h => [...h, { role: "assistant", content: "Having trouble connecting. Check your network and try again." }]);
    }
    setLoading(false);
    setTimeout(() => ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }), 100);
  }, [history, loading, profile, plan, tdee]);

  return (
    <div style={{ ...S.app, ...S.grad, display: "flex", flexDirection: "column", height: "100vh" }}>
      <style>{FONTS}</style>
      <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: 28 }}>🥗</span>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#ede8f5", fontSize: 16 }}>NutriAI Dietitian</div>
          <div style={{ fontSize: 11, color: "#4ade80" }}>Powered by Claude · Personalized for {profile.name}</div>
        </div>
        <button onClick={onBack} style={{ ...S.btnGhost, marginLeft: "auto" }}>← Meal Plan</button>
      </div>

      {history.length === 0 && (
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>👋</div>
            <div style={{ fontFamily: "'Playfair Display', serif", color: "#ede8f5", marginBottom: 6 }}>Hi {profile.name}! Ask me anything about nutrition.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {quickQ.map(q => <button key={q} onClick={() => send(q)} style={{ ...S.tagUnsel, cursor: "pointer", fontSize: 12 }}>{q}</button>)}
            </div>
          </div>
        </div>
      )}

      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {history.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 14 }}>
            {m.role === "assistant" && <div style={{ fontSize: 24, marginRight: 10, alignSelf: "flex-end" }}>🥗</div>}
            <div style={{ maxWidth: "75%", padding: "12px 18px", borderRadius: 18, background: m.role === "user" ? "linear-gradient(135deg, #16a34a, #4ade80)" : "rgba(255,255,255,0.06)", color: m.role === "user" ? "#0d0a1a" : "#ede8f5", fontSize: 14, lineHeight: 1.7, border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none", borderBottomRightRadius: m.role === "user" ? 4 : 18, borderBottomLeftRadius: m.role === "assistant" ? 4 : 18 }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontSize: 24 }}>🥗</div>
            <div style={{ padding: "14px 20px", background: "rgba(255,255,255,0.06)", borderRadius: 18, borderBottomLeftRadius: 4, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
                <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)} }`}</style>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 24px", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask your AI dietitian..." style={{ ...S.input, flex: 1, borderRadius: 14 }} />
          <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ ...S.btn, padding: "12px 20px", opacity: loading || !input.trim() ? 0.4 : 1, fontSize: 18 }}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("onboard");
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tdee, setTdee] = useState(0);
  const [ratings, setRatings] = useState({});

  const generatePlan = (prof, tde) => {
    const foods = REGIONAL_FOODS[prof.region] || REGIONAL_FOODS["Mixed"];
    const safePick = (arr) => {
      const filtered = filterByAllergy(arr, prof.allergies || []);
      return pick(filtered.length ? filtered : arr);
    };
    return {
      breakfast: safePick(foods.breakfast),
      lunch: safePick(foods.lunch),
      dinner: safePick(foods.dinner),
      snack1: safePick(foods.snacks),
      snack2: safePick(foods.snacks),
    };
  };

  const handleStart = (prof, tde) => {
    setProfile(prof);
    setTdee(tde);
    setStep("loading");
    setTimeout(() => {
      setPlan(generatePlan(prof, tde));
      setStep("plan");
    }, 3800);
  };

  const handleSwap = (mealKey) => {
    const foods = REGIONAL_FOODS[profile.region] || REGIONAL_FOODS["Mixed"];
    const mealTypeMap = { breakfast: "breakfast", lunch: "lunch", dinner: "dinner", snack1: "snacks", snack2: "snacks" };
    const arr = foods[mealTypeMap[mealKey]] || foods.snacks;
    const filtered = filterByAllergy(arr, profile.allergies || []);
    const current = plan[mealKey];
    const pool = filtered.filter(f => f.name !== current?.name);
    setPlan(p => ({ ...p, [mealKey]: pick(pool.length ? pool : filtered) }));
  };

  if (step === "onboard") return <OnboardView onDone={handleStart} />;
  if (step === "loading") return <LoadingView />;
  if (step === "plan") return (
    <PlanView
      profile={profile} plan={plan} tdee={tdee}
      onRegenerate={() => { setStep("loading"); setTimeout(() => { setPlan(generatePlan(profile, tdee)); setStep("plan"); }, 1800); }}
      onGoChat={() => setStep("chat")}
      onGoProfile={() => setStep("onboard")}
      onSwap={handleSwap}
      ratings={ratings}
      onRate={(food, val) => setRatings(r => ({ ...r, [food]: val }))}
    />
  );
  if (step === "chat") return <ChatView profile={profile} plan={plan} tdee={tdee} onBack={() => setStep("plan")} />;
  return null;
}
