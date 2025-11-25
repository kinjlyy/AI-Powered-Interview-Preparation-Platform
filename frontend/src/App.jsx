import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './index.css'

const App = () => (
  <div className="bg-slate-50 text-slate-900 min-h-screen">
    <Navbar />
    <div className="pt-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
    <Footer />
  </div>
)

export default App
