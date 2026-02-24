import { useNavigate } from 'react-router-dom';
import { useMatchmaking } from '../hooks/useMatchmaking';

export function Matchmaking() {
  const { status, findMatch } = useMatchmaking();
  const navigate = useNavigate();
  return <main className="page"><div className="panel"><h2>Matchmaking</h2><p>Status: {status}</p><button onClick={findMatch}>Buscar partida</button><button disabled={status !== 'found'} onClick={()=>navigate('/game')}>Entrar no tabuleiro</button></div></main>;
}
