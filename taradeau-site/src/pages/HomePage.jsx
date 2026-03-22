import Hero from '../components/Hero';
import AccesRapides from '../components/AccesRapides';
import MotDuMaire from '../components/MotDuMaire';
import Actualites from '../components/Actualites';
import Evenements from '../components/Evenements';
import ChiffresCles from '../components/ChiffresCles';
import SitesRemarquables from '../components/SitesRemarquables';
import Services from '../components/Services';
import MapSection from '../components/MapSection';
import Timeline from '../components/Timeline';
import WaveDivider from '../components/WaveDivider';
import LavenderPetals from '../components/LavenderPetals';

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
      <Timeline />

      <WaveDivider color="var(--bg-primary)" variant={3} flip />
      <div style={{ position: 'relative' }}>
        <LavenderPetals />
        <SitesRemarquables />
      </div>
      <WaveDivider color="var(--bg-secondary)" variant={1} />

      <Services />

      <WaveDivider color="var(--bg-primary)" variant={2} flip />
      <MapSection />
    </main>
  );
}
