import React from 'react';

export default function RiskGauge({ percentage, riskLevel, riskColor }) {
  // SVG Arc Math
  const radius = 80;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // We only show a semi-circle or 240-degree arc
  const arcLength = circumference * 0.75; 
  const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '10px'
    }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        style={{ transform: 'rotate(135deg)', transformOrigin: 'center' }}
      >
        {/* Background Track Arc */}
        <circle
          stroke="rgba(255, 255, 255, 0.08)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Active Fill Arc */}
        <circle
          stroke={riskColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.5s ease',
            filter: `drop-shadow(0 0 8px ${riskColor})`
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Center Value Overlay */}
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          color: riskColor,
          lineHeight: 1
        }}>
          {percentage}%
        </div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
          marginTop: '4px'
        }}>
          Risk Score
        </div>
      </div>
    </div>
  );
}
