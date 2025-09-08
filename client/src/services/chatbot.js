import { http } from './http.js'

export async function chatbotQuery(query){
  const res = await http.post('/chatbot-api/', { query })
  return res.data
}


