package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.exceptions.AlreadyConfirmedException;
import be.vinci.ipl.cae.demo.exceptions.AlreadyContestedException;
import be.vinci.ipl.cae.demo.exceptions.ForbiddenException;
import be.vinci.ipl.cae.demo.exceptions.InvalidMatchStatusException;
import be.vinci.ipl.cae.demo.exceptions.MatchLineupNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.MatchNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.MatchNotPlayedException;
import be.vinci.ipl.cae.demo.exceptions.MatchScoreNotSetException;
import be.vinci.ipl.cae.demo.exceptions.MemberHasNoTeamException;
import be.vinci.ipl.cae.demo.exceptions.MemberNotManagerOfTeamException;
import be.vinci.ipl.cae.demo.exceptions.NoSlotAvailableForWinnerException;
import be.vinci.ipl.cae.demo.exceptions.TeamNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.UnallowedTieException;
import be.vinci.ipl.cae.demo.models.dtos.EncodeMatchResultDto;
import be.vinci.ipl.cae.demo.models.dtos.MatchLineupDto;
import be.vinci.ipl.cae.demo.models.dtos.MatchSummaryDto;
import be.vinci.ipl.cae.demo.models.dtos.MatchSummaryTournamentDto;
import be.vinci.ipl.cae.demo.models.dtos.MatchTeamDto;
import be.vinci.ipl.cae.demo.models.entities.ConfirmationStatus;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.models.entities.Tournament;
import be.vinci.ipl.cae.demo.repositories.MatchLineupRepository;
import be.vinci.ipl.cae.demo.repositories.MatchRepository;
import be.vinci.ipl.cae.demo.specifications.MatchSpecifications;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Match service.
 */
@Service
public class MatchService {

  private final MatchRepository matchRepository;
  private final MemberService memberService;
  private final MatchLineupRepository matchLineupRepository;
  private final TeamService teamService;
  private final MatchLineupService matchLineupService;

  /**
   * Constructs a new MatchService with the specified repositories and services.
   *
   * @param matchRepository the match repository
   * @param matchLineupRepository the match lineup repository
   * @param memberService the member service
   * @param teamService the team service
   * @param matchLineupService the match lineup service
   */
  public MatchService(
      MatchRepository matchRepository,
      MatchLineupRepository matchLineupRepository,
      MemberService memberService,
      TeamService teamService,
      MatchLineupService matchLineupService) {
    this.matchRepository = matchRepository;
    this.memberService = memberService;
    this.matchLineupRepository = matchLineupRepository;
    this.teamService = teamService;
    this.matchLineupService = matchLineupService;
  }

  /**
   * Returns the set of team members available at a specific time. Only accessible by managers.
   *
   */
  public Set<Member> getAvailableMembersForMatch(Long matchId, Member currentMember) {
    if (!teamService.isManager(currentMember.getTeam(), currentMember)) {
      throw new ForbiddenException("Not a manager");
    }

    // Extract the date from the match directly
    Match match = getMatch(matchId);

    LocalDateTime dateTime = match.getDateHour();

    // The rest of your logic remains the same
    Team team = currentMember.getTeam();
    Set<Member> availableMembers = new HashSet<>();
    for (Member member : team.getMembers()) {
      if (memberService.isMemberFreeAt(member, dateTime)) {
        availableMembers.add(member);
      }
    }
    return availableMembers
        .stream()
        .sorted(Comparator.comparing(Member::getTag))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  /**
   * Retrieves matches for a team and member, filtered by search query.
   *
   * @param teamId the id of the team
   * @param memberId the id of the member
   * @param searchQuery the search query
   * @return the matches
   */
  public List<MatchSummaryDto> getMatches(Long teamId, Long memberId, String searchQuery) {
    Specification<Match> spec = Specification.where(null);

    spec = spec
        .and(MatchSpecifications.hasMember(memberId))
        .and(MatchSpecifications.hasTeam(teamId))
        .and(MatchSpecifications.searchByTeamName(searchQuery));

    Sort sort = Sort.by(Sort.Direction.DESC, "dateHour");

    return matchRepository
        .findAll(spec, sort)
        .stream()
        .map(match -> mapMatchToSummaryDto(match, match.getTournament()))
        .collect(Collectors.toList());
  }

  /**
   * Finds a match by its id.
   *
   * @param matchId the id of the searched match
   * @return the found match
   * @throws MatchNotFoundException if no match has this id
   */
  public Match getMatchById(Long matchId) {
    Match match = matchRepository.getMatchByIdMatch(matchId);

    if (match == null) {
      throw new MatchNotFoundException("Match not found");
    }

    return match;
  }

  /**
   * Retrieves a match by its id.
   *
   * @param matchId the id of the match
   * @return the match
   * @throws MatchNotFoundException if the match is not found
   */

  private Match getMatch(Long matchId) {
    return matchRepository
        .findById(matchId)
        .orElseThrow(() -> new MatchNotFoundException("Match not found"));
  }

  /**
   * Validates if a user is allowed to confirm the result of a match.
   *
   * @param match the match
   * @param member the member
   * @throws MemberHasNoTeamException if the user has no team
   * @throws MemberNotManagerOfTeamException if the user is not part of the match
   */
  private void validateUserCanConfirm(Match match, Member member) {
    if (member.getTeam() == null) {
      throw new MemberHasNoTeamException("Member has no team");
    }

    boolean isManagerTeam1 =
        match.getTeam1() != null && teamService.isManager(match.getTeam1(), member);
    boolean isManagerTeam2 =
        match.getTeam2() != null && teamService.isManager(match.getTeam2(), member);

    if (!isManagerTeam1 && !isManagerTeam2) {
      throw new MemberNotManagerOfTeamException(
          "Member not part of this match or manager of neither team");
    }

    if (getLineups(match).stream().anyMatch(lineup -> lineup.getScore() == null)) {
      throw new MatchScoreNotSetException("Score not set for one or more teams.");
    }
  }

  /**
   * Updates the confirmation status (confirm or contest) for the correct team.
   *
   * @param match the match
   * @param team the team
   * @param status true for confirm, false for contest
   */
  private void updateConfirmationStatus(Match match, Team team, ConfirmationStatus status) {
    MatchLineup lineup = matchLineupRepository.findByMatchAndTeam(match, team).orElse(null);

    if (lineup == null) {
      throw new MatchLineupNotFoundException("Lineup not found for match and team");
    }

    if (status == ConfirmationStatus.CONTESTED
        && (lineup.getConfirmationStatus() == ConfirmationStatus.CONTESTED
            || lineup.getConfirmationStatus() == ConfirmationStatus.ADMIN_LOCKED)) {
      throw new AlreadyContestedException("Vous avez déjà contesté ce match une fois.");
    }

    if (!lineup.isPending()) {
      throw new AlreadyConfirmedException("Lineup already confirmed with a different status");
    }

    lineup.setConfirmationStatus(status);
  }

  /**
   * Handles the result of a match for the authenticated user.
   *
   * @param matchId the id of the match
   * @param member the authenticated user
   * @param status true for confirm, false for contest
   */
  private Match handleMatchResult(Long matchId, Member member, ConfirmationStatus status) {
    Match match = getMatch(matchId);

    validateUserCanConfirm(match, member);

    updateConfirmationStatus(match, member.getTeam(), status);

    return match;
  }

  /**
   * Confirms the result of a match for the authenticated user.
   *
   * @param matchId the id of the match
   * @param member the authenticated user
   */
  @Transactional
  public void confirmResult(Long matchId, Member member) {
    Match match = handleMatchResult(matchId, member, ConfirmationStatus.CONFIRMED);

    if (bothTeamsConfirmed(match)) {
      match.setStatus(MatchStatus.PLAYED);
      updateWinner(match);
      advanceWinnerToNextRound(match);
    }
  }

  /**
   * Checks if both teams in a match have confirmed the results.
   *
   * @param match the match to check
   * @return true if both teams have confirmed with true
   */
  private boolean bothTeamsConfirmed(Match match) {
    List<MatchLineup> lineups = getLineups(match);
    if (lineups == null || lineups.size() < 2) {
      return false;
    }
    return lineups.stream().allMatch(l -> Boolean.TRUE.equals(l.isConfirmed()));
  }

  /**
   * Contests the result of a match for the authenticated user.
   *
   * @param matchId the id of the match
   * @param member the authenticated user
   */
  @Transactional
  public void contestResult(Long matchId, Member member) {
    handleMatchResult(matchId, member, ConfirmationStatus.CONTESTED);
  }

  /**
   * Updates the winner of a match based on the scores of the two teams.
   *
   * @param match the match to update the winner for
   */
  public void updateWinner(Match match) {
    if (match == null) {
      throw new MatchNotFoundException("Match not found.");
    }

    MatchStatus status = match.getStatus();

    if (status != MatchStatus.PLAYED && status != MatchStatus.FORFEIT) {
      System.out.println("Match status not okay");
      throw new MatchNotPlayedException("Match is not played, can't update winner.");
    }

    if (match.getTeam1() == null || match.getTeam2() == null) {
      System.out.println("Match team not okay");
      throw new TeamNotFoundException("Couldn't find one or more team in the match.");
    }

    List<MatchLineup> lineups = getLineups(match);

    MatchLineup team1Lineup = lineups
        .stream()
        .filter(l -> l.getTeam().equals(match.getTeam1()))
        .findFirst()
        .orElseThrow(MatchLineupNotFoundException::new);
    MatchLineup team2Lineup = lineups
        .stream()
        .filter(l -> l.getTeam().equals(match.getTeam2()))
        .findFirst()
        .orElseThrow(MatchLineupNotFoundException::new);

    updateMatchWinner(team1Lineup, team2Lineup);
  }

  /**
   * Retrieves the lineups of a match.
   *
   * @param match the match to retrieve lineups for
   * @return the list of match lineups
   * @throws MatchLineupNotFoundException if the match does not have both lineups
   */
  private List<MatchLineup> getLineups(Match match) {
    List<MatchLineup> lineups = match.getLineups();

    if (lineups == null || lineups.isEmpty()) {
      throw new MatchLineupNotFoundException("Match does not have both lineups.");
    }

    return lineups;
  }

  /**
   * Updates the winner of a match based on the scores of the two teams.
   *
   * @param team1Lineup the lineup of the first team
   * @param team2Lineup the lineup of the second team
   */
  private void updateMatchWinner(MatchLineup team1Lineup, MatchLineup team2Lineup) {
    Integer team1Score = team1Lineup.getScore();
    Integer team2Score = team2Lineup.getScore();

    if (team1Score == null || team2Score == null) {
      return;
    }

    if (team1Score > team2Score) {
      team1Lineup.setWinner(true);
      team2Lineup.setWinner(false);
    } else if (team2Score > team1Score) {
      team1Lineup.setWinner(false);
      team2Lineup.setWinner(true);
    } else {
      throw new UnallowedTieException("Match ends in a tie, this is not allowed.");
    }
  }

  /**
   * Executes a walkover.
   */
  @Transactional
  public void executeWalkover(Match match, Team winningTeam, Team forfeitingTeam) {
    if (match == null || winningTeam == null) {
      return;
    }

    List<MatchLineup> lineups = match.getLineups();

    MatchLineup winnerLineup =
        lineups.stream().filter(l -> l.getTeam().equals(winningTeam)).findFirst().orElse(null);

    if (winnerLineup != null) {
      winnerLineup.setWinner(true);
      winnerLineup.setScore(5);
      winnerLineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
    }

    if (forfeitingTeam != null) {
      MatchLineup forfeitLineup =
          lineups.stream().filter(l -> l.getTeam().equals(forfeitingTeam)).findFirst().orElse(null);

      if (forfeitLineup != null) {
        forfeitLineup.setHasForfeited(true);
        forfeitLineup.setScore(0);
        forfeitLineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      }
    }

    match.setStatus(MatchStatus.FORFEIT);

    advanceWinnerToNextRound(match);
  }

  /**
   * Maps a match to a summary dto.
   *
   * @param match the match
   * @param tournament the tournament
   * @return the summary dto
   */
  public MatchSummaryDto mapMatchToSummaryDto(Match match, Tournament tournament) {
    List<MatchLineup> lineups = matchLineupRepository.findByIdIdMatch(match.getIdMatch());

    MatchTeamDto team1Dto = createMatchTeamDto(match.getTeam1(), lineups);
    MatchTeamDto team2Dto = createMatchTeamDto(match.getTeam2(), lineups);

    return new MatchSummaryDto(
        match.getIdMatch(),
        match.getDateHour(),
        match.getTurn(),
        match.getStatus(),
        team1Dto,
        team2Dto,
        new MatchSummaryTournamentDto(
            tournament.getIdTournament(),
            tournament.getName(),
            tournament.getStatus()),
        match.getNextMatch() == null);
  }

  /**
   * Create a match team dto.
   *
   * @param team the team
   * @param lineups the lineups
   * @return the match team dto
   */
  private MatchTeamDto createMatchTeamDto(Team team, List<MatchLineup> lineups) {
    if (team == null) {
      return null;
    }

    MatchLineup lineup = lineups
        .stream()
        .filter(l -> l.getTeam().getIdTeam().equals(team.getIdTeam()))
        .findFirst()
        .orElse(null);

    if (lineup == null) {
      return new MatchTeamDto(
          team.getIdTeam(),
          team.getName(),
          null,
          false,
          false,
          ConfirmationStatus.PENDING,
          null);
    }
    MatchLineupDto lineupDto = MatchLineupDto.fromEntity(lineup);
    return new MatchTeamDto(
        team.getIdTeam(),
        team.getName(),
        lineup.getScore(),
        lineup.isWinner(),
        lineup.isHasForfeited(),
        lineup.getConfirmationStatus(),
        lineupDto);
  }

  /**
   * Advances the winner to the next round by updating the next match's teams.
   *
   * @param match the match to advance
   */
  @Transactional
  public void advanceWinnerToNextRound(Match match) {
    if (match == null) {
      throw new MatchNotFoundException("Match not found.");
    }

    List<MatchLineup> lineups = match.getLineups();

    if (lineups == null || lineups.isEmpty()) {
      System.out.println("No lineups exist in DB for Match ID " + match.getIdMatch());
      throw new MatchLineupNotFoundException("No lineups found for the match.");
    }

    MatchLineup winnerLineup =
        lineups.stream().filter(MatchLineup::isWinner).findFirst().orElse(null);

    if (winnerLineup == null) {
      System.out.println("Nobody is marked as the winner in Match ID " + match.getIdMatch());
      return;
    }

    Team winnerTeam = winnerLineup.getTeam();

    if (winnerTeam == null) {
      throw new TeamNotFoundException("No team found for the winner lineup.");
    }

    Match nextMatch = match.getNextMatch();

    if (nextMatch == null) {
      match.getTournament().setWinner(winnerTeam);
      return;
    }

    if (nextMatch.getTeam1() == null) {
      nextMatch.setTeam1(winnerTeam);
    } else if (nextMatch.getTeam2() == null) {
      nextMatch.setTeam2(winnerTeam);
    } else {
      throw new NoSlotAvailableForWinnerException(
          "No slot available for the winner in the next match.");
    }

    MatchLineup newLineup = matchLineupService.createDefaultLineup(nextMatch, winnerTeam);
    nextMatch.getLineups().add(newLineup);
  }

  /**
   * Encodes the result of a match (admin only). Sets the scores for both teams, validates that the
   * match is in PLANNED status, and transitions it to PLAYED.
   *
   * @param matchId the id of the match
   * @param dto the DTO containing the scores for both teams
   * @return the updated match summary
   * @throws MatchNotFoundException if the match is not found
   * @throws InvalidMatchStatusException if the match is not in PLANNED status
   * @throws MatchLineupNotFoundException if a lineup is not found
   * @throws UnallowedTieException if the scores are equal
   */
  @Transactional
  public MatchSummaryDto encodeResult(Long matchId, EncodeMatchResultDto dto) {
    Match match = getMatch(matchId);

    validateMatchCanBeEncoded(match);
    validateNoTie(dto);

    List<MatchLineup> lineups = getLineups(match);
    applyScores(match, lineups, dto);

    updateConfirmationStatusesForEncoding(lineups);
    finalizeOrAwaitValidation(match);

    return mapMatchToSummaryDto(match, match.getTournament());
  }

  /**
   * Applies the scores from the DTO to the corresponding team lineups.
   *
   * @param match the match
   * @param lineups the match lineups
   * @param dto the DTO containing the scores
   * @throws MatchLineupNotFoundException if a lineup is not found for a team
   */
  private void applyScores(Match match, List<MatchLineup> lineups, EncodeMatchResultDto dto) {
    MatchLineup team1Lineup = lineups
        .stream()
        .filter(l -> l.getTeam().equals(match.getTeam1()))
        .findFirst()
        .orElseThrow(
            () -> new MatchLineupNotFoundException("Composition introuvable pour l'équipe 1."));

    MatchLineup team2Lineup = lineups
        .stream()
        .filter(l -> l.getTeam().equals(match.getTeam2()))
        .findFirst()
        .orElseThrow(
            () -> new MatchLineupNotFoundException("Composition introuvable pour l'équipe 2."));

    team1Lineup.setScore(dto.scoreTeam1());
    team2Lineup.setScore(dto.scoreTeam2());
  }

  /**
   * Updates confirmation statuses of lineups during score encoding.
   *
   * @param lineups the match lineups
   */
  private void updateConfirmationStatusesForEncoding(List<MatchLineup> lineups) {
    for (MatchLineup lineup : lineups) {
      ConfirmationStatus currentStatus = lineup.getConfirmationStatus();
      if (currentStatus == ConfirmationStatus.CONTESTED) {
        lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      } else if (currentStatus == ConfirmationStatus.CONFIRMED) {
        lineup.setConfirmationStatus(ConfirmationStatus.PENDING);
      }
    }
  }

  /**
   * Finalizes the match if both teams confirmed, otherwise sets it to await validation.
   *
   * @param match the match
   */
  private void finalizeOrAwaitValidation(Match match) {
    if (bothTeamsConfirmed(match)) {
      match.setStatus(MatchStatus.PLAYED);
      updateWinner(match);
      advanceWinnerToNextRound(match);
    } else {
      match.setScoreEncodedAt(LocalDateTime.now());
      match.setStatus(MatchStatus.AWAITING_VALIDATION);
    }
  }

  /**
   * Validates that a match is in PLANNED status.
   *
   * @param match the match to validate
   * @throws InvalidMatchStatusException if the match is not in PLANNED status
   */
  private void validateMatchCanBeEncoded(Match match) {
    if (match.getStatus() != MatchStatus.IN_PROGRESS
        && match.getStatus() != MatchStatus.AWAITING_VALIDATION) {
      throw new InvalidMatchStatusException(
          "Le match doit être en statut IN_PROGRESS ou AWAITING_VALIDATION "
              + "pour encoder les résultats.");
    }
  }

  /**
   * Validates that the scores are not equal (ties are not allowed).
   *
   * @param dto the DTO containing the scores
   * @throws UnallowedTieException if the scores are equal
   */
  private void validateNoTie(EncodeMatchResultDto dto) {
    if (dto.scoreTeam1().equals(dto.scoreTeam2())) {
      throw new UnallowedTieException("Les scores ne peuvent pas être égaux.");
    }
  }

  /**
   * Executes a double forfeit when neither team has enough players.
   */
  public void executeDoubleForfeit(Match match) {
    if (match == null || match.getLineups() == null) {
      return;
    }

    for (MatchLineup lineup : match.getLineups()) {
      lineup.setHasForfeited(true);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
    }

    match.setStatus(MatchStatus.FORFEIT);
  }
}
