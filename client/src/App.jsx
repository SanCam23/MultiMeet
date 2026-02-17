import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Categories from './pages/Categories'
import ItemDetail from './pages/ItemDetail'
import UploadForm from './pages/UploadForm'
import UserDashboard from './pages/UserDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/event/:id" element={<ItemDetail />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/create" element={<UploadForm />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
