import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/imageUtils.js'

export default function ProductCard({ product }) {

  return (
    <Link to={`/product/${product._id}`} className="block rounded-xl overflow-hidden hover-rise glass">
      <div className="relative">
        <img src={getImageUrl(product.images?.[0])} alt={product.title} className="w-full h-60 object-cover"/>
        {product.featured && (
          <span className="absolute top-2 left-2 text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full">Featured</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-slate-100 font-semibold line-clamp-1">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-cyan-300 font-semibold">₹{product.price}</span>
          <span className="text-slate-400">⭐ {product.avgRating?.toFixed?.(1) ?? '—'}</span>
        </div>
      </div>
    </Link>
  )
}


