import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet-async';

interface RankingItem {
  nombre: string;
  puntos: number;
}

export default function Ranking() {
  const [ranking, setRanking] = useState<RankingItem[]>([]);

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => {
        const sortedData = [...data].sort((a, b) => b.puntos - a.puntos);
        setRanking(sortedData);
      })
      .catch(err => console.error('Error cargando ranking:', err));
  }, []);

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href="https://pautopia.duckdns.org/ranking" />
        <title>Ranking - PAUtopía</title>
        <meta name="description" content="Clasificación de estudiantes de PAUtopía. Compite, acumula puntos y sube en el ranking mientras preparas la PAU." />
      </Helmet>

      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <svg className="biblioteca-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 6l2 14h-12l2-14" />
              <path d="M12 11v5" />
              <circle cx="12" cy="6" r="3" />
            </svg>
          </div>
          <h2 className="biblioteca-title">Ranking</h2>
          <p className="biblioteca-subtitle">Clasificación de estudiantes</p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="ranking-list">
          {ranking.map((item, index) => (
            <div key={index} className="ranking-item">
              <div className="ranking-position">
                {index + 1}
              </div>
              <div className="ranking-info">
                <div className="ranking-nombre">{item.nombre}</div>
                <div className="ranking-puntos">{item.puntos} puntos</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}