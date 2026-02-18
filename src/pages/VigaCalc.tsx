import Layout from '../components/Layout';

export default function VigaCalc() {
  return (
    <Layout
      customLogo="/VigaCalc.png"
      customTitle="VigaCalc"
      customSubtitle="Calculadora de vigas"
      showBackButton={true}
      backRoute="/apps"
    >

      <main className="vigacalc-content container">
        <div className="vigacalc-hero">
          <div className="vigacalc-logo-large">
            <img src="/VigaCalc.png" alt="VigaCalc" className="vigacalc-logo-image" />
          </div>
          <h2 className="vigacalc-title">VigaCalc</h2>
          <p className="vigacalc-tagline">Calculadora profesional de vigas estructurales</p>
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
            <h3 className="description-title">¿Qué es VigaCalc?</h3>
            <p className="description-text">
              VigaCalc es una aplicación móvil diseñada para facilitar los cálculos estructurales de vigas.
              Calcula automáticamente los valores de reacciones (Ray y Rby), momento flector (M) y cortante (C)
              de las vigas, ahorrando tiempo y reduciendo errores en tus cálculos.
            </p>
          </div>

          <div className="vigacalc-features">
            <h3 className="features-title">Características principales</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <h4 className="feature-name">Cálculo de Reacciones</h4>
                <p className="feature-description">Determina las reacciones Ray y Rby en los apoyos de la viga</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1.5" />
                    <path d="M3 12h18" />
                    <path d="M3 16.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5" />
                  </svg>
                </div>
                <h4 className="feature-name">Momento Flector (M)</h4>
                <p className="feature-description">Calcula el momento flector máximo en la viga</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                    <path d="M4 6h16" />
                  </svg>
                </div>
                <h4 className="feature-name">Cortante (C)</h4>
                <p className="feature-description">Determina el esfuerzo cortante en diferentes secciones</p>
              </div>
            </div>
          </div>

          <div className="vigacalc-download-section">
            <h3 className="download-title">Descarga VigaCalc</h3>
            <p className="download-description">
              Disponible para dispositivos Android. Descarga el APK e instálalo en tu dispositivo móvil para comenzar a usar VigaCalc.
            </p>
            <a
              href="/VigaCalc.apk"
              download
              className="download-vigacalc-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar VigaCalc APK
            </a>
            <p className="download-note">
              Tamaño aproximado: 21 MB | Versión: 1.0 | Android 5.0+
            </p>
          </div>

        </div>
      </main>
    </Layout>
  );
}
