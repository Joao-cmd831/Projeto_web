import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState, useEffect } from 'react'
import { toast } from '../components/Toast'
import './Carrinho.css'

export default function Carrinho() {
 const { items, total, count, removeItem, updateItem, clearCart, fetchCart } = useCart()
const [pageLoading, setPageLoading] = useState(true)

useEffect(() => {
  const load = async () => {
    setPageLoading(true)
    await fetchCart()
    setPageLoading(false)
  }
  load()
}, [])

  const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const handleRemove = async (produtoId, nome) => {
    await removeItem(produtoId)
    toast.success(`${nome} removido do carrinho`)
  }

  const handleClear = async () => {
    await clearCart()
    toast.success('Carrinho limpo')
  }

  const handleFinish = () => {
    toast.success('Pedido finalizado! Em breve você receberá a confirmação.')
    clearCart()
  }

  if (pageLoading) return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 32 }}>
          <div>
            <h1 className="section-title">Carrinho</h1>
            <p className="section-subtitle" style={{ marginBottom:0 }}>
              {count > 0 ? `${count} item${count > 1 ? 's' : ''}` : 'Seu carrinho está vazio'}
            </p>
          </div>
          {items.length > 0 && (
            <button className="btn btn-ghost" onClick={handleClear} style={{ color:'var(--red)', fontSize:13 }}>
              Limpar carrinho
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="carrinho-empty">
            <div className="carrinho-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h3>Nenhuma peça no carrinho</h3>
            <p>Adicione produtos para continuar</p>
            <Link to="/produtos" className="btn btn-primary" style={{ marginTop:16, fontSize:15, padding:'12px 28px' }}>
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="carrinho-layout">

            {/* Items list */}
            <div className="carrinho-items">
              {items.map(item => (
                <div key={item.id} className="carrinho-item card">
                  <div className="item-img">
                    <img
                      src={item.produto.imagemUrl || `https://placehold.co/100x100/1a1a1a/555?text=Peça`}
                      alt={item.produto.nome}
                      onError={e => e.target.src = `https://placehold.co/100x100/1a1a1a/555?text=Auto`}
                    />
                  </div>

                  <div className="item-info">
                    <p className="item-brand">{item.produto.marca}</p>
                    <h3 className="item-name">{item.produto.nome}</h3>
                    {item.produto.categoria && (
                      <span className="badge badge-dark" style={{ fontSize:10 }}>{item.produto.categoria.nome}</span>
                    )}
                  </div>

                  <div className="item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateItem(item.produto.id, item.quantidade - 1)}
                    >−</button>
                    <span className="qty-val">{item.quantidade}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateItem(item.produto.id, item.quantidade + 1)}
                    >+</button>
                  </div>

                  <div className="item-right">
                    <p className="item-price">{fmt(item.produto.preco * item.quantidade)}</p>
                    <p className="item-unit">{fmt(item.produto.preco)} / un.</p>
                    <button
                      className="btn btn-ghost item-remove"
                      onClick={() => handleRemove(item.produto.id, item.produto.nome)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="carrinho-summary card">
              <h2 className="summary-title">Resumo do Pedido</h2>

              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal ({count} {count === 1 ? 'item' : 'itens'})</span>
                  <span>{fmt(total)}</span>
                </div>
                <div className="summary-line">
                  <span>Frete</span>
                  <span style={{ color:'#55cc55' }}>Grátis</span>
                </div>
              </div>

              <hr className="divider" />

              <div className="summary-total">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>

              <button
                onClick={handleFinish}
                className="btn btn-primary summary-btn"
              >
                Finalizar Compra
              </button>

              <Link to="/produtos" className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', marginTop:8, fontSize:13 }}>
                ← Continuar Comprando
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
