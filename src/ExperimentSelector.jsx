import { useNavigate } from 'react-router-dom'

export default function ExperimentSelector() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h1>Select an Experiment</h1>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/exp1')} style={btnStyle}>Interface A</button>
        <button onClick={() => navigate('/exp2')} style={btnStyle}>Interface B</button>
        <button onClick={() => navigate('/analyze')} style={analyzeBtnStyle}>Analyze Logs</button>
      </div>
    </div>
  )
}

const btnStyle = {
  padding: '1rem 2rem',
  margin: '1rem',
  fontSize: '1.2rem',
  borderRadius: '10px',
  backgroundColor: '#4C6EF5',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
}

const analyzeBtnStyle = {
  ...btnStyle,
  backgroundColor: '#F59F00'
}
