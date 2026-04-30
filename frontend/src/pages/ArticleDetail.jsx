import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function CommentForm({ articleId, onAdded }) {
  const [form, setForm] = useState({ author_name: '', content: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.author_name.trim() || !form.content.trim()) {
      setError('Заполните все поля')
      return
    }
    try {
      const comment = await api.createComment(articleId, form)
      onAdded(comment)
      setForm({ author_name: '', content: '' })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ marginTop: '1rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Оставить комментарий</h3>

      <div className="form-group">
        <label className="form-label" htmlFor="author_name">Ваше имя</label>
        <input
          id="author_name"
          name="author_name"
          className="form-input"
          value={form.author_name}
          onChange={handleChange}
          placeholder="Иван Иванов"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="comment_content">Комментарий</label>
        <textarea
          id="comment_content"
          name="content"
          className="form-textarea"
          value={form.content}
          onChange={handleChange}
          placeholder="Напишите ваш комментарий..."
          style={{ minHeight: '90px' }}
        />
      </div>

      {error   && <p className="error-text" style={{ marginBottom: '0.75rem' }}>{error}</p>}
      {success && <p className="success-text" style={{ marginBottom: '0.75rem' }}>Комментарий добавлен!</p>}

      <button className="btn" type="submit">
        Отправить
      </button>
    </form>
  )
}

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getArticle(id)
      .then(setArticle)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading">Загрузка статьи...</div>
  if (error)   return <div className="loading" style={{ color: '#dc2626' }}>Ошибка: {error}</div>

  function handleCommentAdded(comment) {
    setArticle(a => ({ ...a, comments: [...a.comments, comment] }))
  }

  return (
    <div>
      <Link to="/" className="back-link">← Назад к статьям</Link>

      <div className="card">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">{formatDate(article.created_at)}</div>
        <div className="article-content">{article.content}</div>
      </div>

      <h2 className="section-title">
        Комментарии ({article.comment.length})
      </h2>

      {article.comment.length === 0 ? (
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Комментариев пока нет. Будьте первым!</p>
      ) : (
        article.comment.map(c => (
          <div key={c.id} className="comment">
            <div>
              <span className="comment-author">{c.author_name}</span>
              <span className="comment-date">{formatDate(c.created_at)}</span>
            </div>
            <div className="comment-content">{c.content}</div>
          </div>
        ))
      )}

      <CommentForm articleId={id} onAdded={handleCommentAdded} />
    </div>
  )
}
