import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaEye, FaFile, FaSearch,
} from 'react-icons/fa';
import { useContent } from '../../context/ContentContext';

const emptyPage = {
  titre: '',
  sousTitre: '',
  contenu: '',
  image: '',
  publie: true,
};

function PageForm({ page, pagePath, onSave, onCancel }) {
  const [form, setForm] = useState(page || emptyPage);
  const [path, setPath] = useState(pagePath || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!path.trim()) errs.path = 'Chemin URL requis';
    else if (!path.startsWith('/')) errs.path = 'Le chemin doit commencer par /';
    if (!form.titre.trim()) errs.titre = 'Titre requis';
    if (!form.contenu.trim()) errs.contenu = 'Contenu requis';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave(path, form);
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
          <label>Chemin URL *</label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/commune/patrimoine"
            className={errors.path ? 'error' : ''}
            disabled={!!pagePath}
          />
          {errors.path && <span className="form-error">{errors.path}</span>}
          <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Correspond à l'URL dans le menu de navigation (ex: /tourisme/hebergements)
          </small>
        </div>
        <div className="form-group">
          <label>Titre de la page *</label>
          <input
            type="text"
            value={form.titre}
            onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))}
            placeholder="Patrimoine historique"
            className={errors.titre ? 'error' : ''}
          />
          {errors.titre && <span className="form-error">{errors.titre}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Sous-titre (optionnel)</label>
        <input
          type="text"
          value={form.sousTitre}
          onChange={(e) => setForm((p) => ({ ...p, sousTitre: e.target.value }))}
          placeholder="Découvrez le riche patrimoine de Taradeau"
        />
      </div>

      <div className="form-group">
        <label>URL de l'image d'en-tête (optionnel)</label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div className="form-group">
        <label>Contenu de la page *</label>
        <textarea
          rows="12"
          value={form.contenu}
          onChange={(e) => setForm((p) => ({ ...p, contenu: e.target.value }))}
          placeholder="Écrivez le contenu de la page ici...

Vous pouvez utiliser des retours à la ligne pour structurer le texte.

## Sous-titres
Utilisez ## pour créer des sous-titres.

- Listes avec des tirets
- Un autre élément

**Texte en gras** et *texte en italique*"
          className={errors.contenu ? 'error' : ''}
          style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
        />
        {errors.contenu && <span className="form-error">{errors.contenu}</span>}
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.publie}
            onChange={(e) => setForm((p) => ({ ...p, publie: e.target.checked }))}
            style={{ width: 18, height: 18 }}
          />
          Page publiée (visible par les visiteurs)
        </label>
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

/* Simple markdown-like renderer for preview */
function renderContent(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h3 key={i}>{line.slice(3)}</h3>;
    if (line.startsWith('# ')) return <h2 key={i}>{line.slice(2)}</h2>;
    if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} style={{ margin: '0.25rem 0' }}>{line}</p>;
  });
}

export default function AdminPages() {
  const { content, updatePage, deletePage } = useContent();
  const pages = content.pages || {};
  const [editing, setEditing] = useState(null); // null | 'new' | path string
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [previewPath, setPreviewPath] = useState(null);

  const pageEntries = useMemo(() => {
    return Object.entries(pages)
      .filter(([path, page]) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return path.toLowerCase().includes(q) || page.titre.toLowerCase().includes(q);
      })
      .sort(([a], [b]) => a.localeCompare(b));
  }, [pages, search]);

  const handleSave = (path, data) => {
    updatePage(path, data);
    setEditing(null);
  };

  const handleDelete = (path) => {
    deletePage(path);
    setDeleteConfirm(null);
  };

  return (
    <div className="admin-events">
      <div className="admin-page-header">
        <div>
          <h1>Gestion des pages</h1>
          <p>{pageEntries.length} page{pageEntries.length > 1 ? 's' : ''} créée{pageEntries.length > 1 ? 's' : ''}</p>
        </div>
        {editing === null && (
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            <FaPlus /> Nouvelle page
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing !== null && (
          <PageForm
            key={editing}
            page={editing !== 'new' ? pages[editing] : null}
            pagePath={editing !== 'new' ? editing : null}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      {editing === null && (
        <>
          <div className="admin-filters">
            <div className="admin-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Rechercher par titre ou chemin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="admin-search-clear">
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {pageEntries.length === 0 ? (
            <div className="admin-empty">
              <FaFile style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }} />
              <p>Aucune page créée. Créez votre première page pour enrichir le site.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Les pages correspondent aux liens du menu de navigation (ex: /commune/patrimoine).
              </p>
            </div>
          ) : (
            <div className="admin-events-list">
              {pageEntries.map(([path, page]) => (
                <motion.div
                  key={path}
                  className="admin-event-card"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="admin-event-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ margin: 0 }}>{page.titre}</h3>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor: page.publie ? '#16a34a' : '#6b7280',
                      }}>
                        {page.publie ? 'Publiée' : 'Brouillon'}
                      </span>
                    </div>
                    <div className="admin-event-meta">
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{path}</span>
                    </div>
                    {page.sousTitre && <p style={{ color: 'var(--text-secondary)' }}>{page.sousTitre}</p>}

                    {previewPath === path && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: 'var(--bg-secondary)',
                          borderRadius: 8,
                          maxHeight: 300,
                          overflow: 'auto',
                          fontSize: '0.9rem',
                        }}
                      >
                        {renderContent(page.contenu)}
                      </motion.div>
                    )}
                  </div>

                  <div className="admin-event-card-actions">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setPreviewPath(previewPath === path ? null : path)}
                    >
                      <FaEye /> {previewPath === path ? 'Masquer' : 'Aperçu'}
                    </button>
                    <button className="btn btn-sm btn-outline" onClick={() => setEditing(path)}>
                      <FaEdit /> Modifier
                    </button>
                    {deleteConfirm === path ? (
                      <div className="delete-confirm">
                        <span>Supprimer ?</span>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(path)}>Oui</button>
                        <button className="btn btn-sm btn-outline" onClick={() => setDeleteConfirm(null)}>Non</button>
                      </div>
                    ) : (
                      <button className="btn btn-sm btn-danger-outline" onClick={() => setDeleteConfirm(path)}>
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
