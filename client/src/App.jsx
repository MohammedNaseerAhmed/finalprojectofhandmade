import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Orders from './pages/Orders.jsx'
import MyProducts from './pages/MyProducts.jsx'
import Reviews from './pages/Reviews.jsx'
import SellerOrders from './pages/SellerOrders.jsx'
import Chatbot from './components/Chatbot.jsx'
import { useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

export default function App() {
  const location = useLocation()
  const hideAssistant = location.pathname.startsWith('/login') || location.pathname.startsWith('/register')
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            
            {/* Cart and Orders - accessible by both buyers and sellers */}
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            
            {/* Buyer-only routes */}
            <Route path="/reviews" element={
              <ProtectedRoute requiredRole="buyer">
                <Reviews />
              </ProtectedRoute>
            } />
            
            {/* Seller-only routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="seller">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-products" element={
              <ProtectedRoute requiredRole="seller">
                <MyProducts />
              </ProtectedRoute>
            } />
            <Route path="/seller-orders" element={
              <ProtectedRoute requiredRole="seller">
                <SellerOrders />
              </ProtectedRoute>
            } />
            
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        {!hideAssistant && <Chatbot />}
        <Footer />
      </div>
    </ThemeProvider>
  )
}


