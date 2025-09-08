import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProduct } from '../services/products.js'
import { addToCart } from '../services/cart.js'
import ReviewForm from '../components/ReviewForm.jsx'
import { getImageUrl } from '../utils/imageUtils.js'

export default function Product(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [p, setP] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const run = async ()=>{
      setLoading(true)
      try{ setP(await fetchProduct(id)) } finally { setLoading(false) }
    }
    run()
  }, [id])

  const onAdd = async ()=>{
    try{
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if(!user){ 
        alert('Please login to add items to cart')
        return navigate('/login') 
      }
      await addToCart({ userId: user.id, items: [{ productId: id, quantity: 1 }] })
      alert('Added to cart successfully!')
      navigate('/cart')
    }catch(e){ alert('Failed to add to cart') }
  }

  if(loading) return <div className="text-slate-400">Loading…</div>
  if(!p) return <div className="text-slate-400">Not found</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <img src={getImageUrl(p.images?.[0])} alt={p.title} className="w-full object-cover"/>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{p.title}</h1>
          <div className="mt-2 text-cyan-300 font-semibold">₹{p.price}</div>
          <div className="mt-2 text-slate-400">⭐ {p.avgRating?.toFixed?.(1) ?? '—'} ({p.reviewsCount ?? 0})</div>
          <p className="mt-4 text-slate-300 leading-7 whitespace-pre-line">{p.description}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={onAdd} className="btn btn-primary">Add to Cart</button>
            <button onClick={()=>navigate('/checkout')} className="btn btn-ghost">Buy Now</button>
          </div>
        </div>
      </div>
      
      {/* Review Form - accessible to both buyers and sellers */}
      <ReviewForm productId={id} />
    </div>
  )
}


