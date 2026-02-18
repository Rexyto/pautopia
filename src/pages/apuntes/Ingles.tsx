import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function Ingles() {
  const navigate = useNavigate();

  return (
    <Layout>
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <span style={{ fontSize: '64px' }}>🌍</span>
          </div>
          <h2 className="biblioteca-title">Inglés II</h2>
          <p className="biblioteca-subtitle">Apuntes y recursos de estudio</p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="empty-state">
          <p className="empty-message">
            This is emptier than your vocabulary when the teacher asks you to speak without translating first
          </p>
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
