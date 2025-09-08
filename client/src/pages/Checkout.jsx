import { useState, useEffect } from 'react'
import { placeOrder } from '../services/orders.js'
import { getCart } from '../services/cart.js'
import QRCode from '../components/QRCode.jsx'

export default function Checkout(){
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) return
        
        const cartData = await getCart(user.id)
        setCart(cartData)
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCart()
  }, [])

  const onPlace = async ()=>{
    if (!name.trim() || !address.trim()) {
      alert('Please fill in all required fields')
      return
    }
    
    setPlacing(true)
    try{
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if(!user){ throw new Error('Please login') }
      
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty')
      }
      
      const totalAmount = cart.items.reduce((total, item) => 
        total + (item.productId?.price || 0) * (item.quantity || 1), 0
      )
      
      await placeOrder({ 
        items: cart.items,
        totalAmount,
        shippingAddress: address,
        customerName: name,
        buyerId: user.id
      })
      setSuccess(true)
    } catch (error) {
      alert(error.message || 'Failed to place order')
    } finally { 
      setPlacing(false) 
    }
  }

  if(success) return (
    <div className="glass rounded-2xl p-6 border border-white/10 text-center">
      <h2 className="text-xl font-semibold text-slate-100">Order placed 🎉</h2>
      <p className="text-slate-400 mt-2">Thank you for supporting small artisans.</p>
      
      <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-lg font-medium text-slate-100 mb-4">Complete Payment</h3>
        <QRCode 
          text={`upi://pay?pa=handmadeworld@paytm&pn=HandmadeWorld&am=${cart?.items?.reduce((total, item) => total + (item.productId?.price || 0) * (item.quantity || 1), 0)}&cu=INR&tn=HandmadeWorld Order`}
          size={200}
        />
        <div className="mt-4 text-slate-400 text-sm">
          Amount: ₹{cart?.items?.reduce((total, item) => total + (item.productId?.price || 0) * (item.quantity || 1), 0)}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Checkout</h2>
        <div className="text-slate-400">Loading cart...</div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Checkout</h2>
        <div className="text-slate-400">Your cart is empty.</div>
      </div>
    )
  }

  const totalAmount = cart.items.reduce((total, item) => 
    total + (item.productId?.price || 0) * (item.quantity || 1), 0
  )

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Order Summary</h2>
        <div className="space-y-3">
          {cart.items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <img 
                src={item.productId?.images?.[0] ? `http://localhost:3000${item.productId.images[0]}` : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMEMyMi43NjEgMTAgMjUgMTIuMjM5IDI1IDE1QzI1IDE3Ljc2MSAyMi43NjEgMjAgMjAgMjBDMTcuMjM5IDIwIDE1IDE3Ljc2MSAxNSAxNUMxNSAxMi4yMzkgMTcuMjM5IDEwIDIwIDEwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAgMjZDMTcuMjM5IDI2IDE1IDI4LjIzOSAxNSAzMVYzNUMyNSAzNSAyNSAzNSAyNSAzNVYzMUMyNSAyOC4yMzkgMjIuNzYxIDI2IDIwIDI2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4="} 
                alt={item.productId?.title} 
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-slate-100 font-medium">{item.productId?.title}</div>
                <div className="text-slate-400 text-sm">Qty: {item.quantity} × ₹{item.productId?.price}</div>
              </div>
              <div className="text-cyan-300 font-semibold">₹{item.productId?.price * item.quantity}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
          <div className="text-slate-100 font-semibold">Total Amount</div>
          <div className="text-cyan-300 font-bold text-lg">₹{totalAmount}</div>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Shipping Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="Full name *" 
            className="bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100"
            required
          />
          <input 
            value={address} 
            onChange={e=>setAddress(e.target.value)} 
            placeholder="Shipping address *" 
            className="bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100"
            required
          />
        </div>
        <div className="mt-6 text-right">
          <button 
            disabled={placing || !name.trim() || !address.trim()} 
            onClick={onPlace} 
            className="btn btn-primary disabled:opacity-60"
          >
            {placing ? 'Placing Order…' : `Place Order - ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  )
}


