import './UnavailableModal.css';

interface UnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnavailableModal({ isOpen, onClose }: UnavailableModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Lo sentimos</h2>
        <p>No hemos catalogado aún estos apuntes</p>
        <button className="modal-button" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
}
