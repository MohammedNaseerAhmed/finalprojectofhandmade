import { useEffect, useState } from 'react'
import { http } from '../services/http'
import { getImageUrl } from '../utils/imageUtils'

export default function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user || user.role !== 'seller') {
          setError('Access denied. Seller account required.')
          return
        }
        
        console.log('Fetching seller orders for user:', user.id)
        const response = await http.get('/order-api/orders/seller')
        console.log('Seller orders response:', response.data)
        setOrders(response.data.payload || response.data || [])
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(err.response?.data?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const updateOrderStatus = async (orderId, status) => {
    try {
      await http.put(`/order-api/orders/${orderId}/status`, { status })
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status } : order
        )
      )
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Failed to update order status')
    }
  }

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

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch = searchTerm === '' || 
      order.buyerId?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-slate-400">Loading orders...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="text-center py-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Error Loading Orders</h3>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Customer Orders</h1>
            <p className="text-slate-400">Manage and track orders from buyers who purchased your products</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cyan-400">{orderStats.total}</div>
            <div className="text-sm text-slate-400">Total Orders</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-yellow-400">{orderStats.pending}</div>
            <div className="text-xs text-slate-400">Pending</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-blue-400">{orderStats.confirmed}</div>
            <div className="text-xs text-slate-400">Confirmed</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-purple-400">{orderStats.shipped}</div>
            <div className="text-xs text-slate-400">Shipped</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-green-400">{orderStats.delivered}</div>
            <div className="text-xs text-slate-400">Delivered</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-red-400">{orderStats.cancelled}</div>
            <div className="text-xs text-slate-400">Cancelled</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-400 focus:border-cyan-400/40 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="glass rounded-2xl p-12 border border-white/10 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">
            {searchTerm || filter !== 'all' ? 'No orders found' : 'No customer orders yet'}
          </h3>
          <p className="text-slate-400">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Customer orders will appear here when buyers purchase your products'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
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
                      <span>👤 {order.buyerId?.fullname || 'Unknown Customer'}</span>
                      <span>•</span>
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

              {/* Shipping Info */}
              {order.shippingAddress && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Shipping Address:</div>
                  <div className="text-slate-200">{order.shippingAddress}</div>
                </div>
              )}

              {/* Order Items */}
              <div className="space-y-3 mb-4">
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
                      <div className="text-sm text-slate-400">Price: ₹{item.productId?.price || 0} each</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Qty: {item.quantity || 1}</div>
                      <div className="font-semibold text-cyan-400">₹{(item.productId?.price || 0) * (item.quantity || 1)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {order.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'confirmed')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                    >
                      ✅ Confirm Order
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                    >
                      ❌ Cancel Order
                    </button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <button 
                    onClick={() => updateOrderStatus(order._id, 'shipped')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
                  >
                    🚚 Mark as Shipped
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button 
                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors"
                  >
                    📦 Mark as Delivered
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-500/20 text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-500/30 transition-colors">
                  📞 Contact Customer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}