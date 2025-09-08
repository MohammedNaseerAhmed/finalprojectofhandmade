import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const res = await login({ email, password, role })
      const { token, user } = res.payload || {}
      if(token){
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        // Trigger a custom event to notify navbar of login
        window.dispatchEvent(new CustomEvent('userLogin', { detail: { user, token } }))
        navigate('/')
      }
    }catch(err){
      alert(err?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto glass rounded-2xl p-6 border border-white/10">
      <h2 className="text-2xl font-semibold text-slate-100 mb-2">Welcome back</h2>
      <p className="text-slate-400 mb-4">Sign in to continue shopping or manage your shop.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm text-slate-400">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"/>
        <label className="block text-sm text-slate-400 mt-2">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"/>
        <label className="block text-sm text-slate-400 mt-2">Login as</label>
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-transparent px-3 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable">
          <option className="bg-slate-900" value="buyer">Buyer</option>
          <option className="bg-slate-900" value="seller">Seller</option>
        </select>
        <button disabled={loading} className="w-full btn btn-primary disabled:opacity-60">{loading? 'Signing in…':'Login'}</button>
      </form>
      <div className="text-sm text-slate-400 mt-3">Don't have an account? <a href="/register" className="text-cyan-300 hover:underline">Create one</a></div>
    </div>
  )
}


