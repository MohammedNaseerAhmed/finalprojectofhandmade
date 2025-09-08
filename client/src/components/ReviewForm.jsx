import { useState } from 'react'
import { http } from '../services/http'

export default function ReviewForm({ productId }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) {
      alert('Please login to write a review')
      return
    }

    setSubmitting(true)
    try {
      await http.post('/review-api/review', {
        productId,
        userId: user.id,
        rating,
        comment
      })
      alert('Review submitted successfully!')
      setComment('')
      setRating(5)
    } catch (error) {
      alert('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 border border-white/10">
      <h3 className="text-lg font-semibold text-slate-100 mb-3">Write a Review</h3>
      
      <div className="mb-3">
        <label className="block text-sm text-slate-400 mb-2">Rating</label>
        <select 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
          className="bg-transparent px-3 py-2 rounded-lg border border-white/10 focus:border-cyan-400/40 text-slate-100"
        >
          <option value={5} className="bg-slate-900">⭐⭐⭐⭐⭐ (5)</option>
          <option value={4} className="bg-slate-900">⭐⭐⭐⭐ (4)</option>
          <option value={3} className="bg-slate-900">⭐⭐⭐ (3)</option>
          <option value={2} className="bg-slate-900">⭐⭐ (2)</option>
          <option value={1} className="bg-slate-900">⭐ (1)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={3}
          className="w-full bg-transparent outline-none px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400/40 text-slate-100"
        />
      </div>

      <button 
        type="submit" 
        disabled={submitting}
        className="btn btn-primary disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
