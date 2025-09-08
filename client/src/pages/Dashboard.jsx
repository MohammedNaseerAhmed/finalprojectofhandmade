import { useEffect, useState } from 'react'
import { createProduct, generateDescription } from '../services/products.js'
import { uploadImages } from '../services/upload.js'

export default function Dashboard(){
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState([])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(()=>{}, [])

  const onGenerate = async ()=>{
    if (!title.trim() || !category.trim()) {
      alert('Please enter both title and category before generating description')
      return
    }
    setLoading(true)
    try{
      const res = await generateDescription({ title, category })
      setDescription(res.description || '')
    }catch(e){
      console.error('Description generation error:', e)
      setDescription('A handcrafted piece made with care. Perfect for gifting and everyday joy.')
    } finally { setLoading(false) }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    setUploading(true)
    try {
      const res = await uploadImages(files)
      const newImageUrls = res.payload?.imageUrls || []
      setImages(prev => [...prev, ...newImageUrls])
    } catch (error) {
      alert('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onPublish = async ()=>{
    setLoading(true)
    try{
      const user = JSON.parse(localStorage.getItem('user')||'null')
      if(!user || user.role!=='seller'){ return alert('Login as seller to publish') }
      const useGROQ = !description || description.trim()===''
      await createProduct({ title, description, price: Number(price)||0, images, category, featured:false, useGROQ })
      setTitle(''); setPrice(''); setCategory(''); setImages([]); setDescription('')
      alert('Product created')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Upload Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"/>
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" className="bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"/>
          <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"/>
          
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400 mb-2">Product Images</label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable disabled:opacity-50"
            />
            {uploading && <div className="text-slate-400 text-sm mt-1">Uploading...</div>}
            
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={`http://localhost:3000${img}`} alt={`Product ${index + 1}`} className="w-full h-20 object-cover rounded-lg"/>
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={6} placeholder="Description" className="md:col-span-2 bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100 focusable"></textarea>
        </div>
        <div className="mt-4 flex gap-3">
          <button disabled={loading} onClick={onGenerate} className="px-5 py-3 rounded-xl bg-cyan-400/20 text-cyan-200 border border-cyan-300/20 hover:bg-cyan-400/30 disabled:opacity-60">Generate Description with AI</button>
          <button disabled={loading} onClick={onPublish} className="px-5 py-3 rounded-xl border border-white/10 hover:border-cyan-300/40 disabled:opacity-60">Publish</button>
        </div>
      </div>
    </div>
  )
}


