export default function ControlGrid({ controls, states, onToggle }) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {controls.map(label => (
          <div
            key={label}
            style={{
              width: '160px',
              height: '160px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ccc',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            <div style={{ marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }}>{label}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onToggle(label, 'ON')}
                style={{
                  backgroundColor: '#ef9999',
                  color: '#000',
                  padding: '6px 12px',
                  border: '1px solid #999',
                  borderRadius: '4px',
                  width: '60px',
                  fontWeight: 'bold'
                }}
              >
                ON
              </button>
              <button
                onClick={() => onToggle(label, 'OFF')}
                style={{
                  backgroundColor: '#a6f3a6',
                  color: '#000',
                  padding: '6px 12px',
                  border: '1px solid #999',
                  borderRadius: '4px',
                  width: '60px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto, sans-serif'
                }}
              >
                OFF
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }
  