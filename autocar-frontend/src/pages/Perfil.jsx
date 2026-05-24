import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'
import './Perfil.css'

export default function Perfil() {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [perfil, setPerfil]   = useState(null)
  const [form, setForm] = useState({
    nome: '', telefone: '', endereco: '', cidade: '', estado: '', cep: '',
    senhaAtual: '', novaSenha: '', confirmarSenha: ''
  })

  useEffect(() => {
    axios.get('/api/usuarios/perfil').then(r => {
      setPerfil(r.data)
      setForm(f => ({
        ...f,
        nome:      r.data.nome      || '',
        telefone:  r.data.telefone  || '',
        endereco:  r.data.endereco  || '',
        cidade:    r.data.cidade    || '',
        estado:    r.data.estado    || '',
        cep:       r.data.cep       || '',
      }))
    })
  }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.novaSenha && form.novaSenha !== form.confirmarSenha) {
      toast.error('As senhas não conferem')
      return
    }
    setLoading(true)
    try {
      await axios.put('/api/usuarios/perfil', {
        nome:       form.nome,
        telefone:   form.telefone,
        endereco:   form.endereco,
        cidade:     form.cidade,
        estado:     form.estado,
        cep:        form.cep,
        senhaAtual: form.senhaAtual || undefined,
        novaSenha:  form.novaSenha  || undefined,
      })
      toast.success('Perfil atualizado com sucesso!')
      setForm(f => ({ ...f, senhaAtual: '', novaSenha: '', confirmarSenha: '' }))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const initials = (name) => name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || '?'

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 48, maxWidth: 700, paddingBottom: 64 }}>

        <div className="perfil-header">
          <div className="perfil-avatar">
            {initials(user?.nome)}
          </div>
          <div>
            <h1 className="section-title" style={{ marginBottom: 4 }}>{user?.nome}</h1>
            <p style={{ color: 'var(--gray-mid)', fontSize: 14 }}>{user?.email}</p>
            <span className="badge badge-dark" style={{ marginTop: 8, display: 'inline-block' }}>
              {user?.role === 'ADMIN' ? '⚡ Admin' : '👤 Usuário'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="perfil-form">

          <div className="perfil-section">
            <h2 className="perfil-section-title">Dados Pessoais</h2>
            <div className="form-grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Nome Completo</label>
                <input type="text" className="form-input" value={form.nome} onChange={set('nome')} />
              </div>
              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input type="tel" className="form-input" placeholder="(00) 00000-0000" value={form.telefone} onChange={set('telefone')} />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail (não editável)</label>
                <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="perfil-section">
            <h2 className="perfil-section-title">Endereço</h2>
            <div className="form-grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Endereço</label>
                <input type="text" className="form-input" placeholder="Rua, número, bairro" value={form.endereco} onChange={set('endereco')} />
              </div>
              <div className="form-group">
                <label className="form-label">Cidade</label>
                <input type="text" className="form-input" value={form.cidade} onChange={set('cidade')} />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <input type="text" className="form-input" maxLength={2} placeholder="SP" value={form.estado} onChange={set('estado')} />
              </div>
              <div className="form-group">
                <label className="form-label">CEP</label>
                <input type="text" className="form-input" placeholder="00000-000" value={form.cep} onChange={set('cep')} />
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="perfil-section">
            <h2 className="perfil-section-title">Alterar Senha</h2>
            <p style={{ fontSize: 13, color: 'var(--gray-mid)', marginBottom: 16 }}>
              Preencha apenas se quiser alterar sua senha
            </p>
            <div className="form-grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Senha Atual</label>
                <input type="password" className="form-input" placeholder="••••••••" value={form.senhaAtual} onChange={set('senhaAtual')} />
              </div>
              <div className="form-group">
                <label className="form-label">Nova Senha</label>
                <input type="password" className="form-input" placeholder="••••••••" value={form.novaSenha} onChange={set('novaSenha')} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar Nova Senha</label>
                <input type="password" className="form-input" placeholder="••••••••" value={form.confirmarSenha} onChange={set('confirmarSenha')} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:13, fontSize:15 }} disabled={loading}>
            {loading ? <span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> : 'Salvar Alterações'}
          </button>

        </form>
      </div>
    </div>
  )
}
