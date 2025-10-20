import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signup from './components/SignUp/Signup.jsx'
import Login from './components/Login/Login.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Interview from './components/InterviewPage/Interview.jsx'
import Profile from './components/Profile/Profile.jsx'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes.jsx'
import Home from './components/Home/Home.jsx'
import Feedback from './components/Feedback/Feedback.jsx'

function App() {
  return (
    <Router>
      <Routes>
       <Route path='/' element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview/:topic" element={<Interview />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback/:interviewId" element={<Feedback />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
