import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null')
      setUser(u)
    } catch {}
  }, [])

  useEffect(()=>{
    const run = async ()=>{
      setLoading(true)
      try{
        const data = await fetchProducts({ q, category, sort })
        const list = data.payload || data || []
        setItems(list)
      } catch (error) {
        console.error('Error fetching products:', error)
        setItems([])
      } finally { setLoading(false) }
    }
    run()
  }, [q, category, sort])

  return (
    <div>
      <section className="mb-6 glass rounded-2xl p-6 border border-white/10 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 animate-slide-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient animate-pulse-3d">
              {user?.role === 'seller' ? 'Manage Your Store' : 'Handmade with love'}
            </h1>
            <p className="text-slate-400 mt-1">
              {user?.role === 'seller' 
                ? 'Welcome back! Manage your products and track your sales.' 
                : 'Discover unique crafts from local artisans.'}
            </p>
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-3 animate-slide-right">
            <input 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
              placeholder="Search products by name or description..." 
              className="flex-1 bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 hover-3d focusable"
            />
            <div className="flex gap-3">
              <select 
                value={category} 
                onChange={e=>setCategory(e.target.value)} 
                className="bg-transparent px-3 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 hover-3d focusable"
              >
                <option className="bg-slate-900" value="">All Categories</option>
                <option className="bg-slate-900" value="jewelry">Jewelry</option>
                <option className="bg-slate-900" value="decor">Wall Décor</option>
                <option className="bg-slate-900" value="paintings">Paintings</option>
                <option className="bg-slate-900" value="textiles">Textiles</option>
                <option className="bg-slate-900" value="books">Books</option>
                <option className="bg-slate-900" value="watch">Watches</option>
                <option className="bg-slate-900" value="cycle">Cycles</option>
              </select>
              <select 
                value={sort} 
                onChange={e=>setSort(e.target.value)} 
                className="bg-transparent px-3 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 hover-3d focusable"
              >
                <option className="bg-slate-900" value="newest">Newest First</option>
                <option className="bg-slate-900" value="price_asc">Price: Low to High</option>
                <option className="bg-slate-900" value="price_desc">Price: High to Low</option>
                <option className="bg-slate-900" value="title">Name: A to Z</option>
                <option className="bg-slate-900" value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions for sellers */}
      {user?.role === 'seller' && (
        <section className="mb-6 glass rounded-2xl p-6 border border-white/10 animate-slide-up">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/dashboard" className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-slate-100 font-medium">Add New Product</h3>
              <p className="text-slate-400 text-sm mt-1">Create and list a new handmade product</p>
            </a>
            <a href="/my-products" className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-slate-100 font-medium">Manage Products</h3>
              <p className="text-slate-400 text-sm mt-1">View and edit your existing products</p>
            </a>
          </div>
        </section>
      )}

      {loading ? (
        <div className="text-slate-400 animate-pulse-3d">Loading products…</div>
      ) : (
        <>
          {/* Search results info */}
          {(q || category) && (
            <div className="mb-4 text-slate-400 text-sm">
              {items.length > 0 ? (
                <>Found {items.length} product{items.length !== 1 ? 's' : ''} 
                {q && <> for "{q}"</>}
                {category && <> in {category}</>}</>
              ) : (
                <>No products found
                {q && <> for "{q}"</>}
                {category && <> in {category}</>}</>
              )}
            </div>
          )}
          
          {items.length === 0 ? (
            <div className="text-slate-400 text-center py-20 animate-float">
              {q || category ? (
                <>
                  No products found matching your search.
                  <br />
                  <span className="text-sm">Try adjusting your search terms or browse all categories.</span>
                </>
              ) : (
                <>
                  No products available at the moment.
                  <br />
                  <span className="text-sm">Check back later for new handmade items!</span>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((p, index)=> (
                <div key={p._id} className={`animate-slide-up delay-${Math.min(index * 100, 800)}`}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}


