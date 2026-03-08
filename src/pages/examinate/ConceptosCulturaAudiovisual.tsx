import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import conceptosData from '../../../data/conceptos_cultura_audiovisual.json';

interface Concepto {
  categoria: string;
  nombre: string;
  definicion: string;
}

interface GameState {
  currentQuestion: number;
  correctAnswers: number;
  usedConcepts: Set<string>;
  gameOver: boolean;
  gameWon: boolean;
  failedConcept: Concepto | null;
  failedAnswer: string | null;
}

export default function ConceptosCulturaAudiovisual() {
  const navigate = useNavigate();
  const [conceptos] = useState<Concepto[]>(conceptosData.conceptos);
  const totalConceptos = conceptos.length;

  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    correctAnswers: 0,
    usedConcepts: new Set(),
    gameOver: false,
    gameWon: false,
    failedConcept: null,
    failedAnswer: null,
  });

  const [currentConcept, setCurrentConcept] = useState<Concepto | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateQuestion = () => {
    setSelectedAnswer(null);

    const availableConcepts = conceptos.filter(
      (c) => !gameState.usedConcepts.has(c.nombre)
    );

    if (availableConcepts.length === 0) {
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
        gameWon: true,
      }));
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableConcepts.length);
    const selectedConcept = availableConcepts[randomIndex];

    const wrongOptions = conceptos
      .filter((c) => c.nombre !== selectedConcept.nombre)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((c) => c.nombre);

    const allOptions = shuffleArray([selectedConcept.nombre, ...wrongOptions]);

    setCurrentConcept(selectedConcept);
    setOptions(allOptions);
  };

  useEffect(() => {
    if (!gameState.gameOver) {
      generateQuestion();
    }
  }, [gameState.currentQuestion, gameState.gameOver]);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    if (currentConcept && answer === currentConcept.nombre) {
      const newUsedConcepts = new Set(gameState.usedConcepts);
      newUsedConcepts.add(currentConcept.nombre);

      setTimeout(() => {
        setGameState({
          currentQuestion: gameState.currentQuestion + 1,
          correctAnswers: gameState.correctAnswers + 1,
          usedConcepts: newUsedConcepts,
          gameOver: false,
          gameWon: false,
          failedConcept: null,
          failedAnswer: null,
        });
      }, 1000);
    } else {
      setTimeout(() => {
        setGameState({
          ...gameState,
          gameOver: true,
          gameWon: false,
          failedConcept: currentConcept,
          failedAnswer: answer,
        });
      }, 1000);
    }
  };

  const restartGame = () => {
    setSelectedAnswer(null);
    setGameState({
      currentQuestion: 0,
      correctAnswers: 0,
      usedConcepts: new Set(),
      gameOver: false,
      gameWon: false,
      failedConcept: null,
      failedAnswer: null,
    });
  };

  if (gameState.gameOver && gameState.gameWon) {
    return (
      <Layout>
        <main className="biblioteca-content container">
          <div className="conceptos-modal-overlay">
            <div className="conceptos-modal success">
              <div className="conceptos-modal-icon success">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="conceptos-modal-title">Felicidades</h2>
              <p className="conceptos-modal-message">
                Te sabes todos los conceptos necesarios
              </p>
              <p className="conceptos-modal-score">
                {gameState.correctAnswers} / {totalConceptos} conceptos acertados
              </p>
              <div className="conceptos-modal-buttons">
                <button className="conceptos-button primary" onClick={restartGame}>
                  Volver a intentar
                </button>
                <button className="conceptos-button secondary" onClick={() => navigate('/examinate/cultura-audiovisual')}>
                  Salir
                </button>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (gameState.gameOver && !gameState.gameWon) {
    return (
      <Layout>
        <main className="biblioteca-content container">
          <div className="conceptos-modal-overlay">
            <div className="conceptos-modal failure">
              <div className="conceptos-modal-icon failure">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h2 className="conceptos-modal-title">Perdiste</h2>
              <p className="conceptos-modal-message">
                Es inaceptable, deberías estudiar más
              </p>
              <p className="conceptos-modal-score">
                Total de conceptos que acertaste: {gameState.correctAnswers}
              </p>
              {gameState.failedConcept && (
                <div className="conceptos-failed-info">
                  <p className="conceptos-failed-definition">
                    {gameState.failedConcept.definicion}
                  </p>
                  <p className="conceptos-failed-answer">
                    <strong>Respuesta correcta:</strong> {gameState.failedConcept.nombre}
                  </p>
                </div>
              )}
              <div className="conceptos-modal-buttons">
                <button className="conceptos-button primary" onClick={restartGame}>
                  Volver a intentar
                </button>
                <button className="conceptos-button secondary" onClick={() => navigate('/examinate/cultura-audiovisual')}>
                  Salir
                </button>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="biblioteca-content container">
        <div className="conceptos-game">
          <div className="conceptos-header">
            <div className="conceptos-progress">
              {gameState.correctAnswers} / {totalConceptos}
            </div>
            <button
              className="conceptos-exit-button"
              onClick={() => navigate('/examinate/cultura-audiovisual')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {currentConcept && (
            <div className="conceptos-question-container">
              <div className="conceptos-definition-box">
                <p className="conceptos-definition">{currentConcept.definicion}</p>
              </div>

              <div className="conceptos-options">
                {options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentConcept.nombre;
                  let className = 'conceptos-option';

                  if (selectedAnswer) {
                    if (isSelected && isCorrect) {
                      className += ' correct';
                    } else if (isSelected && !isCorrect) {
                      className += ' incorrect';
                    } else if (isCorrect) {
                      className += ' correct';
                    }
                  }

                  return (
                    <button
                      key={index}
                      className={className}
                      onClick={() => handleAnswerClick(option)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}