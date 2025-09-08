import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { getCart } from '../services/cart'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()
  
  useEffect(()=>{
    try{
      const u = JSON.parse(localStorage.getItem('user')||'null')
      setUser(u)
    }catch{}
  }, [])

  // Fetch cart count when user changes
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user?.id) {
        try {
          const cart = await getCart(user.id)
          const count = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0
          setCartCount(count)
        } catch (error) {
          console.error('Error fetching cart count:', error)
          setCartCount(0)
        }
      } else {
        setCartCount(0)
      }
    }
    
    fetchCartCount()
  }, [user])

  // Listen for storage changes and login events to update user state
  useEffect(() => {
    const handleStorageChange = () => {
      try{
        const u = JSON.parse(localStorage.getItem('user')||'null')
        setUser(u)
      }catch{}
    }
    
    const handleUserLogin = (event) => {
      setUser(event.detail.user)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userLogin', handleUserLogin)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLogin', handleUserLogin)
    }
  }, [])

  const logout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }
  return (
    <header className="sticky top-0 z-50 bg-[rgba(11,15,20,0.7)] glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-cyan-400/20 border border-cyan-300/30 grid place-items-center">
            <span className="text-cyan-300 text-sm font-bold">HW</span>
          </div>
          <span className="text-gradient font-bold tracking-wide">HandmadeWorld</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </NavLink>
          
          {/* Seller-specific navigation */}
          {user?.role==='seller' && (
            <>
              <NavLink to="/dashboard" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </NavLink>
              <NavLink to="/my-products" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                My Products
              </NavLink>
              <NavLink to="/cart" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'} relative`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </NavLink>
              <NavLink to="/orders" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Orders
              </NavLink>
              <NavLink to="/seller-orders" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Customer Orders
              </NavLink>
            </>
          )}
          
          {/* Buyer-specific navigation */}
          {user?.role==='buyer' && (
            <>
              <NavLink to="/cart" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'} relative`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </NavLink>
              <NavLink to="/orders" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Orders
              </NavLink>
              <NavLink to="/reviews" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Reviews
              </NavLink>
            </>
          )}
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Authentication */}
          {!user && (
            <NavLink to="/login" className={({isActive})=>`flex items-center gap-2 hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </NavLink>
          )}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Welcome back</span>
                  <span className="text-sm font-medium text-cyan-300">{user.fullname}</span>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}


