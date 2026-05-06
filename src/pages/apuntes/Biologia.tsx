import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import UnavailableModal from '../../components/UnavailableModal';
import { useDownloadFile } from '../../hooks/useDownloadFile';
import '../../styles/apuntes.css';

export default function Biologia() {
  const navigate = useNavigate();
  const { downloadFile, showUnavailable, setShowUnavailable } = useDownloadFile();

  return (
    <Layout>
      <UnavailableModal isOpen={showUnavailable} onClose={() => setShowUnavailable(false)} />
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <span style={{ fontSize: '64px' }}>🧬</span>
          </div>
          <h2 className="biblioteca-title">Biología</h2>
          <p className="biblioteca-subtitle">Apuntes y recursos de estudio para la PAU</p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="lengua-sections">
          <section className="lengua-section">
            <h3 className="section-category-title">Teoría completa para la PAU</h3>
            <div className="resource-cards-grid">
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Teoría completa Biología PAU</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Bioquímica · Biología celular · Metabolismo · Genética · Evolución · Microbiología · Inmunología · Fisiología · Biotecnología
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/biologia-teoria-completa-pau.pdf')}
                  className="resource-download-button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="back-button-wrapper">
          <button className="back-button" onClick={() => navigate('/apuntes')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Volver a Apuntes
          </button>
        </div>
      </main>
    </Layout>
  );
}