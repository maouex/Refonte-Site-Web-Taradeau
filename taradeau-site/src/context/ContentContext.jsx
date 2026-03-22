import { createContext, useContext, useState, useCallback } from 'react';
import {
  communeInfo as defaultCommuneInfo,
  chiffresCles as defaultChiffres,
  navigation as defaultNavigation,
  accesRapides as defaultAccesRapides,
  services as defaultServices,
  sitesRemarquables as defaultSites,
} from '../data/siteData';

const ContentContext = createContext();

const CONTENT_KEY = 'taradeau-content';

const defaultHero = {
  badge: 'Village provençal du Var',
  titre1: 'Bienvenue à',
  titreHighlight: 'Taradeau',
  sousTitre: 'Entre vignobles et patrimoine médiéval — 1 786 habitants au cœur de la Dracénie',
  bouton1: { label: 'Découvrir la commune', lien: '/commune' },
  bouton2: { label: 'Vos démarches', lien: '/services/demarches' },
};

const defaultMaire = {
  nom: defaultCommuneInfo.maire.nom,
  mandat: defaultCommuneInfo.maire.mandat,
  fonction: defaultCommuneInfo.maire.fonction,
  citation: defaultCommuneInfo.maire.citation,
};

const defaultTimeline = [
  {
    id: 'tl-1',
    date: 'VIe s. av. J.-C.',
    titre: 'Oppidum du Fort',
    description: "Installation d'un oppidum celto-ligure sur la colline du Fort, témoignant des premières occupations humaines du territoire.",
  },
  {
    id: 'tl-2',
    date: 'Ier s. av. J.-C.',
    titre: 'Période romaine',
    description: "Romanisation de la région avec le développement de la viticulture dans la vallée de l'Argens.",
  },
  {
    id: 'tl-3',
    date: 'XIe siècle',
    titre: 'Chapelle Notre-Dame',
    description: "Construction de la chapelle et de la tour médiévale qui dominent encore le village aujourd'hui.",
  },
  {
    id: 'tl-4',
    date: 'XVIIe siècle',
    titre: 'Le village provençal',
    description: "Développement du village autour de l'église, avec ses ruelles typiques et ses maisons en pierre.",
  },
  {
    id: 'tl-5',
    date: '1790',
    titre: 'Commune officielle',
    description: 'Taradeau devient officiellement une commune lors de la Révolution française.',
  },
  {
    id: 'tl-6',
    date: 'XXe siècle',
    titre: 'Essor viticole',
    description: "Taradeau s'affirme au cœur de l'appellation Côtes de Provence avec ses domaines réputés.",
  },
  {
    id: 'tl-7',
    date: "Aujourd'hui",
    titre: '1 786 habitants',
    description: "Un village dynamique entre traditions provençales et modernité, au cœur de la communauté d'agglomération Dracénoise.",
  },
];

const defaultPages = {};

function buildDefaults() {
  return {
    hero: defaultHero,
    maire: defaultMaire,
    communeInfo: {
      nom: defaultCommuneInfo.nom,
      adresse: defaultCommuneInfo.adresse,
      telephone: defaultCommuneInfo.telephone,
      fax: defaultCommuneInfo.fax,
      email: defaultCommuneInfo.email,
      codePostal: defaultCommuneInfo.codePostal,
      horaires: defaultCommuneInfo.horaires,
      reseaux: defaultCommuneInfo.reseaux,
    },
    chiffresCles: defaultChiffres.map((c, i) => ({ ...c, id: `chiffre-${i}` })),
    accesRapides: defaultAccesRapides.map((a, i) => ({ ...a, id: `acces-${i}` })),
    services: defaultServices.map((s, i) => ({ ...s, id: `service-${i}` })),
    sitesRemarquables: defaultSites.map((s, i) => ({ ...s, id: `site-${i}` })),
    timeline: defaultTimeline,
    navigation: defaultNavigation,
    pages: defaultPages,
    footerDescription: 'Village provençal au cœur du Var, entre vignobles et patrimoine médiéval. Une commune où il fait bon vivre.',
  };
}

function loadContent() {
  try {
    const saved = localStorage.getItem(CONTENT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults so new fields are always present
      const defaults = buildDefaults();
      return { ...defaults, ...parsed };
    }
  } catch { /* ignore */ }
  return buildDefaults();
}

function saveContent(content) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent);

  const updateSection = useCallback((section, data) => {
    setContent((prev) => {
      const updated = { ...prev, [section]: data };
      saveContent(updated);
      return updated;
    });
  }, []);

  const updateField = useCallback((section, field, value) => {
    setContent((prev) => {
      const sectionData = prev[section];
      const updated = {
        ...prev,
        [section]: typeof sectionData === 'object' && !Array.isArray(sectionData)
          ? { ...sectionData, [field]: value }
          : value,
      };
      saveContent(updated);
      return updated;
    });
  }, []);

  // CRUD for array sections (chiffresCles, services, sitesRemarquables, timeline, accesRapides)
  const addItem = useCallback((section, item) => {
    setContent((prev) => {
      const arr = prev[section] || [];
      const newItem = { ...item, id: `${section}-${Date.now()}` };
      const updated = { ...prev, [section]: [...arr, newItem] };
      saveContent(updated);
      return updated;
    });
  }, []);

  const updateItem = useCallback((section, id, updates) => {
    setContent((prev) => {
      const arr = (prev[section] || []).map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      const updated = { ...prev, [section]: arr };
      saveContent(updated);
      return updated;
    });
  }, []);

  const deleteItem = useCallback((section, id) => {
    setContent((prev) => {
      const arr = (prev[section] || []).filter((item) => item.id !== id);
      const updated = { ...prev, [section]: arr };
      saveContent(updated);
      return updated;
    });
  }, []);

  const reorderItems = useCallback((section, fromIndex, toIndex) => {
    setContent((prev) => {
      const arr = [...(prev[section] || [])];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      const updated = { ...prev, [section]: arr };
      saveContent(updated);
      return updated;
    });
  }, []);

  // Page content management
  const updatePage = useCallback((path, pageData) => {
    setContent((prev) => {
      const pages = { ...prev.pages, [path]: pageData };
      const updated = { ...prev, pages };
      saveContent(updated);
      return updated;
    });
  }, []);

  const deletePage = useCallback((path) => {
    setContent((prev) => {
      const pages = { ...prev.pages };
      delete pages[path];
      const updated = { ...prev, pages };
      saveContent(updated);
      return updated;
    });
  }, []);

  const resetSection = useCallback((section) => {
    const defaults = buildDefaults();
    setContent((prev) => {
      const updated = { ...prev, [section]: defaults[section] };
      saveContent(updated);
      return updated;
    });
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        updateSection,
        updateField,
        addItem,
        updateItem,
        deleteItem,
        reorderItems,
        updatePage,
        deletePage,
        resetSection,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
}
