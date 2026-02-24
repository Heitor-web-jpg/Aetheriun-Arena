import { MatchHistory } from '../components/profile/MatchHistory';
import { ProfileStats } from '../components/profile/ProfileStats';
import { useProfile } from '../hooks/useProfile';

export function Profile() {
  const { profile } = useProfile();
  return <main className="page"><ProfileStats profile={profile} /><MatchHistory /></main>;
}
