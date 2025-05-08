import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/mainPage'
import AdminLogin from './admin/auth/adminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminRouteGuard from './admin/components/AdminRouteGuard'

function App() {
  return (
    <Router>
      <div className='overflow-hidden'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminRouteGuard>
                <AdminDashboard />
              </AdminRouteGuard>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App