import { useState } from 'react';
import { MatchSummaryDto } from '../../../types';
import { AdminEncodeScoreForm } from '../components/AdminEncodeScoreForm';

interface AdminEncodeScoreModalContentProps {
  match: MatchSummaryDto;
  onChange: (score1: number, score2: number) => void;
}

export const AdminEncodeScoreModalContent = ({
  match,
  onChange,
}: AdminEncodeScoreModalContentProps) => {
  const [scoreTeam1, setScoreTeam1] = useState(match.team1.score ?? 0);
  const [scoreTeam2, setScoreTeam2] = useState(match.team2.score ?? 0);

  const handleScore1Change = (val: number) => {
    setScoreTeam1(val);
    onChange(val, scoreTeam2);
  };

  const handleScore2Change = (val: number) => {
    setScoreTeam2(val);
    onChange(scoreTeam1, val);
  };

  return (
    <AdminEncodeScoreForm
      match={match}
      scoreTeam1={scoreTeam1}
      setScoreTeam1={handleScore1Change}
      scoreTeam2={scoreTeam2}
      setScoreTeam2={handleScore2Change}
    />
  );
};
