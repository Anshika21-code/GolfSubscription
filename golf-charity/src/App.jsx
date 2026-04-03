import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Scores from './pages/Scores'
import Charities from './pages/Charities'
import CharityDetail from './pages/CharityDetail'
import Winners from './pages/Winners'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDraw from './pages/admin/AdminDraw'
import AdminCharities from './pages/admin/AdminCharities'
import AdminWinners from './pages/admin/AdminWinners'
import Navbar from './components/common/Navbar'
import Draw from './pages/Draw'
import Footer from './components/common/Footer'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="loader">Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/dashboard" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/charities" element={<Charities />} />
        <Route path="/charities/:id" element={<CharityDetail />} />
        <Route path="/winners" element={<Winners />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/scores" element={<ProtectedRoute><Scores /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/draw" element={<ProtectedRoute adminOnly><AdminDraw /></ProtectedRoute>} />
        <Route path="/admin/charities" element={<ProtectedRoute adminOnly><AdminCharities /></ProtectedRoute>} />
        <Route path="/admin/winners" element={<ProtectedRoute adminOnly><AdminWinners /></ProtectedRoute>} />
        <Route path="/draw" element={<ProtectedRoute><Draw /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}