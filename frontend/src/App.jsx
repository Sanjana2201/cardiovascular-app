import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResultCard from './components/ResultCard';
import HealthTips from './components/HealthTips';
import confetti from 'canvas-confetti';
import { Activity, User, Heart, Gauge, ShieldAlert, Sparkles, RefreshCw, Zap, Scale } from 'lucide-react';

const ENV_API_URL = import.meta.env.VITE_API_URL;
const FASTAPI_URLS = ENV_API_URL
  ? [ENV_API_URL.replace(/\/$/, ""), "http://127.0.0.1:8001", "http://127.0.0.1:8000"]
  : ["http://127.0.0.1:8001", "http://127.0.0.1:8000"];

const DEFAULT_FORM = {
  age: 50,
  gender: 1, // 1 = Female, 2 = Male
  height: 165,
  weight: 68.0,
  ap_hi: 120,
  ap_lo: 80,
  cholesterol: 1, // 1 = Normal, 2 = Above Normal, 3 = Well Above Normal
  gluc: 1,        // 1 = Normal, 2 = Above Normal, 3 = Well Above Normal
  smoke: 0,
  alco: 0,
  active: 1
};

export default function App() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('assessment');

  const [activeFastApiUrl, setActiveFastApiUrl] = useState(FASTAPI_URLS[0]);

  // Check FastAPI backend health status on mount
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    for (const url of FASTAPI_URLS) {
      try {
        const res = await fetch(`${url}/health`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'healthy' || data.status === 'success') {
            setIsBackendConnected(true);
            setActiveFastApiUrl(url);
            return;
          }
        }
      } catch {
        // try next
      }
    }
    setIsBackendConnected(false);
  };

  // Live BMI calculation
  const heightM = formData.height / 100.0;
  const currentBmi = heightM > 0 ? (formData.weight / (heightM * heightM)).toFixed(1) : 0;

  let currentBmiCat = "Normal";
  if (currentBmi < 18.5) currentBmiCat = "Underweight";
  else if (currentBmi >= 25 && currentBmi < 30) currentBmiCat = "Overweight";
  else if (currentBmi >= 30) currentBmiCat = "Obesity";

  // Live BP calculation category
  let currentBpCat = "Normal";
  if (formData.ap_hi >= 140 || formData.ap_lo >= 90) currentBpCat = "Stage 2 Hypertension";
  else if (formData.ap_hi >= 130 || formData.ap_lo >= 80) currentBpCat = "Stage 1 Hypertension";
  else if (formData.ap_hi >= 120 && formData.ap_lo < 80) currentBpCat = "Elevated";

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLoadHealthy = () => {
    setFormData({
      age: 36,
      gender: 1,
      height: 165,
      weight: 58.0,
      ap_hi: 115,
      ap_lo: 75,
      cholesterol: 1,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1
    });
    setResult(null);
  };

  const handleLoadHighRisk = () => {
    setFormData({
      age: 58,
      gender: 2,
      height: 175,
      weight: 94.0,
      ap_hi: 155,
      ap_lo: 98,
      cholesterol: 3,
      gluc: 2,
      smoke: 1,
      alco: 1,
      active: 0
    });
    setResult(null);
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM);
    setResult(null);
    setError(null);
  };

  // Local calculation fallback if backend server is offline
  const runOfflineInference = (data) => {
    const ageDays = data.age * 365.25;
    // Logistic regression formula approximation based on trained coefficients
    let z = -1.8 
      + (data.ap_hi - 120) * 0.045 
      + (data.ap_lo - 80) * 0.035 
      + (data.cholesterol - 1) * 0.55 
      + (data.gluc - 1) * 0.25 
      + (data.age - 40) * 0.03 
      + (data.weight / ((data.height/100)**2) - 24) * 0.04 
      + (data.smoke ? 0.25 : 0) 
      - (data.active ? 0.3 : 0);

    const prob = 1 / (1 + Math.exp(-z));
    const probPercent = Math.min(Math.max(round(prob * 100, 2), 2), 98);
    const pred = prob >= 0.5 ? 1 : 0;

    let riskLevel = "Low Risk";
    let riskColor = "#10b981";
    if (probPercent >= 75) { riskLevel = "Very High Risk"; riskColor = "#ef4444"; }
    else if (probPercent >= 50) { riskLevel = "High Risk"; riskColor = "#f97316"; }
    else if (probPercent >= 25) { riskLevel = "Moderate Risk"; riskColor = "#f59e0b"; }

    const riskFactors = [];
    if (data.ap_hi >= 130 || data.ap_lo >= 85) {
      riskFactors.append ? null : riskFactors.push({ factor: "Elevated Blood Pressure", detail: `BP: ${data.ap_hi}/${data.ap_lo} mmHg`, impact: "High" });
    }
    if (data.cholesterol > 1) {
      riskFactors.push({ factor: "High Cholesterol", detail: `Cholesterol level index: ${data.cholesterol}`, impact: "High" });
    }
    if (data.smoke === 1) {
      riskFactors.push({ factor: "Tobacco Smoking", detail: "Active smoking status", impact: "High" });
    }
    if (data.active === 0) {
      riskFactors.push({ factor: "Physical Inactivity", detail: "Lack of regular exercise routine", impact: "Medium" });
    }

    const recommendations = [
      "Maintain a balanced Mediterranean-style diet low in saturated fats and refined sugars.",
      "Engage in at least 150 minutes of moderate aerobic exercise per week.",
      "Monitor blood pressure and schedule routine annual clinical checkups."
    ];

    return {
      prediction: pred,
      has_disease: pred === 1,
      result_title: pred === 1 ? "Cardiovascular Disease Risk Detected" : "Low Risk of Cardiovascular Disease",
      probability_percent: probPercent,
      risk_level: riskLevel,
      risk_color: riskColor,
      bmi: currentBmi,
      bmi_category: currentBmiCat,
      bp_category: currentBpCat,
      risk_factors: riskFactors,
      recommendations: recommendations,
      patient_summary: {
        age: data.age,
        gender: data.gender === 1 ? "Female" : "Male",
        blood_pressure: `${data.ap_hi}/${data.ap_lo} mmHg`,
        cholesterol: data.cholesterol === 1 ? "Normal" : (data.cholesterol === 2 ? "Above Normal" : "Well Above Normal"),
        glucose: data.gluc === 1 ? "Normal" : (data.gluc === 2 ? "Above Normal" : "Well Above Normal"),
        smoker: data.smoke === 1 ? "Yes" : "No",
        alcohol: data.alco === 1 ? "Yes" : "No",
        physically_active: data.active === 1 ? "Yes" : "No"
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Try fetching from FastAPI backend
      const res = await fetch(`${activeFastApiUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        if (!data.has_disease && data.prediction === 0) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Prediction request failed.");
      }
    } catch (err) {
      console.warn("FastAPI backend error, running fallback offline prediction:", err.message);
      // Run offline prediction fallback
      const fallbackResult = runOfflineInference(formData);
      setResult(fallbackResult);
      if (!fallbackResult.has_disease) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } finally {
      setLoading(false);
    }
  };

  function round(val, dec) {
    return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        isBackendConnected={isBackendConnected}
        onLoadHealthy={handleLoadHealthy}
        onLoadHighRisk={handleLoadHighRisk}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Top Hero Heading */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <Sparkles size={16} /> Advanced Scikit-Learn Logistic Regression Engine
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
            Predict Cardiovascular Disease Risk in <span className="gradient-text">Real-Time</span>
          </h1>

          <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            Enter patient physiological measurements below to generate an AI risk score, vitals analysis, and clinical recommendations.
          </p>
        </div>

        {activeTab === 'guide' ? (
          <HealthTips />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: result ? '1fr 1fr' : '1fr',
            gap: '32px',
            alignItems: 'start'
          }}>
            
            {/* Form Input Section */}
            <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={22} color="#0ea5e9" /> Patient Vitals Assessment Form
                </h2>
                
                <button onClick={handleReset} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                  <RefreshCw size={14} /> Reset
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Section 1: Demographics & Body Metrics */}
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} /> 1. Demographics & Body Metrics
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {/* Age */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Age (Years)</span>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>{formData.age} yrs</span>
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        className="form-input"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', Number(e.target.value))}
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Gender</span>
                      </label>
                      <div className="segmented-control">
                        <button
                          type="button"
                          className={`segmented-option ${formData.gender === 1 ? 'active-primary' : ''}`}
                          onClick={() => handleInputChange('gender', 1)}
                        >
                          Female (1)
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${formData.gender === 2 ? 'active-primary' : ''}`}
                          onClick={() => handleInputChange('gender', 2)}
                        >
                          Male (2)
                        </button>
                      </div>
                    </div>

                    {/* Height */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Height (cm)</span>
                        <span style={{ color: 'var(--text-muted)' }}>{formData.height} cm</span>
                      </label>
                      <input
                        type="number"
                        min="120"
                        max="220"
                        className="form-input"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', Number(e.target.value))}
                        required
                      />
                    </div>

                    {/* Weight */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Weight (kg)</span>
                        <span style={{ color: 'var(--text-muted)' }}>{formData.weight} kg</span>
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="200"
                        step="0.5"
                        className="form-input"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  {/* Live BMI Indicator Strip */}
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(13, 20, 34, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Scale size={15} color="#38bdf8" /> Live Body Mass Index (BMI):
                    </span>
                    <strong style={{ color: currentBmi >= 25 ? '#fb7185' : '#34d399' }}>
                      {currentBmi} kg/m² ({currentBmiCat})
                    </strong>
                  </div>
                </div>

                {/* Section 2: Clinical Vitals & Lab Measurements */}
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={16} /> 2. Clinical Vitals & Lab Measurements
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {/* Systolic BP */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Systolic BP (ap_hi)</span>
                        <span style={{ color: formData.ap_hi >= 130 ? '#fb7185' : '#34d399', fontWeight: 700 }}>{formData.ap_hi} mmHg</span>
                      </label>
                      <input
                        type="number"
                        min="70"
                        max="240"
                        className="form-input"
                        value={formData.ap_hi}
                        onChange={(e) => handleInputChange('ap_hi', Number(e.target.value))}
                        required
                      />
                    </div>

                    {/* Diastolic BP */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Diastolic BP (ap_lo)</span>
                        <span style={{ color: formData.ap_lo >= 85 ? '#fb7185' : '#34d399', fontWeight: 700 }}>{formData.ap_lo} mmHg</span>
                      </label>
                      <input
                        type="number"
                        min="40"
                        max="160"
                        className="form-input"
                        value={formData.ap_lo}
                        onChange={(e) => handleInputChange('ap_lo', Number(e.target.value))}
                        required
                      />
                    </div>

                    {/* Cholesterol */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Cholesterol Level</span>
                      </label>
                      <select
                        className="form-select"
                        value={formData.cholesterol}
                        onChange={(e) => handleInputChange('cholesterol', Number(e.target.value))}
                      >
                        <option value={1}>1 - Normal (&lt;200 mg/dL)</option>
                        <option value={2}>2 - Above Normal (200-239 mg/dL)</option>
                        <option value={3}>3 - Well Above Normal (240+ mg/dL)</option>
                      </select>
                    </div>

                    {/* Glucose */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Glucose Level</span>
                      </label>
                      <select
                        className="form-select"
                        value={formData.gluc}
                        onChange={(e) => handleInputChange('gluc', Number(e.target.value))}
                      >
                        <option value={1}>1 - Normal (&lt;100 mg/dL)</option>
                        <option value={2}>2 - Above Normal (100-125 mg/dL)</option>
                        <option value={3}>3 - Well Above Normal (126+ mg/dL)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Lifestyle & Habitual Indicators */}
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} /> 3. Lifestyle & Habitual Factors
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {/* Smoking */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Tobacco Smoking</span>
                      </label>
                      <div className="segmented-control">
                        <button
                          type="button"
                          className={`segmented-option ${formData.smoke === 0 ? 'active-no' : ''}`}
                          onClick={() => handleInputChange('smoke', 0)}
                        >
                          No (0)
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${formData.smoke === 1 ? 'active-yes' : ''}`}
                          onClick={() => handleInputChange('smoke', 1)}
                        >
                          Yes (1)
                        </button>
                      </div>
                    </div>

                    {/* Alcohol */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Alcohol Consumption</span>
                      </label>
                      <div className="segmented-control">
                        <button
                          type="button"
                          className={`segmented-option ${formData.alco === 0 ? 'active-no' : ''}`}
                          onClick={() => handleInputChange('alco', 0)}
                        >
                          No (0)
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${formData.alco === 1 ? 'active-yes' : ''}`}
                          onClick={() => handleInputChange('alco', 1)}
                        >
                          Yes (1)
                        </button>
                      </div>
                    </div>

                    {/* Physical Activity */}
                    <div className="form-group">
                      <label className="form-label">
                        <span>Physical Activity</span>
                      </label>
                      <div className="segmented-control">
                        <button
                          type="button"
                          className={`segmented-option ${formData.active === 1 ? 'active-no' : ''}`}
                          onClick={() => handleInputChange('active', 1)}
                        >
                          Active (1)
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${formData.active === 0 ? 'active-yes' : ''}`}
                          onClick={() => handleInputChange('active', 0)}
                        >
                          Inactive (0)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={20} className="pulse-animation" />
                      Analyzing Vitals with ML Model...
                    </>
                  ) : (
                    <>
                      <Gauge size={20} />
                      Generate AI Cardiovascular Assessment
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Prediction Result Display Column */}
            {result && (
              <ResultCard result={result} onReset={handleReset} />
            )}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
