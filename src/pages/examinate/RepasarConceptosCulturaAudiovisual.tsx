import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import conceptosData from '../../../data/conceptos_cultura_audiovisual.json';
import '../../styles/repasar.css';

interface Concepto {
  categoria: string;
  nombre: string;
  definicion: string;
}

export default function RepasarConceptosCulturaAudiovisual() {
  const navigate = useNavigate();
  const conceptos: Concepto[] = conceptosData.conceptos;
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<string | null>(null);

  const categorias = useMemo(() => {
    const cats = new Set(conceptos.map((c) => c.categoria));
    return Array.from(cats).sort((a, b) => a.localeCompare(b, 'es'));
  }, [conceptos]);

  const conceptosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return conceptos
      .filter((c) => {
        const coincideBusqueda = q
          ? c.nombre.toLowerCase().includes(q) || c.definicion.toLowerCase().includes(q)
          : true;
        const coincideCategoria = categoriaActiva ? c.categoria === categoriaActiva : true;
        return coincideBusqueda && coincideCategoria;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [busqueda, categoriaActiva, conceptos]);

  return (
    <Layout>
      <main className="biblioteca-content container">
        <div className="biblioteca-header">
          <div className="biblioteca-icon-wrapper">
            <span style={{ fontSize: '64px' }}>🎞️</span>
          </div>
          <h2 className="biblioteca-title">Cultura Audiovisual</h2>
          <p className="biblioteca-subtitle">Repasar conceptos</p>
          <div className="biblioteca-divider"></div>
        </div>

        {/* Buscador */}
        <div className="repasar-search-wrapper">
          <svg className="repasar-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar concepto o definición..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="repasar-search-input"
          />
        </div>

        {/* Tags de categoría */}
        <div className="repasar-tags">
          <button
            onClick={() => setCategoriaActiva(null)}
            className={`repasar-tag${categoriaActiva === null ? ' activo' : ''}`}
          >
            Todo
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(categoriaActiva === cat ? null : cat)}
              className={`repasar-tag${categoriaActiva === cat ? ' activo' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="repasar-count">
          {conceptosFiltrados.length} concepto{conceptosFiltrados.length !== 1 ? 's' : ''}
        </p>

        {/* Lista plana alfabética */}
        {conceptosFiltrados.length === 0 ? (
          <p className="repasar-empty">No se encontraron resultados</p>
        ) : (
          <div className="repasar-lista">
            {conceptosFiltrados.map((concepto) => (
              <div
                key={concepto.nombre}
                className="repasar-item"
                onClick={() => setExpandido(expandido === concepto.nombre ? null : concepto.nombre)}
              >
                <div className="repasar-item-header">
                  <div>
                    <h4 className="repasar-item-nombre">{concepto.nombre}</h4>
                    <span className="repasar-item-categoria">{concepto.categoria}</span>
                  </div>
                  <svg
                    className={`repasar-item-chevron${expandido === concepto.nombre ? ' abierto' : ''}`}
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                {expandido === concepto.nombre && (
                  <p className="repasar-item-definicion">{concepto.definicion}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="back-button-wrapper">
          <button className="back-button" onClick={() => navigate('/examinate/cultura-audiovisual')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Volver
          </button>
        </div>
      </main>
    </Layout>
  );
}