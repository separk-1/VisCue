// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ExperimentSelector from './ExperimentSelector'
import App_A_wog from './App_A_wog'
import App_A_wg from './App_A_wg'
import App_B_wog from './App_B_wog'
import App_B_wg from './App_B_wg'
import AnalyzePage from './Analyze'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExperimentSelector />} />
        <Route path="/exp1" element={<App_A_wog />} />
        <Route path="/exp2" element={<App_A_wg />} />
        <Route path="/exp3" element={<App_B_wog />} />
        <Route path="/exp4" element={<App_B_wg />} />
        <Route path="/analyze" element={<AnalyzePage />} />
      </Routes>
    </Router>
  )
}
