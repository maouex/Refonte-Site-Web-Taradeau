import { useState } from 'react';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import AnimatedSection from './AnimatedSection';
import { actualites } from '../data/siteData';

const categories = [
  { key: 'vieCommunale', label: 'Vie communale' },
  { key: 'manifestations', label: 'Manifestations' },
  { key: 'jeunesse', label: 'Jeunesse' },
  { key: 'tourisme', label: 'Tourisme' },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Actualites() {
  const [activeTab, setActiveTab] = useState('vieCommunale');

  const articles = actualites[activeTab] || [];

  return (
    <section className="section actualites-section" aria-label="Actualités" id="actualites">
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Actualités</h2>
            <p>Restez informés de la vie à Taradeau</p>
          </div>
        </AnimatedSection>

        <div className="actualites-tabs" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`tab-btn ${activeTab === cat.key ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.key)}
              role="tab"
              aria-selected={activeTab === cat.key}
              aria-controls={`panel-${cat.key}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="actualites-grid" role="tabpanel" id={`panel-${activeTab}`}>
          {articles.map((article, i) => (
            <AnimatedSection key={article.titre} delay={i * 0.1}>
              <article className="article-card">
                <div className="article-card-image">
                  <span className="article-card-category">{article.categorie}</span>
                </div>
                <div className="article-card-body">
                  <div className="article-card-date">
                    <FaCalendarAlt />
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                  </div>
                  <h3>{article.titre}</h3>
                  <p>{article.extrait}</p>
                  <a href="#" className="article-card-link">
                    Lire la suite <FaArrowRight />
                  </a>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
