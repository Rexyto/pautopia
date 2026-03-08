import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

interface Asignatura {
  id: string;
  nombre: string;
  icono: string;
  route: string;
}

const asignaturas: Asignatura[] = [
  {
    id: 'biologia',
    nombre: 'Biología',
    icono: '🧬',
    route: '/apuntes/biologia'
  },
  {
    id: 'tecnologia',
    nombre: 'Tecnología e Ingeniería II',
    icono: '⚙️',
    route: '/apuntes/tecnologia'
  },
  {
    id: 'mates',
    nombre: 'Matemáticas II',
    icono: '📐',
    route: '/apuntes/mates'
  },
  {
    id: 'filosofia',
    nombre: 'Filosofía',
    icono: '💭',
    route: '/apuntes/filosofia'
  },
  {
    id: 'lengua',
    nombre: 'Lengua Castellana y Literatura II',
    icono: '📚',
    route: '/apuntes/lengua'
  },
  {
    id: 'ingles',
    nombre: 'Inglés II',
    icono: '🌍',
    route: '/apuntes/ingles'
  },
  {
    id: 'historia',
    nombre: 'Historia de España',
    icono: '🏛️',
    route: '/apuntes/historia'
  },
  {
    id: 'fisica',
    nombre: 'Física II',
    icono: '⚛️',
    route: '/apuntes/fisica'
  },
  {
    id: 'quimica',
    nombre: 'Química',
    icono: '🧪',
    route: '/apuntes/quimica'
  },
  {
    id: 'cultura-audiovisual',
    nombre: 'Cultura Audiovisual',
    icono: '🎞️',
    route: '/apuntes/cultura-audiovisual'
  }
];

export default function ApuntesIndex() {
  const navigate = useNavigate();

  return (
    <Layout>
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <svg className="biblioteca-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h2 className="biblioteca-title">Apuntes</h2>
          <p className="biblioteca-subtitle">Recursos de estudio para todas tus asignaturas</p>
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