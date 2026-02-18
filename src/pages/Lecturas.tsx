import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lectura, Pregunta, Material } from '../types';
import { api } from '../api';
import Accordion from '../components/Accordion';

export default function Lecturas() {
  const navigate = useNavigate();
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [selectedLectura, setSelectedLectura] = useState<Lectura | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadLecturas();
  }, []);

  useEffect(() => {
    if (selectedLectura) {
      loadLecturaDetails(selectedLectura.id);
      setMobileMenuOpen(false); // Cerrar menú móvil al seleccionar lectura
    }
  }, [selectedLectura]);

  const loadLecturas = async () => {
    setLoading(true);
    try {
      const data = await api.getLecturas();
      setLecturas(data);
      if (data.length > 0) {
        setSelectedLectura(data[0]);
      }
    } catch (error) {
      console.error('Error cargando lecturas:', error);
    }
    setLoading(false);
  };

  const loadLecturaDetails = async (lecturaId: string) => {
    try {
      const [preguntasData, materialesData] = await Promise.all([
        api.getPreguntas(lecturaId),
        api.getMateriales(lecturaId),
      ]);
      setPreguntas(preguntasData);
      setMateriales(materialesData);
    } catch (error) {
      console.error('Error cargando detalles:', error);
    }
  };

  const materialesPorGrupo = materiales.reduce((acc, material) => {
    const grupo = material.grupo || 'Otros';
    if (!acc[grupo]) {
      acc[grupo] = [];
    }
    acc[grupo].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  if (loading) {
    return (
      <div className="lecturas-page">
        <div className="loading">Cargando lecturas...</div>
      </div>
    );
  }

  return (
    <div className="lecturas-page">
      {/* Header Móvil */}
      <header className="mobile-header">
        <div className="mobile-header-top">
          <button 
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" />
              )}
            </svg>
          </button>
          <div className="mobile-logo">
            <img src="/logo.png" alt="PAUtopía" className="logo-image" />
            <span className="app-title">PAUtopía</span>
          </div>
          <div className="mobile-nav">
            <button className="nav-button" onClick={() => navigate('/')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
          </div>
        </div>

        {/* Selector Móvil de Lecturas */}
        <div className="mobile-lectura-selector">
          <select 
            value={selectedLectura?.id || ''}
            onChange={(e) => {
              const lectura = lecturas.find(l => l.id === e.target.value);
              if (lectura) setSelectedLectura(lectura);
            }}
            className="lectura-select"
          >
            {lecturas.map((lectura) => (
              <option key={lectura.id} value={lectura.id}>
                {lectura.titulo} - {lectura.autor}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Menú Lateral Móvil */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <h2>Navegación</h2>
              <button 
                className="close-menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <nav className="mobile-nav-menu">
              <button
                className="mobile-nav-item"
                onClick={() => navigate('/')}
              >
                Inicio
              </button>
              <button
                className="mobile-nav-item active"
                onClick={() => setMobileMenuOpen(false)}
              >
                Lecturas
              </button>
              <button
                className="mobile-nav-item"
                onClick={() => navigate('/frases')}
              >
                Frases
              </button>
              <button
                className="mobile-nav-item"
                onClick={() => navigate('/apuntes')}
              >
                Apuntes
              </button>
              <button
                className="mobile-nav-item"
                onClick={() => navigate('/apps')}
              >
                Apps
              </button>
              <button
                className="mobile-nav-item"
                onClick={() => navigate('/examinate')}
              >
                Examínate
              </button>
              <button
                className="mobile-nav-item"
                onClick={() => navigate('/ranking')}
              >
                Ranking
              </button>
              <button
                className="mobile-nav-item"
                onClick={() => navigate('/creditos')}
              >
                Créditos
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Header Desktop */}
      <header className="desktop-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <img src="/logo.png" alt="PAUtopía Logo" className="logo-image" />
              </div>
              <div>
                <h1 className="app-title">PAUtopía</h1>
                <p className="app-subtitle">Tu espacio de estudio perfecto</p>
              </div>
            </div>
            <nav className="nav-buttons">
              <button className="nav-button" onClick={() => navigate('/')}>Inicio</button>
              <button className="nav-button active">Lecturas</button>
              <button className="nav-button" onClick={() => navigate('/apuntes')}>Apuntes</button>
              <button className="nav-button" onClick={() => navigate('/frases')}>Frases</button>
              <button className="nav-button" onClick={() => navigate('/apps')}>Apps</button>
              <button className="nav-button" onClick={() => navigate('/examinate')}>Examínate</button>
              <button className="nav-button" onClick={() => navigate('/ranking')}>Ranking</button>
              <button className="nav-button" onClick={() => navigate('/creditos')}>Créditos</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content container">
        {/* Sidebar Desktop */}
        <div className="desktop-sidebar">
          <h2 className="sidebar-title">Obras</h2>
          <nav className="lecturas-nav">
            {lecturas.map((lectura) => (
              <button
                key={lectura.id}
                className={`lectura-item ${selectedLectura?.id === lectura.id ? 'active' : ''}`}
                onClick={() => setSelectedLectura(lectura)}
              >
                <div className="lectura-item-title">{lectura.titulo}</div>
                <div className="lectura-item-autor">{lectura.autor}</div>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido Principal */}
        {selectedLectura && (
          <div className="content-area">
            <div className="lectura-header">
              <h2 className="lectura-title">{selectedLectura.titulo}</h2>
              {selectedLectura.autor && (
                <p className="lectura-autor">Por {selectedLectura.autor}</p>
              )}
              {materiales.some(m => m.archivo) && (
                <div className="download-pdf-section">
                  {materiales
                    .filter(m => m.archivo)
                    .map((material) => (
                      <a
                        key={material.id}
                        href={`/${material.archivo}`}
                        download
                        className="download-pdf-button"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Descargar PDF
                      </a>
                    ))}
                </div>
              )}
              {selectedLectura.descripcion && (
                <p className="lectura-descripcion">{selectedLectura.descripcion}</p>
              )}
              {selectedLectura.enlaceOnline && (
                <a
                  href={selectedLectura.enlaceOnline}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lectura-link"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Leer online
                </a>
              )}
            </div>

            {preguntas.length > 0 && (
              <section className="section">
                <h3 className="section-title">Preguntas de Comprensión</h3>
                <div className="preguntas-list">
                  {preguntas.map((pregunta) => (
                    <Accordion
                      key={pregunta.id}
                      pregunta={pregunta.texto}
                      respuesta={pregunta.respuesta}
                    />
                  ))}
                </div>
              </section>
            )}

            {Object.keys(materialesPorGrupo).length > 0 && (
              <section className="section">
                <h3 className="section-title">Materiales Extras</h3>
                {Object.entries(materialesPorGrupo).map(([grupo, mats]) => (
                  <div key={grupo} className="material-grupo">
                    <h4 className="material-grupo-title">{grupo}</h4>
                    <div className="materiales-list">
                      {mats.map((material) => (
                        <div key={material.id} className="material-card-wrapper">
                          <a
                            href={material.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="material-card"
                          >
                            <div className="material-icon">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </div>
                            <div className="material-content">
                              <div className="material-title">{material.titulo}</div>
                              {material.descripcion && (
                                <div className="material-descripcion">{material.descripcion}</div>
                              )}
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </main>

    </div>
  );
}