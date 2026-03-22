export const communeInfo = {
  nom: 'Taradeau',
  departement: 'Var',
  codePostal: '83460',
  codeInsee: '83134',
  adresse: '38, route de Flayosc BP6 – 83460 Taradeau',
  telephone: '04 94 99 70 30',
  fax: '04 94 99 70 71',
  email: 'accueil@mairie-taradeau.fr',
  maire: {
    nom: 'Albert DAVID',
    mandat: '2020–2026',
    fonction: 'Maire de Taradeau',
    citation:
      "Chers Taradéens, Taradéennes, c'est avec fierté et détermination que nous poursuivons notre engagement pour faire de Taradeau un village où il fait bon vivre, entre traditions provençales et modernité.",
  },
  horaires: [
    { jours: 'Mardi – Jeudi', heures: '9h – 12h / 15h – 17h30' },
    { jours: 'Lundi & Vendredi', heures: '9h – 12h' },
  ],
  reseaux: {
    facebook: 'https://facebook.com/mairie.taradeau',
    twitter: 'https://twitter.com/taradeau',
    instagram: 'https://instagram.com/taradeau',
    youtube: 'https://youtube.com/@taradeau',
  },
};

export const chiffresCles = [
  { valeur: 1786, label: 'Habitants', suffixe: '' },
  { valeur: 17.3, label: 'km² de superficie', suffixe: '', decimales: 1 },
  { valeur: 21, label: 'Lieux-dits', suffixe: '' },
  { valeur: 773, label: 'Ménages', suffixe: '' },
];

export const navigation = [
  { label: 'Accueil', path: '/' },
  {
    label: 'La Commune',
    path: '/commune',
    sous: [
      { label: 'En chiffres', path: '/commune/chiffres' },
      { label: 'Patrimoine historique', path: '/commune/patrimoine' },
      { label: 'Situation géographique', path: '/commune/geographie' },
      { label: 'Histoire', path: '/commune/histoire' },
    ],
  },
  {
    label: 'Tourisme',
    path: '/tourisme',
    sous: [
      { label: 'Hébergements & Restaurants', path: '/tourisme/hebergements' },
      { label: 'Commerces & Artisanat', path: '/tourisme/commerces' },
      { label: 'Sites remarquables', path: '/tourisme/sites' },
      { label: 'Balades', path: '/tourisme/balades' },
      { label: 'Transports', path: '/tourisme/transports' },
    ],
  },
  {
    label: 'Manifestations',
    path: '/manifestations',
    sous: [
      { label: 'Évènements', path: '/manifestations/evenements' },
      { label: 'Associations', path: '/manifestations/associations' },
    ],
  },
  {
    label: 'Vie Municipale',
    path: '/vie-municipale',
    sous: [
      { label: 'Les élus', path: '/vie-municipale/elus' },
      { label: 'Conseils municipaux', path: '/vie-municipale/conseils' },
      { label: 'Projets & Réalisations', path: '/vie-municipale/projets' },
      { label: 'Taradeau Info', path: '/vie-municipale/bulletin' },
      { label: 'Environnement', path: '/vie-municipale/environnement' },
    ],
  },
  {
    label: 'Services',
    path: '/services',
    sous: [
      { label: 'Démarches administratives', path: '/services/demarches' },
      { label: 'Urbanisme', path: '/services/urbanisme' },
      { label: 'CCAS', path: '/services/ccas' },
      { label: 'Police municipale', path: '/services/police' },
      { label: 'Eau & Assainissement', path: '/services/eau' },
      { label: 'Marchés publics', path: '/services/marches' },
    ],
  },
  {
    label: 'Jeunesse',
    path: '/jeunesse',
    sous: [
      { label: 'Écoles', path: '/jeunesse/ecoles' },
      { label: 'Centre aéré', path: '/jeunesse/centre-aere' },
      { label: 'Petite enfance', path: '/jeunesse/petite-enfance' },
      { label: 'Cantine scolaire', path: '/jeunesse/cantine' },
      { label: 'Transports scolaires', path: '/jeunesse/transports' },
    ],
  },
];

export const accesRapides = [
  { titre: 'Calendrier', icone: 'FaCalendarAlt', description: 'Consultez les dates importantes' },
  { titre: 'Documents', icone: 'FaFileAlt', description: 'Téléchargez les documents officiels' },
  { titre: 'Galerie', icone: 'FaImages', description: 'Découvrez Taradeau en images' },
  { titre: 'Plan', icone: 'FaMapMarkedAlt', description: 'Situez-vous dans le village' },
  { titre: 'Actualités', icone: 'FaNewspaper', description: 'Restez informés' },
];

export const actualites = {
  vieCommunale: [
    {
      titre: 'Conseil Municipal du 15 mars',
      date: '2026-03-15',
      extrait: 'Retour sur les délibérations du dernier conseil municipal.',
      categorie: 'Vie communale',
    },
    {
      titre: 'Cérémonie du 19 mars',
      date: '2026-03-19',
      extrait: 'Commémoration en mémoire des victimes de la guerre d\'Algérie.',
      categorie: 'Vie communale',
    },
    {
      titre: 'Nouvelles délibérations',
      date: '2026-03-10',
      extrait: 'Les dernières délibérations du conseil sont disponibles.',
      categorie: 'Vie communale',
    },
  ],
  manifestations: [
    {
      titre: 'Soirée Théâtre',
      date: '2026-02-14',
      extrait: 'Une soirée théâtre exceptionnelle à la salle des fêtes.',
      categorie: 'Manifestations',
    },
    {
      titre: 'Soirée Karaoké du Foyer Rural',
      date: '2026-03-28',
      extrait: 'Venez chanter au Foyer Rural pour une soirée conviviale !',
      categorie: 'Manifestations',
    },
    {
      titre: 'Vœux du Maire 2026',
      date: '2026-01-15',
      extrait: 'Retour sur la cérémonie des vœux du maire.',
      categorie: 'Manifestations',
    },
  ],
  jeunesse: [
    {
      titre: 'Menus cantine – Semaine 13',
      date: '2026-03-23',
      extrait: 'Découvrez les menus de la cantine scolaire.',
      categorie: 'Jeunesse',
    },
    {
      titre: 'Inscriptions centre aéré été',
      date: '2026-04-01',
      extrait: 'Les inscriptions pour le centre aéré d\'été sont ouvertes.',
      categorie: 'Jeunesse',
    },
  ],
  tourisme: [
    {
      titre: 'Découvrez le Bar de la Tour',
      date: '2026-03-01',
      extrait: 'Un lieu convivial au cœur du village.',
      categorie: 'Tourisme',
    },
    {
      titre: 'Randonnée avec la RDT',
      date: '2026-03-25',
      extrait: 'Prochaine sortie de la Randonnée Détente Taradéenne.',
      categorie: 'Tourisme',
    },
  ],
};

export const evenements = [
  {
    titre: 'Forum des Associations Taradéennes',
    date: '2026-09-12',
    lieu: 'Salle des fêtes',
    description: 'Venez découvrir les associations de Taradeau et trouvez votre activité !',
  },
  {
    titre: 'Apéro Concert O\'KAZOO',
    date: '2026-07-18',
    lieu: 'Place du Ménage',
    description: 'Concert en plein air avec l\'orchestre O\'KAZOO.',
  },
  {
    titre: 'Journée Italienne – 100 ans Motos GUZZI',
    date: '2026-06-05',
    lieu: 'Parking salle des fêtes',
    description: 'Célébrons les 100 ans des motos Moto Guzzi avec une journée italienne !',
  },
  {
    titre: 'Aïoli du Comité des Fêtes',
    date: '2026-08-15',
    lieu: 'Parking salle des fêtes',
    description: 'Grand aïoli organisé par le Comité des Fêtes de Taradeau.',
  },
];

export const services = [
  {
    titre: 'Démarches administratives',
    icone: 'FaFileSignature',
    description: 'Actes d\'état civil, CNI, passeport, permis de conduire, carte grise.',
  },
  {
    titre: 'Urbanisme',
    icone: 'FaBuilding',
    description: 'Permis de construire, déclarations préalables, certificats d\'urbanisme.',
  },
  {
    titre: 'CCAS',
    icone: 'FaHandHoldingHeart',
    description: 'Centre Communal d\'Action Sociale – Aide et accompagnement.',
  },
  {
    titre: 'Police municipale',
    icone: 'FaShieldAlt',
    description: 'Sécurité et tranquillité publique.',
  },
  {
    titre: 'Eau & Assainissement',
    icone: 'FaTint',
    description: 'Gestion de l\'eau potable et de l\'assainissement.',
  },
  {
    titre: 'Marchés publics',
    icone: 'FaGavel',
    description: 'Consultez les appels d\'offres et marchés publics.',
  },
];

export const sitesRemarquables = [
  {
    titre: 'Chapelle et Tour de Taradeau',
    description:
      'Vestiges médiévaux dominant le village, offrant un panorama exceptionnel sur la vallée de l\'Argens et les vignobles environnants.',
  },
  {
    titre: 'Oppidum du Fort',
    description:
      'Site archéologique datant du VIe siècle avant J.-C., témoignage de l\'occupation ligure puis celto-ligure de la région.',
  },
  {
    titre: 'Les Vignobles',
    description:
      'Taradeau est au cœur de l\'appellation Côtes de Provence, avec des domaines viticoles réputés.',
  },
];
