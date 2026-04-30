import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function AddArticle() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', content: '' })
  const [submitting, setSub] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      setError('Заполните все поля')
      return
    }
    setSub(true)
    try {
      const article = await api.createArticle(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setSub(false)
    }
  }

  return (
    <div>
      <Link to="/" className="back-link">← Назад к статьям</Link>

      <h1 className="page-title">Новая статья</h1>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label className="form-label" htmlFor="title">Заголовок</label>
          <input
            id="title"
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            placeholder="Введите заголовок статьи"
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Содержание</label>
          <textarea
            id="content"
            name="content"
            className="form-textarea"
            value={form.content}
            onChange={handleChange}
            placeholder="Напишите содержание статьи..."
            style={{ minHeight: '300px' }}
          />
        </div>

        {error && <p className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Публикация...' : 'Опубликовать'}
          </button>
          <Link to="/">
            <button type="button" className="btn btn-secondary">Отмена</button>
          </Link>
        </div>
      </form>
    </div>
  )
}
