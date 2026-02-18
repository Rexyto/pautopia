import Layout from '../components/Layout';

interface Frase {
  texto: string;
  autor: string;
}

const frases: Frase[] = [
  {
    texto: "Hay que hacer cambios para obtener cambios",
    autor: "Profe de Física"
  },
  {
    texto: "¿De qué está hecha la pizarra?",
    autor: "Profe de Filosofía"
  },
  {
    texto: "Que me tomo la cicuta",
    autor: "Profe de Filosofía"
  },
  {
    texto: "Yo me voy a si me voy emm bueno si ¡Adiós!",
    autor: "Profe de Filosofía"
  },
  {
    texto: "Tienes incontinencia verbal",
    autor: "Profe de Física"
  },
  {
    texto: "Si se desenchufa se apaga",
    autor: "Profe de Audiovisuales"
  },
  {
    texto: "Silence s'il vous plait",
    autor: "Profe de Filosofía"
  },
  {
    texto: "¿Me seguís?",
    autor: "Profe de Física"
  },
  {
    texto: "El examen ese que tenéis por junio",
    autor: "El líder del clan"
  },
  {
    texto: "Sexto de la ESO",
    autor: "El líder del clan"
  },
  {
    texto: "Obrigado",
    autor: "Profe de filosofía"
  }

];

export default function Frases() {
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
          <h2 className="biblioteca-title">Biblioteca de Alejandría</h2>
          <p className="biblioteca-subtitle">Sabiduría compartida por nuestros profesores</p>
          <div className="biblioteca-divider"></div>
        </div>

        <div className="frases-grid">
          {frases.map((frase, index) => (
            <div key={index} className="frase-card">
              <div className="frase-quote-mark">"</div>
              <blockquote className="frase-texto">
                {frase.texto}
              </blockquote>
              <div className="frase-footer">
                <div className="frase-autor-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <p className="frase-autor">{frase.autor}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="biblioteca-footer">
          <p className="biblioteca-message">
            Las mejores lecciones a veces vienen de las preguntas más simples
          </p>
        </div>
      </main>
    </Layout>
  );
}