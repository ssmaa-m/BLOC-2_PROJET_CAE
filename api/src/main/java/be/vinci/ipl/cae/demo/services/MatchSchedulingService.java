package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.entities.ConfirmationStatus;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.repositories.MatchRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Match scheduling service.
 */
@Service
public class MatchSchedulingService {

  private final MatchRepository matchRepository;
  private final MatchService matchService;

  /**
   * Constructor.
   */
  public MatchSchedulingService(MatchRepository matchRepository, MatchService matchService) {
    this.matchRepository = matchRepository;
    this.matchService = matchService;
  }

  /**
   * Periodically updates match statuses. Runs every 5 seconds to synchronize database state with
   * the current time.
   */
  @Scheduled(initialDelay = 5000, fixedDelay = 5000)
  @Transactional
  public void enforceMatchStartRules() {
    System.out.println("Updating matches...");
    LocalDateTime now = LocalDateTime.now();
    List<Match> startingMatches =
        matchRepository.findByStatusAndDateHourLessThanEqual(MatchStatus.PLANNED, now);

    for (Match match : startingMatches) {
      Team t1 = match.getTeam1();
      Team t2 = match.getTeam2();

      if (t1 == null && t2 == null) {
        match.setStatus(MatchStatus.FORFEIT);
        continue;
      }

      if (t1 != null && t2 == null) {
        matchService.executeWalkover(match, t1, null);
        continue;
      }

      if (t1 == null && t2 != null) {
        matchService.executeWalkover(match, t2, null);
        continue;
      }

      boolean team1Valid = hasEnoughPlayers(match, t1);
      boolean team2Valid = hasEnoughPlayers(match, t2);

      if (!team1Valid && !team2Valid) {
        matchService.executeDoubleForfeit(match);
      } else if (!team1Valid) {
        matchService.executeWalkover(match, t2, t1);
      } else if (!team2Valid) {
        matchService.executeWalkover(match, t1, t2);
      } else {
        match.setStatus(MatchStatus.IN_PROGRESS);
      }
    }
  }

  /**
   * Periodically updates match confirmation. Runs every 60 seconds.
   */
  @Scheduled(initialDelay = 5000, fixedDelay = 5000)
  @Transactional
  public void autoValidateMatches() {
    System.out.println("Auto-validating matches...");
    LocalDateTime twoHoursAgo = LocalDateTime.now().minusHours(2);

    List<Match> expiredMatches = matchRepository
        .findByStatusAndScoreEncodedAtLessThanEqual(MatchStatus.AWAITING_VALIDATION, twoHoursAgo);

    for (Match match : expiredMatches) {
      boolean isContested = match.getLineups().stream().anyMatch(MatchLineup::isContested);

      if (isContested) {
        continue;
      }

      System.out.println("Auto-validating match ID: " + match.getIdMatch());

      for (MatchLineup lineup : match.getLineups()) {
        if (lineup.isPending()) {
          lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
        }
      }

      match.setStatus(MatchStatus.PLAYED);
      matchService.updateWinner(match);
      matchService.advanceWinnerToNextRound(match);
    }
  }

  /**
   * Checks if the lineup for a specific team in a match has members.
   *
   * @param match the match
   * @param team the team
   * @return true if the lineup has members, false otherwise
   */
  private boolean hasEnoughPlayers(Match match, Team team) {
    return team != null && match
        .getLineups()
        .stream()
        .filter(lineup -> lineup.getTeam().getIdTeam().equals(team.getIdTeam()))
        .findFirst()
        .map(lineup -> lineup.getMembers() != null && !lineup.getMembers().isEmpty())
        .orElse(false);
  }
}
