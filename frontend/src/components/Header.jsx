import React from 'react';
import { Heart, Activity, ShieldCheck, Sparkles, Server, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ isBackendConnected, onLoadHealthy, onLoadHighRisk, activeTab, setActiveTab }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(244, 63, 94, 0.25)'
          }}>
            <Heart className="heartbeat-icon" size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
                CardioCare <span className="gradient-text">AI</span>
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'rgba(14, 165, 233, 0.15)',
                color: '#38bdf8',
                padding: '2px 8px',
                borderRadius: '20px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                ML v2.0
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Precision Cardiovascular Disease Assessment
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`btn-secondary ${activeTab === 'assessment' ? 'active-tab' : ''}`}
            style={{
              background: activeTab === 'assessment' ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
              borderColor: activeTab === 'assessment' ? '#38bdf8' : 'transparent',
              color: activeTab === 'assessment' ? '#38bdf8' : 'var(--text-muted)'
            }}
          >
            <Activity size={16} />
            Assessment
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`btn-secondary ${activeTab === 'guide' ? 'active-tab' : ''}`}
            style={{
              background: activeTab === 'guide' ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
              borderColor: activeTab === 'guide' ? '#38bdf8' : 'transparent',
              color: activeTab === 'guide' ? '#38bdf8' : 'var(--text-muted)'
            }}
          >
            <ShieldCheck size={16} />
            Health Guide
          </button>
        </nav>

        {/* Action Controls & Backend Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Presets Dropdown/Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={onLoadHealthy}
              className="btn-secondary"
              title="Load low-risk sample values"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <Sparkles size={14} color="#34d399" />
              Healthy Sample
            </button>
            <button
              onClick={onLoadHighRisk}
              className="btn-secondary"
              title="Load high-risk sample values"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <Sparkles size={14} color="#fb7185" />
              High-Risk Sample
            </button>
          </div>

          {/* Backend Connection Indicator Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: isBackendConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            fontSize: '0.78rem',
            fontWeight: 600,
            color: isBackendConnected ? '#34d399' : '#fbbf24'
          }}>
            <Server size={14} />
            {isBackendConnected ? (
              <>
                <CheckCircle2 size={13} color="#34d399" />
                <span>FastAPI Live</span>
              </>
            ) : (
              <>
                <AlertCircle size={13} color="#fbbf24" />
                <span>Offline Predictor</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
