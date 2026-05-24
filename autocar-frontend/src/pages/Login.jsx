import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSenha, setShowSenha] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.email.length > 100) { setError('E-mail deve ter no máximo 100 caracteres'); return }
    if (form.senha.length < 6)   { setError('Senha deve ter no mínimo 6 caracteres'); return }
    if (form.senha.length > 20)  { setError('Senha deve ter no máximo 20 caracteres'); return }

    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/login', form)
      login(data)
      toast.success(`Bem-vindo, ${data.nome}!`)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-wrapper">
        <div className="auth-brand">
          <span>⬡</span>
          <span>AUTOCAR</span>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Entrar</h1>
          <p className="auth-sub">Acesse sua conta para continuar</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={form.email}
                onChange={set('email')}
                maxLength={100}
                required
              />
              <span className="char-count">{form.email.length}/100</span>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-password">
                <input
                  type={showSenha ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={set('senha')}
                  maxLength={20}
                  required
                />
                <button type="button" className="toggle-senha" onClick={() => setShowSenha(!showSenha)}>
                  {showSenha ? '👁️' : '🔐'}
                </button>
              </div>
              <span className="char-count">{form.senha.length}/20 (mín. 6)</span>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> : 'Entrar'}
            </button>
          </form>

          <p className="auth-footer">
            Não tem conta? <Link to="/cadastro">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
