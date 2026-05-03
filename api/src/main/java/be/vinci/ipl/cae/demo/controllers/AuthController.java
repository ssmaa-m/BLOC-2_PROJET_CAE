package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.AuthenticatedUser;
import be.vinci.ipl.cae.demo.models.dtos.Credentials;
import be.vinci.ipl.cae.demo.models.dtos.NewMember;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.services.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * AuthController to handle member authentication.
 */
@RestController
@RequestMapping("/auths")
public class AuthController {

  private final MemberService memberService;

  /**
   * Constructor.
   *
   * @param memberService the member service
   */
  public AuthController(MemberService memberService) {
    this.memberService = memberService;
  }

  /**
   * Check if credentials are invalid.
   *
   * @param credentials the credentials
   * @return true if invalid
   */
  private boolean isInvalidCredentials(Credentials credentials) {
    return credentials == null || credentials.getEmail() == null || credentials.getEmail().isBlank()
        || credentials.getPassword() == null || credentials.getPassword().isBlank();
  }

  /**
   * Register a new member.
   *
   * @param newMember the member to register
   */
  @PostMapping("/register")
  public void register(@RequestBody NewMember newMember) {
    if (newMember == null || newMember.getEmail() == null || newMember.getEmail().isBlank()
        || newMember.getPassword() == null || newMember.getPassword().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email ou mot de passe manquant");
    }
    memberService.register(newMember);
  }

  /**
   * Login a member.
   *
   * @param credentials the login credentials
   * @return the authenticated user
   */
  @PostMapping("/login")
  public AuthenticatedUser login(@RequestBody Credentials credentials) {
    if (isInvalidCredentials(credentials)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email ou mot de passe manquant");
    }

    return memberService.login(credentials.getEmail(), credentials.getPassword());
  }

  /**
   * Relog the authenticated user.
   *
   * @param currentMember the logged user
   * @return the authenticated user
   */
  @GetMapping("/login/me")
  public AuthenticatedUser relog(@AuthenticationPrincipal Member currentMember) {
    if (currentMember == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
    }

    return memberService.createJwtToken(currentMember.getEmail());
  }
}
