import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('autocar_token')
    const savedUser = localStorage.getItem('autocar_user')
    if (saved && savedUser) {
      setToken(saved)
      setUser(JSON.parse(savedUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    setUser({ id: data.userId, nome: data.nome, email: data.email, role: data.role })
    setToken(data.token)
    localStorage.setItem('autocar_token', data.token)
    localStorage.setItem('autocar_user', JSON.stringify({
      id: data.userId, nome: data.nome, email: data.email, role: data.role
    }))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('autocar_token')
    localStorage.removeItem('autocar_user')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
