import React from 'react';
import { Activity, ShieldCheck, Heart, Stethoscope, Scale, Droplet, Flame } from 'lucide-react';

export default function HealthTips() {
  const bpCategories = [
    { name: 'Normal', range: '< 120 / < 80 mmHg', status: 'Optimal', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    { name: 'Elevated', range: '120-129 / < 80 mmHg', status: 'Caution', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    { name: 'Hypertension Stage 1', range: '130-139 / 80-89 mmHg', status: 'Warning', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)' },
    { name: 'Hypertension Stage 2', range: '140+ / 90+ mmHg', status: 'High Risk', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Educational Banner */}
      <div className="glass-card" style={{ padding: '28px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '10px', borderRadius: '14px', background: 'rgba(14, 165, 233, 0.15)' }}>
            <Stethoscope size={24} color="#38bdf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Cardiovascular Clinical Reference Guide</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Standard medical thresholds for blood pressure, cholesterol, and BMI evaluation.
            </p>
          </div>
        </div>

        {/* BP Threshold Table */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#38bdf8" /> Blood Pressure (BP) Classification (AHA Standards)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {bpCategories.map((bp, i) => (
              <div
                key={i}
                style={{
                  background: bp.bg,
                  border: `1px solid ${bp.color}40`,
                  borderRadius: '16px',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: bp.color }}>{bp.name}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: bp.color, color: '#000' }}>
                    {bp.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{bp.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid of Health Factors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* Cholesterol Card */}
          <div style={{ background: 'rgba(13, 20, 34, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Droplet size={20} color="#fbbf24" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Serum Cholesterol Levels</h4>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              • <strong>Level 1 (Normal):</strong> Below 200 mg/dL.<br />
              • <strong>Level 2 (Above Normal):</strong> 200-239 mg/dL.<br />
              • <strong>Level 3 (Well Above Normal):</strong> 240+ mg/dL. Excessive cholesterol causes arterial plaque build-up.
            </p>
          </div>

          {/* Glucose Card */}
          <div style={{ background: 'rgba(13, 20, 34, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Flame size={20} color="#f87171" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Fasting Blood Glucose</h4>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              • <strong>Level 1 (Normal):</strong> &lt; 100 mg/dL.<br />
              • <strong>Level 2 (Pre-diabetic):</strong> 100-125 mg/dL.<br />
              • <strong>Level 3 (Diabetic Range):</strong> 126+ mg/dL. High glucose damages blood vessel elasticity over time.
            </p>
          </div>

          {/* BMI Card */}
          <div style={{ background: 'rgba(13, 20, 34, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Scale size={20} color="#34d399" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Body Mass Index (BMI)</h4>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              • <strong>Normal:</strong> 18.5 - 24.9 kg/m².<br />
              • <strong>Overweight:</strong> 25.0 - 29.9 kg/m².<br />
              • <strong>Obesity:</strong> 30.0+ kg/m². Maintaining a healthy weight decreases cardiac workload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
