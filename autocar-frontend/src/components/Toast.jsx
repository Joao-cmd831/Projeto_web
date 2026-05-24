import { useState, useEffect, createContext, useContext } from 'react'

const ToastContext = createContext(null)

let _addToast = null

export function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = (msg, type = 'success') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, msg, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }
  }, [])

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'success' ? '✓' : '✕'}</span>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

export const toast = {
  success: (msg) => _addToast?.(msg, 'success'),
  error:   (msg) => _addToast?.(msg, 'error'),
}

export default Toast
