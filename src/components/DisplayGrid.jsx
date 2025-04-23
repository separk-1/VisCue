// src/components/DisplayGrid.jsx
import BoxLabel from './BoxLabel'
import '../styles/ui.css'

export default function DisplayGrid({ controls, states }) {
  return (
    <div className="display-grid">
      {controls.map(label => (
        <BoxLabel key={label} label={label} state={states[label]} />
      ))}
    </div>
  )
}
