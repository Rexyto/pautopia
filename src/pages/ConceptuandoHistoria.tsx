import Layout from '../components/Layout';

export default function ConceptuandoHistoria() {
  return (
    <Layout
      customLogo="/Conceptuando_la_historia.png"
      customTitle="Conceptuando la historia"
      customSubtitle="Aprende conceptos de historia"
      showBackButton={true}
      backRoute="/apps"
    >

      <main className="vigacalc-content container">
        <div className="vigacalc-hero">
          <div className="vigacalc-logo-large">
            <img src="/Conceptuando_la_historia.png" alt="Conceptuando la historia" className="vigacalc-logo-image" />
          </div>
          <h2 className="vigacalc-title">Conceptuando la historia</h2>
          <p className="vigacalc-tagline">Domina los conceptos clave de Historia de España</p>
        </div>

        <div className="vigacalc-info-section">
          <div className="vigacalc-description-card">
            <div className="description-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <h3 className="description-title">¿Qué es Conceptuando la historia?</h3>
            <p className="description-text">
              Conceptuando la historia es una aplicación móvil educativa diseñada para ayudarte a memorizar
              y comprender los conceptos fundamentales de Historia de España. A través de un sistema interactivo
              de preguntas y respuestas, podrás poner a prueba tus conocimientos y prepararte eficazmente para
              la PAU. La app incluye todos los conceptos esenciales organizados por categorías temáticas.
            </p>
          </div>

          <div className="vigacalc-features">
            <h3 className="features-title">Características principales</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h4 className="feature-name">Base de datos completa</h4>
                <p className="feature-description">Más de 100 conceptos históricos organizados por categorías</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <h4 className="feature-name">Sistema de evaluación</h4>
                <p className="feature-description">Pon a prueba tus conocimientos con preguntas tipo test</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h4 className="feature-name">Aprendizaje progresivo</h4>
                <p className="feature-description">Avanza a tu ritmo y repasa cuando lo necesites</p>
              </div>
            </div>
          </div>

          <div className="vigacalc-download-section">
            <h3 className="download-title">Descarga Conceptuando la historia</h3>
            <p className="download-description">
              Disponible para dispositivos Android. Descarga el APK e instálalo en tu dispositivo móvil para comenzar a estudiar los conceptos de Historia de España.
            </p>
            <a
              href="/Conceptuando_la_historia.apk"
              download
              className="download-vigacalc-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar Conceptuando la historia APK
            </a>
            <p className="download-note">
              Tamaño aproximado: 23 MB | Versión: 1.0 | Android 5.0+
            </p>
          </div>

        </div>
      </main>
    </Layout>
  );
}
