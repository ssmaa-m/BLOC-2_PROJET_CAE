package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.exceptions.ForbiddenException;
import be.vinci.ipl.cae.demo.exceptions.MatchLineupNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.MatchNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.MemberNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.MemberNotInTeamException;
import be.vinci.ipl.cae.demo.exceptions.MemberUnavailableException;
import be.vinci.ipl.cae.demo.exceptions.PrivateLineupException;
import be.vinci.ipl.cae.demo.exceptions.TeamNotFoundException;
import be.vinci.ipl.cae.demo.models.dtos.MatchLineupDto;
import be.vinci.ipl.cae.demo.models.dtos.NewMatchLineupDto;
import be.vinci.ipl.cae.demo.models.entities.ConfirmationStatus;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.repositories.MatchLineupRepository;
import be.vinci.ipl.cae.demo.repositories.MatchRepository;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.TeamRepository;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Service handling the management and validation of match lineups.
 */
@Service
public class MatchLineupService {

  private final MatchRepository matchRepository;
  private final MatchLineupRepository matchLineupRepository;
  private final MemberRepository memberRepository;
  private final MemberService memberService;
  private final TeamService teamService;
  private final TeamRepository teamRepository;
  private final NotificationService notificationService;

  /**
   * Match lineupservice constructor.
   *
   * @param matchRepository match repository
   * @param matchLineupRepository matchLineup repository
   * @param memberRepository member repository
   * @param memberService member service
   * @param teamService team service
   */
  public MatchLineupService(
      MatchRepository matchRepository,
      MatchLineupRepository matchLineupRepository,
      MemberRepository memberRepository,
      MemberService memberService,
      TeamService teamService,
      TeamRepository teamRepository,
      NotificationService notificationService) {
    this.matchRepository = matchRepository;
    this.matchLineupRepository = matchLineupRepository;
    this.memberRepository = memberRepository;
    this.memberService = memberService;
    this.teamService = teamService;
    this.teamRepository = teamRepository;
    this.notificationService = notificationService;
  }

  /**
   * Updates the match lineup for the team of the authenticated member. This method validates that
   * the current member is a manager of a team involved in the match, ensures all provided players
   * belong to that team, and verifies their availability for the match's date and time. If
   * validation passes, the existing lineup is replaced.
   *
   * @param newLineup DTO containing the list of member IDs for the lineup.
   * @param matchId The unique identifier of the match to update.
   * @param currentMember The currently authenticated member performing the update.
   * @return A MatchLineupDto representing the newly updated state of the lineup.
   **/
  public MatchLineupDto updateLineup(
      NewMatchLineupDto newLineup,
      Long matchId,
      Member currentMember) {
    Set<Member> membersSet = validateMatchLineup(newLineup, matchId, currentMember);
    Match match = matchRepository.getMatchByIdMatch(matchId);
    Team team = currentMember.getTeam();
    MatchLineup matchLineup = matchLineupRepository
        .findByMatchAndTeam(match, team)
        .orElseThrow(MatchLineupNotFoundException::new);
    Set<Long> oldLineup =
        matchLineup.getMembers().stream().map(Member::getIdMember).collect(Collectors.toSet());
    matchLineup.replaceLineup(membersSet);
    matchLineupRepository.save(matchLineup);
    notificationService
        .notifyLineup(
            oldLineup,
            newLineup.playerIds(),
            match.getTournament().getIdTournament(),
            match);
    return MatchLineupDto.fromEntity(matchLineup);
  }

  private Set<Member> validateMatchLineup(
      NewMatchLineupDto newLineup,
      Long matchId,
      Member currentMember) {
    Match match = matchRepository.getMatchByIdMatch(matchId);
    if (match == null) {
      throw new MatchNotFoundException("Match " + matchId + " not found.");
    }
    // if not manager of one of the teams in the match
    if (!teamService.isManager(match.getTeam1(), currentMember)
        && !teamService.isManager(match.getTeam2(), currentMember)) {
      throw new ForbiddenException("You are not a manager for either team in this match.");
    }
    Team team = currentMember.getTeam();
    Set<Member> memberSet = new HashSet<>();
    // check members are in this team
    for (Long id : newLineup.playerIds()) {
      // check member exists
      Member member = memberRepository.findById(id).orElse(null);
      if (member == null) {
        throw new MemberNotFoundException("Member with " + id + " does not exist");
      }
      // check member is part of team
      if (!memberService.isMemberOfTeam(id, team)) {
        throw new MemberNotInTeamException();
      }
      // check member is available in this date
      if (!memberService.isMemberFreeAt(member, match.getDateHour())) {
        throw new MemberUnavailableException();
      }
      memberSet.add(member);
    }
    return memberSet;

  }

  /**
   * Get the lineup linked to a team.
   *
   * @param matchId the match id
   * @param teamId the team id
   * @param currentMember the authenticated member
   * @return the lineup linked to the team and match
   */
  public MatchLineupDto getLineupForTeam(Long matchId, Long teamId, Member currentMember) {
    Match match = matchRepository.findById(matchId).orElseThrow(MatchNotFoundException::new);

    Team team = teamRepository
        .findById(teamId)
        .orElseThrow(() -> new TeamNotFoundException("Team not found"));

    boolean isUserInThisTeam = memberService.isMemberOfTeam(currentMember.getIdMember(), team);
    boolean matchWasPlayed = match.wasPlayed();

    if (!matchWasPlayed && !isUserInThisTeam) {
      throw new PrivateLineupException("Lineup is private until match date.");
    }

    Team targetMatchTeam;
    if (match.getTeam1() != null && match.getTeam1().getIdTeam().equals(teamId)) {
      targetMatchTeam = match.getTeam1();
    } else if (match.getTeam2() != null && match.getTeam2().getIdTeam().equals(teamId)) {
      targetMatchTeam = match.getTeam2();
    } else {
      throw new IllegalArgumentException("Cette équipe ne participe pas à ce match.");
    }

    // FETCH the lineup as an Optional
    Optional<MatchLineup> lineupOpt =
        matchLineupRepository.findByMatchAndTeam(match, targetMatchTeam);

    // return mapped entity to dto or empty dto set
    return lineupOpt
        .map(MatchLineupDto::fromEntity)
        .orElseGet(
            () -> new MatchLineupDto(matchId, teamId, team.getName(), Collections.emptySet()));
  }

  /**
   * Create a default lineup for a match and team.
   *
   * @param match the match
   * @param team the team
   * @return the default lineup
   */
  public MatchLineup createDefaultLineup(Match match, Team team) {
    MatchLineup lineup = new MatchLineup();
    lineup.setMatch(match);
    lineup.setTeam(team);
    lineup.setWinner(false);
    lineup.setHasForfeited(false);
    lineup.setConfirmationStatus(ConfirmationStatus.PENDING);

    return lineup;
  }

}
