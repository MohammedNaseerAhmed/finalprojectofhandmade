import { http } from './http.js'

export async function getCart(userId){
  const res = await http.get(`/cart-api/cart/${userId}`)
  return res.data.payload || res.data
}

export async function addToCart(payload){
  const res = await http.post('/cart-api/cart', payload)
  return res.data.payload || res.data
}

export async function updateCartItemQuantity(userId, productId, quantity){
  const res = await http.put(`/cart-api/cart/${userId}/item/${productId}`, { quantity })
  return res.data.payload || res.data
}

export async function removeCartItem(userId, productId){
  const res = await http.delete(`/cart-api/cart/${userId}/item/${productId}`)
  return res.data.payload || res.data
}


