import { createContext, useContext, useState, useCallback } from 'react';
import { actualites as defaultActualites } from '../data/siteData';

const NewsContext = createContext();

const NEWS_KEY = 'taradeau-actualites';

function flattenActualites() {
  const all = [];
  let idx = 0;
  Object.entries(defaultActualites).forEach(([catKey, items]) => {
    items.forEach((item) => {
      all.push({
        id: `actu-${idx++}`,
        titre: item.titre,
        date: item.date,
        extrait: item.extrait,
        categorie: catKey,
        contenu: item.extrait,
        image: null,
        auteur: 'Mairie de Taradeau',
      });
    });
  });
  return all;
}

function loadArticles() {
  try {
    const saved = localStorage.getItem(NEWS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return flattenActualites();
}

function saveArticles(articles) {
  localStorage.setItem(NEWS_KEY, JSON.stringify(articles));
}

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState(loadArticles);

  const addArticle = useCallback((article) => {
    const newArticle = {
      ...article,
      id: `actu-${Date.now()}`,
      image: article.image || null,
    };
    setArticles((prev) => {
      const updated = [...prev, newArticle];
      saveArticles(updated);
      return updated;
    });
    return newArticle;
  }, []);

  const updateArticle = useCallback((id, updates) => {
    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      saveArticles(updated);
      return updated;
    });
  }, []);

  const deleteArticle = useCallback((id) => {
    setArticles((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveArticles(updated);
      return updated;
    });
  }, []);

  return (
    <NewsContext.Provider
      value={{
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within NewsProvider');
  return context;
}
