import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import UnavailableModal from '../../components/UnavailableModal';
import { useDownloadFile } from '../../hooks/useDownloadFile';
import '../../styles/apuntes.css';

export default function CulturaAudiovisual() {
  const navigate = useNavigate();
  const { downloadFile, showUnavailable, setShowUnavailable } = useDownloadFile();

  return (
    <Layout>
      <UnavailableModal isOpen={showUnavailable} onClose={() => setShowUnavailable(false)} />
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <span style={{ fontSize: '64px' }}>🎞️</span>
          </div>
          <h2 className="biblioteca-title">Cultura Audiovisual</h2>
          <p className="biblioteca-subtitle">
            Apuntes completos de Cultura Audiovisual - 1º y 2º de Bachillerato
          </p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="lengua-sections">
          <section className="lengua-section">
            <h3 className="section-category-title">Bloque 1 · Historia de la Fotografía</h3>
            <div className="resource-cards-grid">
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Historia de la Fotografía</h4>
                </div>
                <button
                  onClick={() => downloadFile('/cultura-audiovisual-historia-fotografia.pdf')}
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

          <section className="lengua-section">
            <h3 className="section-category-title">Bloque 2 · La Imagen Fija y sus Lenguajes</h3>
            <div className="resource-cards-grid">
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">La Imagen Fija y sus Lenguajes</h4>
                </div>
                <button
                  onClick={() => downloadFile('/cultura-audiovisual-imagen-fija-lenguajes.pdf')}
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

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Leyes de la Gestalt</h4>
                </div>
                <button
                  onClick={() => downloadFile('/cultura-audiovisual-leyes-gestalt.pdf')}
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

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Teoría del Color</h4>
                </div>
                <button
                  onClick={() => downloadFile('/cultura-audiovisual-teoria-color.pdf')}
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

          <section className="lengua-section">
            <h3 className="section-category-title">Bloque 3 · La Publicidad</h3>
            <div className="resource-cards-grid">
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">La Publicidad</h4>
                </div>
                <button
                  onClick={() => downloadFile('/cultura-audiovisual-publicidad.pdf')}
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