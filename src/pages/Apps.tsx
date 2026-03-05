import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface App {
  id: string;
  name: string;
  icon: string;
  route: string;
}

const apps: App[] = [
  {
    id: 'vigacalc',
    name: 'VigaCalc',
    icon: '/VigaCalc.png',
    route: '/apps/vigacalc'
  },
  {
    id: 'wavecalc',
    name: 'WaveCalc',
    icon: '/WaveCalc.png',
    route: '/apps/wavecalc'
  },
  {
    id: 'conceptuando-historia',
    name: 'Conceptuando la historia',
    icon: '/Conceptuando_la_historia.png',
    route: '/apps/conceptuando-historia'
  },
  {
    id: 'rlccalc',
    name: 'RLCCalc',
    icon: '/RLCCalc.png',
    route: '/apps/rlccalc'
  },
];

export default function Apps() {
  const navigate = useNavigate();

  return (
    <Layout>

      <main className="apps-content container">
        <div className="apps-header">
          <div className="apps-icon-wrapper">
            <svg className="apps-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h2 className="apps-title">Apps Útiles</h2>
          <p className="apps-subtitle">Apps diseñadas o buscadas de internet para ayudarte de cara a la PAU o para otras actividades</p>
          <div className="apps-divider"></div>
        </div>

        <div className="apps-grid">
          {apps.map((app) => (
            <div
              key={app.id}
              className="app-card"
              onClick={() => navigate(app.route)}
            >
              <div className="app-card-icon">
                <img src={app.icon} alt={app.name} className="app-icon-image" />
              </div>
              <div className="app-card-content">
                <h3 className="app-card-title">{app.name}</h3>
                <div className="app-card-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
