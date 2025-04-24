import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import GuideModal from './components/GuideModal'

export default function ExperimentSelector() {
  const navigate = useNavigate()
  const [showGuide, setShowGuide] = useState(true)

  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      
    {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

      <h1>Select an Experiment</h1>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/exp1')} style={btnStyle}>Scenario #1</button>
        <button onClick={() => navigate('/exp2')} style={btnStyle}>Scenario #2</button>
        <button onClick={() => navigate('/exp3')} style={btnStyle}>Scenario #3</button>
        <button onClick={() => navigate('/exp4')} style={btnStyle}>Scenario #4</button>
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
