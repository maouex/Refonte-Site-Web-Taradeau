import Hero from '../components/Hero';
import AccesRapides from '../components/AccesRapides';
import MotDuMaire from '../components/MotDuMaire';
import Actualites from '../components/Actualites';
import Evenements from '../components/Evenements';
import ChiffresCles from '../components/ChiffresCles';
import SitesRemarquables from '../components/SitesRemarquables';
import Services from '../components/Services';
import MapSection from '../components/MapSection';

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <AccesRapides />
      <MotDuMaire />
      <Actualites />
      <Evenements />
      <ChiffresCles />
      <SitesRemarquables />
      <Services />
      <MapSection />
    </main>
  );
}
