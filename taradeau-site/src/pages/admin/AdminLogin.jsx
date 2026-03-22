import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaLandmark, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-page">
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <FaLandmark />
          </div>
          <h1>Administration</h1>
          <p>Mairie de Taradeau</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <motion.div
              className="admin-login-error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <FaExclamationTriangle />
              {error}
            </motion.div>
          )}

          <div className="form-group">
            <label htmlFor="admin-password">
              <FaLock /> Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Entrez le mot de passe"
              autoFocus
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Se connecter
          </button>
        </form>

        <p className="admin-login-hint">
          Accès réservé au personnel municipal
        </p>
      </motion.div>
    </div>
  );
}
