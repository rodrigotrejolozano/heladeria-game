import { useEffect, useState } from 'react';
import { GAME_CONFIG, shuffle } from './gameConfig';

const initialDifficulty = 'medio';

function App() {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [phase, setPhase] = useState('start');
  const [cards, setCards] = useState([]);
  const [targets, setTargets] = useState([]);
  const [foundTargets, setFoundTargets] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [scratchingCard, setScratchingCard] = useState(null);
  const [lives, setLives] = useState(GAME_CONFIG.startingLives);
  const [countdown, setCountdown] = useState(0);
  const [wrongCard, setWrongCard] = useState(null);

  const settings = GAME_CONFIG.difficulties[difficulty];

  const startGame = (selectedDifficulty = difficulty) => {
    const selectedSettings = GAME_CONFIG.difficulties[selectedDifficulty];
    const roundCards = shuffle(GAME_CONFIG.flavors).slice(0, GAME_CONFIG.totalCards);
    const roundTargets = shuffle(roundCards).slice(0, GAME_CONFIG.targetCount);

    setDifficulty(selectedDifficulty);
    setCards(roundCards);
    setTargets(roundTargets);
    setFoundTargets([]);
    setRevealedCards([]);
    setScratchingCard(null);
    setLives(selectedSettings.lives ?? GAME_CONFIG.startingLives);
    setCountdown(selectedSettings.memorizeTime);
    setWrongCard(null);
    setPhase('memorize');
  };

  useEffect(() => {
    if (phase !== 'memorize') return undefined;

    const countdownTimer = window.setInterval(() => {
      setCountdown((value) => Math.max(0, value - 1));
    }, 1000);
    const phaseTimer = window.setTimeout(() => setPhase('play'), settings.memorizeTime * 1000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(phaseTimer);
    };
  }, [phase, settings.memorizeTime]);

  const selectCard = (card) => {
    const isTarget = targets.some((target) => target.name === card.name);
    const alreadyFound = foundTargets.includes(card.name);
    const alreadyRevealed = revealedCards.includes(card.name);

    if (phase !== 'play' || wrongCard || scratchingCard || alreadyFound || alreadyRevealed) return;

    setScratchingCard(card.name);
    window.setTimeout(() => {
      setScratchingCard(null);
      setRevealedCards((current) => [...current, card.name]);

      if (isTarget) {
        const nextFoundTargets = [...foundTargets, card.name];
        setFoundTargets(nextFoundTargets);
        if (nextFoundTargets.length === targets.length) setPhase('won');
        return;
      }

      const remainingLives = lives - 1;
      setWrongCard(card.name);
      setLives(remainingLives);
      window.setTimeout(() => setWrongCard(null), 520);
      if (remainingLives <= 0) setPhase('lost');
    }, GAME_CONFIG.scratchTime);
  };

  const foundCount = foundTargets.length;

  return (
    <main className={`app-shell phase-${phase}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="game-layout">
        <header className="brand-row">
          <div className="brand-mark" aria-hidden="true"><span>✦</span></div>
          <div>
            <p className="brand-kicker">Heladería Nube</p>
            <p className="brand-subtitle">Sabores que dejan huella</p>
          </div>
          <div className="round-label">Ronda <strong>01</strong></div>
        </header>

        {phase === 'start' ? (
          <section className="start-screen panel-in">
            <div className="hero-copy">
              <span className="eyebrow">Reto de memoria</span>
              <h1>¿Puedes recordar<br /><em>el sabor perfecto?</em></h1>
              <p>Memoriza tres helados, encuentra sus posiciones y gana un premio recién salido del congelador.</p>
            </div>
            <div className="hero-cone" aria-hidden="true"><span className="scoop scoop-top">🍓</span><span className="scoop scoop-mid">🍦</span><span className="scoop scoop-low">🍫</span><span className="cone">⌄</span></div>
            <div className="difficulty-block">
              <div className="section-heading"><span>01</span><h2>Elige tu ritmo</h2></div>
              <div className="difficulty-options">
                {Object.entries(GAME_CONFIG.difficulties).map(([key, option]) => (
                  <button className={`difficulty-option ${difficulty === key ? 'selected' : ''} accent-${option.accent}`} key={key} onClick={() => setDifficulty(key)} type="button">
                    <span className="option-radio" />
                    <span><strong>{option.label}</strong><small>{option.memorizeTime}s para memorizar</small></span>
                    <b>{option.lives} {option.lives === 1 ? 'vida' : 'vidas'}</b>
                  </button>
                ))}
              </div>
              <button className="primary-button start-button" onClick={() => startGame()} type="button">Comenzar el reto <span>→</span></button>
            </div>
          </section>
        ) : (
          <section className="play-screen panel-in">
            <div className="game-heading">
              <div>
                <span className="eyebrow">{phase === 'memorize' ? 'Fase 01 · Memorización' : 'Fase 02 · Encuentra los sabores'}</span>
                <h1>{phase === 'memorize' ? 'Guarda estas posiciones' : '¿Dónde estaba cada uno?'}</h1>
              </div>
              <div className="lives" aria-label={`${lives} vidas restantes`}><span>Vidas</span><div>{[...Array(settings.lives ?? GAME_CONFIG.startingLives)].map((_, index) => <i className={index < lives ? 'alive' : ''} key={index}>♥</i>)}</div></div>
            </div>

            {phase === 'memorize' ? (
              <div className="memory-banner"><span className="timer-ring">{countdown}</span><div className="memory-copy"><p><strong>Memoriza todos los sabores</strong><small>Cuando termine el tiempo descubrirás cuáles tres posiciones encontrar.</small></p></div></div>
            ) : (
              <div className="target-banner"><div><span className="eyebrow">Encuentra los tres</span><strong>¿Dónde estaba cada sabor?</strong></div><div className="targets">{targets.map((target) => <span className={foundTargets.includes(target.name) ? 'found' : ''} key={target.name}>{target.emoji} {target.name}</span>)}</div></div>
            )}

            <div className="ice-cream-grid" aria-label="Tablero de helados">
              {cards.map((card, index) => {
                const isFound = foundTargets.includes(card.name);
                const isRevealed = revealedCards.includes(card.name);
                const isScratching = scratchingCard === card.name;
                return <button className={`ice-card flavor-${card.color} ${isFound ? 'found-card' : ''} ${isRevealed ? 'revealed-card' : ''} ${wrongCard === card.name ? 'wrong-card' : ''}`} key={`${card.name}-${index}`} onClick={() => selectCard(card)} type="button" disabled={phase !== 'play'}>
                  <span className="card-number">0{index + 1}</span><span className="ice-visual"><span className="ice-scoop">{card.emoji}</span><span className="ice-stick" /></span><span className="flavor-name">{phase === 'memorize' || isRevealed ? card.name : 'Sabor secreto'}</span><span className="flavor-note">{phase === 'memorize' ? card.note : isFound ? '¡Encontrado!' : isRevealed ? 'No era este sabor' : '•••'}</span>
                  {phase === 'play' && !isRevealed && <span className={`scratch-mask ${isScratching ? 'scratching' : ''}`} aria-hidden="true"><span>✦</span><strong>Raspa para descubrir</strong><small>toca la tarjeta</small></span>}
                </button>;
              })}
            </div>
            <div className="game-footer"><span className="progress-dots"><i className={foundCount >= 1 ? 'done' : ''} /><i className={foundCount >= 2 ? 'done' : ''} /><i className={foundCount >= 3 ? 'done' : ''} /></span><span>{phase === 'memorize' ? 'Prepárate...' : `${foundCount} de ${targets.length} encontrados`}</span><button className="text-button" onClick={() => setPhase('start')} type="button">Salir</button></div>
          </section>
        )}

        {(phase === 'won' || phase === 'lost') && <div className="result-overlay"><div className={`result-card ${phase}`}><span className="result-icon">{phase === 'won' ? '🍨' : '🍦'}</span><span className="eyebrow">{phase === 'won' ? '¡Pedido completado!' : 'Casi lo tienes'}</span><h2>{phase === 'won' ? 'Helado ganado' : 'Se derritió el intento'}</h2><p>{phase === 'won' ? 'Tu memoria tiene un sabor increíble. Disfruta tu premio.' : 'No pasa nada, cada ronda entrena un poco más tu memoria.'}</p><button className="primary-button" onClick={() => startGame()} type="button">Jugar otra vez <span>↗</span></button><button className="text-button" onClick={() => setPhase('start')} type="button">Cambiar dificultad</button></div></div>}
      </section>
    </main>
  );
}

export default App;
