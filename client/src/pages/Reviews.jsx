import { useEffect, useState } from 'react'
import { http } from '../services/http'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) {
          setError('Please log in to view reviews')
          return
        }
        
        const response = await http.get(`/review-api/reviews/user/${user.id}`)
        setReviews(response.data.payload || response.data || [])
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError(err.response?.data?.message || 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">My Reviews</h2>
        <div className="text-slate-400">Loading reviews...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">My Reviews</h2>
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">My Reviews</h2>
        
        {reviews.length === 0 ? (
          <div className="text-slate-400 text-center py-8">
            You haven't written any reviews yet.
            <br />
            <span className="text-sm">Visit a product page to write your first review!</span>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-slate-100 font-medium">
                      {review.productId?.title || 'Product'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-600'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-400 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-slate-300 mt-2 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
