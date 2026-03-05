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

            <div className="github-banner">
              <a
                href="https://github.com/Rexyto/pautopia"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <div className="github-link-text">
                  <span className="github-link-title">Repositorio en GitHub</span>
                  <span className="github-link-sub">Por si algún aventurero quiere seguir el legado de PAUtopía</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>

            <div className="footer-bottom">
              <p className="footer-copyright">
                © 2026 PAUtopía. Creado con dedicación para estudiantes que buscan la excelencia.
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