import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from './Toast'
import './ProductCard.css'

export default function ProductCard({ produto }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await addItem(produto.id, 1)
      toast.success('Produto adicionado ao carrinho!')
    } catch {
      toast.error('Erro ao adicionar produto')
    }
  }

  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="product-card card">
      <div className="product-img">
        <img
          src={produto.imagemUrl || `https://placehold.co/400x260/1a1a1a/555?text=${encodeURIComponent(produto.nome)}`}
          alt={produto.nome}
          onError={e => e.target.src = `https://placehold.co/400x260/1a1a1a/555?text=AutoCar`}
        />
        {produto.categoria && (
          <span className="product-cat badge badge-dark">{produto.categoria.nome}</span>
        )}
      </div>

      <div className="product-body">
        <p className="product-brand">{produto.marca}</p>
        <h3 className="product-name">{produto.nome}</h3>
        {produto.anoCompativel && (
          <p className="product-compat">Compatível: {produto.anoCompativel}</p>
        )}
        <div className="product-footer">
          <span className="product-price">{fmt(produto.preco)}</span>
          <button
            onClick={handleAdd}
            className="btn btn-primary"
            style={{ fontSize: 13, padding: '8px 14px' }}
            disabled={produto.estoque === 0}
          >
            {produto.estoque === 0 ? 'Esgotado' : '+ Carrinho'}
          </button>
        </div>
      </div>
    </div>
  )
}
