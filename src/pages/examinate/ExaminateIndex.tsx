import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/Layout';

interface Asignatura {
  id: string;
  nombre: string;
  icono: string;
  route: string;
}

const asignaturas: Asignatura[] = [
  {
    id: 'historia',
    nombre: 'Historia de España',
    icono: '🏛️',
    route: '/examinate/historia'
  },
  {
    id: 'cultura-audiovisual',
    nombre: 'Cultura Audiovisual',
    icono: '🎞️',
    route: '/examinate/cultura-audiovisual'
  }
];

export default function ExaminateIndex() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href="https://pautopia.duckdns.org/examinate" />
        <title>Examínate - Pautopia</title>
        <meta name="description" content="Pon a prueba tus conocimientos con nuestros exámenes interactivos en Pautopia." />
      </Helmet>
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <svg className="biblioteca-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h2 className="biblioteca-title">Examínate</h2>
          <p className="biblioteca-subtitle">Pon a prueba tus conocimientos</p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="apps-grid">
          {asignaturas.map((asignatura) => (
            <div
              key={asignatura.id}
              className="app-card"
              onClick={() => navigate(asignatura.route)}
            >
              <div className="app-card-icon">
                <span style={{ fontSize: '60px' }}>{asignatura.icono}</span>
              </div>
              <div className="app-card-content">
                <h3 className="app-card-title">{asignatura.nombre}</h3>
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