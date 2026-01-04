import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SubjectPage from './pages/SubjectPage'
import Quiz from './pages/Quiz'
import Feedback from './pages/Feedback'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true')
    } else {
      localStorage.removeItem('isLoggedIn')
    }
  }, [isLoggedIn])

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login onLogin={() => setIsLoggedIn(true)} />} 
        />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/subject/:subjectId" 
          element={isLoggedIn ? <SubjectPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/quiz/:subjectId/:topicId" 
          element={isLoggedIn ? <Quiz /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/feedback" 
          element={isLoggedIn ? <Feedback /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

