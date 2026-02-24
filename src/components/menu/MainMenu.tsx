import { Link } from 'react-router-dom';

const items = [
  { to: '/matchmaking', label: 'Batalha Online' },
  { to: '/game?mode=ai', label: 'Treino' },
  { to: '/deck-builder', label: 'Decks' },
  { to: '/profile', label: 'Perfil' },
];

export function MainMenu() {
  return (
    <div className="main-menu">
      <h1>Aetheriun Arena ⚔️</h1>
      <p>Pelo poder de Grayskull!</p>
      <div className="menu-grid">{items.map((item) => <Link key={item.to} className="menu-btn" to={item.to}>{item.label}</Link>)}</div>
    </div>
  );
}
