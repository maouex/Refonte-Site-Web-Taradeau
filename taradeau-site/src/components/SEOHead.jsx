import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageMeta = {
  '/': {
    title: 'Mairie de Taradeau – Village provençal du Var (83460)',
    description: 'Site officiel de la Mairie de Taradeau – Village provençal du Var (83460). Démarches, actualités, événements, tourisme et services municipaux.',
  },
  '/commune': {
    title: 'La Commune – Mairie de Taradeau',
    description: 'Découvrez Taradeau, village provençal du Var : histoire, patrimoine, situation géographique et chiffres clés.',
  },
  '/tourisme': {
    title: 'Tourisme – Mairie de Taradeau',
    description: 'Tourisme à Taradeau : hébergements, restaurants, sites remarquables, balades et transports dans le Var.',
  },
  '/manifestations': {
    title: 'Manifestations & Événements – Mairie de Taradeau',
    description: 'Calendrier des événements et manifestations à Taradeau. Associations et vie culturelle du village.',
  },
  '/vie-municipale': {
    title: 'Vie Municipale – Mairie de Taradeau',
    description: 'Vie municipale de Taradeau : élus, conseils municipaux, projets, bulletin communal et environnement.',
  },
  '/services': {
    title: 'Services Municipaux – Mairie de Taradeau',
    description: 'Services municipaux de Taradeau : démarches administratives, urbanisme, CCAS, police municipale.',
  },
  '/jeunesse': {
    title: 'Jeunesse – Mairie de Taradeau',
    description: 'Jeunesse à Taradeau : écoles, centre aéré, petite enfance, cantine et transports scolaires.',
  },
};

export default function SEOHead() {
  const location = useLocation();

  useEffect(() => {
    const meta = pageMeta[location.pathname] || {
      title: `${location.pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' – ')} – Mairie de Taradeau`,
      description: 'Site officiel de la Mairie de Taradeau, village provençal du Var (83460).',
    };

    document.title = meta.title;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', meta.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://www.mairie-taradeau.fr${location.pathname}`);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://www.mairie-taradeau.fr${location.pathname}`);
  }, [location.pathname]);

  return null;
}
