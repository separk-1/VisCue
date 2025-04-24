// src/components/Guide_A.jsx
import React from 'react';
import '../styles/ui.css'


export default function GuideModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '600px',
        fontFamily: "'IBM Plex Mono', monospace",
        lineHeight: '1.6'
      }}>
        <h2>Guide</h2>
        <p><strong>Welcome!</strong> This experiment allows you to change the status of system components using control buttons.</p>
        
        <h3>📝 How to Participate</h3>
        <ol>
          <li>Enter your name or ID in the input box.</li>
          <li>Click <strong>Start Experiment</strong> to begin.</li>
          <li>Use the buttons to change the states in the display.</li>
          <li>Click <strong>End Experiment</strong> to finish.</li>
          <li>Click <strong>Download Logs</strong> to save your actions.</li>
        </ol>
        <h3>✅ Tips</h3>
        <ul>
          <li>Your actions are recorded in real time.</li>
          <li>You can retry if you make a mistake.</li>
          <li>Try to reach the expected state accurately and quickly.</li>
        </ul>
        <button onClick={onClose} style={{
          marginTop: '1rem',
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontFamily: "'IBM Plex Mono', monospace",
          cursor: 'pointer',
          border: '1px solid #999'
        }}>
          Close Guide
        </button>
      </div>
    </div>
  )
}
