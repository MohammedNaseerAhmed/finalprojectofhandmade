import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProductsByUser, deleteProduct } from '../services/products'
import { getImageUrl } from '../utils/imageUtils'

export default function MyProducts(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const run = async ()=>{
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if(!user){ setLoading(false); return }
      setLoading(true)
      try{ const res = await fetchProductsByUser(user.id); setItems(res?.payload || res || []) }
      finally { setLoading(false) }
    }
    run()
  }, [])

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setDeleting(productId)
    try {
      await deleteProduct(productId)
      setItems(prev => prev.filter(item => item._id !== productId))
    } catch (error) {
      alert('Failed to delete product: ' + (error.response?.data?.message || error.message))
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (productId) => {
    navigate(`/dashboard?edit=${productId}`)
  }

  if(loading) return <div className="text-slate-400">Loading…</div>
  if(!items?.length) return <div className="text-slate-400">You have not added any products yet.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map(product => (
        <div key={product._id} className="glass rounded-2xl p-4 border border-white/10 hover:border-cyan-400/30 transition-colors">
          <img 
            src={getImageUrl(product.images?.[0], 200)} 
            alt={product.title}
            className="w-full h-48 object-cover rounded-xl mb-3"
          />
          <h3 className="text-slate-100 font-medium mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-slate-400 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-cyan-300 font-semibold">₹{product.price}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              product.isProductActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {product.isProductActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleEdit(product._id)}
              className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => handleDelete(product._id)}
              disabled={deleting === product._id}
              className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              {deleting === product._id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}


