package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.exceptions.DuplicateRegistrationException;
import be.vinci.ipl.cae.demo.exceptions.ImpossibleTournamentException;
import be.vinci.ipl.cae.demo.exceptions.InactiveTeamException;
import be.vinci.ipl.cae.demo.exceptions.InsufficientTeamMembersException;
import be.vinci.ipl.cae.demo.exceptions.NotAdminException;
import be.vinci.ipl.cae.demo.exceptions.NotManagerException;
import be.vinci.ipl.cae.demo.exceptions.RegistrationClosedException;
import be.vinci.ipl.cae.demo.exceptions.TournamentNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.TournamentStatusException;
import be.vinci.ipl.cae.demo.models.dtos.MatchSummaryDto;
import be.vinci.ipl.cae.demo.models.dtos.NewTournament;
import be.vinci.ipl.cae.demo.models.dtos.TeamSummaryDto;
import be.vinci.ipl.cae.demo.models.dtos.TournamentDetailsDto;
import be.vinci.ipl.cae.demo.models.dtos.TournamentSummaryDto;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.NotificationType;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.models.entities.Tournament;
import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import be.vinci.ipl.cae.demo.repositories.MatchLineupRepository;
import be.vinci.ipl.cae.demo.repositories.MatchRepository;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.TournamentRepository;
import be.vinci.ipl.cae.demo.specifications.TournamentSpecifications;
import be.vinci.ipl.cae.demo.utils.BracketGenerator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tournament service.
 */
@Service
public class TournamentService {

  private final TournamentRepository tournamentRepository;
  private final MemberRepository memberRepository;
  private final MatchLineupRepository matchLineupRepository;
  private final MatchRepository matchRepository;
  private final NotificationService notificationService;
  private final TeamService teamService;
  private final MatchService matchService;
  private final MatchLineupService matchLineupService;

  /**
   * Constructor.
   */
  public TournamentService(
      TournamentRepository tournamentRepository,
      MemberRepository memberRepository,
      MatchLineupRepository matchLineupRepository,
      MatchRepository matchRepository,
      TeamService teamService,
      NotificationService notificationService,
      MatchService matchService,
      MatchLineupService matchLineupService) {
    this.tournamentRepository = tournamentRepository;
    this.memberRepository = memberRepository;
    this.matchLineupRepository = matchLineupRepository;
    this.matchRepository = matchRepository;
    this.notificationService = notificationService;
    this.teamService = teamService;
    this.matchService = matchService;
    this.matchLineupService = matchLineupService;
  }

  /**
   * Get complete details of a tournament (teams, matches, scores).
   *
   * @param idTournament the id of the tournament
   * @return the tournament details
   */
  public TournamentDetailsDto getTournamentDetails(Long idTournament, Member member) {
    Tournament tournament = tournamentRepository.findById(idTournament).orElse(null);

    if (tournament == null) {
      return null;
    }

    List<TeamSummaryDto> teams = getTeams(tournament);

    List<MatchSummaryDto> matches = getMatchesSummaryDto(tournament, member);

    return new TournamentDetailsDto(
        tournament.getIdTournament(),
        tournament.getName(),
        tournament.getDescription(),
        tournament.getStartDate(),
        tournament.getEndDate(),
        tournament.getRegistrationDeadline(),
        tournament.getStatus(),
        tournament.getCapacity(),
        tournament.getRegistrationsNumber(),
        teams,
        matches);
  }

  /**
   * Get the teams of a tournament.
   *
   * @param tournament the tournament
   * @return the teams of the tournament
   */
  private List<TeamSummaryDto> getTeams(Tournament tournament) {
    return tournament
        .getTeams()
        .stream()
        .map(t -> new TeamSummaryDto(t.getIdTeam(), t.getName()))
        .toList();
  }

  /**
   * Get the matches of a tournament.
   *
   * @param tournament the tournament
   * @return the matches of the tournament
   */
  private List<MatchSummaryDto> getMatchesSummaryDto(Tournament tournament, Member currentMember) {
    boolean isAdmin = currentMember != null && currentMember.isAdmin();

    if (tournament.getStatus() == TournamentStatus.REGISTRATION_CLOSED && !isAdmin) {
      return Collections.emptyList();
    }

    List<Match> matchesEntities = matchRepository.findByTournament(tournament);
    return matchesEntities
        .stream()
        .filter(match -> !isByeMatch(match))
        .map(match -> matchService.mapMatchToSummaryDto(match, tournament))
        .toList();
  }

  /**
   * Check if a match is a bye match.
   *
   * @param match the match
   * @return true if the match is a bye match, false otherwise
   */
  public boolean isByeMatch(Match match) {
    if (match.getStatus() == MatchStatus.FORFEIT) {
      return false;
    }

    boolean hasExactlyOneTeam = (match.getTeam1() == null) ^ (match.getTeam2() == null);
    boolean isBye = false;

    if (hasExactlyOneTeam && match.getNextMatch() != null) {
      Team singleTeam = (match.getTeam1() != null) ? match.getTeam1() : match.getTeam2();
      Match nextMatch = match.getNextMatch();

      isBye = singleTeam.equals(nextMatch.getTeam1()) || singleTeam.equals(nextMatch.getTeam2());
    }

    return isBye;
  }

  /**
   * Creates and inserts a new tournament into the database.
   *
   * @param newTournament payload
   * @return created tournament
   */
  public Tournament createTournament(NewTournament newTournament) {
    Tournament tournament = new Tournament();
    tournament.setName(newTournament.name());
    tournament.setDescription(newTournament.description());
    tournament.setCapacity(newTournament.capacity());
    tournament.setEndDate(newTournament.endDate());
    tournament.setStartDate(newTournament.startDate());
    tournament.setRegistrationDeadline(newTournament.registrationDeadline());

    tournament = tournamentRepository.save(tournament);
    return tournament;
  }

  /**
   * Get all tournaments optionally filtered by timeframe, teams or members.
   *
   * @param statuses a list of specific statuses to filter by
   * @param teamsIds a list of specific team ids
   * @param membersIds a list of specific member ids whose team will be used
   * @param search a search string to filter tournaments by name
   * @return the filtered and sorted list of tournaments.
   */
  public Iterable<TournamentSummaryDto> getTournaments(
      List<TournamentStatus> statuses,
      List<Long> teamsIds,
      List<Long> membersIds,
      String search,
      LocalDate minDate,
      LocalDate maxDate,
      Integer limit) {
    Specification<Tournament> spec = Specification.where(null);

    spec = spec
        .and(TournamentSpecifications.hasStatuses(statuses))
        .and(TournamentSpecifications.searchByName(search))
        .and(TournamentSpecifications.isBetweenDates(minDate, maxDate))
        .and(TournamentSpecifications.hasTeams(teamsIds))
        .and(TournamentSpecifications.hasMembersInMatches(membersIds));

    Sort sort = Sort.by(Sort.Direction.DESC, "startDate");

    Pageable pageable;
    if (limit != null && limit > 0) {
      pageable = PageRequest.of(0, limit, sort);
    } else {
      pageable = PageRequest.ofSize(Integer.MAX_VALUE).withSort(sort);
    }

    List<Tournament> tournaments = tournamentRepository.findAll(spec, pageable).getContent();

    return tournaments.stream().map(this::mapToSummaryDto).toList();
  }

  /**
   * Maps a tournament to a summary DTO.
   *
   * @param t the tournament to map
   * @return the tournament summary DTO
   */
  private TournamentSummaryDto mapToSummaryDto(Tournament t) {
    return new TournamentSummaryDto(
        t.getIdTournament(),
        t.getName(),
        t.getDescription(),
        t.getStartDate(),
        t.getEndDate(),
        t.getRegistrationDeadline(),
        t.getStatus(),
        t.getCapacity(),
        t.getRegistrationsNumber());
  }

  /**
   * Update a tournament's information.
   *
   * @param tournamentId the id of the tournament to update
   * @param newTournament the tournament with the updated data
   * @param currentMember the current member
   * @return the updated tournament if it has been updated, null otherwise.
   */
  public Tournament updateTournament(
      Long tournamentId,
      NewTournament newTournament,
      Member currentMember) {
    if (!currentMember.isAdmin()) {
      return null;
    }

    Tournament tournament = tournamentRepository.findById(tournamentId).orElse(null);

    if (tournament == null) {
      return null;
    }

    if (tournament.getStatus() != TournamentStatus.IN_PREPARATION) {
      return null;
    }

    if (newTournament.name() != null) {
      tournament.setName(newTournament.name());
    }

    if (newTournament.description() != null) {
      tournament.setDescription(newTournament.description());
    }

    if (newTournament.startDate() != null) {
      tournament.setStartDate(newTournament.startDate());
    }

    if (newTournament.endDate() != null) {
      tournament.setEndDate(newTournament.endDate());
    }

    if (newTournament.capacity() != tournament.getCapacity()) {
      tournament.setCapacity(newTournament.capacity());
    }

    if (newTournament.registrationDeadline() != null) {
      tournament.setRegistrationDeadline(newTournament.registrationDeadline());
    }
    return tournamentRepository.save(tournament);
  }

  /**
   * Change a tournament status from IN_PREPARATION to REGISTRATION_OPEN.
   *
   * @param tournamentId the id of the tournament to update
   * @param currentMember the current member
   * @return the tournament if it's status has been changed to REGISTRATION_OPEN, null otherwise.
   */
  public Tournament publishTournament(Long tournamentId, Member currentMember) {
    Tournament tournament =
        doesTournamentExistInTheGivenStatus(tournamentId, TournamentStatus.IN_PREPARATION);

    Tournament updatedTournament =
        updateTournamentStatus(tournament, TournamentStatus.REGISTRATION_OPEN, currentMember);

    notificationService
        .notifyAllMembers(
            "Nouveau Tournoi ! " + updatedTournament.getName() + " vient d'ouvrir ses portes.",
            NotificationType.TOURNAMENT,
            tournamentId);

    return updatedTournament;
  }

  /**
   * Change a tournament status from REGISTRATION_CLOSED to PLANNED.
   *
   * @param tournamentId the id of the tournament to update
   * @param currentMember the current member
   * @return the tournament if it's status has been changed to PLANNED, null otherwise.
   */
  public Tournament publishTournamentMatches(Long tournamentId, Member currentMember) {
    Tournament tournament =
        doesTournamentExistInTheGivenStatus(tournamentId, TournamentStatus.REGISTRATION_CLOSED);

    Tournament updatedTournament =
        updateTournamentStatus(tournament, TournamentStatus.PLANNED, currentMember);

    notificationService
        .notifyAllMembers(
            "Les matchs de " + updatedTournament.getName() + " sont maintenant disponibles !",
            NotificationType.TOURNAMENT,
            tournamentId);

    return updatedTournament;
  }

  /**
   * Update a tournament status.
   *
   * @param tournament the tournament to update
   * @param status the status to set
   * @param currentMember the current member
   * @return the tournament if it's status has been changed, null otherwise.
   */
  public Tournament updateTournamentStatus(
      Tournament tournament,
      TournamentStatus status,
      Member currentMember) {
    if (!currentMember.isAdmin()) {
      throw new NotAdminException("Only admins can update tournament status");
    }

    tournament.setStatus(status);

    tournamentRepository.save(tournament);

    return tournament;
  }

  /**
   * Checks if a tournament exists and has the given status.
   *
   * @param tournamentId the tournament id
   * @param status the status to check
   * @return the tournament if it exists and has the given status, null otherwise
   */
  private Tournament doesTournamentExistInTheGivenStatus(
      Long tournamentId,
      TournamentStatus status) {
    Tournament tournament = tournamentRepository.findById(tournamentId).orElse(null);

    if (tournament == null) {
      throw new TournamentNotFoundException("Tournament not found");
    }

    if (tournament.getStatus() != status) {
      throw new TournamentStatusException("Tournament status does not match");
    }

    return tournament;
  }

  /**
   * Register a team to a tournament.
   *
   * @param idTournament the tournament id
   * @param currentMember the member requesting to register the team
   */
  @Transactional
  public TournamentDetailsDto registerTeam(Long idTournament, Member currentMember) {
    // Reload member within the transactional session to avoid LazyInitializationException
    Member member = memberRepository.findById(currentMember.getIdMember()).orElse(null);
    if (member == null) {
      throw new InactiveTeamException("User not found");
    }

    Team team = member.getTeam();
    if (team == null || !team.getIsActive()) {
      throw new InactiveTeamException("User is not in an active team");
    }

    if (!teamService.isManager(team, member)) {
      throw new NotManagerException("Only a team manager can register the team");
    }

    if (team.getMembers().size() < 4) {
      throw new InsufficientTeamMembersException("Team must have at least 4 members to register");
    }

    Tournament tournament = tournamentRepository
        .findById(idTournament)
        .orElseThrow(() -> new TournamentNotFoundException("Tournament not found"));

    if (team.getTournaments().contains(tournament)) {
      throw new DuplicateRegistrationException("Team is already registered for this tournament");
    }

    if (!tournament.registerTeam(team)) {
      throw new RegistrationClosedException("Registration closed or deadline passed");
    }

    tournamentRepository.save(tournament);
    return getTournamentDetails(idTournament, null);
  }

  /**
   * Generate matches for a tournament.
   *
   * @param tournamentId the ID of the tournament
   */
  @Transactional
  public void generateMatches(Long tournamentId) {
    Tournament tournament = fetchAndValidateTournament(tournamentId);

    clearExistingMatches(tournament);

    List<Match> generatedMatches = BracketGenerator.generateBracket(tournament.getTeams());

    scheduleMatches(generatedMatches, tournament);

    List<Match> savedMatches = matchRepository.saveAll(generatedMatches);

    generateAndSaveDefaultLineups(savedMatches);

    tournamentRepository.save(tournament);
  }

  /**
   * Clears existing matches for a tournament.
   *
   * @param tournament the tournament to clear matches for
   */
  public void clearExistingMatches(Tournament tournament) {
    List<Match> existingMatches = matchRepository.findByTournament(tournament);

    if (existingMatches.isEmpty()) {
      return;
    }

    if (tournament.getStatus() != TournamentStatus.REGISTRATION_CLOSED
        && tournament.getStatus() != TournamentStatus.CANCELLED) {
      throw new TournamentStatusException(
          "Cannot clear matches: tournament is not in a clearance valid status");
    }

    matchLineupRepository.deleteByMatchIn(existingMatches);

    for (Match match : existingMatches) {
      match.setNextMatch(null);
    }

    matchRepository.saveAll(existingMatches);

    matchRepository.deleteAll(existingMatches);
  }

  /**
   * Fetch and validate a tournament by its ID.
   *
   * @param tournamentId the ID of the tournament
   * @return the tournament
   */
  private Tournament fetchAndValidateTournament(Long tournamentId) {
    Tournament tournament = tournamentRepository
        .findById(tournamentId)
        .orElseThrow(() -> new TournamentNotFoundException("Tournament not found"));

    if (tournament.getStatus() != TournamentStatus.REGISTRATION_CLOSED) {
      throw new TournamentStatusException(
          "Matches can only be generated for a registration-closed tournament");
    }
    return tournament;
  }

  /**
   * Schedule matches for a tournament.
   *
   * @param matches the matches to schedule
   * @param tournament the tournament
   */
  public void scheduleMatches(List<Match> matches, Tournament tournament) {
    final int matchDurationMins = 60;
    final int bufferMins = 30;
    final int daysBetweenRounds = 1;
    final int startTimeHour = 10;

    matches.sort(Comparator.comparingInt(Match::getTurn));

    LocalDateTime currentTimeCursor = tournament.getStartDate().atTime(startTimeHour, 0);
    int currentRound = 1;

    for (Match match : matches) {
      if (match.getTurn() > currentRound) {
        currentRound = match.getTurn();
        currentTimeCursor = currentTimeCursor
            .plusDays(daysBetweenRounds)
            .withHour(startTimeHour)
            .withMinute(0)
            .withSecond(0)
            .withNano(0);
      }

      if (isByeMatch(match)) {
        match.setDateHour(currentTimeCursor);
        match.setStatus(MatchStatus.PLAYED);
      } else {
        match.setDateHour(currentTimeCursor);
        match.setStatus(MatchStatus.PLANNED);
        currentTimeCursor = currentTimeCursor.plusMinutes(matchDurationMins + bufferMins);
      }

      match.setTournament(tournament);
    }

    LocalDateTime actualFinishTime = currentTimeCursor;

    if (actualFinishTime.isAfter(tournament.getEndDate().atTime(23, 59))) {
      tournament.setStatus(TournamentStatus.CANCELLED);
      throw new ImpossibleTournamentException("Tournament is physically impossible to complete!");
    }

    tournament.setEndDate(actualFinishTime.toLocalDate());
  }

  /**
   * Generate and save default lineups for a list of matches.
   *
   * @param savedMatches the saved matches
   */
  private void generateAndSaveDefaultLineups(List<Match> savedMatches) {
    List<MatchLineup> defaultLineups = new ArrayList<>();

    for (Match match : savedMatches) {
      if (match.getTeam1() != null) {
        defaultLineups.add(matchLineupService.createDefaultLineup(match, match.getTeam1()));
      }
      if (match.getTeam2() != null) {
        defaultLineups.add(matchLineupService.createDefaultLineup(match, match.getTeam2()));
      }
    }

    matchLineupRepository.saveAll(defaultLineups);
  }
}
