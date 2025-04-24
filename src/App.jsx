// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ExperimentSelector from './ExperimentSelector'
import App_A from './App_A'
import App_B from './App_B'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExperimentSelector />} />
        <Route path="/exp1" element={<App_A />} />
        <Route path="/exp2" element={<App_B />} />
      </Routes>
    </Router>
  )
}
