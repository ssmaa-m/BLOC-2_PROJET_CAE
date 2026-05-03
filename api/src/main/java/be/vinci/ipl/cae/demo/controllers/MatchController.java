package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.EncodeMatchResultDto;
import be.vinci.ipl.cae.demo.models.dtos.ForfeitRequest;
import be.vinci.ipl.cae.demo.models.dtos.MatchSummaryDto;
import be.vinci.ipl.cae.demo.models.dtos.MemberSummaryDto;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.services.MatchService;
import be.vinci.ipl.cae.demo.services.TeamService;
import jakarta.validation.Valid;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller handling match-related endpoints.
 */
@RestController
@RequestMapping("/matches")
public class MatchController {

  private final MatchService matchService;
  private final TeamService teamService;

  /**
   * Constructor for MatchController.
   *
   * @param matchService the injected MatchService
   */
  public MatchController(MatchService matchService, TeamService teamService) {
    this.matchService = matchService;
    this.teamService = teamService;
  }

  /**
   * Retrieves matches for a team and member, filtered by search query.
   *
   * @param teamId the id of the team
   * @param memberId the id of the member
   * @param searchQuery the search query
   * @return the matches
   */
  @GetMapping({"", "/"})
  public List<MatchSummaryDto> getMatches(
      @RequestParam(required = false) Long teamId,
      @RequestParam(required = false) Long memberId,
      @RequestParam(required = false) String searchQuery) {
    return matchService.getMatches(teamId, memberId, searchQuery);
  }

  /**
   * Confirms the result of a match.
   *
   * @param id the id of the match
   * @param currentMember the authenticated user
   */
  @PatchMapping("/{id}/confirm")
  @PreAuthorize("isAuthenticated()")
  public void confirmMatchResult(
      @PathVariable Long id,
      @AuthenticationPrincipal Member currentMember) {
    matchService.confirmResult(id, currentMember);
  }

  /**
   * Contests the result of a match.
   *
   * @param id the id of the match
   * @param currentMember the authenticated user
   */
  @PatchMapping("/{id}/contest")
  @PreAuthorize("isAuthenticated()")
  public void contestMatchResult(
      @PathVariable Long id,
      @AuthenticationPrincipal Member currentMember) {
    matchService.contestResult(id, currentMember);
  }

  /**
   * Fetches available members for a match.(manager use only.
   *
   * @param matchId match id
   * @param currentMember the manager sending the request
   * @return set of members
   */
  @GetMapping("/{matchId}/available-members")
  @PreAuthorize("isAuthenticated()") // Or your specific manager check
  public Set<MemberSummaryDto> getAvailableMembers(
      @PathVariable Long matchId,
      @AuthenticationPrincipal Member currentMember) {

    return matchService
        .getAvailableMembersForMatch(matchId, currentMember)
        .stream()
        .map(MemberSummaryDto::fromEntity)
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  /**
   * Encodes the result of a match (admin only).
   *
   * @param id the id of the match
   * @param dto the DTO containing the scores for both teams
   * @return the updated match summary
   */
  @PatchMapping("/{id}/result")
  @PreAuthorize("hasRole('ADMIN')")
  public MatchSummaryDto encodeMatchResult(
      @PathVariable Long id,
      @Valid @RequestBody EncodeMatchResultDto dto) {
    return matchService.encodeResult(id, dto);
  }

  /**
   * Declare forfeit for a match (manager only).
   *
   * @param matchId the match id
   * @param request the request body containing the id's of the match, the winning team and the
   *        forfeiting team
   */
  @PatchMapping("/{matchId}/declare-forfeit")
  @PreAuthorize("isAuthenticated()")
  public void declareForfeit(@PathVariable Long matchId, @RequestBody ForfeitRequest request) {
    Match match = matchService.getMatchById(matchId);
    Team winningTeam = teamService.getExistingTeam(request.winningTeamId());
    Team forfeitingTeam = teamService.getExistingTeam(request.forfeitingTeamId());

    matchService.executeWalkover(match, winningTeam, forfeitingTeam);
  }

}
