import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaSave, FaPlus, FaTrash, FaTimes, FaUndo,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock,
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube,
  FaSitemap, FaArrowUp, FaArrowDown, FaEdit,
} from 'react-icons/fa';
import { useContent } from '../../context/ContentContext';

/* ─── Commune Info Editor ─── */
function CommuneInfoEditor({ data, onSave }) {
  const [form, setForm] = useState(data);
  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const setReseau = (field, value) =>
    setForm((p) => ({ ...p, reseaux: { ...p.reseaux, [field]: value } }));

  const updateHoraire = (idx, field, value) => {
    setForm((p) => {
      const horaires = [...p.horaires];
      horaires[idx] = { ...horaires[idx], [field]: value };
      return { ...p, horaires };
    });
  };

  const addHoraire = () => {
    setForm((p) => ({
      ...p,
      horaires: [...p.horaires, { jours: '', heures: '' }],
    }));
  };

  const removeHoraire = (idx) => {
    setForm((p) => ({
      ...p,
      horaires: p.horaires.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="admin-content-editor">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <FaMapMarkerAlt /> Coordonnées
      </h3>

      <div className="form-row">
        <div className="form-group">
          <label>Nom de la commune</label>
          <input value={form.nom} onChange={(e) => set('nom', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Code postal</label>
          <input value={form.codePostal} onChange={(e) => set('codePostal', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label>Adresse complète</label>
        <input value={form.adresse} onChange={(e) => set('adresse', e.target.value)} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label><FaPhone style={{ marginRight: 4 }} /> Téléphone</label>
          <input value={form.telephone} onChange={(e) => set('telephone', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fax</label>
          <input value={form.fax} onChange={(e) => set('fax', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label><FaEnvelope style={{ marginRight: 4 }} /> Email</label>
        <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
      </div>

      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0 1rem' }}>
        <FaClock /> Horaires d'ouverture
      </h3>

      {form.horaires.map((h, idx) => (
        <div key={idx} className="form-row" style={{ alignItems: 'end' }}>
          <div className="form-group">
            <label>Jours</label>
            <input
              value={h.jours}
              onChange={(e) => updateHoraire(idx, 'jours', e.target.value)}
              placeholder="Lundi – Vendredi"
            />
          </div>
          <div className="form-group">
            <label>Heures</label>
            <input
              value={h.heures}
              onChange={(e) => updateHoraire(idx, 'heures', e.target.value)}
              placeholder="9h – 12h / 14h – 17h"
            />
          </div>
          <button
            className="btn btn-sm btn-danger-outline"
            onClick={() => removeHoraire(idx)}
            style={{ marginBottom: '0.5rem' }}
          >
            <FaTrash />
          </button>
        </div>
      ))}
      <button className="btn btn-sm btn-outline" onClick={addHoraire} style={{ marginBottom: '1rem' }}>
        <FaPlus /> Ajouter un créneau
      </button>

      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0 1rem' }}>
        Réseaux sociaux
      </h3>

      <div className="form-row">
        <div className="form-group">
          <label><FaFacebookF style={{ marginRight: 4 }} /> Facebook</label>
          <input value={form.reseaux.facebook} onChange={(e) => setReseau('facebook', e.target.value)} />
        </div>
        <div className="form-group">
          <label><FaTwitter style={{ marginRight: 4 }} /> Twitter</label>
          <input value={form.reseaux.twitter} onChange={(e) => setReseau('twitter', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label><FaInstagram style={{ marginRight: 4 }} /> Instagram</label>
          <input value={form.reseaux.instagram} onChange={(e) => setReseau('instagram', e.target.value)} />
        </div>
        <div className="form-group">
          <label><FaYoutube style={{ marginRight: 4 }} /> YouTube</label>
          <input value={form.reseaux.youtube} onChange={(e) => setReseau('youtube', e.target.value)} />
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => onSave(form)}><FaSave /> Enregistrer</button>
      </div>
    </div>
  );
}

/* ─── Navigation Editor ─── */
function NavigationEditor({ data, onSave }) {
  const [nav, setNav] = useState(data);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSubItem, setEditingSubItem] = useState(null);
  const [form, setForm] = useState({});

  const handleSaveItem = (idx) => {
    const updated = [...nav];
    updated[idx] = { ...updated[idx], label: form.label, path: form.path };
    setNav(updated);
    setEditingItem(null);
    onSave(updated);
  };

  const handleSaveSubItem = (parentIdx, subIdx) => {
    const updated = [...nav];
    const sous = [...(updated[parentIdx].sous || [])];
    sous[subIdx] = { label: form.label, path: form.path };
    updated[parentIdx] = { ...updated[parentIdx], sous };
    setNav(updated);
    setEditingSubItem(null);
    onSave(updated);
  };

  const addMainItem = () => {
    const updated = [...nav, { label: 'Nouvelle rubrique', path: '/nouvelle-rubrique', sous: [] }];
    setNav(updated);
    onSave(updated);
  };

  const addSubItem = (parentIdx) => {
    const updated = [...nav];
    const sous = [...(updated[parentIdx].sous || []), { label: 'Nouveau', path: `${updated[parentIdx].path}/nouveau` }];
    updated[parentIdx] = { ...updated[parentIdx], sous };
    setNav(updated);
    onSave(updated);
  };

  const removeMainItem = (idx) => {
    const updated = nav.filter((_, i) => i !== idx);
    setNav(updated);
    onSave(updated);
  };

  const removeSubItem = (parentIdx, subIdx) => {
    const updated = [...nav];
    updated[parentIdx] = {
      ...updated[parentIdx],
      sous: updated[parentIdx].sous.filter((_, i) => i !== subIdx),
    };
    setNav(updated);
    onSave(updated);
  };

  const moveItem = (idx, dir) => {
    const updated = [...nav];
    const target = idx + dir;
    if (target < 0 || target >= updated.length) return;
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    setNav(updated);
    onSave(updated);
  };

  return (
    <div className="admin-content-editor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaSitemap /> Structure du menu
        </h3>
        <button className="btn btn-sm btn-primary" onClick={addMainItem}>
          <FaPlus /> Rubrique
        </button>
      </div>

      {nav.map((item, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: '0.75rem',
            border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            background: 'var(--bg-card)',
          }}>
            {editingItem === idx ? (
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                <input
                  value={form.label}
                  onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder="Libellé"
                  style={{ flex: 1 }}
                />
                <input
                  value={form.path}
                  onChange={(e) => setForm((p) => ({ ...p, path: e.target.value }))}
                  placeholder="/chemin"
                  style={{ flex: 1, fontFamily: 'monospace' }}
                />
                <button className="btn btn-sm btn-primary" onClick={() => handleSaveItem(idx)}><FaSave /></button>
                <button className="btn btn-sm btn-outline" onClick={() => setEditingItem(null)}><FaTimes /></button>
              </div>
            ) : (
              <>
                <div>
                  <strong>{item.label}</strong>
                  <span style={{ marginLeft: '0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {item.path}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {idx > 0 && <button className="btn btn-sm btn-outline" onClick={() => moveItem(idx, -1)}><FaArrowUp /></button>}
                  {idx < nav.length - 1 && <button className="btn btn-sm btn-outline" onClick={() => moveItem(idx, 1)}><FaArrowDown /></button>}
                  <button className="btn btn-sm btn-outline" onClick={() => { setEditingItem(idx); setForm({ label: item.label, path: item.path }); }}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => addSubItem(idx)}><FaPlus /></button>
                  {idx > 0 && (
                    <button className="btn btn-sm btn-danger-outline" onClick={() => removeMainItem(idx)}><FaTrash /></button>
                  )}
                </div>
              </>
            )}
          </div>

          {item.sous && item.sous.length > 0 && (
            <div style={{ padding: '0.25rem 1rem 0.5rem 2rem', background: 'var(--bg-secondary)' }}>
              {item.sous.map((sub, subIdx) => (
                <div
                  key={subIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0',
                    borderBottom: subIdx < item.sous.length - 1 ? '1px solid var(--border-color, rgba(0,0,0,0.05))' : 'none',
                  }}
                >
                  {editingSubItem === `${idx}-${subIdx}` ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                      <input
                        value={form.label}
                        onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                        style={{ flex: 1 }}
                      />
                      <input
                        value={form.path}
                        onChange={(e) => setForm((p) => ({ ...p, path: e.target.value }))}
                        style={{ flex: 1, fontFamily: 'monospace' }}
                      />
                      <button className="btn btn-sm btn-primary" onClick={() => handleSaveSubItem(idx, subIdx)}><FaSave /></button>
                      <button className="btn btn-sm btn-outline" onClick={() => setEditingSubItem(null)}><FaTimes /></button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span>{sub.label}</span>
                        <span style={{ marginLeft: '0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {sub.path}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => { setEditingSubItem(`${idx}-${subIdx}`); setForm({ label: sub.label, path: sub.path }); }}
                        >
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger-outline" onClick={() => removeSubItem(idx, subIdx)}>
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Footer Description Editor ─── */
function FooterEditor({ description, onSave }) {
  const [text, setText] = useState(description);

  return (
    <div className="admin-content-editor">
      <div className="form-group">
        <label>Description affichée dans le pied de page</label>
        <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => onSave(text)}><FaSave /> Enregistrer</button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function AdminParametres() {
  const { content, updateSection, resetSection } = useContent();
  const [activeTab, setActiveTab] = useState('commune');
  const [saved, setSaved] = useState(false);

  const handleSave = (section, data) => {
    updateSection(section, data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { key: 'commune', label: 'Coordonnées', icon: FaMapMarkerAlt },
    { key: 'navigation', label: 'Navigation', icon: FaSitemap },
    { key: 'footer', label: 'Pied de page', icon: FaEdit },
  ];

  return (
    <div className="admin-events">
      <div className="admin-page-header">
        <div>
          <h1>Paramètres du site</h1>
          <p>Configurez les informations générales</p>
        </div>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: '#16a34a',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            Enregistré !
          </motion.span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.key ? 600 : 400,
                background: activeTab === tab.key ? 'var(--rouge-provencal)' : 'var(--bg-card)',
                color: activeTab === tab.key ? '#fff' : 'var(--text-primary)',
                transition: 'all 0.2s',
              }}
            >
              <Icon /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'commune' && (
        <CommuneInfoEditor
          data={content.communeInfo}
          onSave={(data) => handleSave('communeInfo', data)}
        />
      )}

      {activeTab === 'navigation' && (
        <NavigationEditor
          data={content.navigation}
          onSave={(data) => handleSave('navigation', data)}
        />
      )}

      {activeTab === 'footer' && (
        <FooterEditor
          description={content.footerDescription}
          onSave={(data) => handleSave('footerDescription', data)}
        />
      )}
    </div>
  );
}
