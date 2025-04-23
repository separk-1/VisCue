// src/components/BoxLabel.jsx
import '../styles/ui.css'

export default function BoxLabel({ label, state }) {
  return (
    <div className="label-container">
      <div className={`label-box ${state === 'ON' ? 'on' : 'off'}`}>
        {label}<br />ON
      </div>
      <div className={`label-box ${state === 'OFF' ? 'on' : 'off'}`}>
        {label}<br />OFF
      </div>
    </div>
  )
}
