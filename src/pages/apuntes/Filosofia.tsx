import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import UnavailableModal from '../../components/UnavailableModal';
import { useDownloadFile } from '../../hooks/useDownloadFile';
import '../../styles/apuntes.css';

export default function Filosofia() {
  const navigate = useNavigate();
  const { downloadFile, showUnavailable, setShowUnavailable } = useDownloadFile();

  return (
    <Layout>
      <UnavailableModal isOpen={showUnavailable} onClose={() => setShowUnavailable(false)} />
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <span style={{ fontSize: '64px' }}>💭</span>
          </div>
          <h2 className="biblioteca-title">Filosofía</h2>
          <p className="biblioteca-subtitle">
            Apuntes y recursos de estudio filosófico
          </p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="lengua-sections">

          {/* TEMAS FUNDAMENTALES */}
          <section className="lengua-section">
            <h3 className="section-category-title">Temas Fundamentales</h3>
            <div className="resource-cards-grid">

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Origen de la Filosofía y Fin de la Antigüedad</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Introducción al pensamiento filosófico occidental
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-tema1.pdf')}
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
                  <h4 className="resource-card-title">Lógica</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Tipos de conocimiento, operadores lógicos, tablas de verdad y reglas de inferencia
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-logica.pdf')}
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

          {/* GRECIA CLÁSICA */}
          <section className="lengua-section">
            <h3 className="section-category-title">Grecia Clásica</h3>
            <div className="resource-cards-grid">

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">La Sofística y Sócrates</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Los sofistas, el método socrático y la mayéutica · Siglo V a.C.
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-sofistica-socrates.pdf')}
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
                  <h4 className="resource-card-title">Platón</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Teoría de las Ideas, el mito de la caverna y la República
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-platon.pdf')}
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
                  <h4 className="resource-card-title">Aristóteles</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Metafísica, ética nicomáquea y lógica aristotélica
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-aristoteles.pdf')}
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
                  <h4 className="resource-card-title">Filosofía Helenística</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Estoicismo, epicureísmo, escepticismo y neoplatonismo
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-helenistica.pdf')}
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

          {/* FILOSOFÍA MEDIEVAL Y RENACIMIENTO */}
          <section className="lengua-section">
            <h3 className="section-category-title">Filosofía Medieval y Renacimiento</h3>
            <div className="resource-cards-grid">

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Filosofía Medieval Completa</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    La Escolástica, Tomás de Aquino y los grandes pensadores medievales · Siglos XI–XIV
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-medieval.pdf')}
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
                  <h4 className="resource-card-title">Filosofía del Renacimiento</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Humanismo, Maquiavelo y la revolución científica · Siglos XV–XVI
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-renacimiento.pdf')}
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

          {/* FILOSOFÍA MODERNA */}
          <section className="lengua-section">
            <h3 className="section-category-title">Filosofía Moderna</h3>
            <div className="resource-cards-grid">

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Racionalismo y Empirismo</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Descartes, Spinoza, Leibniz, Locke, Hume · Siglos XVII–XVIII
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-moderna.pdf')}
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
                  <h4 className="resource-card-title">Kant</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Crítica de la razón pura, el imperativo categórico y el giro copernicano
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-kant.pdf')}
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

          {/* FILOSOFÍA CONTEMPORÁNEA */}
          <section className="lengua-section">
            <h3 className="section-category-title">Filosofía Contemporánea</h3>
            <div className="resource-cards-grid">

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Filosofía Contemporánea</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Hegel, Comte, Mill, Marx y Nietzsche · Siglo XIX
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-contemporanea.pdf')}
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
                  <h4 className="resource-card-title">Nietzsche</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    La muerte de Dios, el nihilismo, el superhombre y la voluntad de poder
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-nietzsche.pdf')}
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
                  <h4 className="resource-card-title">Marx</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #888)', marginTop: '0.3rem' }}>
                    Materialismo histórico, lucha de clases y crítica al capitalismo
                  </p>
                </div>
                <button
                  onClick={() => downloadFile('/filosofia-marx.pdf')}
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