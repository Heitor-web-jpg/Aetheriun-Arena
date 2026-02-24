import type { Profile } from '../../hooks/useProfile';
export function ProfileStats({ profile }: { profile: Profile | null }) {
  if (!profile) return <div className="panel">Sem perfil autenticado.</div>;
  return <div className="panel"><h3>{profile.username}</h3><p>Vitórias: {profile.wins}</p><p>Derrotas: {profile.losses}</p><p>Partidas: {profile.games_played}</p></div>;
}
