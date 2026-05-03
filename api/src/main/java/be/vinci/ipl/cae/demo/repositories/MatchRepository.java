package be.vinci.ipl.cae.demo.repositories;

import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import be.vinci.ipl.cae.demo.models.entities.Tournament;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Match entity.
 */
@Repository
public interface MatchRepository
    extends JpaRepository<Match, Long>, JpaSpecificationExecutor<Match> {

  /**
   * Find all matches for a given tournament.
   *
   * @param idTournament the id of the tournament
   * @return a list of matches
   */
  List<Match> findByTournamentIdTournament(Long idTournament);

  /**
   * Find all matches for a given tournament.
   *
   * @param tournament the tournament
   * @return a list of matches
   */
  List<Match> findByTournament(Tournament tournament);

  /**
   * Find a match by its id.
   *
   * @param idMatch the id of the match
   * @return the match
   */
  Match getMatchByIdMatch(Long idMatch);

  /**
   * Find a match by status and dateHour.
   *
   * @param status the status
   * @param dateTime the dateHour
   * @return the list of matches found
   */
  List<Match> findByStatusAndDateHourLessThanEqual(MatchStatus status, LocalDateTime dateTime);

  /**
   * Find a match by status and ScoreEncodedAt.
   *
   * @param status the status
   * @param dateTime the scoreEncodedAt
   * @return the list of matches found
   */
  List<Match> findByStatusAndScoreEncodedAtLessThanEqual(
      MatchStatus status,
      LocalDateTime dateTime);
}
