// src/App_B.jsx
import { useEffect, useRef, useState } from 'react'
import './App.css'
import './styles/ui.css'
import { initialSets } from './data/initialStates'
import GuideB from './components/Guide_B_wog'

function createLogEntry(type, label) {
  return { type, label, time: Date.now() }
}

const expectedStates = initialSets['Expected State']

function VisualIndicator({ state, expected }) {
  const isOn = state === 'ON'
  const isCorrect = state === expected
  const color = isCorrect ? '#a6f3a6' : '#ef9999'

  return (
    <div style={{
      position: 'relative',
      width: '72px',
      height: '72px',
      backgroundColor: '#ccc',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* 도넛 테두리 */}
      <div style={{
        width: '66px',
        height: '66px',
        borderRadius: '50%',
        border: `10px solid ${isOn ? color : '#ddd'}`,
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        transition: 'border-color 0.25s ease-in-out'
      }} />

      {/* 가로 선 */}
      <div style={{
        position: 'absolute',
        width: '68px',
        height: '16px',
        backgroundColor: isOn ? '#eee' : color,
        borderRadius: '4px',
        opacity: isOn ? 0.2 : 1,
        transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out'
      }} />
    </div>
  )
}




function StateCard({ label, state, expected, onToggle }) {
  return (
    <div style={{
      width: '180px',
      background: '#f5f5f5',
      borderRadius: '10px',
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      boxShadow: '1px 1px 4px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        fontSize: '0.8rem',
        fontWeight: '600',
        fontFamily: "'IBM Plex Mono', monospace",
        marginBottom: '0.5rem',
        textAlign: 'center'
      }}>
        {label}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ marginLeft: '1.5rem' }}>
          <VisualIndicator state={state} expected={expected} />
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            marginRight: '0.75rem' 
          }}>
          <button style={buttonStyle} onClick={(e) => onToggle('ON', e)}>ON</button>
          <button style={buttonStyle} onClick={(e) => onToggle('OFF', e)}>OFF</button>
        </div>
      </div>
    </div>
  )
}


const buttonStyle = {
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  background: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: "'IBM Plex Mono', monospace",
  minWidth: '50px'
}


export default function App_B_wog() {
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
  
    const isCorrectClick = expectedStates[label] === newState
  
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
      interface: "#3",
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

  return (
    <div className="fullscreen-app" style={{ backgroundColor: '#d3d3d3', padding: '1rem' }}>
    <h2 style={{ fontFamily: 'sans-serif'}}>Senario #3</h2>
      {showGuide && <GuideB onClose={() => setShowGuide(false)} />}

      <div className="interface-body">
        <div style={{ marginBottom: '1rem' }}>

          <button
          onClick={() => setShowGuide(true)}
          style={{
            marginLeft: '1rem',
            padding: '6px 12px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontFamily: "'IBM Plex Mono', monospace",
            border: '1px solid #999',
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}
        >
          Show Guide
        </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          {controls.map(label => (
            <StateCard
              key={label}
              label={label}
              state={states[label]}
              expected={expectedStates[label]}
              onToggle={(newState, e) => handleToggle(label, newState, e)}
            />
          ))}
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