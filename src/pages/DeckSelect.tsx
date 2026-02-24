import { Link } from 'react-router-dom';
export function DeckSelect() { return <main className="page"><div className="panel"><h2>Selecionar Deck</h2><p>Escolha um deck válido de 40 cartas antes da partida.</p><Link className="menu-btn" to="/matchmaking">Entrar na fila</Link></div></main>; }
