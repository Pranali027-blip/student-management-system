import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import Exam from './pages/Exams'
import Notifications from './pages/Notifications'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  )
}

export default App