import { http } from './http.js'

export async function fetchProducts(params={}){
  const res = await http.get('/product-api/products', { params })
  return res.data.payload || res.data
}

export async function fetchProduct(id){
  const res = await http.get(`/product-api/product/${id}`)
  return res.data.payload || res.data
}

export async function createProduct(payload){
  const res = await http.post('/product-api/product', payload)
  return res.data.payload || res.data
}

export async function generateDescription(payload){
  const res = await http.post('/product-api/generate-description', payload)
  return res.data.payload || res.data
}

export async function fetchProductsByUser(userId){
  const res = await http.get(`/product-api/products/${userId}`)
  return res.data.payload || res.data
}

export async function updateProduct(id, payload){
  const res = await http.put(`/product-api/product/${id}`, payload)
  return res.data.payload || res.data
}

export async function deleteProduct(id){
  const res = await http.delete(`/product-api/product/${id}`)
  return res.data.payload || res.data
}


