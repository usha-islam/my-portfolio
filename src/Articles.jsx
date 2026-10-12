import { useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { articles, articleIntroduction } from './articles.js'
import './Articles.css'

function ArticleMeta({ article }) {
  return <><ul className="tags">{article.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><p className="reading-time">{article.readingTime} min read</p></>
}

export function Articles() {
  const section = useRef(null)
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        entry.target.style.setProperty('--article-delay', `${index * 100}ms`)
        entry.target.classList.add('article-entered')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.1 })
    section.current.querySelectorAll('.article-card').forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [])
  return <section id="articles" ref={section} className="section container article-listing reveal" tabIndex="-1">
    <div className="section-heading"><h1>QA Insights</h1><p className="section-description">Practical perspectives on testing, quality, and better software decisions.</p></div>
    <p className="article-introduction">{articleIntroduction}</p>
    <div className="article-grid">{articles.map(article => <article className="article-card" key={article.slug}>
      <h3>{article.title}</h3><p className="article-excerpt">{article.excerpt}</p><ArticleMeta article={article} />
      <a className="text-link article-read-link" href={`#/articles/${article.slug}`} aria-label={`Read Article: ${article.title}`}>Read Article <span aria-hidden="true">→</span></a>
    </article>)}</div>
  </section>
}

const markdownComponents = {
  table: ({ children, node: _node, ...props }) => <div className="article-table-scroll" role="region" aria-label="Article table" tabIndex="0"><table {...props}>{children}</table></div>,
  pre: ({ children, node: _node, ...props }) => <pre {...props} tabIndex="0" aria-label="Code example">{children}</pre>,
}

export function ArticleReader({ slug }) {
  const index = articles.findIndex(article => article.slug === slug)
  const article = articles[index]
  if (!article) return <div className="article-reader"><h1>Article not found</h1><a className="text-link" href="#/articles">Back to Articles</a></div>
  return <article className="article-reader">
    <a className="text-link" href="#/articles">← Back to Articles</a>
    <header className="article-header"><h1>{article.title}</h1><p className="article-author">By Fatema Akter Usha</p><ArticleMeta article={article} /></header>
    <p className="article-context">{articleIntroduction}</p>
    <div className="article-body"><Markdown remarkPlugins={[remarkGfm]} skipHtml components={markdownComponents}>{article.content}</Markdown></div>
    <nav className="article-pagination" aria-label="Article navigation">
      {index > 0 && <a className="text-link" href={`#/articles/${articles[index - 1].slug}`}><span>← Previous article<br />{articles[index - 1].title}</span></a>}
      {index < articles.length - 1 && <a className="text-link article-next" href={`#/articles/${articles[index + 1].slug}`}><span>Next article →<br />{articles[index + 1].title}</span></a>}
    </nav>
    <a className="text-link" href="#/articles">Back to Articles</a>
  </article>
}
