import Layout from '../components/Layout';
import { useState } from 'react';
import '../styles/frases.css';

type Categoria =
  | 'Filosofía'
  | 'Física'
  | 'Historia del Arte'
  | 'Lengua'
  | 'Inglés'
  | 'Dibujo Técnico'
  | 'Matemáticas'
  | 'Audiovisuales'
  | 'Tecnología';

interface Frase {
  texto: string;
  autor: string;
  categoria: Categoria;
}

// Cada categoría: color del acento (para la pill activa y el tag)
const CATEGORIA_CONFIG: Record<Categoria, { color: string; glow: string }> = {
  'Filosofía':         { color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
  'Física':            { color: '#60a5fa', glow: 'rgba(96,165,250,0.3)' },
  'Historia del Arte': { color: '#fb923c', glow: 'rgba(251,146,60,0.3)' },
  'Lengua':            { color: '#34d399', glow: 'rgba(52,211,153,0.3)' },
  'Inglés':            { color: '#2dd4bf', glow: 'rgba(45,212,191,0.3)' },
  'Dibujo Técnico':    { color: '#e879f9', glow: 'rgba(232,121,249,0.3)' },
  'Matemáticas':       { color: '#f87171', glow: 'rgba(248,113,113,0.3)' },
  'Audiovisuales':     { color: '#38bdf8', glow: 'rgba(56,189,248,0.3)' },
  'Tecnología':        { color: '#94a3b8', glow: 'rgba(148,163,184,0.3)' },
};

const frases: Frase[] = [
  { texto: "Hay que hacer cambios para obtener cambios",             autor: "Profe de Física",            categoria: 'Física' },
  { texto: "¿De qué está hecha la pizarra?",                        autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "Que me tomo la cicuta",                                  autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "Yo me voy a si me voy emm bueno si ¡Adiós!",            autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "Tienes incontinencia verbal",                            autor: "Profe de Física",            categoria: 'Física' },
  { texto: "Si se desenchufa se apaga",                              autor: "Profe de Audiovisuales",     categoria: 'Audiovisuales' },
  { texto: "Silence s'il vous plait",                                autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "¿Me seguís?",                                            autor: "Profe de Física",            categoria: 'Física' },
  { texto: "El examen ese que tenéis por junio",                     autor: "El líder del clan",          categoria: 'Tecnología' },
  { texto: "Sexto de la ESO",                                        autor: "El líder del clan",          categoria: 'Tecnología' },
  { texto: "Obrigado",                                               autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "MH",                                                     autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "A la caverna",                                           autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "Que os divorcio eh?",                                    autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "Tengo que apagar la vela que no escucho",                autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "Tengo diarrea mental",                                   autor: "El líder del clan",          categoria: 'Tecnología' },
  { texto: "¿Lo entendéis?, anda darle una vuelta",                  autor: "Profe de Lengua2",           categoria: 'Lengua' },
  { texto: "Vamos a buscar en WordReference",                        autor: "Profe de Inglés",            categoria: 'Inglés' },
  { texto: "No quiero batalla de indios",                            autor: "Profe de Dibujo Técnico",    categoria: 'Dibujo Técnico' },
  { texto: "Suesia",                                                 autor: "Profe de Filosofía",         categoria: 'Filosofía' },
  { texto: "¿Qué es del six seven?",                                 autor: "Profe de Mates",             categoria: 'Matemáticas' },
  { texto: "Esto no es un diálogo, es un monólogo",                  autor: "Profe de Historia del Arte", categoria: 'Historia del Arte' },
  { texto: "Pero no se lo digáis a mi prima Sara por favor ¿eh?",    autor: "Profe de Historia del Arte", categoria: 'Historia del Arte' },
  { texto: "Ahora tenemos que dar mujeres porque está de moda",      autor: "Profe de Historia del Arte", categoria: 'Historia del Arte' },
];

const TODAS = 'Todas';

export default function Frases() {
  const categorias = [TODAS, ...Array.from(new Set(frases.map(f => f.categoria))).sort()] as string[];
  const [activa, setActiva] = useState<string>(TODAS);

  const frasesFiltradas = activa === TODAS ? frases : frases.filter(f => f.categoria === activa);

  return (
    <Layout>
      <main className="frases-page container">

        {/* HEADER */}
        <div className="frases-header">
          <div className="frases-icon-wrapper">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1 className="frases-titulo">Biblioteca de Alejandría</h1>
          <p className="frases-subtitulo">Sabiduría compartida por nuestros profesores</p>
          <div className="frases-divider" />
        </div>

        {/* FILTER PILLS */}
        <div className="frases-filter-section">
          <p className="frases-filter-label">Filtrar por categoría</p>
          <div className="frases-pills">
            {categorias.map(cat => {
              const isAll = cat === TODAS;
              const isActiva = activa === cat;
              const count = isAll ? frases.length : frases.filter(f => f.categoria === cat).length;
              const cfg = !isAll ? CATEGORIA_CONFIG[cat as Categoria] : null;

              const activeStyle = cfg && isActiva ? {
                background: `rgba(15,23,42,0.6)`,
                borderColor: cfg.color,
                color: cfg.color,
                boxShadow: `0 4px 16px ${cfg.glow}`,
              } : {};

              return (
                <button
                  key={cat}
                  className={`frases-pill${isAll ? ' pill-todas' : ''}${isActiva ? ' pill-activa' : ''}`}
                  style={activeStyle}
                  onClick={() => setActiva(cat)}
                >
                  {cat}
                  <span className="pill-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* COUNT */}
        <p className="frases-results-info">
          {frasesFiltradas.length === frases.length
            ? `${frases.length} frases en total`
            : `${frasesFiltradas.length} frase${frasesFiltradas.length !== 1 ? 's' : ''} · ${activa}`}
        </p>

        {/* CARDS */}
        <div className="frases-grid">
          {frasesFiltradas.length === 0 && (
            <div className="frases-empty">No hay frases en esta categoría aún...</div>
          )}
          {frasesFiltradas.map((frase, index) => {
            const cfg = CATEGORIA_CONFIG[frase.categoria];
            return (
              <div key={index} className="frase-card">
                <div
                  className="frase-card-top-bar"
                  style={{ background: `linear-gradient(90deg, ${cfg.color}, transparent)` }}
                />
                <div className="frase-card-quote">"</div>
                <blockquote className="frase-card-texto">{frase.texto}</blockquote>
                <div className="frase-card-footer">
                  <p className="frase-card-autor">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {frase.autor}
                  </p>
                  <span
                    className="frase-card-tag"
                    style={{ color: cfg.color, borderColor: cfg.color + '55' }}
                  >
                    {frase.categoria}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="frases-footer-box">
          <p className="frases-footer-msg">
            Las mejores lecciones a veces vienen de las preguntas más simples
          </p>
        </div>
      </main>
    </Layout>
  );
}