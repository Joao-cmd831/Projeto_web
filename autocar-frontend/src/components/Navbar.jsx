import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">AUTO<span>CAR</span></span>
        </Link>

        {/* Nav links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/"         end onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/produtos"     onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Produtos</NavLink>
          {user && (
            <NavLink to="/perfil"   onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Perfil</NavLink>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/carrinho" className="cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {count > 0 && <span className="cart-badge">{count}</span>}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: 13, padding: '7px 14px' }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost" style={{ fontSize: 14 }}>Entrar</Link>
              <Link to="/cadastro" className="btn btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>Cadastrar</Link>
            </>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}
