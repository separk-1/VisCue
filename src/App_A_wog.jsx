// src/App_A.jsx
import { useEffect, useRef, useState } from 'react'
import './App.css'
import './styles/ui.css'
import DisplayGrid from './components/DisplayGrid'
import ControlGrid from './components/ControlGrid'
import { initialSets } from './data/initialStates'
import GuideA from './components/Guide_A_wog'

const panelStyle = {
  width: '100%',
  maxWidth: '1200px',
  marginInline: 'auto',
}

function createLogEntry(type, label) {
  return { type, label, time: Date.now() }
}
const btnStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontFamily: "'IBM Plex Mono', monospace",
  border: '1px solid #999',
  backgroundColor: '#fff',
  cursor: 'pointer'
}

export default function App_A_wog() {
  const log = useRef([])
  const [selectedSetName, setSelectedSetName] = useState('Initial State')
  const [states, setStates] = useState(initialSets[selectedSetName])
  const controls = Object.keys(states || {})

  const [participantName, setParticipantName] = useState('')
  const [isLogging, setIsLogging] = useState(false)
  const [isExperimentEnded, setIsExperimentEnded] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showGuide, setShowGuide] = useState(false)

  const handleToggle = (label, newState, event = null) => {
    setStates(prev => ({ ...prev, [label]: newState }))

    const isCorrectClick = initialSets['Expected State'][label] === newState

    if (isLogging && !isExperimentEnded) {
      log.current.push({
        type: 'toggle',
        label: `${label} ${newState}`,
        time: Date.now(),
        x: event?.clientX ?? null,
        y: event?.clientY ?? null,
        correct: isCorrectClick
      })
    }
  }
  
  console.log("selectedSetName:", selectedSetName)
console.log("states:", states)
console.log("controls:", controls)

  
  const handleSetChange = (e) => {
    const newSet = e.target.value
    setSelectedSetName(newSet)
    setStates(initialSets[newSet])
    if (isLogging && !isExperimentEnded) {
      log.current.push(createLogEntry('initialSetChange', `Selected ${newSet}`))
    }
  }

  const handleDownload = () => {
    const data = {
      interface: "#1",
      selectedInitialState: selectedSetName,
      participant: participantName,
      log: log.current
    }

    const now = new Date()
    const pad = n => n.toString().padStart(2, '0')
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

    const safeName = participantName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
    const filename = `log_${timestamp}_${safeName}.json`

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const moveHandler = e => {
      if (isLogging && !isExperimentEnded) {
        log.current.push({ type: 'mousemove', x: e.clientX, y: e.clientY, time: Date.now() })
      }
    }
    window.addEventListener('mousemove', moveHandler)
    return () => window.removeEventListener('mousemove', moveHandler)
  }, [isLogging, isExperimentEnded])

  const handleStartExperiment = () => {
    if (!participantName) {
      setErrorMessage('Please enter your name or ID before starting the experiment.')
      return
    }
    if (!isLogging) {
      log.current.push(createLogEntry('experimentStart', 'Experiment started'))
      setIsLogging(true)
      setIsExperimentEnded(false)
      setErrorMessage('')
    }
  }

  const handleEndExperiment = () => {
    if (isLogging && !isExperimentEnded) {
      log.current.push(createLogEntry('experimentEnd', 'Experiment ended'))
      setIsExperimentEnded(true)
    }
  }

  const handleOpenGoalWindow = () => {
    localStorage.setItem('goalState', JSON.stringify(initialSets['Expected State']))
    window.open('/goal.html', '_blank', 'width=700,height=600')
  }
  

  return (
    <div className="fullscreen-app">
    <h2 style={{ fontFamily: 'sans-serif'}}>Scenario #1</h2>
      {showGuide && <GuideA onClose={() => setShowGuide(false)} />}

      <div className="interface-body">
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <button
        onClick={() => setShowGuide(true)}
        style={btnStyle}
      >
        Show Guide
      </button>
      <button
      onClick={handleOpenGoalWindow}
      style={btnStyle}
    >
      Show Goal
    </button>

    </div>

        <div
        style={{
          ...panelStyle,
          backgroundColor: '#f8f9fa',
          padding: '0.5rem 0.75rem',
          borderRadius: '10px',
          border: '1px solid #ccc',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <DisplayGrid controls={controls} states={states} />
        </div>

      <div style={panelStyle}>
      <ControlGrid
        controls={controls}
        states={states}
        onToggle={(label, newState, event) => handleToggle(label, newState, event)}
      />
    </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Enter your name or ID"
            value={participantName}
            onChange={e => setParticipantName(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', marginRight: '10px', border: '1px solid #ccc' }}
          />

          <button
            onClick={handleStartExperiment}
            disabled={isLogging || isExperimentEnded}
            style={{
              padding: '10px 20px',
              marginRight: '8px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: isExperimentEnded ? '#BDBDBD' : (isLogging ? '#81C784' : '#4CAF50'),
              color: '#fff',
              border: isLogging ? '2px solid #388E3C' : 'none'
            }}
          >
            {isExperimentEnded ? 'Experiment Ended' : (isLogging ? 'Experiment Running...' : 'Start Experiment')}
          </button>

          <button
            onClick={handleEndExperiment}
            disabled={!isLogging || isExperimentEnded}
            style={{
              padding: '10px 20px',
              marginRight: '8px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: isExperimentEnded ? '#BDBDBD' : '#f44336',
              color: '#fff'
            }}
          >
            {isExperimentEnded ? 'Experiment Ended' : 'End Experiment'}
          </button>

          <button
            onClick={handleDownload}
            disabled={!participantName}
            style={{
              padding: '10px 20px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: isExperimentEnded ? '#FFC107' : '#fff',
              border: '1px solid #888',
              color: isExperimentEnded ? '#000' : '#000'
            }}
          >
            Download Logs
          </button>

          {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}