import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadArticles(sortField, sortOrder);
  }, [])
  
  const loadArticles = (sortField, sortOrder) => {
    api.getArticles(sortField, sortOrder)
      .then(setArticles);
  }
  
  const handleSort = (newField) => {
    let newOrder = 'asc';
    if (sortField === newField) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortField(newField);
    setSortOrder(newOrder);
    loadArticles(newField, newOrder);
  }
  
  const getArrow = (field) => {
    if (sortField !== field) return '';
    return sortOrder === 'asc' ? '↑' : '↓';
  }  

  const getButtonActive = (field) => {
    return sortField === field ? '' : 'btn-secondary';
  }  

  return (
    <div>
      <h1 className="page-title">Все статьи</h1>
      
      <div className="sort-panel">
        <span className="sort-label">Сортировать по:</span>
        <button 
          onClick={() => handleSort('id')}
          className={`btn-sort btn ${getButtonActive('id')}`}
        >
          ID {getArrow('id')}
        </button>
        <button 
          onClick={() => handleSort('title')}
          className={`btn-sort btn ${getButtonActive('title')}`}
        >
          Названию {getArrow('title')}
        </button>
      </div>
      <br/>

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
