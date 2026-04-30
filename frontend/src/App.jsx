import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ArticlesList from './pages/ArticlesList'
import ArticleDetail from './pages/ArticleDetail'
import AddArticle from './pages/AddArticle'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">Блог</Link>
          <nav>
            <Link to="/" className="nav-link">Статьи</Link>
            <Link to="/articles/new" className="nav-link nav-link--accent">+ Написать статью</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<ArticlesList />} />
          <Route path="/articles/new" element={<AddArticle />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
