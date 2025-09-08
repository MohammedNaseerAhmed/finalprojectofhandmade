import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  
  useEffect(()=>{
    try{
      const u = JSON.parse(localStorage.getItem('user')||'null')
      setUser(u)
    }catch{}
  }, [])

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
          <NavLink to="/" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>Home</NavLink>
          
          {/* Seller-specific navigation */}
          {user?.role==='seller' && (
            <>
              <NavLink to="/dashboard" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>Add Product</NavLink>
              <NavLink to="/my-products" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>My Products</NavLink>
              <NavLink to="/cart" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>Cart</NavLink>
              <NavLink to="/orders" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>My Orders</NavLink>
              <NavLink to="/seller-orders" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>Customer Orders</NavLink>
            </>
          )}
          
          {/* Buyer-specific navigation */}
          {user?.role==='buyer' && (
            <>
              <NavLink to="/cart" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>Cart</NavLink>
              <NavLink to="/orders" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>My Orders</NavLink>
              <NavLink to="/reviews" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>Reviews</NavLink>
            </>
          )}
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Authentication */}
          {!user && <NavLink to="/login" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'text-slate-300'}`}>Login</NavLink>}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Welcome, {user.fullname}</span>
              <button onClick={logout} className="text-slate-300 hover:text-cyan-300">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}


