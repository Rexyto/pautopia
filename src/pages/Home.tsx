import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import SugerenciasModal from '../components/SugerenciasModal';

export default function Home() {
  const navigate = useNavigate();
  const [visitas, setVisitas] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSugerenciasModal, setShowSugerenciasModal] = useState(false);

  useEffect(() => {
    const trackVisita = async () => {
      try {
        const data = await api.incrementarVisitas();
        setVisitas(data.total);
      } catch (error) {
        console.error('Error al registrar visita:', error);
        try {
          const data = await api.getVisitas();
          setVisitas(data.total);
        } catch (err) {
          console.error('Error al obtener visitas:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    trackVisita();
  }, []);

  return (
    <div className="home-page">
      <Helmet>
        <link rel="canonical" href="https://pautopia.duckdns.org/" />
        <title>PAUtopía - Recursos para estudiantes de Bachillerato</title>
        <meta name="description" content="Plataforma educativa con apuntes, calculadoras, exámenes y frases memorables para estudiantes de Bachillerato." />
      </Helmet>
      <div className="hero-background"></div>

      <div className="update-banner">
        3ª Evaluación - ¡A por todas shavalesss!
      </div>

      <div className="version-badge" onClick={() => setShowUpdateModal(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Versión 3.3</span>
      </div>

      {showUpdateModal && (
        <div className="update-modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="update-modal" onClick={(e) => e.stopPropagation()}>
            <div className="update-modal-header">
              <div className="update-modal-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <h2 className="update-modal-title">Actualizaciones Recientes</h2>
              <p className="update-modal-version">Versión 3.3</p>
            </div>
            <div className="update-modal-content">

              <div className="update-item">
                <div className="update-item-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="update-item-text">
                  <h3>Nuevos apuntes de Filosofía Contemporánea</h3>
                  <p>• Se han añadido los apuntes de Filosofía Contemporánea: Hegel, Comte, Mill y comentario de texto de Marx</p>
                </div>
              </div>

            </div>
            <button className="update-modal-close" onClick={() => setShowUpdateModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <SugerenciasModal
        isOpen={showSugerenciasModal}
        onClose={() => setShowSugerenciasModal(false)}
      />

      <button
        className="floating-sugerencias-button"
        onClick={() => setShowSugerenciasModal(true)}
        aria-label="Enviar sugerencia"
      >
        <span className="sugerencias-tooltip">¿Algún consejo?</span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <div className="home-content">
        <div className="home-logo">
          <img src="/logo.png" alt="PAUtopía Logo" className="home-logo-image" />
        </div>
        <h1 className="home-title">PAUtopía</h1>
        <p className="home-subtitle">Tu espacio de estudio perfecto</p>

        <div className="stats-card">
          <div className="stats-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stats-content">
            <div className="stats-label">Estudiantes ayudados</div>
            <div className="stats-value">
              {loading ? (
                <div className="stats-loading"></div>
              ) : (
                visitas.toLocaleString('es-ES')
              )}
            </div>
          </div>
        </div>

        <div className="home-buttons">
          <button className="home-button primary" onClick={() => navigate('/lecturas')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Lecturas
          </button>
          <button className="home-button secondary" onClick={() => navigate('/apuntes')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Apuntes
          </button>
          <button className="home-button secondary" onClick={() => navigate('/frases')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Frases
          </button>
          <button className="home-button secondary" onClick={() => navigate('/apps')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            Apps
          </button>
          <button className="home-button secondary" onClick={() => navigate('/examinate')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Examínate
          </button>
          <button className="home-button secondary" onClick={() => navigate('/ranking')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 6l2 14h-12l2-14" />
              <path d="M12 11v5" />
              <circle cx="12" cy="6" r="3" />
            </svg>
            Ranking
          </button>
          <button className="home-button secondary" onClick={() => navigate('/creditos')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Créditos
          </button>
        </div>
      </div>
    </div>
  );
}