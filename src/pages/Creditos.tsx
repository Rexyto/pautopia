import Layout from '../components/Layout';

export default function Creditos() {
  return (
    <Layout>

      <main className="creditos-content container">
        <div className="credits-section">
          <div className="credits-header">
            <h2 className="credits-title">Créditos</h2>
            <div className="credits-divider"></div>
          </div>

          <div className="credits-content">
            <div className="creator-card">
              <div className="creator-image-wrapper">
                <img src="/rexy.png" alt="Rexy" className="creator-image" />
                <div className="creator-badge">Creador</div>
              </div>
              <div className="creator-info">
                <h3 className="creator-name">Rexy</h3>
                <p className="creator-role">Desarrollador Principal</p>
                <p className="creator-description">
                  Con pasión por la educación y la tecnología, transformando el estudio en una experiencia digital única.
                </p>
              </div>
            </div>

            <div className="collaboration-banner">
              <div className="collaboration-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="collaboration-text">
                <p className="collaboration-label">En colaboración con</p>
                <p className="collaboration-name">La Tiza de Rosa</p>
              </div>
            </div>

            <div className="philosophy-section">
              <div className="quote-icon">❝</div>
              <blockquote className="philosophy-quote">
                El conocimiento es el único tesoro que crece cuando se comparte.
                Cada página leída, cada pregunta resuelta, es un paso más hacia la sabiduría.
              </blockquote>
              <div className="quote-author">— PAUtopía</div>
            </div>

            <div className="footer-bottom">
              <p className="footer-copyright">
                © 2024 PAUtopía. Creado con dedicación para estudiantes que buscan la excelencia.
              </p>
              <p className="footer-tagline">
                ✨ Donde el estudio se encuentra con la inspiración ✨
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}