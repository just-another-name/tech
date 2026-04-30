const BASE_URL = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Ошибка сервера' }))
    throw new Error(err.message || 'Ошибка сервера')
  }

  return res.json()
}

export const api = {
  getArticles: ()             => request('/articles'),
  getArticle:  (id)           => request(`/articles/${id}`),
  createArticle: (data)       => request('/articles', { method: 'POST', body: JSON.stringify(data) }),
  createComment: (id, data)   => request(`/articles/${id}/comment`, { method: 'POST', body: JSON.stringify(data) }),
}
