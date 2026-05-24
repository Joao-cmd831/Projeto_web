import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'
import './Auth.css'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showSenha, setShowSenha]       = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmar: '',
    telefone: '', cpf: '', endereco: '', cidade: '', estado: '', cep: ''
  })

  // ---- Máscaras ----
  const maskCPF = v =>
    v.replace(/\D/g, '')
     .slice(0, 11)
     .replace(/(\d{3})(\d)/, '$1.$2')
     .replace(/(\d{3})(\d)/, '$1.$2')
     .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

  const maskTelefone = v =>
    v.replace(/\D/g, '')
     .slice(0, 11)
     .replace(/(\d{2})(\d)/, '($1) $2')
     .replace(/(\d{5})(\d{1,4})$/, '$1-$2')

  const maskCEP = v =>
    v.replace(/\D/g, '')
     .slice(0, 8)
     .replace(/(\d{5})(\d{1,3})$/, '$1-$2')

  const maskEstado = v =>
    v.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2)

  const handleChange = (k, maskFn) => e => {
    const val = maskFn ? maskFn(e.target.value) : e.target.value
    setForm(f => ({ ...f, [k]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cpfLimpo = form.cpf.replace(/\D/g, '')
    const telLimpo = form.telefone.replace(/\D/g, '')
    const cepLimpo = form.cep.replace(/\D/g, '')

    if (form.nome.trim().length < 2)          { setError('Nome deve ter no mínimo 2 caracteres'); return }
    if (form.nome.length > 60)                { setError('Nome deve ter no máximo 60 caracteres'); return }
    if (form.email.length > 100)              { setError('E-mail deve ter no máximo 100 caracteres'); return }
    if (form.senha.length < 6)                { setError('Senha deve ter no mínimo 6 caracteres'); return }
    if (form.senha.length > 20)               { setError('Senha deve ter no máximo 20 caracteres'); return }
    if (form.senha !== form.confirmar)        { setError('As senhas não conferem'); return }
    if (form.cpf && cpfLimpo.length !== 11)   { setError('CPF inválido — digite os 11 dígitos'); return }
    if (form.telefone && telLimpo.length < 10){ setError('Telefone inválido — digite DDD + número'); return }
    if (form.cep && cepLimpo.length !== 8)    { setError('CEP inválido — digite os 8 dígitos'); return }
    if (form.cidade && form.cidade.length > 50) { setError('Cidade deve ter no máximo 50 caracteres'); return }

    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/register', {
        nome:      form.nome,
        email:     form.email,
        senha:     form.senha,
        telefone:  form.telefone,
        cpf:       form.cpf,
        endereco:  form.endereco,
        cidade:    form.cidade,
        estado:    form.estado,
        cep:       form.cep
      })
      login(data)
      toast.success('Conta criada com sucesso!')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-wrapper auth-wrapper-wide">

        <div className="auth-brand">
          <span>⬡</span>
          <span>AUTOCAR</span>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Criar Conta</h1>
          <p className="auth-sub">Preencha os dados para se cadastrar</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="auth-section-label">Dados Pessoais</div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input
                  type="text" className="form-input"
                  placeholder="João Silva"
                  value={form.nome}
                  onChange={handleChange('nome')}
                  maxLength={60} required
                />
                <span className="char-count">{form.nome.length}/60</span>
              </div>

              <div className="form-group">
                <label className="form-label">CPF</label>
                <input
                  type="text" className="form-input"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleChange('cpf', maskCPF)}
                  maxLength={14}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">E-mail *</label>
              <input
                type="email" className="form-input"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange('email')}
                maxLength={100} required
              />
              <span className="char-count">{form.email.length}/100</span>
            </div>

            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                type="text" className="form-input"
                placeholder="(00) 00000-0000"
                value={form.telefone}
                onChange={handleChange('telefone', maskTelefone)}
                maxLength={15}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Senha *</label>
                <div className="input-password">
                  <input
                    type={showSenha ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={form.senha}
                    onChange={handleChange('senha')}
                    maxLength={20} required
                  />
                  <button type="button" className="toggle-senha" onClick={() => setShowSenha(!showSenha)}>
                    {showSenha ? '👁️' : '🔐'}
                  </button>
                </div>
                <span className="char-count">{form.senha.length}/20 (mín. 6)</span>
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar Senha *</label>
                <div className="input-password">
                  <input
                    type={showConfirmar ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={form.confirmar}
                    onChange={handleChange('confirmar')}
                    maxLength={20} required
                  />
                  <button type="button" className="toggle-senha" onClick={() => setShowConfirmar(!showConfirmar)}>
                    {showConfirmar ? '👁️' : '🔐'}
                  </button>
                </div>
                <span className="char-count">{form.confirmar.length}/20</span>
              </div>
            </div>

            <hr className="divider" />
            <div className="auth-section-label">Endereço (opcional)</div>

            <div className="form-group">
              <label className="form-label">Endereço</label>
              <input
                type="text" className="form-input"
                placeholder="Rua das Flores, 123, Bairro Centro"
                value={form.endereco}
                onChange={handleChange('endereco')}
                maxLength={255}
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group" style={{ gridColumn: '1 / 2' }}>
                <label className="form-label">Cidade</label>
                <input
                  type="text" className="form-input"
                  placeholder="São Paulo"
                  value={form.cidade}
                  onChange={handleChange('cidade')}
                  maxLength={50}
                />
                <span className="char-count">{form.cidade.length}/50</span>
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <input
                  type="text" className="form-input"
                  placeholder="SP"
                  value={form.estado}
                  onChange={handleChange('estado', maskEstado)}
                  maxLength={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">CEP</label>
                <input
                  type="text" className="form-input"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={handleChange('cep', maskCEP)}
                  maxLength={9}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> : 'Criar Conta'}
            </button>
          </form>

          <p className="auth-footer">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}