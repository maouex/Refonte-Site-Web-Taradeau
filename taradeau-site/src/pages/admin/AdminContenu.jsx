import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSave, FaTimes, FaPlus, FaTrash, FaEdit, FaUndo,
  FaArrowUp, FaArrowDown, FaHome, FaUserTie, FaChartBar,
  FaBolt, FaLandmark, FaMapMarkerAlt, FaHistory, FaCogs,
} from 'react-icons/fa';
import { useContent } from '../../context/ContentContext';

const SECTIONS = [
  { key: 'hero', label: 'Section Hero', icon: FaHome, description: 'Titre principal, sous-titre, boutons' },
  { key: 'maire', label: 'Mot du Maire', icon: FaUserTie, description: 'Nom, mandat, citation' },
  { key: 'chiffresCles', label: 'Chiffres clés', icon: FaChartBar, description: 'Statistiques de la commune' },
  { key: 'accesRapides', label: 'Accès rapides', icon: FaBolt, description: 'Raccourcis de la page d\'accueil' },
  { key: 'services', label: 'Services', icon: FaCogs, description: 'Services municipaux' },
  { key: 'sitesRemarquables', label: 'Sites remarquables', icon: FaMapMarkerAlt, description: 'Patrimoine et sites d\'intérêt' },
  { key: 'timeline', label: 'Chronologie', icon: FaHistory, description: 'Histoire de Taradeau' },
];

const ICON_OPTIONS = [
  'FaCalendarAlt', 'FaFileAlt', 'FaImages', 'FaMapMarkedAlt', 'FaNewspaper',
  'FaFileSignature', 'FaBuilding', 'FaHandHoldingHeart', 'FaShieldAlt', 'FaTint',
  'FaGavel', 'FaUsers', 'FaGraduationCap', 'FaChild', 'FaBus', 'FaUtensils',
  'FaTree', 'FaWater', 'FaChurch', 'FaMonument', 'FaWineGlassAlt', 'FaMountain',
];

/* ─── Hero Editor ─── */
function HeroEditor({ data, onSave }) {
  const [form, setForm] = useState(data);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const setBtn = (num, field, value) =>
    setForm((p) => ({ ...p, [`bouton${num}`]: { ...p[`bouton${num}`], [field]: value } }));

  return (
    <div className="admin-content-editor">
      <div className="form-group">
        <label>Badge</label>
        <input value={form.badge} onChange={(e) => set('badge', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Ligne 1 du titre</label>
          <input value={form.titre1} onChange={(e) => set('titre1', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Mot mis en avant</label>
          <input value={form.titreHighlight} onChange={(e) => set('titreHighlight', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Sous-titre</label>
        <textarea rows="2" value={form.sousTitre} onChange={(e) => set('sousTitre', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Bouton 1 — texte</label>
          <input value={form.bouton1.label} onChange={(e) => setBtn(1, 'label', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Bouton 1 — lien</label>
          <input value={form.bouton1.lien} onChange={(e) => setBtn(1, 'lien', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Bouton 2 — texte</label>
          <input value={form.bouton2.label} onChange={(e) => setBtn(2, 'label', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Bouton 2 — lien</label>
          <input value={form.bouton2.lien} onChange={(e) => setBtn(2, 'lien', e.target.value)} />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => onSave(form)}><FaSave /> Enregistrer</button>
      </div>
    </div>
  );
}

/* ─── Maire Editor ─── */
function MaireEditor({ data, onSave }) {
  const [form, setForm] = useState(data);
  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="admin-content-editor">
      <div className="form-row">
        <div className="form-group">
          <label>Nom</label>
          <input value={form.nom} onChange={(e) => set('nom', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Mandat</label>
          <input value={form.mandat} onChange={(e) => set('mandat', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Fonction</label>
        <input value={form.fonction} onChange={(e) => set('fonction', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Citation</label>
        <textarea rows="4" value={form.citation} onChange={(e) => set('citation', e.target.value)} />
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => onSave(form)}><FaSave /> Enregistrer</button>
      </div>
    </div>
  );
}

/* ─── Generic List Editor (chiffres, accès rapides, services, sites, timeline) ─── */
function ListEditor({ sectionKey, items, fields, onAdd, onUpdate, onDelete, onReorder }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item });
  };

  const startNew = () => {
    const blank = { id: 'new' };
    fields.forEach((f) => { blank[f.key] = f.default || ''; });
    setEditing('new');
    setForm(blank);
  };

  const handleSave = () => {
    if (editing === 'new') {
      const { id, ...rest } = form;
      onAdd(rest);
    } else {
      onUpdate(editing, form);
    }
    setEditing(null);
    setForm({});
  };

  return (
    <div className="admin-content-editor">
      <AnimatePresence mode="wait">
        {editing !== null && (
          <motion.div
            className="admin-event-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ marginBottom: '1.5rem' }}
          >
            {fields.map((f) => (
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    rows={f.rows || 3}
                    value={form[f.key] || ''}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                ) : f.type === 'number' ? (
                  <input
                    type="number"
                    step={f.step || 1}
                    value={form[f.key] || ''}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                ) : f.type === 'select' ? (
                  <select
                    value={form[f.key] || ''}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  >
                    {(f.options || []).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form[f.key] || ''}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSave}><FaSave /> Enregistrer</button>
              <button className="btn btn-outline" onClick={() => setEditing(null)}><FaTimes /> Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {editing === null && (
        <button className="btn btn-primary" onClick={startNew} style={{ marginBottom: '1rem' }}>
          <FaPlus /> Ajouter
        </button>
      )}

      <div className="admin-events-list">
        {items.map((item, idx) => (
          <motion.div key={item.id} className="admin-event-card" layout>
            <div className="admin-event-card-body">
              <h3 style={{ margin: 0 }}>{item.titre || item.label || item.date || `#${idx + 1}`}</h3>
              {item.description && (
                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {item.description.substring(0, 120)}{item.description.length > 120 ? '…' : ''}
                </p>
              )}
              {item.valeur !== undefined && (
                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>
                  Valeur : <strong>{item.valeur}</strong> {item.suffixe}
                </p>
              )}
            </div>
            <div className="admin-event-card-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {idx > 0 && (
                <button className="btn btn-sm btn-outline" onClick={() => onReorder(idx, idx - 1)} title="Monter">
                  <FaArrowUp />
                </button>
              )}
              {idx < items.length - 1 && (
                <button className="btn btn-sm btn-outline" onClick={() => onReorder(idx, idx + 1)} title="Descendre">
                  <FaArrowDown />
                </button>
              )}
              <button className="btn btn-sm btn-outline" onClick={() => startEdit(item)}>
                <FaEdit /> Modifier
              </button>
              {deleteConfirm === item.id ? (
                <div className="delete-confirm">
                  <span>Supprimer ?</span>
                  <button className="btn btn-sm btn-danger" onClick={() => { onDelete(item.id); setDeleteConfirm(null); }}>Oui</button>
                  <button className="btn btn-sm btn-outline" onClick={() => setDeleteConfirm(null)}>Non</button>
                </div>
              ) : (
                <button className="btn btn-sm btn-danger-outline" onClick={() => setDeleteConfirm(item.id)}>
                  <FaTrash />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Field definitions for each list section ─── */
const FIELDS = {
  chiffresCles: [
    { key: 'valeur', label: 'Valeur (nombre)', type: 'number', step: 0.1, default: 0 },
    { key: 'label', label: 'Libellé', default: '' },
    { key: 'suffixe', label: 'Suffixe (optionnel)', default: '' },
    { key: 'decimales', label: 'Nombre de décimales', type: 'number', default: 0 },
  ],
  accesRapides: [
    { key: 'titre', label: 'Titre', default: '' },
    { key: 'description', label: 'Description', default: '' },
    { key: 'icone', label: 'Icône', type: 'select', options: ICON_OPTIONS, default: 'FaFileAlt' },
  ],
  services: [
    { key: 'titre', label: 'Titre du service', default: '' },
    { key: 'description', label: 'Description', type: 'textarea', default: '' },
    { key: 'icone', label: 'Icône', type: 'select', options: ICON_OPTIONS, default: 'FaCogs' },
  ],
  sitesRemarquables: [
    { key: 'titre', label: 'Nom du site', default: '' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 4, default: '' },
  ],
  timeline: [
    { key: 'date', label: 'Date / Époque', default: '' },
    { key: 'titre', label: 'Titre', default: '' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 3, default: '' },
  ],
};

export default function AdminContenu() {
  const { content, updateSection, addItem, updateItem, deleteItem, reorderItems, resetSection } = useContent();
  const [activeSection, setActiveSection] = useState('hero');
  const [resetConfirm, setResetConfirm] = useState(null);

  const handleReset = (section) => {
    resetSection(section);
    setResetConfirm(null);
  };

  const renderEditor = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroEditor data={content.hero} onSave={(data) => updateSection('hero', data)} />;
      case 'maire':
        return <MaireEditor data={content.maire} onSave={(data) => updateSection('maire', data)} />;
      case 'chiffresCles':
      case 'accesRapides':
      case 'services':
      case 'sitesRemarquables':
      case 'timeline':
        return (
          <ListEditor
            sectionKey={activeSection}
            items={content[activeSection] || []}
            fields={FIELDS[activeSection]}
            onAdd={(item) => addItem(activeSection, item)}
            onUpdate={(id, data) => updateItem(activeSection, id, data)}
            onDelete={(id) => deleteItem(activeSection, id)}
            onReorder={(from, to) => reorderItems(activeSection, from, to)}
          />
        );
      default:
        return null;
    }
  };

  const activeDef = SECTIONS.find((s) => s.key === activeSection);

  return (
    <div className="admin-events">
      <div className="admin-page-header">
        <div>
          <h1>Gestion du contenu</h1>
          <p>Modifiez le contenu de chaque section du site</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Sidebar tabs */}
        <div style={{ minWidth: 220, flex: '0 0 220px' }}>
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.35rem',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: activeSection === s.key ? 600 : 400,
                  background: activeSection === s.key ? 'var(--rouge-provencal)' : 'var(--bg-card)',
                  color: activeSection === s.key ? '#fff' : 'var(--text-primary)',
                  transition: 'all 0.2s',
                }}
              >
                <Icon /> {s.label}
              </button>
            );
          })}
        </div>

        {/* Editor area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '1rem 1.25rem',
            background: 'var(--bg-card)',
            borderRadius: 12,
            border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{activeDef?.label}</h2>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {activeDef?.description}
              </p>
            </div>
            {resetConfirm === activeSection ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Réinitialiser ?</span>
                <button className="btn btn-sm btn-danger" onClick={() => handleReset(activeSection)}>Oui</button>
                <button className="btn btn-sm btn-outline" onClick={() => setResetConfirm(null)}>Non</button>
              </div>
            ) : (
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setResetConfirm(activeSection)}
                title="Réinitialiser aux valeurs par défaut"
              >
                <FaUndo /> Réinitialiser
              </button>
            )}
          </div>

          {renderEditor()}
        </div>
      </div>
    </div>
  );
}
