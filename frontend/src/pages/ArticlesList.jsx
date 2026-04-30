import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ArticlesList() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    api.getArticles()
      .then(setArticles);
  }, [])

  return (
    <div>
      <h1 className="page-title">Все статьи</h1>

      {articles.length === 0 ? (
        <div className="empty">
          <p>Статей пока нет.</p>
          <Link to="/articles/new">Написать первую статью</Link>
        </div>
      ) : (
        articles.map(article => (
          <div key={article.id} className="card">
            <div className="card-title">
              <Link to={`/articles/${article.id}`}>{article.title}</Link>
            </div>
            <div className="card-meta">{formatDate(article.created_at)}</div>
            <div className="card-summary">{article.summary}</div>
          </div>
        ))
      )}
    </div>
  )
}
