import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const mensajes = [
  { titulo: "Ni yo me atreví a conocer esto", subtitulo: "Y eso que yo soy la web. Hay límites." },
  { titulo: "Esto es demasiado complejo incluso para mí", subtitulo: "Has llegado a una ruta que ni el temario oficial contempla." },
  { titulo: "Ni la de filo se desvió tanto del temario", subtitulo: "Enhorabuena. Has encontrado la página más fuera de contexto del universo." },
  { titulo: "Ni un campo magnético había hecho cosas tan extrañas", subtitulo: "Esta URL ha alterado el espacio-tiempo. Y sigue sin existir." },
  { titulo: "Rollo", subtitulo: "No hay nada aquí. Nada. Solo tú, el vacío, y el examen de mañana." },
];

const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-bg">
        <span>4</span><span>0</span><span>4</span>
      </div>
      <div className="notfound-content">
        <h1 className="notfound-titulo">{mensaje.titulo}</h1>
        <p className="notfound-subtitulo">{mensaje.subtitulo}</p>
        <button className="notfound-btn" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}