import { useEffect, useState } from 'react'
import { getOrders } from '../services/orders'
import { getImageUrl } from '../utils/imageUtils'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const run = async ()=>{
      setLoading(true)
      try{ 
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) return
        
        // For sellers, only show orders they placed as a buyer (not orders they received as a seller)
        const res = await getOrders(); 
        const allOrders = res?.payload || res || []
        
        // Filter orders to only show orders where the user is the buyer
        // This ensures sellers only see their own purchases, not orders for their products
        const userOrders = allOrders.filter(order => 
          order.userId === user.id || order.buyerId === user.id
        )
        
        setOrders(userOrders) 
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally{ 
        setLoading(false) 
      }
    }
    run()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'confirmed': return '✅'
      case 'shipped': return '🚚'
      case 'delivered': return '📦'
      case 'cancelled': return '❌'
      default: return '❓'
    }
  }

  if(loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-slate-400">Loading your orders...</span>
        </div>
      </div>
    )
  }

  if(!orders?.length) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return (
      <div className="glass rounded-2xl p-12 border border-white/10 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">No orders yet</h3>
        <p className="text-slate-400">
          {user.role === 'seller' 
            ? "You haven't placed any orders as a buyer yet. Start shopping to see your purchases here!" 
            : "Start shopping to see your orders here!"
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="glass rounded-2xl p-6 border border-white/10 hover:border-cyan-400/20 transition-colors">
          {/* Order Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                #{order._id.slice(-4)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Order #{order._id.slice(-8)}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>🕒 {new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">₹{order.totalAmount}</div>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border shadow-sm ${getStatusColor(order.status)}`}>
                <span>{getStatusIcon(order.status)}</span>
                {order.status?.toUpperCase() || 'PENDING'}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Order Items:</h4>
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <img 
                  src={getImageUrl(item.productId?.images?.[0], 60)} 
                  alt={item.productId?.title} 
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                         <div className="flex-1">
                           <div className="font-medium text-slate-100">{item.productId?.title || 'Unknown Product'}</div>
                           <div className="text-sm text-slate-400">Category: {item.productId?.category || 'Unknown'}</div>
                           <div className="text-sm text-slate-400">Seller: {item.productId?.userId?.fullname || 'Unknown'}</div>
                           <div className="text-sm text-slate-400">Price: ₹{item.productId?.price || 0} each</div>
                         </div>
                         <div className="text-right">
                           <div className="text-sm text-slate-400">Qty: {item.quantity || 1}</div>
                           <div className="font-semibold text-cyan-400">₹{(item.productId?.price || 0) * (item.quantity || 1)}</div>
                         </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


