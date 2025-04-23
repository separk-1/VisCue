// src/App.jsx
import { useEffect, useRef, useState } from 'react'
import './App.css'
import './styles/ui.css'
import DisplayGrid from './components/DisplayGrid'
import ControlGrid from './components/ControlGrid'
import BoxLabel from './components/BoxLabel'
import { initialSets } from './data/initialStates'

function createLogEntry(type, label) {
  return { type, label, time: Date.now() }
}

export default function App() {
  const log = useRef([])
  const [selectedSetName, setSelectedSetName] = useState('Set A')
  const [states, setStates] = useState(initialSets[selectedSetName])
  const controls = Object.keys(states)

  const handleToggle = (label, newState) => {
    setStates(prev => ({ ...prev, [label]: newState }))
    log.current.push(createLogEntry('toggle', `${label} ${newState}`))
  }

  const handleSetChange = (e) => {
    const newSet = e.target.value
    setSelectedSetName(newSet)
    setStates(initialSets[newSet])
    log.current.push(createLogEntry('initialSetChange', `Selected ${newSet}`))
  }

  const handleDownload = () => {
    const data = {
      selectedInitialState: selectedSetName,
      log: log.current
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'log.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const moveHandler = e => {
      log.current.push({ type: 'mousemove', x: e.clientX, y: e.clientY, time: Date.now() })
    }
    window.addEventListener('mousemove', moveHandler)
    return () => window.removeEventListener('mousemove', moveHandler)
  }, [])

  return (
    <div className="fullscreen-app">
      <h2 style={{ fontFamily: 'sans-serif', padding: '1rem' }}>Interface 1</h2>

      <div className="interface-body">
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Initial State Set:</label>
          <select value={selectedSetName} onChange={handleSetChange}>
            {Object.keys(initialSets).map(setName => (
              <option key={setName} value={setName}>{setName}</option>
            ))}
          </select>
        </div>

        <div className="display-panel-scrollable">
          <DisplayGrid controls={controls} states={states} />
        </div>

        <ControlGrid controls={controls} states={states} onToggle={handleToggle} />

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={handleDownload} style={{ padding: '10px 20px', fontWeight: 'bold', borderRadius: '6px', backgroundColor: '#fff', border: '1px solid #888' }}>
            Download Logs
          </button>
        </div>
      </div>
    </div>
  )
}