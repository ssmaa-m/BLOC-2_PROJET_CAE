package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.exceptions.InvalidTeamNameException;
import be.vinci.ipl.cae.demo.models.dtos.FullTeamDto;
import be.vinci.ipl.cae.demo.models.dtos.NewTeam;
import be.vinci.ipl.cae.demo.models.dtos.TeamDetailsDto;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.services.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * TeamController to handle team-related requests.
 */
@RestController
@RequestMapping("/teams")
public class TeamController {

  private final TeamService teamService;

  /**
   * Constructor for TeamController.
   *
   * @param teamService the injected TeamService.
   */
  public TeamController(TeamService teamService) {
    this.teamService = teamService;
  }

  /**
   * Create a new team. The authenticated member becomes the team's manager.
   *
   * @param newTeam the team creation request body.
   * @param currentMember the authenticated member.
   * @return the created team.
   */
  @PostMapping("/")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("isAuthenticated()")
  public Team createTeam(
      @RequestBody NewTeam newTeam,
      @AuthenticationPrincipal Member currentMember) {
    if (newTeam == null || newTeam.getName() == null || newTeam.getName().isBlank()) {
      throw new InvalidTeamNameException("Le nom de l'équipe ne peut pas être vide.");
    }

    return teamService.createTeam(newTeam.getName(), currentMember);
  }

  /**
   * Get all active teams.
   *
   * @return an iterable of all active teams.
   */
  @GetMapping({"", "/"})
  public Iterable<FullTeamDto> getAllTeams(
      @RequestParam(required = false) boolean isActive,
      @RequestParam(required = false) String searchQuery) {
    return teamService.getAllTeams(isActive, searchQuery);
  }

  /**
   * Get team details.
   *
   * @param id the team ID
   * @param currentMember the current member
   * @return the team details
   */
  @GetMapping("/{id}/details")
  public TeamDetailsDto getTeamDetails(
      @PathVariable Long id,
      @AuthenticationPrincipal Member currentMember) {
    return teamService.getTeamDetails(id, currentMember);
  }

  /**
   * Designate a member as a manager of a team.
   *
   * @param id the team ID
   * @param idMember the member ID to designate
   * @param currentMember the authenticated member
   * @return the updated team
   */
  @PutMapping("/{id}/manager/{idMember}")
  @PreAuthorize("isAuthenticated()")
  public Team designateSecondManager(
      @PathVariable Long id,
      @PathVariable Long idMember,
      @AuthenticationPrincipal Member currentMember) {
    return teamService.designateSecondManager(id, idMember, currentMember);
  }

  /**
   * Allow a manager to resign from their role, optionally designating a replacement.
   *
   * @param id the team ID
   * @param replacementId the ID of the replacement member (optional)
   * @param currentMember the authenticated member
   * @return the updated team
   */
  @PutMapping("/{id}/resign")
  @PreAuthorize("isAuthenticated()")
  public Team resignManager(
      @PathVariable Long id,
      @RequestParam(required = false) Long replacementId,
      @AuthenticationPrincipal Member currentMember) {
    return teamService.resignManager(id, currentMember, replacementId);
  }

  /**
   * Exclude a member from their team.
   *
   * @param id the team id
   * @param idMember the id of the member to exclude
   * @param currentMember the authenticated member
   */
  @PutMapping("/{id}/exclude-member/{idMember}")
  @PreAuthorize("isAuthenticated()")
  public void excludeMember(
      @PathVariable Long id,
      @PathVariable Long idMember,
      @AuthenticationPrincipal Member currentMember) {
    teamService.excludeMember(currentMember.getTeam(), idMember);
  }
}
