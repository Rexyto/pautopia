import { useState } from 'react';
import './Accordion.css';

interface AccordionProps {
  pregunta: string;
  respuesta: string;
}

export default function Accordion({ pregunta, respuesta }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <button
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="accordion-question">{pregunta}</span>
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-answer">
          {respuesta}
        </div>
      </div>
    </div>
  );
}
