package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.MemberSummaryDto;
import be.vinci.ipl.cae.demo.models.dtos.PasswordUpdateDto;
import be.vinci.ipl.cae.demo.models.dtos.ProfileDto;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.ProfileImage;
import be.vinci.ipl.cae.demo.services.MemberService;
import be.vinci.ipl.cae.demo.services.MemberService.MemberQueryStatus;
import be.vinci.ipl.cae.demo.services.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controller to handle member/profile queries.
 */
@RestController
@RequestMapping("/members")
public class MemberController {

  private final MemberService memberService;
  private final TeamService teamService;

  /**
   * Constructor for MemberController.
   *
   * @param memberService the injected MemberService
   * @param teamService the injected TeamService
   */
  public MemberController(MemberService memberService, TeamService teamService) {
    this.memberService = memberService;
    this.teamService = teamService;
  }

  /**
   * Get all members as lightweight summaries.
   *
   * @return an array of member summaries
   */
  @GetMapping({"/", ""})
  public Iterable<MemberSummaryDto> getAllMemberSummaries(
      @RequestParam(required = false) MemberQueryStatus status,
      @RequestParam(required = false) String searchQuery) {
    return memberService.getAllMemberSummaries(status, searchQuery);
  }

  /**
   * Get all members private data.
   *
   * @param currentMember the authenticated member
   * @return all members
   */
  @GetMapping("/full")
  @PreAuthorize("hasRole('ADMIN')")
  public Iterable<Member> getAllMembers(
      @AuthenticationPrincipal Member currentMember,
      @RequestParam(required = false) MemberQueryStatus status,
      @RequestParam(required = false) String searchQuery) {
    return memberService.getAllMembers(status, searchQuery);
  }

  /**
   * Read one member's profile.
   *
   * @param id the member ID
   * @param currentMember the authenticated member
   * @return the profile
   */
  @GetMapping("/{id}")
  public ProfileDto readOne(@PathVariable Long id, @AuthenticationPrincipal Member currentMember) {
    String authenticatedEmail = currentMember != null ? currentMember.getEmail() : null;
    ProfileDto profile = memberService.getProfile(id, authenticatedEmail);

    if (profile == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    return profile;
  }

  /**
   * Update password.
   *
   * @param passwordDto the password DTO
   * @param currentMember the authenticated member
   */
  @PatchMapping("/me/password")
  @PreAuthorize("isAuthenticated()")
  public void updatePassword(
      @RequestBody PasswordUpdateDto passwordDto,
      @AuthenticationPrincipal Member currentMember) {
    if (passwordDto == null || passwordDto.getPassword() == null
        || passwordDto.getPassword().trim().isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password cannot be empty");
    }

    boolean updated = memberService.updatePassword(currentMember, passwordDto.getPassword());
    if (!updated) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Update avatar.
   */
  @PatchMapping("/me/avatar")
  @PreAuthorize("isAuthenticated()")
  public void updateAvatar(
      @RequestBody ProfileImage profileImage,
      @AuthenticationPrincipal Member currentMember) {
    boolean updated = memberService.updateAvatar(currentMember, profileImage);
    if (!updated) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid profile image");
    }
  }

  /**
   * Update specialty.
   */
  @PatchMapping("/me/specialty")
  @PreAuthorize("isAuthenticated()")
  public void updateSpecialty(
      @RequestBody Long specialtyId,
      @AuthenticationPrincipal Member currentMember) {
    boolean updated = memberService.updateSpecialty(currentMember, specialtyId);
    if (!updated) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid specialty");
    }
  }

  /**
   * Toggle admin.
   */
  @PatchMapping("/{id}/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public void toggleAdmin(@PathVariable Long id, @AuthenticationPrincipal Member currentMember) {
    if (currentMember.getIdMember().equals(id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "You cannot change your own admin status");
    }

    boolean updated = memberService.toggleAdmin(id);
    if (!updated) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Quit team.
   */
  @PostMapping("/me/quit-team")
  @PreAuthorize("isAuthenticated()")
  public void quitTeam(@AuthenticationPrincipal Member currentMember) {
    teamService.quitTeam(currentMember);
  }

  /**
   * Ban a member.
   *
   * @param id the member ID
   * @param currentMember the authenticated member
   */
  @PatchMapping("/{id}/ban")
  @PreAuthorize("hasRole('ADMIN')")
  public void banMember(@PathVariable Long id, @AuthenticationPrincipal Member currentMember) {
    memberService.banMember(id, currentMember.getEmail());
  }

  /**
   * Check if a member is the last active member of their team.
   *
   * @param id the ID of the member
   * @return true if the member is the last active member, false otherwise
   */
  @GetMapping("/{id}/is-last")
  public boolean isLastMember(@PathVariable Long id) {
    return memberService.isLastMember(id);
  }
}
