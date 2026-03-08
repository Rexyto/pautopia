import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function CulturaAudiovisual() {
  const navigate = useNavigate();

  return (
    <Layout>
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <span style={{ fontSize: '64px' }}>🎞️</span>
          </div>
          <h2 className="biblioteca-title">Cultura Audiovisual</h2>
          <p className="biblioteca-subtitle">Examínate</p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="apps-grid">
          <div
            className="app-card"
            onClick={() => navigate('/examinate/cultura-audiovisual/repasar')}
          >
            <div className="app-card-icon">
              <span style={{ fontSize: '60px' }}>📋</span>
            </div>
            <div className="app-card-content">
              <h3 className="app-card-title">Repasar</h3>
              <p className="app-card-description">Consulta todos los conceptos ordenados alfabéticamente</p>
              <div className="app-card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="app-card"
            onClick={() => navigate('/examinate/cultura-audiovisual/conceptos')}
          >
            <div className="app-card-icon">
              <span style={{ fontSize: '60px' }}>📖</span>
            </div>
            <div className="app-card-content">
              <h3 className="app-card-title">Conceptos</h3>
              <p className="app-card-description">Examínate de forma tipo test sobre los conceptos</p>
              <div className="app-card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="back-button-wrapper">
          <button className="back-button" onClick={() => navigate('/examinate')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Volver a Examínate
          </button>
        </div>
      </main>
    </Layout>
  );
}