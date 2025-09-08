import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as registerApi } from '../services/auth'

export default function Register(){
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const res = await registerApi({ fullname, email, password, role })
      const { token, user } = res.payload || {}
      if(token){
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        // Auto-login after registration - no need to login again
        navigate('/')
      }
    }catch(err){
      alert(err?.response?.data?.message || 'Register failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto glass rounded-2xl p-6 border border-white/10">
      <h2 className="text-2xl font-semibold text-slate-100 mb-2">Create account</h2>
      <p className="text-slate-400 mb-4">Join as a buyer or seller.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm text-slate-400">Full name</label>
        <input value={fullname} onChange={e=>setFullname(e.target.value)} placeholder="Alex Johnson" className="w-full bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"/>
        <label className="block text-sm text-slate-400 mt-2">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"/>
        <label className="block text-sm text-slate-400 mt-2">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"/>
        <label className="block text-sm text-slate-400 mt-2">Register as</label>
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-transparent px-3 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable">
          <option className="bg-slate-900" value="buyer">Buyer</option>
          <option className="bg-slate-900" value="seller">Seller</option>
        </select>
        <button disabled={loading} className="w-full btn btn-primary disabled:opacity-60">{loading? 'Creating…':'Register'}</button>
      </form>
      <div className="text-sm text-slate-400 mt-3">Already have an account? <a href="/login" className="text-cyan-300 hover:underline">Sign in</a></div>
    </div>
  )
}


