import { GameBoard } from '../components/game/GameBoard';
import { useGameState } from '../hooks/useGameState';
export function Game() { const { state, setState } = useGameState(); return <main className="page"><GameBoard gameState={state} setGameState={setState} /></main>; }
