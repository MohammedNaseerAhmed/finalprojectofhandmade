import { useEffect, useRef, useState } from 'react'
import { chatbotQuery } from '../services/chatbot.js'

export default function Chatbot(){
  const [open, setOpen] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me for products, e.g., "Show jewelry under ₹3000"' }
  ])
  const listRef = useRef(null)

  useEffect(()=>{
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const onSend = async (e)=>{
    e.preventDefault()
    const q = input.trim()
    if(!q) return
    setMessages(m=>[...m, { role: 'user', content: q }])
    setInput('')
    try{
      const res = await chatbotQuery(q)
      const items = res?.payload || []
      const text = res?.message || (items.length > 0 ? 'Here are some picks:' : 'No products matched your search')
      setMessages(m=>[...m, { role:'assistant', content: text, items }])
    }catch(err){
      console.error('Chatbot error:', err)
      setMessages(m=>[...m, { role:'assistant', content: 'Sorry, I could not fetch results.' }])
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button onClick={()=>setOpen(o=>!o)} className="glass hover-rise rounded-full px-4 py-2 text-sm text-slate-100 border border-cyan-300/20">
        {open ? 'Close Assistant' : 'Ask Assistant'}
      </button>
      {open && (
        <div className="mt-3 w-[360px] glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 text-slate-200">
            Shopping Assistant
          </div>
          <div ref={listRef} className="max-h-72 overflow-y-auto space-y-3 p-3">
            {messages.map((m, i)=> (
              <div key={i} className={`${m.role==='assistant'? 'text-slate-200':'text-slate-300'} text-sm`}>
                <p className="mb-2">{m.content}</p>
                {m.items?.length>0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {m.items.map((it, index)=> (
                      <a key={it._id || index} href={`/product/${it._id}`} className="glass hover-rise rounded-lg overflow-hidden">
                        <img 
                          src={it.images?.[0] ? `http://localhost:3000${it.images[0]}` : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCAyMEM2Mi4xNSAyMCA3MiAzMC4xNSA3MiA0MkM3MiA1My44NSA2Mi4xNSA2NCA1MCA2NEMzNy44NSA2NCAyOCA1My44NSAyOCA0MkMyOCAzMC4xNSAzNy44NSAyMCA1MCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTUwIDY1QzM3Ljg1IDY1IDI4IDc1LjE1IDI4IDg3VjkwSDcyVjg3QzcyIDc1LjE1IDYyLjE1IDY1IDUwIDY1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4="} 
                          alt={it.title} 
                          className="h-24 w-full object-cover"
                        />
                        <div className="p-2 text-xs">
                          <div className="line-clamp-1 text-slate-100">{it.title}</div>
                          <div className="text-cyan-300 font-semibold">₹{it.price}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={onSend} className="flex items-center gap-2 p-3 border-t border-white/10">
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask e.g. featured paintings" className="flex-1 bg-transparent outline-none px-3 py-2 rounded-lg border border-white/10 focus:border-cyan-400/40 text-slate-100"/>
            <button className="px-3 py-2 rounded-lg bg-cyan-400/20 text-cyan-200 border border-cyan-300/20 hover:bg-cyan-400/30">Send</button>
          </form>
        </div>
      )}
    </div>
  )
}


