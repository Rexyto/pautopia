import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import UnavailableModal from '../../components/UnavailableModal';
import { useDownloadFile } from '../../hooks/useDownloadFile';
import '../../styles/apuntes.css';

export default function Lengua() {
  const navigate = useNavigate();
  const { downloadFile, showUnavailable, setShowUnavailable } = useDownloadFile();

  return (
    <Layout>
      <UnavailableModal isOpen={showUnavailable} onClose={() => setShowUnavailable(false)} />
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <span style={{ fontSize: '64px' }}>📚</span>
          </div>
          <h2 className="biblioteca-title">Lengua Castellana y Literatura II</h2>
          <p className="biblioteca-subtitle">
            Apuntes hechos a mano por <strong>La Tiza de Rosa</strong>, nuestra profe favorita.
            <br />
            Puedes encontrar más información y recursos en su página web:
            <a href="https://sites.google.com/iesmariapacheco.com/elblogderosaysuscosasii/inicio" target="_blank" rel="noopener noreferrer">
              El Blog de Rosa y sus Cosas II
            </a>
          </p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="lengua-sections">

          {/* SINTAXIS */}
          <section className="lengua-section">
            <h3 className="section-category-title">Sintaxis</h3>
            <div className="resource-cards-grid">

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Complementos</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-complementos.pdf')} className="resource-download-button">
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
                  <h4 className="resource-card-title">Sintaxis Global</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-sintaxis-global.pdf')} className="resource-download-button">
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
                  <h4 className="resource-card-title">Esquema de Sintaxis</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-esquema-sintaxis.pdf')} className="resource-download-button">
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
                  <h4 className="resource-card-title">Oraciones Compuestas según la NGLE</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-oraciones-compuestas-ngle.pdf')} className="resource-download-button">
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
                  <h4 className="resource-card-title">Valores del SE</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-valores-se.pdf')} className="resource-download-button">
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

          {/* MORFOLOGÍA */}
          <section className="lengua-section">
            <h3 className="section-category-title">Morfología</h3>
            <div className="resource-cards-grid">

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Las palabras: formación, estructura y relaciones de significado</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-palabras-formacion-estructura-significado.pdf')} className="resource-download-button">
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
                  <h4 className="resource-card-title">Esquema formación de palabras</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-esquema-formacion-palabras.pdf')} className="resource-download-button">
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
                  <h4 className="resource-card-title">Relaciones de significado</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-relaciones-significado.pdf')} className="resource-download-button">
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

          {/* LITERATURA */}
          <section className="lengua-section">
            <h3 className="section-category-title">Literatura</h3>
            <div className="resource-cards-grid">

              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">El realismo literario. Características. Autores y obras más significativas</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-realismo-caracteristicas-autores-obras.pdf')} className="resource-download-button">
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
                  <h4 className="resource-card-title">El Modernismo. Características. La repercusión de Rubén Darío y el Modernismo en España</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-modernismo-caracteristicas-ruben-dario.pdf')} className="resource-download-button">
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
                  <h4 className="resource-card-title">Generación del 98. Características. Principales autores y obras</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-generacion-98-caracteristicas-autores-obras.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 4 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 4. Novecentismo o Generación del 14. Características de la novela y del ensayo (T7DC)</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-tema4-novecentismo.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 5 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 5. Antonio Machado y Juan Ramón Jiménez (T8DC)</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-tema5-machado-jimenez.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 6 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 6. Las Vanguardias: Tendencias y Características (T11DC)</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-tema6-vanguardias.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 7 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 7. Generación del 27: Características, Autores y Obras Principales</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-tema7-generacion-27.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 8 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 8. El teatro español anterior a 1936: tendencias, rasgos principales, autores y obras más significativas (T13DC)</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-tema8-teatro-anterior-1936.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 9 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 9. La narrativa española posterior a 1936: tendencias, rasgos principales, autores y obras más significativas (T14DC)</h4>
                </div>
                <button onClick={() => downloadFile('/literatura-tema9-narrativa-posterior-1936.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 10 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 10. El teatro español posterior a 1936: tendencias, rasgos principales, autores y obras más significativas (T15DC)</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-tema10-teatro-posterior-1936.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 11 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 11. La poesía española posterior a 1936: tendencias, rasgos principales, autores y obras más significativas (T16DC)</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-tema11-poesia-posterior-1936.pdf')} className="resource-download-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar PDF
                </button>
              </div>

              {/* Tema 12 */}
              <div className="resource-card">
                <div className="resource-card-header">
                  <h4 className="resource-card-title">Tema 12. La literatura española desde 1975 hasta la época actual: narrativa, poesía y teatro (T16DC)</h4>
                </div>
                <button onClick={() => downloadFile('/lengua-tema12-literatura-desde-1975.pdf')} className="resource-download-button">
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