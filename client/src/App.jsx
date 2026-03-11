import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Search from './pages/Search'
import UserDashboard from './pages/UserDashboard'
import UserProfile from './pages/UserProfile'
import UploadForm from './pages/UploadForm'
import ItemDetail from './pages/ItemDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<UserDashboard />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/create" element={<UploadForm />} />
        <Route path="/event/:id" element={<ItemDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
