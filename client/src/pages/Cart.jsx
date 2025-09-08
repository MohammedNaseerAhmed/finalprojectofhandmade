import { useEffect, useState } from 'react'
import { getCart, updateCartItemQuantity, removeCartItem } from '../services/cart.js'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/imageUtils.js'

export default function Cart(){
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(()=>{ (async()=> {
    try {
      setLoading(true)
      setError(null)
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if(!user) {
        setError('Please log in to view your cart')
        return
      }
      const cartData = await getCart(user.id)
      setCart(cartData)
    } catch (err) {
      console.error('Error fetching cart:', err)
      setError(err.response?.data?.message || 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  })() }, [])

  const items = cart?.items || []
  const subtotal = items.reduce((s,it)=> s + (it.productId?.price || it.price || 0) * (it.quantity||1), 0)

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if (!user) return
      
      if (newQuantity < 1) {
        await handleRemoveItem(productId)
        return
      }
      
      await updateCartItemQuantity(user.id, productId, newQuantity)
      
      // Update local state instead of refetching
      setCart(prevCart => {
        if (!prevCart) return prevCart
        const updatedItems = prevCart.items.map(item => 
          item.productId._id === productId || item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
        return { ...prevCart, items: updatedItems }
      })
    } catch (err) {
      console.error('Error updating quantity:', err)
      alert('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if (!user) return
      
      await removeCartItem(user.id, productId)
      
      // Update local state instead of refetching
      setCart(prevCart => {
        if (!prevCart) return prevCart
        const updatedItems = prevCart.items.filter(item => 
          item.productId._id !== productId && item.productId !== productId
        )
        return { ...prevCart, items: updatedItems }
      })
    } catch (err) {
      console.error('Error removing item:', err)
      alert('Failed to remove item')
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Cart</h2>
        <div className="text-slate-400">Loading cart...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Cart</h2>
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Cart</h2>
      {items.length===0 ? (
        <div className="text-slate-400">Cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it, idx)=> (
            <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <img src={getImageUrl(it.productId?.images?.[0])} className="h-16 w-16 object-cover rounded-lg"/>
              <div className="flex-1">
                <div className="text-slate-100 font-medium">{it.productId?.title || 'Item'}</div>
                <div className="text-slate-400 text-sm">₹{it.productId?.price || it.price || 0} each</div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleQuantityChange(it.productId._id || it.productId, (it.quantity || 1) - 1)}
                  className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-slate-100 min-w-[2rem] text-center">{it.quantity || 1}</span>
                <button 
                  onClick={() => handleQuantityChange(it.productId._id || it.productId, (it.quantity || 1) + 1)}
                  className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <div className="text-cyan-300 font-semibold min-w-[5rem] text-right">
                ₹{(it.productId?.price || it.price || 0) * (it.quantity||1)}
              </div>
              <button 
                onClick={() => handleRemoveItem(it.productId._id || it.productId)}
                className="text-red-400 hover:text-red-300 p-1"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-slate-400">Subtotal</div>
            <div className="text-cyan-300 font-semibold">₹{subtotal}</div>
          </div>
          <div className="text-right">
            <Link to="/checkout" className="inline-block btn btn-primary">Checkout</Link>
          </div>
        </div>
      )}
    </div>
  )
}


