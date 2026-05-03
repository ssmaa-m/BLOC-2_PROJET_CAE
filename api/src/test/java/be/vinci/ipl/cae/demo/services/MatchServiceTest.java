package be.vinci.ipl.cae.demo.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import be.vinci.ipl.cae.demo.exceptions.AlreadyConfirmedException;
import be.vinci.ipl.cae.demo.exceptions.AlreadyContestedException;
import be.vinci.ipl.cae.demo.exceptions.InvalidMatchStatusException;
import be.vinci.ipl.cae.demo.exceptions.MatchLineupNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.MatchNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.MemberHasNoTeamException;
import be.vinci.ipl.cae.demo.exceptions.MemberNotManagerOfTeamException;
import be.vinci.ipl.cae.demo.exceptions.NoSlotAvailableForWinnerException;
import be.vinci.ipl.cae.demo.exceptions.TeamNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.UnallowedTieException;
import be.vinci.ipl.cae.demo.models.dtos.EncodeMatchResultDto;
import be.vinci.ipl.cae.demo.models.dtos.MatchSummaryDto;
import be.vinci.ipl.cae.demo.models.entities.Tournament;
import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import be.vinci.ipl.cae.demo.models.entities.ConfirmationStatus;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.repositories.MatchLineupRepository;
import be.vinci.ipl.cae.demo.repositories.MatchRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class MatchServiceTest {

  @Mock
  private MatchRepository matchRepository;

  @Mock
  private MatchLineupRepository matchLineupRepository;

  @Mock
  private MemberService memberService;

  @Mock
  private TeamService teamService;

  @Mock
  private MatchLineupService matchLineupService;

  @InjectMocks
  private MatchService matchService;

  private Match match;
  private Member member;
  private MatchLineup team1Lineup;
  private MatchLineup team2Lineup;

  @BeforeEach
  void setUp() {
    match = new Match();
    match.setIdMatch(1L);
    match.setStatus(MatchStatus.PLAYED);

    Team team1 = new Team();
    team1.setIdTeam(10L);

    Team team2 = new Team();
    team2.setIdTeam(20L);

    match.setTeam1(team1);
    match.setTeam2(team2);

    member = new Member();

    team1Lineup = new MatchLineup();
    team1Lineup.setTeam(team1);
    team1Lineup.setScore(3);

    team2Lineup = new MatchLineup();
    team2Lineup.setTeam(team2);
    team2Lineup.setScore(1);

    Tournament tournament = new Tournament();
    tournament.setIdTournament(100L);
    tournament.setName("Tournament");
    tournament.setStatus(TournamentStatus.IN_PREPARATION);
    match.setTournament(tournament);

    match.getLineups().addAll(List.of(team1Lineup, team2Lineup));
  }

  @Test
  void confirmResult_team1_success() {
    // Arrange
    member.setTeam(match.getTeam1());

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam1()))
        .thenReturn(Optional.of(team1Lineup));
    when(teamService.isManager(any(), any())).thenReturn(true);

    // Act
    matchService.confirmResult(1L, member);

    // Assert
    assertTrue(team1Lineup.isConfirmed());
  }

  @Test
  void confirmResult_team2_success() {
    // Arrange
    member.setTeam(match.getTeam2());

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam2()))
        .thenReturn(Optional.of(team2Lineup));
    when(teamService.isManager(any(), any())).thenReturn(true);

    // Act
    matchService.confirmResult(1L, member);

    // Assert
    assertTrue(team2Lineup.isConfirmed());
  }

  @Test
  void confirmResult_match_not_found() {
    when(matchRepository.findById(1L)).thenReturn(Optional.empty());

    assertThrows(MatchNotFoundException.class,
        () -> matchService.confirmResult(1L, member));
  }

  @Test
  void confirmResult_result_not_found() {
    member.setTeam(match.getTeam1());
    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam1()))
        .thenReturn(Optional.empty());
    when(teamService.isManager(any(), any())).thenReturn(true);

    assertThrows(MatchLineupNotFoundException.class, () -> matchService.confirmResult(1L, member));
  }

  @Test
  void confirmResult_user_no_team() {
    member.setTeam(null);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));

    assertThrows(MemberHasNoTeamException.class, () -> matchService.confirmResult(1L, member));
  }

  @Test
  void confirmResult_user_not_in_match() {
    Team otherTeam = new Team();
    otherTeam.setIdTeam(99L);
    member.setTeam(otherTeam);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));

    assertThrows(
        MemberNotManagerOfTeamException.class,
        () -> matchService.confirmResult(1L, member));
  }

  @Test
  void confirmResult_already_confirmed_team1() {
    member.setTeam(match.getTeam1());
    team1Lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam1()))
        .thenReturn(Optional.of(team1Lineup));
    when(teamService.isManager(any(), any())).thenReturn(true);

    assertThrows(AlreadyConfirmedException.class, () -> matchService.confirmResult(1L, member));
  }

  @Test
  void confirmResult_already_confirmed_team2() {
    member.setTeam(match.getTeam2());
    team2Lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam2()))
        .thenReturn(Optional.of(team2Lineup));
    when(teamService.isManager(any(), any())).thenReturn(true);

    assertThrows(AlreadyConfirmedException.class, () -> matchService.confirmResult(1L, member));
  }

  @Test
  void contestResult_team1_success() {
    // Arrange
    member.setTeam(match.getTeam1());

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam1()))
        .thenReturn(Optional.of(team1Lineup));
    when(teamService.isManager(any(), any())).thenReturn(true);

    // Act
    matchService.contestResult(1L, member);

    // Assert
    assertFalse(team1Lineup.isConfirmed());
  }

  @Test
  void contestResult_team2_success() {
    // Arrange
    member.setTeam(match.getTeam2());

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam2()))
        .thenReturn(Optional.of(team2Lineup));
    when(teamService.isManager(any(), any())).thenReturn(true);

    // Act
    matchService.contestResult(1L, member);

    // Assert
    assertFalse(team2Lineup.isConfirmed());
  }

  @Test
  void contestResult_match_not_found() {
    when(matchRepository.findById(1L)).thenReturn(Optional.empty());

    assertThrows(MatchNotFoundException.class,
        () -> matchService.contestResult(1L, member));
  }

  @Test
  void contestResult_result_not_found() {
    member.setTeam(match.getTeam1());
    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam1()))
        .thenReturn(Optional.empty());
    when(teamService.isManager(any(), any())).thenReturn(true);

    assertThrows(MatchLineupNotFoundException.class, () -> matchService.contestResult(1L, member));
  }

  @Test
  void contestResult_user_no_team() {
    member.setTeam(null);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));

    assertThrows(MemberHasNoTeamException.class, () -> matchService.contestResult(1L, member));
  }

  @Test
  void contestResult_user_not_in_match() {
    Team otherTeam = new Team();
    otherTeam.setIdTeam(99L);
    member.setTeam(otherTeam);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));

    assertThrows(
        MemberNotManagerOfTeamException.class,
        () -> matchService.contestResult(1L, member));
  }

  @Test
  void contestResult_already_confirmed_team1() {
    member.setTeam(match.getTeam1());
    team1Lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam1()))
        .thenReturn(Optional.of(team1Lineup));
    when(teamService.isManager(any(), any())).thenReturn(true);

    assertThrows(AlreadyContestedException.class, () -> matchService.contestResult(1L, member));
  }

  @Test
  void contestResult_already_confirmed_team2() {
    member.setTeam(match.getTeam2());
    team2Lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByMatchAndTeam(match, match.getTeam2()))
        .thenReturn(Optional.of(team2Lineup));
    when(teamService.isManager(any(), any())).thenReturn(true);

    assertThrows(AlreadyContestedException.class, () -> matchService.contestResult(1L, member));
  }

  @Test
  void encodeResult_success() {
    // Arrange
    match.setStatus(MatchStatus.IN_PROGRESS);
    Match localMatch = new Match();
    team1Lineup.setMatch(localMatch);
    team2Lineup.setMatch(localMatch);

    EncodeMatchResultDto dto = new EncodeMatchResultDto(2, 1);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByIdIdMatch(1L)).thenReturn(List.of(team1Lineup, team2Lineup));

    // Act
    MatchSummaryDto result = matchService.encodeResult(1L, dto);

    // Assert
    assertTrue(result.status() == MatchStatus.AWAITING_VALIDATION);
    assertTrue(team1Lineup.getScore() == 2);
    assertTrue(team2Lineup.getScore() == 1);
  }

  @Test
  void encodeResult_match_not_found() {
    when(matchRepository.findById(1L)).thenReturn(Optional.empty());

    assertThrows(MatchNotFoundException.class,
        () -> matchService.encodeResult(1L, new EncodeMatchResultDto(2, 1)));
  }

  @Test
  void encodeResult_invalid_status() {
    match.setStatus(MatchStatus.PLAYED); // Already played
    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));

    assertThrows(
        InvalidMatchStatusException.class,
        () -> matchService.encodeResult(1L, new EncodeMatchResultDto(2, 1)));
  }

  @Test
  void encodeResult_unallowed_tie() {
    match.setStatus(MatchStatus.IN_PROGRESS);
    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));

    assertThrows(
        UnallowedTieException.class,
        () -> matchService.encodeResult(1L, new EncodeMatchResultDto(1, 1)));
  }

  @Test
  void encodeResult_lineup_not_found() {
    match.setStatus(MatchStatus.IN_PROGRESS);
    match.getLineups().clear(); // Trigger exception
    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));

    assertThrows(
        MatchLineupNotFoundException.class,
        () -> matchService.encodeResult(1L, new EncodeMatchResultDto(2, 1)));
  }

  @Test
  void encodeResult_allows_AWAITING_VALIDATION_status() {
    // Arrange
    match.setStatus(MatchStatus.AWAITING_VALIDATION);
    Match localMatch = new Match();
    team1Lineup.setMatch(localMatch);
    team2Lineup.setMatch(localMatch);

    EncodeMatchResultDto dto = new EncodeMatchResultDto(3, 2);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByIdIdMatch(1L)).thenReturn(List.of(team1Lineup, team2Lineup));

    // Act
    MatchSummaryDto result = matchService.encodeResult(1L, dto);

    // Assert
    assertTrue(result.status() == MatchStatus.AWAITING_VALIDATION);
  }

  @Test
  void encodeResult_finalizes_match_when_both_teams_locked() {
    // Arrange
    match.setStatus(MatchStatus.AWAITING_VALIDATION);
    team1Lineup.setConfirmationStatus(ConfirmationStatus.CONTESTED);
    team2Lineup.setConfirmationStatus(ConfirmationStatus.CONTESTED);
    Match localMatch = new Match();
    team1Lineup.setMatch(localMatch);
    team2Lineup.setMatch(localMatch);

    EncodeMatchResultDto dto = new EncodeMatchResultDto(3, 2);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByIdIdMatch(1L)).thenReturn(List.of(team1Lineup, team2Lineup));

    // Act
    MatchSummaryDto result = matchService.encodeResult(1L, dto);

    // Assert
    assertTrue(result.status() == MatchStatus.PLAYED);
    assertTrue(team1Lineup.getConfirmationStatus() == ConfirmationStatus.ADMIN_LOCKED);
    assertTrue(team2Lineup.getConfirmationStatus() == ConfirmationStatus.ADMIN_LOCKED);
  }

  @Test
  void encodeResult_resets_confirmed_to_pending() {
    // Arrange
    match.setStatus(MatchStatus.IN_PROGRESS);
    team1Lineup.setConfirmationStatus(ConfirmationStatus.CONFIRMED);
    team2Lineup.setConfirmationStatus(ConfirmationStatus.PENDING);
    Match localMatch = new Match();
    team1Lineup.setMatch(localMatch);
    team2Lineup.setMatch(localMatch);

    EncodeMatchResultDto dto = new EncodeMatchResultDto(3, 2);

    when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
    when(matchLineupRepository.findByIdIdMatch(1L)).thenReturn(List.of(team1Lineup, team2Lineup));

    // Act
    matchService.encodeResult(1L, dto);

    // Assert
    assertTrue(team1Lineup.getConfirmationStatus() == ConfirmationStatus.PENDING);
    assertTrue(team2Lineup.getConfirmationStatus() == ConfirmationStatus.PENDING);
  }

  @Test
  void advanceWinnerToNextRoundThrowsWhenMatchIsNull() {
    // Act + Assert
    assertThrows(MatchNotFoundException.class, () -> matchService.advanceWinnerToNextRound(null));
  }

  @Test
  void advanceWinnerToNextRoundThrowsWhenLineupsAreEmpty() {
    // Arrange
    match.setLineups(List.of());

    // Act + Assert
    assertThrows(
        MatchLineupNotFoundException.class,
        () -> matchService.advanceWinnerToNextRound(match));
  }

  @Test
  void advanceWinnerToNextRoundDoesNothingWhenNoWinner() {
    // Arrange
    team1Lineup.setWinner(false);
    team2Lineup.setWinner(false);

    match.setNextMatch(new Match());

    // Act
    matchService.advanceWinnerToNextRound(match);

    // Assert
    // nothing has changed
    assertFalse(match.getNextMatch().getLineups().size() > 0);
  }

  @Test
  void advanceWinnerToNextRoundThrowsWhenWinnerHasNoTeam() {
    // Arrange
    team1Lineup.setWinner(true);
    team1Lineup.setTeam(null);

    // Act + Assert
    assertThrows(TeamNotFoundException.class, () -> matchService.advanceWinnerToNextRound(match));
  }

  @Test
  void advanceWinnerToNextRoundSetsTournamentWinnerWhenNoNextMatch() {
    // Arrange
    team1Lineup.setWinner(true);
    match.setNextMatch(null);

    // Act
    matchService.advanceWinnerToNextRound(match);

    // Assert
    assertEquals(match.getTeam1(), match.getTournament().getWinner());
  }

  @Test
  void advanceWinnerToNextRoundPlacesWinnerInTeam1() {
    // Arrange
    team1Lineup.setWinner(true);

    Match next = new Match();
    next.setLineups(new java.util.ArrayList<>());
    match.setNextMatch(next);

    when(matchLineupService.createDefaultLineup(any(), any())).thenReturn(new MatchLineup());

    // Act
    matchService.advanceWinnerToNextRound(match);

    // Assert
    assertEquals(match.getTeam1(), next.getTeam1());
  }

  @Test
  void advanceWinnerToNextRoundPlacesWinnerInTeam2() {
    // Arrange
    team1Lineup.setWinner(true);

    Match next = new Match();
    next.setTeam1(new Team());
    next.setLineups(new java.util.ArrayList<>());
    match.setNextMatch(next);

    when(matchLineupService.createDefaultLineup(any(), any())).thenReturn(new MatchLineup());

    // Act
    matchService.advanceWinnerToNextRound(match);

    // Assert
    assertEquals(match.getTeam1(), next.getTeam2());
  }

  @Test
  void advanceWinnerToNextRoundThrowsWhenNoSlotAvailable() {
    // Arrange
    team1Lineup.setWinner(true);

    Match next = new Match();
    next.setTeam1(new Team());
    next.setTeam2(new Team());
    match.setNextMatch(next);

    // Act + Assert
    assertThrows(
        NoSlotAvailableForWinnerException.class,
        () -> matchService.advanceWinnerToNextRound(match));
  }

  @Test
  void advanceWinnerToNextRoundCreatesNewLineupInNextMatch() {
    // Arrange
    team1Lineup.setWinner(true);

    Match next = new Match();
    next.setLineups(new java.util.ArrayList<>());
    match.setNextMatch(next);

    MatchLineup created = new MatchLineup();
    when(matchLineupService.createDefaultLineup(any(), any())).thenReturn(created);

    // Act
    matchService.advanceWinnerToNextRound(match);

    // Assert
    assertTrue(next.getLineups().contains(created));
  }

}
