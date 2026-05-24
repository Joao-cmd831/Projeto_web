import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return }
    try {
      const { data } = await axios.get('/api/carrinho')
      setItems(data.itens || [])
    } catch {
      setItems([])
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = async (produtoId, quantidade = 1) => {
    await axios.post(`/api/carrinho/adicionar/${produtoId}?quantidade=${quantidade}`)
    await fetchCart()
  }

  const removeItem = async (produtoId) => {
    await axios.delete(`/api/carrinho/remover/${produtoId}`)
    await fetchCart()
  }

  const updateItem = async (produtoId, quantidade) => {
    await axios.put(`/api/carrinho/atualizar/${produtoId}?quantidade=${quantidade}`)
    await fetchCart()
  }

  const clearCart = async () => {
    await axios.delete('/api/carrinho/limpar')
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + (i.produto.preco * i.quantidade), 0)
  const count = items.reduce((sum, i) => sum + i.quantidade, 0)

  return (
    <CartContext.Provider value={{ items, total, count, addItem, removeItem, updateItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
