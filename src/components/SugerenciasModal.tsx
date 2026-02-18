import { useState } from 'react';
import '../styles/sugerencias.css';

interface SugerenciasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SugerenciasModal({ isOpen, onClose }: SugerenciasModalProps) {
  const [nombre, setNombre] = useState('');
  const [sugerencia, setSugerencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !sugerencia.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          sugerencia: sugerencia.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Mostrar el mensaje de error específico del servidor
        setError(data.error || 'Error al enviar la sugerencia');
        return;
      }

      setSuccess(true);
      setNombre('');
      setSugerencia('');
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNombre('');
    setSugerencia('');
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sugerencias-overlay" onClick={handleClose}>
      <div className="sugerencias-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sugerencias-header">
          <div className="sugerencias-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="sugerencias-title">Envía tu sugerencia</h2>
          <p className="sugerencias-subtitle">
            Ayúdanos a mejorar PAUtopía con tus ideas
          </p>
        </div>

        {success ? (
          <div className="sugerencias-success">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3>¡Gracias por tu sugerencia!</h3>
            <p>La hemos recibido correctamente</p>
          </div>
        ) : (
          <form className="sugerencias-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Tu nombre</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="¿Cómo te llamas?"
                maxLength={50}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sugerencia">Tu sugerencia</label>
              <textarea
                id="sugerencia"
                value={sugerencia}
                onChange={(e) => setSugerencia(e.target.value)}
                placeholder="Cuéntanos tu idea para mejorar PAUtopía..."
                rows={5}
                maxLength={500}
                disabled={loading}
              />
              <div className="character-count">
                {sugerencia.length}/500
              </div>
            </div>

            {error && (
              <div className="sugerencias-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className="sugerencias-buttons">
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-enviar"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Enviar sugerencia
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}