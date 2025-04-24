// src/components/GuideModal.jsx
import React from 'react';

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
        borderRadius: '12px',
        width: '90%',
        maxWidth: '640px',
        maxHeight: '85%',
        overflowY: 'auto',
        fontFamily: "'IBM Plex Mono', monospace",
        lineHeight: 1.6,
        color: '#222'
      }}>
        <h2>🧭 Experiment Guide</h2>
        <ol>
        <li>
            Select the <span style={{ backgroundColor: '#cddafd' }}><strong>scenario</strong></span> assigned to you.
        </li>
        <li>
            Within the scenario, click the <span style={{ backgroundColor: '#fff3bf' }}><strong>Guide</strong></span> button to view detailed instructions.
        </li>
        <li>
            After completing the task, use your <span style={{ backgroundColor: '#d3f9d8' }}><strong>browser's back button</strong></span> to return to this screen.
        </li>
        <li>
            Then, complete the <span style={{ backgroundColor: '#d0ebff' }}><strong>survey</strong></span> using the button below.
        </li>
        <li>
            <em>(Optional)</em> You can explore your results on the <span style={{ backgroundColor: '#ffe8cc' }}><strong>Analyze</strong></span> page.
        </li>
        </ol>



        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <button
            onClick={() => window.open('https://forms.gle/mAUwrjJmtKf3Uzwr6', '_blank')}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: '#4C6EF5',
              color: 'white',
              border: 'none'
            }}>
            Fill Out Survey
          </button>

          <button onClick={onClose} style={{
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            backgroundColor: '#eee',
            color: '#222',
            border: '1px solid #ccc'
          }}>
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
