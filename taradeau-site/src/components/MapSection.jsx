import AnimatedSection from './AnimatedSection';

export default function MapSection() {
  return (
    <section className="section map-section" aria-label="Localisation">
      <div className="container">
        <AnimatedSection>
          <div className="section-header">
            <div className="accent-line" />
            <h2>Nous trouver</h2>
            <p>Entre Les Arcs et Trans-en-Provence, au cœur de la Dracénie</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="map-container">
            <iframe
              title="Localisation de Taradeau"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11655.86!2d6.4267!3d43.5381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12ce9c9e7a4e9e3d%3A0x40819a5fd979e20!2s83460+Taradeau!5e0!3m2!1sfr!2sfr!4v1"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
