import { http } from './http.js'

export async function placeOrder(payload){
  const res = await http.post('/order-api/order', payload)
  return res.data
}

export async function getOrders(){
  const res = await http.get('/order-api/orders')
  return res.data
}


