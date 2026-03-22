import { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import AccesRapides from '../components/AccesRapides';
import MotDuMaire from '../components/MotDuMaire';
import Actualites from '../components/Actualites';
import Evenements from '../components/Evenements';
import ChiffresCles from '../components/ChiffresCles';
import SitesRemarquables from '../components/SitesRemarquables';
import Services from '../components/Services';
import WaveDivider from '../components/WaveDivider';
import LavenderPetals from '../components/LavenderPetals';
import Timeline from '../components/Timeline';

// Lazy-loaded new sections
const GaleriePhoto = lazy(() => import('../components/GaleriePhoto'));
const Calendrier = lazy(() => import('../components/Calendrier'));
const CarteInteractive = lazy(() => import('../components/CarteInteractive'));
const ContactForm = lazy(() => import('../components/ContactForm'));
const MeteoWidget = lazy(() => import('../components/MeteoWidget'));
const Newsletter = lazy(() => import('../components/Newsletter'));

function SectionFallback() {
  return (
    <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Chargement...
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <AccesRapides />

      <WaveDivider color="var(--bg-secondary)" variant={1} />
      <div style={{ position: 'relative' }}>
        <LavenderPetals />
        <MotDuMaire />
      </div>
      <WaveDivider color="var(--bg-primary)" variant={2} flip />

      <Actualites />

      <WaveDivider color="var(--bg-secondary)" variant={3} />
      <Evenements />
      <WaveDivider color="var(--bleu-nuit)" variant={1} flip />

      <ChiffresCles />

      <WaveDivider color="var(--bg-primary)" variant={2} />

      <Suspense fallback={<SectionFallback />}>
        <Calendrier />
      </Suspense>

      <WaveDivider color="var(--bg-secondary)" variant={3} flip />
      <Timeline />

      <WaveDivider color="var(--bg-primary)" variant={1} />
      <div style={{ position: 'relative' }}>
        <LavenderPetals />
        <SitesRemarquables />
      </div>
      <WaveDivider color="var(--bg-secondary)" variant={2} flip />

      <Suspense fallback={<SectionFallback />}>
        <GaleriePhoto />
      </Suspense>

      <WaveDivider color="var(--bg-primary)" variant={3} />
      <Services />

      <WaveDivider color="var(--bg-secondary)" variant={1} flip />
      <Suspense fallback={<SectionFallback />}>
        <MeteoWidget />
      </Suspense>

      <WaveDivider color="var(--bg-primary)" variant={2} />
      <Suspense fallback={<SectionFallback />}>
        <CarteInteractive />
      </Suspense>

      <WaveDivider color="var(--bg-secondary)" variant={3} flip />
      <Suspense fallback={<SectionFallback />}>
        <ContactForm />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Newsletter />
      </Suspense>
    </main>
  );
}
