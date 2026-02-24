import { Navigate, Route, Routes } from 'react-router-dom';
import { Index } from './pages/Index';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { DeckBuilder } from './pages/DeckBuilder';
import { DeckSelect } from './pages/DeckSelect';
import { Game } from './pages/Game';
import { Matchmaking } from './pages/Matchmaking';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/deck-builder" element={<DeckBuilder />} />
      <Route path="/deck-select" element={<DeckSelect />} />
      <Route path="/game" element={<Game />} />
      <Route path="/matchmaking" element={<Matchmaking />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
