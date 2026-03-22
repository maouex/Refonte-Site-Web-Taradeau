import { Link } from 'react-router-dom';
import {
  FaLandmark,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa';
import { communeInfo } from '../data/siteData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <div className="logo-icon">
                <FaLandmark />
              </div>
              Taradeau
            </Link>
            <p>
              Village provençal au cœur du Var, entre vignobles et patrimoine médiéval.
              Une commune où il fait bon vivre.
            </p>
            <div className="footer-social">
              <a href={communeInfo.reseaux.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href={communeInfo.reseaux.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href={communeInfo.reseaux.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href={communeInfo.reseaux.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Liens rapides</h4>
            <ul>
              <li><Link to="/commune">La Commune</Link></li>
              <li><Link to="/tourisme">Tourisme</Link></li>
              <li><Link to="/manifestations">Manifestations</Link></li>
              <li><Link to="/vie-municipale">Vie Municipale</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/jeunesse">Jeunesse</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact-item">
              <FaMapMarkerAlt />
              <span>{communeInfo.adresse}</span>
            </div>
            <div className="footer-contact-item">
              <FaPhone />
              <a href={`tel:${communeInfo.telephone.replace(/\s/g, '')}`}>
                {communeInfo.telephone}
              </a>
            </div>
            <div className="footer-contact-item">
              <FaEnvelope />
              <a href={`mailto:${communeInfo.email}`}>{communeInfo.email}</a>
            </div>
            <div className="footer-contact-item">
              <FaClock />
              <div>
                {communeInfo.horaires.map((h, i) => (
                  <div key={i}>
                    <strong>{h.jours}</strong><br />
                    {h.heures}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: 16 }}>
              Restez informés de l'actualité de Taradeau
            </p>
            <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Votre email" aria-label="Adresse email pour la newsletter" />
              <button type="submit">S'inscrire</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Mairie de Taradeau. Tous droits réservés.</p>
          <div className="footer-labels">
            <span className="footer-label">ANEV</span>
            <span className="footer-label">Villes et Villages Fleuris</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
