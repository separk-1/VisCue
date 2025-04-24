import { useState } from 'react'
import initialAndTarget from '../analyze/initial_and_target_states.json'

export default function AnalyzePage() {
  const [logData, setLogData] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        setLogData(parsed)
        setAnalysis(null)
      } catch (err) {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  const runAnalysis = () => {
    const log = logData.log
    const target = initialAndTarget.target
    const initial = initialAndTarget.initial

    const startTime = log.find(e => e.type === 'experimentStart')?.time ?? 0
    const endTime = log.find(e => e.type === 'experimentEnd')?.time ?? null

    const toggleEvents = log.filter(e => e.type === 'toggle')
    const toggleCounts = {}
    const state = { ...initial }
    const timeToTarget = {}

    toggleEvents.forEach(e => {
      const [label, val] = e.label.split(' ').slice(-2)
      toggleCounts[label] = (toggleCounts[label] || 0) + 1
      state[label] = val
      if (!timeToTarget[label] && val === target[label]) {
        timeToTarget[label] = (e.time - startTime) / 1000
      }
    })

    const mastered = Object.entries(toggleCounts)
      .filter(([label, count]) => count === 1 && state[label] === target[label])
      .map(([label]) => label)

    const confused = Object.entries(toggleCounts)
      .filter(([label, count]) => count > 1 || state[label] !== target[label])
      .map(([label]) => label)

    const unmatched = Object.entries(target)
      .filter(([label, val]) => state[label] !== val)
      .map(([label]) => label)

    const correctTotal = Object.entries(target)
      .filter(([k, v]) => state[k] === v).length

    const total = Object.keys(target).length
    const accuracy = (correctTotal / total * 100).toFixed(1)
    const avgTime = Object.values(timeToTarget).reduce((a, b) => a + b, 0) / Object.values(timeToTarget).length || 0

    setAnalysis({
      accuracy,
      mastered,
      confused,
      unmatched,
      avgTime: avgTime.toFixed(2),
      totalToggles: toggleEvents.length,
      finalMatch: unmatched.length === 0
    })
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Analyze Logs</h1>
      <input type="file" accept=".json" onChange={handleFileUpload} style={{ margin: '1rem' }} />

      {logData && (
        <>
          <div style={{ marginTop: '1rem' }}>
            <h3>Participant: {logData.participant}</h3>
            <p><strong>Interface:</strong> {logData.interface}</p>
            <p><strong>Initial State:</strong> {logData.selectedInitialState}</p>
            <p><strong>Total Toggles:</strong> {logData.log.filter(e => e.type === 'toggle').length}</p>
            <button onClick={runAnalysis} style={btn}>Run Full Analysis</button>
          </div>

          {analysis && (
            <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px', marginInline: 'auto' }}>
              <p><strong>Accuracy:</strong> {analysis.accuracy}%</p>
              <p><strong>Final State Correct:</strong> {analysis.finalMatch ? 'Yes' : 'No'}</p>
              <p><strong>Average Time to Correct:</strong> {analysis.avgTime} sec</p>
              <p><strong>Mastered:</strong> {analysis.mastered.join(', ')}</p>
              <p><strong>Confused:</strong> {analysis.confused.join(', ')}</p>
              <p><strong>Unmatched:</strong> {analysis.unmatched.join(', ')}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const btn = {
  padding: '10px 20px',
  marginTop: '10px',
  borderRadius: '6px',
  fontWeight: 'bold',
  backgroundColor: '#4C6EF5',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
}
