package be.vinci.ipl.cae.demo.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import be.vinci.ipl.cae.demo.exceptions.DuplicateRegistrationException;
import be.vinci.ipl.cae.demo.exceptions.ImpossibleTournamentException;
import be.vinci.ipl.cae.demo.exceptions.InactiveTeamException;
import be.vinci.ipl.cae.demo.exceptions.InsufficientTeamMembersException;
import be.vinci.ipl.cae.demo.exceptions.NotManagerException;
import be.vinci.ipl.cae.demo.exceptions.RegistrationClosedException;
import be.vinci.ipl.cae.demo.exceptions.TournamentNotFoundException;
import be.vinci.ipl.cae.demo.models.dtos.NewTournament;
import be.vinci.ipl.cae.demo.models.dtos.TournamentDetailsDto;
import be.vinci.ipl.cae.demo.models.dtos.TournamentSummaryDto;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.models.entities.Tournament;
import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import be.vinci.ipl.cae.demo.repositories.MatchLineupRepository;
import be.vinci.ipl.cae.demo.repositories.MatchRepository;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.TournamentRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class TournamentServiceTest {

  @Mock
  private TournamentRepository tournamentRepository;

  @Mock
  private MemberRepository memberRepository;

  @Mock
  private MatchLineupRepository matchLineupRepository;

  @Mock
  private MatchRepository matchRepository;

  @Mock
  private TeamService teamService;

  @Mock
  private NotificationService notificationService;

  @Mock
  private MatchService matchService;

  @Mock
  private MatchLineupService matchLineupService;

  @Mock
  private TournamentService tournamentService;

  private Member memberAdmin;

  private Tournament tournament;

  private NewTournament newTournament;

  private Member manager;

  private Team team;

  @BeforeEach
  void setUp() {
    tournamentService = new TournamentService(
        tournamentRepository,
        memberRepository,
        matchLineupRepository,
        matchRepository,
        teamService,
        notificationService,
        matchService,
        matchLineupService);

    memberAdmin = new Member();
    memberAdmin.setAdmin(true);

    newTournament = new NewTournament(
        "un1",
        "ud1",
        LocalDate.of(2028, 1, 1),
        LocalDate.of(2028, 1, 31),
        4,
        LocalDate.of(2027, 12, 1).atStartOfDay());

    manager = new Member();
    manager.setIdMember(1L);

    team = new Team();
    team.setIdTeam(10L);
    team.setName("Test Team");
    team.setIsActive(true);
    team.setManager1(manager);
    manager.setTeam(team);

    Member m2 = new Member();
    m2.setIdMember(2L);
    Member m3 = new Member();
    m3.setIdMember(3L);
    Member m4 = new Member();
    m4.setIdMember(4L);
    team.setMembers(List.of(manager, m2, m3, m4));

    tournament = new Tournament();
    tournament.setIdTournament(100L);
    tournament.setStatus(TournamentStatus.REGISTRATION_OPEN);
    tournament.setRegistrationDeadline(java.time.LocalDateTime.now().plusDays(5));
    tournament.setCapacity(8);
  }

  @Test
  void updateUnexistingTournament() {
    // Arrange
    when(tournamentRepository.findById(1L)).thenReturn(Optional.empty());

    // Act
    Tournament result = tournamentService.updateTournament(
        1L, newTournament, memberAdmin
    );

    // Assert
    assertNull(result);
    verify(tournamentRepository, never()).save(any());
  }

  @Test
  void updateTournamentAsAdminWithTournamentStatusNotInPreparation() {
    // Arrange

    tournament = new Tournament();
    tournament.setIdTournament(1L);
    tournament.setStatus(TournamentStatus.REGISTRATION_OPEN);

    when(tournamentRepository.findById(1L)).thenReturn(Optional.of(tournament));

    // Act
    Tournament result = tournamentService.updateTournament(1L, newTournament, memberAdmin);

    // Assert
    assertNull(result);
    verify(tournamentRepository, never()).save(any());
  }

  @Test
  void updateTournamentAsANonAdminMember() {
    // Arrange
    Member nonAdminMember = new Member();
    nonAdminMember.setIdMember(2L);
    nonAdminMember.setAdmin(false);

    tournament = new Tournament();
    tournament.setIdTournament(1L);
    tournament.setStatus(TournamentStatus.IN_PREPARATION);

    // Act
    Tournament result = tournamentService.updateTournament(1L, newTournament, nonAdminMember);

    // Arrange
    assertNull(result);
    verify(tournamentRepository, never()).save(any());
  }

  @Test
  void updateTournamentAsAdminWithTournamentStatusInPreparation() {
    // Arrange
    tournament = new Tournament();
    tournament.setIdTournament(1L);
    tournament.setName("t1");
    tournament.setDescription("d1");
    tournament.setStartDate(LocalDate.of(2027, 1, 1));
    tournament.setEndDate(LocalDate.of(2027, 1, 31));
    tournament.setRegistrationDeadline(LocalDate.of(2026, 12, 1).atStartOfDay());
    tournament.setCapacity(8);
    tournament.setStatus(TournamentStatus.IN_PREPARATION);

    when(tournamentRepository.findById(1L)).thenReturn(Optional.of(tournament));
    when(tournamentRepository.save(any(Tournament.class))).thenReturn(tournament);

    // Act
    Tournament result = tournamentService.updateTournament(1L, newTournament, memberAdmin);

    // Assert
    assertAll(
        () -> assertNotNull(result),
        () -> assertEquals("un1", result.getName()),
        () -> assertEquals("ud1", result.getDescription()),
        () -> assertEquals(LocalDate.of(2028, 1, 1), result.getStartDate()),
        () -> assertEquals(LocalDate.of(2028, 1, 31), result.getEndDate()),
        () -> assertEquals(4, result.getCapacity()),
        () -> assertEquals(
            LocalDate.of(2027, 12, 1).atStartOfDay(),
            result.getRegistrationDeadline()));
    verify(tournamentRepository, times(1)).save(tournament);
  }

  @Test
  void registerTeamValid() {
    // Arrange
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager));
    when(tournamentRepository.findById(100L)).thenReturn(Optional.of(tournament));
    when(teamService.isManager(team, manager)).thenReturn(true);
    when(matchRepository.findByTournament(tournament)).thenReturn(List.of());

    // Act
    TournamentDetailsDto result = tournamentService.registerTeam(100L, manager);

    // Assert
    assertNotNull(result);
    assertTrue(tournament.getTeams().contains(team));
    assertTrue(team.getTournaments().contains(tournament));
    verify(tournamentRepository).save(tournament);
  }

  @Test
  void registerTeamInvalidTournament() {
    // Arrange
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager));
    when(teamService.isManager(team, manager)).thenReturn(true);
    when(tournamentRepository.findById(100L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(TournamentNotFoundException.class, () -> tournamentService.registerTeam(100L, manager));
  }

  @Test
  void registerTeamNotActiveTeam() {
    // Arrange
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager));
    team.setIsActive(false);

    // Act & Assert
    assertThrows(InactiveTeamException.class, () -> tournamentService.registerTeam(100L, manager));
    verify(tournamentRepository, never()).save(any());
  }

  @Test
  void registerTeamNotManager() {
    // Arrange
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager));
    when(teamService.isManager(team, manager)).thenReturn(false);

    // Act & Assert
    assertThrows(NotManagerException.class, () -> tournamentService.registerTeam(100L, manager));
    verify(tournamentRepository, never()).save(any());
  }

  @Test
  void registerTeamNotEnoughMembers() {
    // Arrange
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager));
    team.setMembers(List.of(manager, new Member())); // only 2 members
    when(teamService.isManager(team, manager)).thenReturn(true);

    // Act & Assert
    assertThrows(InsufficientTeamMembersException.class, () -> tournamentService.registerTeam(100L, manager));
    verify(tournamentRepository, never()).save(any());
  }

  @Test
  void registerTeamAlreadyRegistered() {
    // Arrange
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager));
    when(tournamentRepository.findById(100L)).thenReturn(Optional.of(tournament));
    when(teamService.isManager(team, manager)).thenReturn(true);
    team.getTournaments().add(tournament);

    // Act & Assert
    assertThrows(DuplicateRegistrationException.class, () -> tournamentService.registerTeam(100L, manager));
    verify(tournamentRepository, never()).save(any());
  }

  @Test
  void registerTeamRegistrationClosed() {
    // Arrange
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager));
    tournament.setStatus(TournamentStatus.REGISTRATION_CLOSED);
    when(tournamentRepository.findById(100L)).thenReturn(Optional.of(tournament));
    when(teamService.isManager(team, manager)).thenReturn(true);

    // Act & Assert
    assertThrows(RegistrationClosedException.class, () -> tournamentService.registerTeam(100L, manager));
    verify(tournamentRepository, never()).save(any());
  }

  @Test
  void isByeMatchWithMatchStatusForfeit() {
    // Arrange
    Match match = new Match();
    match.setStatus(MatchStatus.FORFEIT);

    // Act
    boolean result = tournamentService.isByeMatch(match);

    // Assert
    assertFalse(result);
  }

  @Test
  void isByeMatchWithNoTeams() {
    // Arrange
    Match match = new Match();
    match.setStatus(MatchStatus.PLANNED);

    match.setTeam1(null);
    match.setTeam2(null);

    // Act
    boolean result = tournamentService.isByeMatch(match);

    // Assert
    assertFalse(result);
  }

  @Test
  void isByeMatchWithTwoTeams() {
    // Arrange
    Match match = new Match();
    match.setStatus(MatchStatus.PLANNED);

    match.setTeam1(new Team());
    match.setTeam2(new Team());

    // Act
    boolean result = tournamentService.isByeMatch(match);

    // Assert
    assertFalse(result);
  }

  @Test
  void isByeMatchWithOneTeamButNoNextMatch() {
    // Arrange
    Match match = new Match();
    match.setStatus(MatchStatus.PLANNED);

    Team t1 = new Team();
    match.setTeam1(t1);
    match.setTeam2(null);

    match.setNextMatch(null);

    // Act
    boolean result = tournamentService.isByeMatch(match);

    // Assert
    assertFalse(result);
  }

  @Test
  void isByeMatchWithOneTeamButNotInNextMatch() {
    // Arrange
    Match match = new Match();
    match.setStatus(MatchStatus.PLANNED);

    Team t1 = new Team();
    t1.setIdTeam(1L);

    Team t2 = new Team();
    t2.setIdTeam(2L);

    match.setTeam1(t1);
    match.setTeam2(null);

    Match next = new Match();
    next.setTeam1(t2);
    next.setTeam2(null);

    match.setNextMatch(next);

    // Act
    boolean result = tournamentService.isByeMatch(match);

    // Assert
    assertFalse(result);
  }

  @Test
  void isByeMatchWithOneTeamAndPresentInNextMatch() {
    // Arrange
    Match match = new Match();
    match.setStatus(MatchStatus.PLANNED);

    Team t1 = new Team();
    t1.setIdTeam(1L);

    match.setTeam1(t1);
    match.setTeam2(null);

    Match next = new Match();
    next.setTeam1(t1);
    next.setTeam2(null);

    match.setNextMatch(next);

    // Act
    boolean result = tournamentService.isByeMatch(match);

    // Assert
    assertTrue(result);
  }

  @Test
  void isByeMatchWithTeam2AndPresentInNextMatch() {
    // Arrange
    Match match = new Match();
    match.setStatus(MatchStatus.PLANNED);

    Team t1 = new Team();
    t1.setIdTeam(1L);

    match.setTeam1(null);
    match.setTeam2(t1);

    Match next = new Match();
    next.setTeam1(null);
    next.setTeam2(t1);

    match.setNextMatch(next);

    // Act
    boolean result = tournamentService.isByeMatch(match);

    // Assert
    assertTrue(result);
  }

  @Test
  void getTournamentsWithNullLimitUsesMaxPageable() {
    // Arrange
    when(tournamentRepository.findAll(any(), any(Pageable.class)))
        .thenReturn(new PageImpl<>(List.of(tournament)));

    // Act
    Iterable<TournamentSummaryDto> result = tournamentService.getTournaments(
        List.of(), List.of(), List.of(), null, null, null, null);

    // Assert
    assertNotNull(result);
    verify(tournamentRepository, times(1))
        .findAll(any(), any(Pageable.class));
  }

  @Test
  void getTournamentsReturnsEmptyListWhenRepositoryIsEmpty() {
    // Arrange
    when(tournamentRepository.findAll(any(), any(Pageable.class)))
        .thenReturn(new PageImpl<>(List.of()));

    // Act
    Iterable<TournamentSummaryDto> result = tournamentService.getTournaments(
        List.of(), List.of(), List.of(), null, null, null, null);

    // Assert
    assertAll(
        () -> assertNotNull(result),
        () -> assertEquals(0, ((List<?>) result).size())
    );
  }

  @Test
  void getTournamentsWithFiltersCallsRepositoryCorrectly() {
    // Arrange
    when(tournamentRepository.findAll(any(), any(Pageable.class)))
        .thenReturn(new PageImpl<>(List.of(tournament)));

    List<TournamentStatus> statuses = List.of(TournamentStatus.REGISTRATION_OPEN);
    List<Long> teams = List.of(10L, 20L);
    List<Long> members = List.of(1L, 2L);
    String search = "cup";

    // Act
    tournamentService.getTournaments(
        statuses, teams, members, search,
        LocalDate.of(2025, 1, 1),
        LocalDate.of(2025, 12, 31),
        null);

    // Assert
    verify(tournamentRepository, times(1))
        .findAll(any(), any(Pageable.class));
  }

  @Test
  void getTournamentsMapsEntitiesToSummaryDto() {
    // Arrange
    tournament.setName("Test Tournament");

    when(tournamentRepository.findAll(any(), any(Pageable.class)))
        .thenReturn(new PageImpl<>(List.of(tournament)));

    // Act
    Iterable<TournamentSummaryDto> result =
        tournamentService.getTournaments(List.of(), List.of(), List.of(), null, null, null, null);

    List<TournamentSummaryDto> list = (List<TournamentSummaryDto>) result;

    // Assert
    assertAll(
        () -> assertEquals(1, list.size()),
        () -> assertEquals("Test Tournament", list.getFirst().name()));
  }

  @Test
  void scheduleMatchesSortsMatchesByTurn() {
    // Arrange
    Tournament tournament = new Tournament();
    tournament.setStartDate(LocalDate.of(2030, 1, 1));
    tournament.setEndDate(LocalDate.of(2030, 1, 10));

    Match m1 = new Match();
    m1.setTurn(2);
    Match m2 = new Match();
    m2.setTurn(1);

    List<Match> matches = new ArrayList<>(List.of(m1, m2));

    // Act
    tournamentService.scheduleMatches(matches, tournament);

    // Assert
    assertAll(
        () -> assertEquals(1, matches.getFirst().getTurn()),
        () -> assertEquals(2, matches.get(1).getTurn()));
  }

  @Test
  void scheduleMatchesSetsPlannedStatusForNormalMatch() {
    // Arrange
    Tournament tournament = new Tournament();
    tournament.setStartDate(LocalDate.of(2030, 1, 1));
    tournament.setEndDate(LocalDate.of(2030, 1, 10));

    Match m = new Match();
    m.setTurn(1);
    m.setTeam1(new Team());
    m.setTeam2(new Team());

    List<Match> matches = new ArrayList<>();
    matches.add(m);

    // Act
    tournamentService.scheduleMatches(matches, tournament);

    // Assert
    assertAll(
        () -> assertEquals(MatchStatus.PLANNED, m.getStatus()),
        () -> assertNotNull(m.getDateHour()));
  }

  @Test
  void scheduleMatchesSetsPlayedStatusForByeMatch() {
    // Arrange
    Tournament tournament = new Tournament();
    tournament.setStartDate(LocalDate.of(2030, 1, 1));
    tournament.setEndDate(LocalDate.of(2030, 1, 10));

    Team teamA = new Team();
    teamA.setIdTeam(1L);

    Match next = new Match();
    next.setTeam1(teamA);

    Match m = new Match();
    m.setTurn(1);
    m.setTeam1(teamA);
    m.setTeam2(null);
    m.setNextMatch(next);

    List<Match> matches = new ArrayList<>();
    matches.add(m);

    // Act
    tournamentService.scheduleMatches(matches, tournament);

    // Assert
    assertEquals(MatchStatus.PLAYED, m.getStatus());
  }

  @Test
  void scheduleMatchesAdvancesDayWhenRoundChanges() {
    // Arrange
    Tournament tournament = new Tournament();
    tournament.setStartDate(LocalDate.of(2030, 1, 1));
    tournament.setEndDate(LocalDate.of(2030, 1, 10));

    Match m1 = new Match();
    m1.setTurn(1);
    m1.setTeam1(new Team());
    m1.setTeam2(new Team());

    Match m2 = new Match();
    m2.setTurn(2);
    m2.setTeam1(new Team());
    m2.setTeam2(new Team());

    List<Match> matches = new ArrayList<>();
    matches.add(m1);
    matches.add(m2);

    // Act
    tournamentService.scheduleMatches(matches, tournament);

    // Assert
    assertAll(
        () -> assertEquals(LocalDate.of(2030, 1, 1), m1.getDateHour().toLocalDate()),
        () -> assertEquals(LocalDate.of(2030, 1, 2), m2.getDateHour().toLocalDate()));
  }

  @Test
  void scheduleMatchesThrowsIfTournamentCannotFinish() {
    // Arrange
    Tournament tournament = new Tournament();

    // end date is before start date
    tournament.setStartDate(LocalDate.of(2030, 1, 2));
    tournament.setEndDate(LocalDate.of(2030, 1, 1));

    Match m = new Match();
    m.setTurn(1);
    m.setTeam1(new Team());
    m.setTeam2(new Team());

    List<Match> matches = new ArrayList<>();
    matches.add(m);

    // Act + Assert
    assertAll(
        () -> assertThrows(
            ImpossibleTournamentException.class,
            () -> tournamentService.scheduleMatches(matches, tournament)),
        () -> assertEquals(TournamentStatus.CANCELLED, tournament.getStatus()));
  }

  @Test
  void scheduleMatchesUpdatesTournamentEndDate() {
    // Arrange
    Tournament tournament = new Tournament();
    tournament.setStartDate(LocalDate.of(2030, 1, 1));
    tournament.setEndDate(LocalDate.of(2030, 1, 10));

    Match m = new Match();
    m.setTurn(1);
    m.setTeam1(new Team());
    m.setTeam2(new Team());

    List<Match> matches = new ArrayList<>();
    matches.add(m);

    // Act
    tournamentService.scheduleMatches(matches, tournament);

    // Assert
    assertEquals(m.getDateHour().toLocalDate(), tournament.getEndDate());
  }


}
