import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUpload, FaTrash, FaSearch, FaImage, FaExpand, FaTimes,
} from 'react-icons/fa';

const STORAGE_KEY = 'taradeau-images';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_COMPRESSED_SIZE = 500 * 1024; // 500KB
const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.7;
const CATEGORIES = ['Patrimoine', 'Nature', 'Village', 'Événements', 'Autre'];

/* ---------- Compression utility ---------- */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let quality = JPEG_QUALITY;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Progressively reduce quality if still too large
        while (dataUrl.length > MAX_COMPRESSED_SIZE * 1.37 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Impossible de charger l\'image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

/* ---------- Storage helpers ---------- */
function loadImages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveImages(images) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

function getStorageUsage() {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    total += (localStorage.getItem(key) || '').length * 2; // UTF-16
  }
  return total;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
}

/* ---------- Styles ---------- */
const styles = {
  container: {
    padding: 0,
  },
  storageWarning: {
    background: 'rgba(232, 78, 59, 0.1)',
    border: '1px solid var(--rouge-provencal)',
    borderRadius: 12,
    padding: '12px 20px',
    marginBottom: 20,
    color: 'var(--rouge-provencal)',
    fontSize: '0.875rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  storageInfo: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    padding: '10px 16px',
    marginBottom: 20,
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storageBar: {
    height: 6,
    borderRadius: 3,
    background: 'var(--border-color)',
    flex: 1,
    maxWidth: 200,
    marginLeft: 12,
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    padding: '8px 14px',
    flex: '1 1 220px',
    maxWidth: 320,
    transition: 'all var(--transition)',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    width: '100%',
    fontFamily: 'var(--font-body)',
  },
  filterSelect: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    padding: '8px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    outline: 'none',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'linear-gradient(135deg, var(--rouge-provencal), var(--or-accent))',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all var(--transition)',
    marginLeft: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'all var(--transition)',
    cursor: 'pointer',
    position: 'relative',
  },
  cardHover: {
    boxShadow: 'var(--shadow-md)',
    transform: 'translateY(-3px)',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    display: 'block',
    background: 'var(--border-color)',
  },
  cardBody: {
    padding: '14px 16px',
  },
  cardName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  categoryBadge: {
    display: 'inline-block',
    background: 'rgba(201, 168, 76, 0.12)',
    color: 'var(--or-accent)',
    padding: '2px 10px',
    borderRadius: 50,
    fontSize: '0.72rem',
    fontWeight: 600,
    marginTop: 6,
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  overlayBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all var(--transition)',
  },
  expandBtn: {
    background: 'rgba(255,255,255,0.9)',
    color: 'var(--bleu-nuit)',
  },
  deleteBtn: {
    background: 'rgba(232, 78, 59, 0.9)',
    color: '#fff',
  },
  lightboxOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lightboxClose: {
    position: 'absolute',
    top: 20,
    right: 20,
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: '#fff',
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  lightboxImg: {
    maxWidth: '90vw',
    maxHeight: '85vh',
    borderRadius: 12,
    objectFit: 'contain',
  },
  lightboxInfo: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: '10px 24px',
    color: '#fff',
    fontSize: '0.85rem',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)',
  },
  emptyIcon: {
    fontSize: '3rem',
    color: 'var(--text-muted)',
    marginBottom: 16,
  },
  deleteConfirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  deleteConfirmCard: {
    background: 'var(--bg-card)',
    borderRadius: 16,
    padding: 32,
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
    boxShadow: 'var(--shadow-xl)',
  },
  deleteConfirmTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 8,
  },
  deleteConfirmText: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginBottom: 24,
  },
  deleteConfirmActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  btnDanger: {
    background: 'var(--rouge-provencal)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 24px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all var(--transition)',
  },
  btnOutline: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    padding: '10px 24px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all var(--transition)',
  },
  uploadError: {
    background: 'rgba(232, 78, 59, 0.08)',
    color: 'var(--rouge-provencal)',
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: '0.85rem',
    marginBottom: 16,
    fontWeight: 500,
  },
  uploadProgress: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  spinner: {
    width: 20,
    height: 20,
    border: '3px solid var(--border-color)',
    borderTopColor: 'var(--rouge-provencal)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    flexShrink: 0,
  },
};

/* ---------- Component ---------- */
export default function AdminImages() {
  const [images, setImages] = useState(loadImages);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [storageUsage, setStorageUsage] = useState(0);

  const fileInputRef = useRef(null);

  // Persist images and refresh storage usage
  useEffect(() => {
    saveImages(images);
    setStorageUsage(getStorageUsage());
  }, [images]);

  // Initial storage check
  useEffect(() => {
    setStorageUsage(getStorageUsage());
  }, []);

  const storagePercent = Math.min((storageUsage / (5 * 1024 * 1024)) * 100, 100);
  const storageCritical = storagePercent > 80;

  /* --- Upload handler --- */
  const handleUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');
    setUploading(true);

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setError(`"${file.name}" n'est pas une image valide.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          setError(`"${file.name}" dépasse la taille maximale de 2 Mo.`);
          continue;
        }

        const dataUrl = await compressImage(file);
        const taille = Math.round((dataUrl.length * 3) / 4); // approximate decoded size

        const newImage = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          nom: file.name.replace(/\.[^.]+$/, ''),
          categorie: 'Autre',
          dataUrl,
          dateAjout: new Date().toISOString(),
          taille,
        };

        setImages((prev) => [newImage, ...prev]);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du téléversement.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  /* --- Category change --- */
  const handleCategoryChange = useCallback((id, cat) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, categorie: cat } : img))
    );
  }, []);

  /* --- Delete --- */
  const handleDelete = useCallback((id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDeleteConfirm(null);
    if (lightbox && lightbox.id === id) setLightbox(null);
  }, [lightbox]);

  /* --- Filtered images --- */
  const filtered = images.filter((img) => {
    const matchSearch = !search || img.nom.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || img.categorie === filterCat;
    return matchSearch && matchCat;
  });

  /* --- Inline keyframes for spinner --- */
  const spinnerKeyframes = `@keyframes spin { to { transform: rotate(360deg); } }`;

  return (
    <div style={styles.container}>
      <style>{spinnerKeyframes}</style>

      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1>Gestion des images</h1>
          <p>{images.length} image{images.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Storage warning */}
      {storageCritical && (
        <motion.div
          style={styles.storageWarning}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaImage />
          Attention : le stockage local est presque plein ({storagePercent.toFixed(0)}%).
          Supprimez des images pour libérer de l'espace.
        </motion.div>
      )}

      {/* Storage bar */}
      <div style={styles.storageInfo}>
        <span>Stockage : {formatSize(storageUsage)} / ~5 Mo</span>
        <div style={styles.storageBar}>
          <div
            style={{
              height: '100%',
              borderRadius: 3,
              width: `${storagePercent}%`,
              background: storageCritical
                ? 'var(--rouge-provencal)'
                : 'linear-gradient(90deg, var(--or-accent), var(--rouge-provencal))',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            style={styles.uploadError}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploading indicator */}
      {uploading && (
        <div style={styles.uploadProgress}>
          <div style={styles.spinner} />
          Compression et téléversement en cours...
        </div>
      )}

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <FaSearch style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Rechercher une image..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
        <button
          style={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <FaUpload /> Ajouter des images
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div
          style={styles.emptyState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={styles.emptyIcon}><FaImage /></div>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 4 }}>
            {images.length === 0 ? 'Aucune image' : 'Aucun résultat'}
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            {images.length === 0
              ? 'Cliquez sur "Ajouter des images" pour commencer.'
              : 'Essayez de modifier vos critères de recherche.'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          style={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence>
            {filtered.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  ...styles.card,
                  ...(hoveredId === img.id ? styles.cardHover : {}),
                }}
                onMouseEnter={() => setHoveredId(img.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={img.dataUrl}
                    alt={img.nom}
                    style={styles.thumbnail}
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <AnimatePresence>
                    {hoveredId === img.id && (
                      <motion.div
                        style={styles.cardOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <button
                          style={{ ...styles.overlayBtn, ...styles.expandBtn }}
                          onClick={(e) => { e.stopPropagation(); setLightbox(img); }}
                          title="Agrandir"
                        >
                          <FaExpand />
                        </button>
                        <button
                          style={{ ...styles.overlayBtn, ...styles.deleteBtn }}
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(img); }}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card body */}
                <div style={styles.cardBody}>
                  <div style={styles.cardName} title={img.nom}>{img.nom}</div>
                  <div style={styles.cardMeta}>
                    <span>{new Date(img.dateAjout).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}</span>
                    <span>{formatSize(img.taille)}</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <select
                      value={img.categorie}
                      onChange={(e) => handleCategoryChange(img.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        ...styles.filterSelect,
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        borderRadius: 8,
                        width: '100%',
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <span style={styles.categoryBadge}>{img.categorie}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            style={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox.dataUrl}
              alt={lightbox.nom}
              style={styles.lightboxImg}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              style={styles.lightboxClose}
              onClick={() => setLightbox(null)}
              title="Fermer"
            >
              <FaTimes />
            </button>
            <motion.div
              style={styles.lightboxInfo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              <strong>{lightbox.nom}</strong> &mdash; {lightbox.categorie} &mdash;{' '}
              {new Date(lightbox.dateAjout).toLocaleDateString('fr-FR')} &mdash;{' '}
              {formatSize(lightbox.taille)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            style={styles.deleteConfirmOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              style={styles.deleteConfirmCard}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.deleteConfirmTitle}>Supprimer cette image ?</div>
              <p style={styles.deleteConfirmText}>
                L'image <strong>"{deleteConfirm.nom}"</strong> sera définitivement supprimée.
                Cette action est irréversible.
              </p>
              <div style={styles.deleteConfirmActions}>
                <button
                  style={styles.btnDanger}
                  onClick={() => handleDelete(deleteConfirm.id)}
                >
                  <FaTrash style={{ marginRight: 6 }} /> Supprimer
                </button>
                <button
                  style={styles.btnOutline}
                  onClick={() => setDeleteConfirm(null)}
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
