import React from 'react';
import { Heart, ShieldAlert, Cpu, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '80px',
      background: 'rgba(9, 13, 22, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '40px 24px 24px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Medical Disclaimer Box */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <ShieldAlert size={24} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
              Important Clinical & Medical Disclaimer
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              CardioCare AI is designed strictly as an educational and preliminary decision-support tool powered by machine learning algorithms (Logistic Regression on 70,000 patient records). It does not constitute a formal diagnosis, medical advice, or treatment plan. Always consult a qualified physician or cardiologist for clinical cardiovascular evaluation.
            </p>
          </div>
        </div>

        {/* Footer Navigation & Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '32px',
          marginBottom: '36px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Heart className="heartbeat-icon" size={20} />
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>CardioCare AI</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
              Empowering proactive heart health management with intelligent machine learning analytics and real-time risk factor insights.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>FastAPI</span>
              <span className="badge" style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>React</span>
              <span className="badge" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>Scikit-Learn</span>
            </div>
          </div>

          {/* Model Features */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="#38bdf8" /> Model Architecture
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>• Trained on 70,000 Anonymized Cardio Records</li>
              <li>• StandardScaler Feature Normalization</li>
              <li>• Multi-Factor Logistic Regression Engine</li>
              <li>• 11 Input Vitals & Demographic Parameters</li>
            </ul>
          </div>

          {/* Clinical Parameters */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#34d399" /> Evaluated Metrics
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>• Systolic & Diastolic Blood Pressure</li>
              <li>• Serum Cholesterol & Glucose Levels</li>
              <li>• Body Mass Index (BMI) & Age Adjustments</li>
              <li>• Tobacco, Alcohol & Physical Activity Status</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-subtle)'
        }}>
          <div>
            © {new Date().getFullYear()} CardioCare AI. All rights reserved. Built for Healthcare Innovation.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>FastAPI Port: 8000</span>
            <span>•</span>
            <span>Vite React Frontend</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
