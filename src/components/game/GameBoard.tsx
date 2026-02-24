import { useState } from 'react';
import type { Card, GameState } from '../../lib/gameTypes';
import { GameLog } from './GameLog';
import { HandArea } from './HandArea';
import { PlayerArea } from './PlayerArea';
import { SurrenderButton } from './SurrenderButton';
import { TurnButton } from './TurnButton';

export function GameBoard({ gameState, setGameState }: { gameState: GameState; setGameState: (state: GameState) => void }) {
  const [logs, setLogs] = useState<string[]>(['Partida iniciada']);
  const me = gameState.players.p1;
  const opp = gameState.players.p2;

  function playCard(card: Card) {
    const slot = me.field.findIndex((c) => c === null);
    if (slot < 0 || card.cost > me.energy || card.type !== 'Criatura') return;
    const next = structuredClone(gameState);
    next.players.p1.hand = next.players.p1.hand.filter((c) => c.id !== card.id);
    next.players.p1.field[slot] = card;
    next.players.p1.energy -= card.cost;
    setGameState(next);
    setLogs((l) => [`Jogou ${card.name}`, ...l]);
  }

  function endTurn() {
    const next = structuredClone(gameState);
    next.currentTurn = next.currentTurn === 'p1' ? 'p2' : 'p1';
    next.turnNumber += 1;
    next.players[next.currentTurn].energy = Math.min(12, next.players[next.currentTurn].energy + 1);
    setGameState(next);
    setLogs((l) => ['Fim de turno', ...l]);
  }

  function surrender() {
    const next = structuredClone(gameState);
    next.status = 'finished';
    next.winner = 'p2';
    setGameState(next);
    setLogs((l) => ['Você se rendeu', ...l]);
  }

  return <div className="board">
    <PlayerArea player={opp} title="Oponente" />
    <div className="battlefield">Turno: {gameState.currentTurn} • Rodada: {gameState.turnNumber}</div>
    <PlayerArea player={me} title="Você" />
    <HandArea cards={me.hand} onPlay={playCard} />
    <div className="actions"><TurnButton onClick={endTurn} /><SurrenderButton onClick={surrender} /></div>
    <GameLog logs={logs} />
  </div>;
}
