import React, { useRef } from 'react';
import { ShieldCheck, AlertTriangle, Download, CheckCircle2, Info, HeartPulse, FileText } from 'lucide-react';
import RiskGauge from './RiskGauge';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResultCard({ result, onReset }) {
  const reportRef = useRef(null);

  if (!result) return null;

  const isHighRisk = result.has_disease || result.prediction === 1;

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#090d16',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`CardioCare_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to generate PDF report. You can use browser print (Ctrl+P) as alternative.');
    }
  };

  return (
    <div className="glass-card" style={{ padding: '28px', borderRadius: '24px', animation: 'fadeIn 0.5s ease' }}>
      {/* Printable Area Wrapper */}
      <div ref={reportRef} style={{ padding: '10px' }}>
        
        {/* Header Title Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={22} color="#0ea5e9" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>AI Risk Assessment Report</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleDownloadPDF}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
            >
              <Download size={16} />
              Export PDF Report
            </button>
            <button onClick={onReset} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              New Test
            </button>
          </div>
        </div>

        {/* Top Prediction Banner & Gauge Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
          alignItems: 'center'
        }}>
          {/* Main Status Banner */}
          <div style={{
            background: isHighRisk 
              ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.05) 100%)' 
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: `1px solid ${isHighRisk ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
            borderRadius: '20px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              {isHighRisk ? (
                <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.2)' }}>
                  <AlertTriangle size={28} color="#fb7185" />
                </div>
              ) : (
                <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)' }}>
                  <ShieldCheck size={28} color="#34d399" />
                </div>
              )}
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isHighRisk ? '#fb7185' : '#34d399',
                  letterSpacing: '0.05em'
                }}>
                  Primary Model Classification
                </span>
                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: isHighRisk ? '#fda4af' : '#6ee7b7',
                  margin: 0
                }}>
                  {result.result_title || (isHighRisk ? 'Cardiovascular Disease Detected' : 'No Cardiovascular Disease Detected')}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              {isHighRisk
                ? "The algorithm indicates an elevated risk pattern based on your blood pressure, cholesterol, BMI, or lifestyle factors. Prompt medical evaluation is advised."
                : "Your evaluated physiological metrics fall within a favorable range. Continue maintaining healthy habits and annual health checkups."}
            </p>

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: result.risk_color || (isHighRisk ? '#fb7185' : '#34d399'),
                border: `1px solid ${result.risk_color || '#38bdf8'}`
              }}>
                Category: {result.risk_level}
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)'
              }}>
                BMI: {result.bmi} ({result.bmi_category})
              </div>
            </div>
          </div>

          {/* Probability Arc Gauge Card */}
          <div style={{
            background: 'rgba(13, 20, 34, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RiskGauge
              percentage={result.probability_percent}
              riskLevel={result.risk_level}
              riskColor={result.risk_color || (isHighRisk ? '#f43f5e' : '#10b981')}
            />
          </div>
        </div>

        {/* Patient Vitals Summary Grid */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#38bdf8" /> Patient Vitals & Clinical Summary
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Age & Gender</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {result.patient_summary?.age} yrs ({result.patient_summary?.gender})
              </strong>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Blood Pressure</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {result.patient_summary?.blood_pressure}
              </strong>
              <span style={{ fontSize: '0.7rem', color: result.bp_category === 'Normal' ? '#34d399' : '#fb7185', display: 'block', marginTop: '2px' }}>
                {result.bp_category}
              </span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Cholesterol</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {result.patient_summary?.cholesterol}
              </strong>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Glucose</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {result.patient_summary?.glucose}
              </strong>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Lifestyle Status</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                Smoke: {result.patient_summary?.smoker} | Active: {result.patient_summary?.physically_active}
              </strong>
            </div>
          </div>
        </div>

        {/* Identified Risk Factors Breakdown */}
        {result.risk_factors && result.risk_factors.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#f59e0b" /> Identified Key Risk Contributors
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.risk_factors.map((rf, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(13, 20, 34, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: rf.impact === 'High' ? '#f43f5e' : '#f59e0b'
                    }} />
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{rf.factor}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{rf.detail}</p>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: rf.impact === 'High' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: rf.impact === 'High' ? '#fb7185' : '#fbbf24',
                    border: `1px solid ${rf.impact === 'High' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                  }}>
                    {rf.impact} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#34d399" /> Personalized Health Recommendations
            </h4>
            <div style={{
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.18)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {result.recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>•</span>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
