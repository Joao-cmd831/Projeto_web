import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Produtos from './pages/Produtos'
import Perfil from './pages/Perfil'
import Carrinho from './pages/Carrinho'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner" /></div>
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

function AppInner() {
  return (
    <>
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/produtos"  element={<Produtos />} />
        <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/cadastro"  element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/perfil"    element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/carrinho"  element={<PrivateRoute><Carrinho /></PrivateRoute>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  )
}
