import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import './Produtos.css'

export default function Produtos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [produtos, setProdutos]       = useState([])
  const [categorias, setCategorias]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [catSel, setCatSel]           = useState(searchParams.get('categoria') || '')

  const fetchProdutos = useCallback(async () => {
    setLoading(true)
    try {
      let url = '/api/produtos'
      if (search.trim())   url = `/api/produtos/buscar?q=${encodeURIComponent(search)}`
      else if (catSel)     url = `/api/produtos/categoria/${catSel}`

      const { data } = await axios.get(url)
      setProdutos(data)
    } catch { setProdutos([]) }
    finally { setLoading(false) }
  }, [search, catSel])

  useEffect(() => {
    axios.get('/api/categorias').then(r => setCategorias(r.data))
  }, [])

  useEffect(() => {
    const t = setTimeout(fetchProdutos, 300)
    return () => clearTimeout(t)
  }, [fetchProdutos])

  const selectCat = (id) => {
    setCatSel(id)
    setSearch('')
    if (id) setSearchParams({ categoria: id })
    else setSearchParams({})
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40 }}>

        {/* Header */}
        <div className="produtos-header">
          <div>
            <h1 className="section-title">Catálogo</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              {loading ? '...' : `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} encontrado${produtos.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Search */}
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar peça, marca..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCatSel(''); setSearchParams({}) }}
            />
            {search && (
              <button className="search-clear" onClick={() => { setSearch(''); fetchProdutos() }}>×</button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="cat-filters">
          <button
            className={`cat-filter-btn ${!catSel ? 'active' : ''}`}
            onClick={() => selectCat('')}
          >
            Todos
          </button>
          {categorias.map(c => (
            <button
              key={c.id}
              className={`cat-filter-btn ${catSel == c.id ? 'active' : ''}`}
              onClick={() => selectCat(c.id)}
            >
              {c.nome}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}><div className="spinner" /></div>
        ) : produtos.length === 0 ? (
          <div className="empty-state">
            <p>🔍</p>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente outra busca ou categoria</p>
          </div>
        ) : (
          <div className="grid-4">
            {produtos.map(p => <ProductCard key={p.id} produto={p} />)}
          </div>
        )}

      </div>
    </div>
  )
}
