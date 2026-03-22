import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaSearch, FaFilter, FaCalendarAlt, FaNewspaper, FaUser,
} from 'react-icons/fa';
import { useNews } from '../../context/NewsContext';

const CATEGORIES = {
  vieCommunale: 'Vie communale',
  manifestations: 'Manifestations',
  jeunesse: 'Jeunesse',
  tourisme: 'Tourisme',
};

const CATEGORY_COLORS = {
  vieCommunale: '#2563eb',
  manifestations: '#dc2626',
  jeunesse: '#16a34a',
  tourisme: '#d97706',
};

const emptyArticle = {
  titre: '',
  date: '',
  extrait: '',
  categorie: 'vieCommunale',
  contenu: '',
  auteur: '',
};

function ArticleForm({ article, onSave, onCancel }) {
  const [form, setForm] = useState(article || emptyArticle);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.titre.trim()) errs.titre = 'Titre requis';
    if (!form.date) errs.date = 'Date requise';
    if (!form.extrait.trim()) errs.extrait = 'Extrait requis';
    if (!form.contenu.trim()) errs.contenu = 'Contenu requis';
    if (!form.auteur.trim()) errs.auteur = 'Auteur requis';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave(form);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <motion.form
      className="admin-event-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="form-row">
        <div className="form-group">
          <label>Titre de l'article *</label>
          <input
            type="text"
            value={form.titre}
            onChange={handleChange('titre')}
            placeholder="Titre de l'actualit&eacute;"
            className={errors.titre ? 'error' : ''}
          />
          {errors.titre && <span className="form-error">{errors.titre}</span>}
        </div>
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Cat&eacute;gorie *</label>
          <select value={form.categorie} onChange={handleChange('categorie')}>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Auteur *</label>
          <input
            type="text"
            value={form.auteur}
            onChange={handleChange('auteur')}
            placeholder="Nom de l'auteur"
            className={errors.auteur ? 'error' : ''}
          />
          {errors.auteur && <span className="form-error">{errors.auteur}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Extrait *</label>
        <input
          type="text"
          value={form.extrait}
          onChange={handleChange('extrait')}
          placeholder="R&eacute;sum&eacute; court de l'article"
          className={errors.extrait ? 'error' : ''}
        />
        {errors.extrait && <span className="form-error">{errors.extrait}</span>}
      </div>

      <div className="form-group">
        <label>Contenu complet *</label>
        <textarea
          rows="6"
          value={form.contenu}
          onChange={handleChange('contenu')}
          placeholder="Contenu d&eacute;taill&eacute; de l'article..."
          className={errors.contenu ? 'error' : ''}
        />
        {errors.contenu && <span className="form-error">{errors.contenu}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          <FaSave /> Enregistrer
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          <FaTimes /> Annuler
        </button>
      </div>
    </motion.form>
  );
}

export default function AdminActualites() {
  const { articles, addArticle, updateArticle, deleteArticle } = useNews();
  const [editing, setEditing] = useState(null); // null | 'new' | article id
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('all');

  const filtered = useMemo(() => {
    return articles
      .filter((a) => {
        if (filterCategorie !== 'all' && a.categorie !== filterCategorie) return false;
        if (search) {
          const q = search.toLowerCase();
          return a.titre.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [articles, search, filterCategorie]);

  const handleSave = (form) => {
    if (editing === 'new') {
      addArticle(form);
    } else {
      updateArticle(editing, form);
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteArticle(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="admin-events">
      <div className="admin-page-header">
        <div>
          <h1>Gestion des actualit&eacute;s</h1>
          <p>{filtered.length} article{filtered.length > 1 ? 's' : ''}</p>
        </div>
        {editing === null && (
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            <FaPlus /> Nouvel article
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing !== null && (
          <ArticleForm
            key={editing}
            article={editing !== 'new' ? articles.find((a) => a.id === editing) : null}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      {editing === null && (
        <div className="admin-filters">
          <div className="admin-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Rechercher par titre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="admin-search-clear">
                <FaTimes />
              </button>
            )}
          </div>

          <div className="admin-filter-group">
            <FaFilter />
            <select value={filterCategorie} onChange={(e) => setFilterCategorie(e.target.value)}>
              <option value="all">Toutes les cat&eacute;gories</option>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filtered.length === 0 && editing === null ? (
        <div className="admin-empty">
          <p>Aucun article trouv&eacute;.</p>
        </div>
      ) : (
        <div className="admin-events-list">
          {filtered.map((article) => (
            <motion.div
              key={article.id}
              className="admin-event-card"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="admin-event-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ margin: 0 }}>{article.titre}</h3>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#fff',
                      backgroundColor: CATEGORY_COLORS[article.categorie] || '#6b7280',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {CATEGORIES[article.categorie] || article.categorie}
                  </span>
                </div>
                <div className="admin-event-meta">
                  <span><FaCalendarAlt /> {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span><FaUser /> {article.auteur}</span>
                  <span><FaNewspaper /> {CATEGORIES[article.categorie] || article.categorie}</span>
                </div>
                <p>{article.extrait}</p>
              </div>

              <div className="admin-event-card-actions">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setEditing(article.id)}
                >
                  <FaEdit /> Modifier
                </button>
                {deleteConfirm === article.id ? (
                  <div className="delete-confirm">
                    <span>Supprimer ?</span>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(article.id)}>Oui</button>
                    <button className="btn btn-sm btn-outline" onClick={() => setDeleteConfirm(null)}>Non</button>
                  </div>
                ) : (
                  <button
                    className="btn btn-sm btn-danger-outline"
                    onClick={() => setDeleteConfirm(article.id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
