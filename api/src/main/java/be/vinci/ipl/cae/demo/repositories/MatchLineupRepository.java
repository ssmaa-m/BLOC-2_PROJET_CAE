package be.vinci.ipl.cae.demo.repositories;

import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.MatchLineupId;
import be.vinci.ipl.cae.demo.models.entities.Team;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Match Lineup repository.
 */
@Repository
public interface MatchLineupRepository extends JpaRepository<MatchLineup, MatchLineupId> {

  /**
   * Get match lineups for a specific match.
   *
   * @param idMatch the id of the match
   * @return a list of match lineups
   */
  List<MatchLineup> findByIdIdMatch(Long idMatch);

  /**
   * Retrieves the lineup for a specific match and team.
   */
  Optional<MatchLineup> findByMatchAndTeam(Match match, Team team);

  /**
   * Delete matchLineup linked to a list of matches.
   *
   * @param matches the matches the matchLineups are linked to
   */
  void deleteByMatchIn(List<Match> matches);

  /**
   * Get match lineups for a specific team where the match is in the future.
   *
   * @param team the team to filter by
   * @param now the current date/time to compare against
   * @return a list of future match lineups for the team
   */
  List<MatchLineup> findByTeamAndMatchDateHourAfter(Team team, LocalDateTime now);
}
