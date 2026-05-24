import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/produtos'),
      axios.get('/api/categorias')
    ]).then(([p, c]) => {
      setProdutos(p.data.slice(0, 8))
      setCategorias(c.data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <p className="hero-eyebrow">Peças automotivas de qualidade</p>
          <h1 className="hero-title">
            PERFORMANCE<br />
            <span>SEM LIMITES</span>
          </h1>
          <p className="hero-desc">
            As melhores marcas do mercado com entrega rápida para todo o Brasil.
            Encontre a peça certa para o seu veículo.
          </p>
          <div className="hero-actions">
            <Link to="/produtos" className="btn btn-primary" style={{ fontSize: 16, padding: '13px 28px' }}>
              Ver Catálogo
            </Link>
            <Link to="/cadastro" className="btn btn-outline" style={{ fontSize: 16, padding: '13px 28px' }}>
              Criar Conta
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Produtos</span>
          </div>
          <div className="hero-stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Marcas</span>
          </div>
          <div className="hero-stat">
            <span className="stat-number">24h</span>
            <span className="stat-label">Entrega</span>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <h2 className="section-title">Categorias</h2>
          <p className="section-subtitle">Encontre peças por categoria</p>
          <div className="cat-grid">
            {categorias.map(cat => (
              <Link key={cat.id} to={`/produtos?categoria=${cat.id}`} className="cat-card">
                <span className="cat-icon">{getCatIcon(cat.slug)}</span>
                <span className="cat-name">{cat.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="section">
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 40 }}>
            <div>
              <h2 className="section-title">Destaques</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Produtos mais procurados</p>
            </div>
            <Link to="/produtos" className="btn btn-outline" style={{ fontSize: 13 }}>Ver todos →</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}><div className="spinner" /></div>
          ) : (
            <div className="grid-4">
              {produtos.map(p => <ProductCard key={p.id} produto={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-inner">
            <div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800, textTransform:'uppercase', marginBottom:8 }}>
                Garantia em todas as peças
              </h2>
              <p style={{ color:'var(--gray-mid)', fontSize:15 }}>
                Trabalhamos apenas com fornecedores certificados e oferecemos garantia em todos os produtos.
              </p>
            </div>
            <Link to="/produtos" className="btn btn-primary" style={{ fontSize: 15, padding: '12px 28px', whiteSpace:'nowrap' }}>
              Comprar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Footer simples */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-logo">⬡ AUTOCAR</span>
          <p>© {new Date().getFullYear()} AutoCar. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  )
}

function getCatIcon(slug) {
  const icons = {
    freios: '🛑', motor: '⚙️', suspensao: '🔩', eletrica: '⚡',
    filtros: '🔧', transmissao: '⚒️', escapamento: '💨', carroceria: '🚗'
  }
  return icons[slug] || '🔩'
}
