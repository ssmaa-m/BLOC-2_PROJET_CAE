package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.exceptions.AccountBannedException;
import be.vinci.ipl.cae.demo.exceptions.CannotBanAdminException;
import be.vinci.ipl.cae.demo.exceptions.CannotBanSelfException;
import be.vinci.ipl.cae.demo.exceptions.EmailAlreadyTakenException;
import be.vinci.ipl.cae.demo.exceptions.InvalidCredentialsException;
import be.vinci.ipl.cae.demo.exceptions.InvalidPasswordException;
import be.vinci.ipl.cae.demo.exceptions.MemberAlreadyBannedException;
import be.vinci.ipl.cae.demo.exceptions.MemberNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.NotAdminException;
import be.vinci.ipl.cae.demo.exceptions.NotAuthenticatedException;
import be.vinci.ipl.cae.demo.models.dtos.AuthenticatedUser;
import be.vinci.ipl.cae.demo.models.dtos.MemberSummaryDto;
import be.vinci.ipl.cae.demo.models.dtos.NewMember;
import be.vinci.ipl.cae.demo.models.dtos.ProfileDto;
import be.vinci.ipl.cae.demo.models.dtos.UserSummaryDto;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.ProfileImage;
import be.vinci.ipl.cae.demo.models.entities.Specialty;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.models.entities.Unavailability;
import be.vinci.ipl.cae.demo.repositories.MatchLineupRepository;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.ProfileImageRepository;
import be.vinci.ipl.cae.demo.repositories.SpecialtyRepository;
import be.vinci.ipl.cae.demo.repositories.TeamRepository;
import be.vinci.ipl.cae.demo.repositories.UnavailabilityRepository;
import be.vinci.ipl.cae.demo.specifications.MemberSpecifications;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service handling authentication and registration for members.
 */
@Service
public class MemberService {

  @Value("APP_JWT_SECRET")
  private String jwtSecret;
  private static final long lifetimeJwt = 24 * 60 * 60 * 1000; // 24 hours

  // Do NOT make this final or static
  private Algorithm algorithm;

  /**
   * Initialize jwt.
   */
  @PostConstruct
  public void init() {
    // This runs only after jwtSecret is successfully pulled from .env
    this.algorithm = Algorithm.HMAC256(jwtSecret);
  }

  private final BCryptPasswordEncoder passwordEncoder;
  private final MemberRepository memberRepository;
  private final UnavailabilityRepository unavailabilityRepository;
  private final SpecialtyRepository specialtyRepository;
  private final ProfileImageRepository profileImageRepository;
  private final TeamRepository teamRepository;
  private final MatchLineupRepository matchLineupRepository;

  /**
   * Constructor.
   *
   * @param passwordEncoder the password encoder
   * @param memberRepository the member repository
   * @param unavailabilityRepository the unavailability repository
   * @param specialtyRepository the specialty repository
   * @param profileImageRepository the profile image repository
   */
  public MemberService(
      BCryptPasswordEncoder passwordEncoder,
      MemberRepository memberRepository,
      UnavailabilityRepository unavailabilityRepository,
      SpecialtyRepository specialtyRepository,
      ProfileImageRepository profileImageRepository,
      TeamRepository teamRepository,
      MatchLineupRepository matchLineupRepository) {
    this.passwordEncoder = passwordEncoder;
    this.memberRepository = memberRepository;
    this.unavailabilityRepository = unavailabilityRepository;
    this.specialtyRepository = specialtyRepository;
    this.profileImageRepository = profileImageRepository;
    this.teamRepository = teamRepository;
    this.matchLineupRepository = matchLineupRepository;
  }

  /**
   * Create an AuthenticatedUser based on a member and a token.
   *
   * @param member the member
   * @param token the token
   * @return the authenticated user
   */
  public AuthenticatedUser toAuthenticatedUser(Member member, String token) {
    AuthenticatedUser authenticatedUser = new AuthenticatedUser();
    authenticatedUser.setId(member.getIdMember());
    authenticatedUser.setEmail(member.getEmail());
    authenticatedUser.setTag(member.getTag());
    authenticatedUser.setToken(token);
    authenticatedUser.setAdmin(member.isAdmin());
    Team teamTemp = member.getTeam();
    if (teamTemp == null) {
      authenticatedUser.setTeamId(null);
    } else {
      authenticatedUser.setTeamId(member.getTeam().getIdTeam());
    }
    teamRepository
        .findFirstByManager1OrManager2(member, member)
        .ifPresent(team -> authenticatedUser.setManagedTeamId(team.getIdTeam()));

    return authenticatedUser;
  }

  /**
   * Create a JWT token.
   *
   * @param email the member email included in the JWT claim
   * @return the JWT token
   */
  public AuthenticatedUser createJwtToken(String email) {
    String token = JWT
        .create()
        .withIssuer("auth0")
        .withClaim("username", email)
        .withIssuedAt(new Date())
        .withExpiresAt(new Date(System.currentTimeMillis() + lifetimeJwt))
        .sign(algorithm);

    Member member = memberRepository.findByEmail(email);
    return toAuthenticatedUser(member, token);
  }

  /**
   * Verify a JWT token.
   *
   * @param token the token to verify
   * @return the email if the token is valid, null otherwise
   */
  public String verifyJwtToken(String token) {
    try {
      return JWT.require(algorithm).build().verify(token).getClaim("username").asString();
    } catch (Exception e) {
      return null;
    }
  }

  /**
   * Login a member.
   *
   * @param email the member email
   * @param password the member password
   * @return the authenticated user if login succeeds
   */
  public AuthenticatedUser login(String email, String password) {
    Member member = memberRepository.findByEmail(email);

    if (member == null) {
      throw new InvalidCredentialsException("Identifiants invalides");
    }

    if (member.isDeleted()) {
      throw new AccountBannedException("Compte banni");
    }

    if (!passwordEncoder.matches(password, member.getPassword())) {
      throw new InvalidCredentialsException("Identifiants invalides");
    }

    return createJwtToken(email);
  }

  private void validatePassword(String password) {
    if (password == null || password.length() < 8) {
      throw new InvalidPasswordException("Le mot de passe doit contenir au moins 8 caractères");
    }

    if (!password.matches(".*[A-Z].*")) {
      throw new InvalidPasswordException("Le mot de passe doit contenir au moins une majuscule");
    }

    if (!password.matches(".*[a-z].*")) {
      throw new InvalidPasswordException("Le mot de passe doit contenir au moins une minuscule");
    }

    if (!password.matches(".*\\d.*")) {
      throw new InvalidPasswordException("Le mot de passe doit contenir au moins un chiffre");
    }

    if (!password.matches(".*[^a-zA-Z0-9].*")) {
      throw new InvalidPasswordException(
          "Le mot de passe doit contenir au moins un caractère spécial");
    }
  }

  /**
   * Register a new member.
   *
   * @param newMember the member information
   * @return the created member
   */
  public Member register(NewMember newMember) {
    validatePassword(newMember.getPassword());

    if (memberRepository.existsByEmail(newMember.getEmail())) {
      throw new EmailAlreadyTakenException("Email déjà utilisé");
    }

    Member member = new Member();

    member.setEmail(newMember.getEmail());
    member.setPassword(passwordEncoder.encode(newMember.getPassword()));
    member.setTag(newMember.getTag());
    member.setAdmin(false);
    member.setDeleted(false);
    member.setSpecialty(specialtyRepository.getByIdSpecialty(newMember.getSpecialtyId()));
    member
        .setProfileImage(
            profileImageRepository.getProfileImageByIdImage(newMember.getProfileImageId()));
    return memberRepository.save(member);
  }

  /**
   * Read a member by email.
   *
   * @param email the member email
   * @return the member if found
   */
  public Member readOneFromEmail(String email) {
    return memberRepository.findByEmail(email);
  }

  /**
   * Update a member's password.
   *
   * @param newPassword the new password
   * @return true if updated, false if the member is not found
   */
  public boolean updatePassword(Member member, String newPassword) {
    member.setPassword(passwordEncoder.encode(newPassword));
    memberRepository.save(member);
    return true;
  }

  /**
   * Update a member's profile image.
   *
   * @param member the member
   * @param profileImage the new profile image
   * @return true if updated, false if the image is invalid
   */
  public boolean updateAvatar(Member member, ProfileImage profileImage) {
    if (profileImage == null || profileImage.getIdImage() == null) {
      return false;
    }
    ProfileImage existingImage =
        profileImageRepository.getProfileImageByIdImage(profileImage.getIdImage());
    if (existingImage == null) {
      return false;
    }
    member.setProfileImage(existingImage);
    memberRepository.save(member);
    return true;
  }

  /**
   * Update a member's profile image.
   *
   * @param member the member
   * @param specialtyId the new profile image
   * @return true if updated, false if the image is invalid
   */
  public boolean updateSpecialty(Member member, Long specialtyId) {
    if (specialtyId == null || specialtyId <= 0) {
      return false;
    }
    Specialty existingSpecialty = specialtyRepository.getByIdSpecialty(specialtyId);
    if (existingSpecialty == null) {
      return false;
    }
    member.setSpecialty(existingSpecialty);
    memberRepository.save(member);
    return true;
  }

  /**
   * Get member profile DTO with privacy rules.
   *
   * @param requestedId the requested member ID
   * @param authenticatedEmail the authenticated user email
   * @return the profile DTO or null if not found
   */
  public ProfileDto getProfile(Long requestedId, String authenticatedEmail) {
    Member requestedMember = memberRepository.findById(requestedId).orElse(null);
    if (requestedMember == null) {
      return null;
    }

    Member authMember =
        authenticatedEmail != null ? memberRepository.findByEmail(authenticatedEmail) : null;
    boolean isSelf = authMember != null && authMember.getIdMember().equals(requestedId);

    ProfileDto.ProfileDtoBuilder builder = ProfileDto
        .builder()
        .id(requestedMember.getIdMember())
        .tag(requestedMember.getTag())
        .specialty(
            requestedMember.getSpecialty() != null ? requestedMember.getSpecialty().getName()
                : null)
        .avatar(
            requestedMember.getProfileImage() != null ? requestedMember.getProfileImage().getPath()
                : null);

    Team team = requestedMember.getTeam();
    if (team != null) {
      boolean isManager1 =
          team.getManager1() != null && team.getManager1().getIdMember().equals(requestedId);
      boolean isManager2 =
          team.getManager2() != null && team.getManager2().getIdMember().equals(requestedId);
      boolean hasOtherManager =
          (isManager1 && team.getManager2() != null) || (isManager2 && team.getManager1() != null);

      builder
          .team(
              ProfileDto.TeamDto
                  .builder()
                  .id(team.getIdTeam())
                  .name(team.getName())
                  .isManager(isManager1 || isManager2)
                  .membersCount(team.getMembers().size())
                  .hasOtherManager(hasOtherManager)
                  .build());
    }

    if (isSelf) {
      builder
          .email(requestedMember.getEmail())
          .creationDate(requestedMember.getCreationDate())
          .isAdmin(requestedMember.isAdmin());

      var unavailabilities = StreamSupport
          .stream(unavailabilityRepository.findByMember(requestedMember).spliterator(), false)
          .map(
              u -> ProfileDto.UnavailabilityDto
                  .builder()
                  .id(u.getIdUnavailability())
                  .startDate(u.getStartDate())
                  .endDate(u.getEndDate())
                  .build())
          .collect(Collectors.toList());
      builder.unavailabilities(unavailabilities);
    }

    return builder.build();
  }

  /**
   * Get member summary DTO for lists.
   *
   * @param member the member entity
   * @return the user summary DTO
   */
  public UserSummaryDto getUserSummary(Member member) {
    if (member == null) {
      return null;
    }
    return UserSummaryDto
        .builder()
        .id(member.getIdMember())
        .tag(member.getTag())
        .avatar(member.getProfileImage() != null ? member.getProfileImage().getPath() : null)
        .build();
  }

  /**
   * Toggles the isAdmin property of a member.
   *
   * @param idMember id of the target member
   * @return true if it succeeded and false otherwise
   */
  public boolean toggleAdmin(Long idMember) {
    Member member = memberRepository.findById(idMember).orElse(null);
    if (member == null) {
      return false;
    }
    member.setAdmin(!member.isAdmin());
    memberRepository.save(member);
    return true;
  }

  /**
   * Enum representing the status of a member for filtering purposes.
   */
  public enum MemberQueryStatus {
    ADMIN, MEMBER, BANNED,
  }

  /**
   * Get all members.
   *
   * @return an iterable of all members
   */
  public List<Member> getAllMembers(MemberQueryStatus status, String searchQuery) {
    Specification<Member> spec = Specification
        .where(MemberSpecifications.hasState(status))
        .and(MemberSpecifications.search(searchQuery));
    Sort sort = Sort.by("tag").ascending();
    return memberRepository.findAll(spec, sort);
  }

  /**
   * Map a member to a lightweight summary DTO (no sensitive data).
   *
   * @param m the member to map
   * @return the MemberSummaryDto
   */
  public MemberSummaryDto mapMemberToSummary(Member m) {
    return MemberSummaryDto
        .builder()
        .id(m.getIdMember())
        .tag(m.getTag())
        .avatar(m.getProfileImage() != null ? m.getProfileImage().getPath() : null)
        .build();
  }

  /**
   * Get all members as lightweight summaries (no sensitive data).
   *
   * @return List of MemberSummaryDto
   */
  public List<MemberSummaryDto> getAllMemberSummaries(
      MemberQueryStatus status,
      String searchQuery) {
    List<Member> members = getAllMembers(status, searchQuery);

    return members.stream().map(this::mapMemberToSummary).collect(Collectors.toList());
  }

  /**
   * Retrieve the authenticated member based on email.
   *
   * @param email the email of the authenticated user
   * @return the authenticated member
   * @throws NotAuthenticatedException if the user is not authenticated
   */
  private Member getAuthenticatedMember(String email) {
    Member member = memberRepository.findByEmail(email);

    if (member == null) {
      throw new NotAuthenticatedException("Utilisateur non authentifié");
    }

    return member;
  }

  /**
   * Check if the requester is an admin.
   *
   * @param requester the member performing the action
   * @throws NotAdminException if the member is not an admin
   */
  private void checkAdmin(Member requester) {
    if (!requester.isAdmin()) {
      throw new NotAdminException("Accès réservé aux admins");
    }
  }

  /**
   * Retrieve the member to be banned.
   *
   * @param id the ID of the target member
   * @return the found member
   * @throws MemberNotFoundException if the member does not exist
   */
  private Member getTargetMember(Long id) {
    return memberRepository
        .findById(id)
        .orElseThrow(() -> new MemberNotFoundException("Membre introuvable"));
  }

  /**
   * Validate business rules before banning a member.
   *
   * @param member the member to ban
   * @param requester the member performing the action
   * @throws CannotBanAdminException if trying to ban an admin
   * @throws MemberAlreadyBannedException if the member is already banned
   * @throws CannotBanSelfException if the user tries to ban themselves
   */
  private void checkBanValidity(Member member, Member requester) {
    if (member.getIdMember().equals(requester.getIdMember())) {
      throw new CannotBanSelfException("Tu ne peux pas te bannir toi-même");
    }

    if (member.isAdmin()) {
      throw new CannotBanAdminException("Impossible de bannir un admin");
    }

    if (member.isDeleted()) {
      throw new MemberAlreadyBannedException("Membre déjà banni");
    }

  }

  /**
   * Handle team updates before banning a member.
   *
   * @param member the member to ban
   */
  private void handleTeamBeforeBan(Member member) {
    Team team = member.getTeam();

    if (team == null) {
      return;
    }

    if (team.getManager1() != null
        && team.getManager1().getIdMember().equals(member.getIdMember())) {
      if (team.getManager2() != null) {
        team.setManager1(team.getManager2());
        team.setManager2(null);
      } else {
        Member replacement = team
            .getMembers()
            .stream()
            .filter(m -> !m.getIdMember().equals(member.getIdMember()))
            .filter(m -> !m.isDeleted())
            .min(Comparator.comparing(Member::getCreationDate))
            .orElse(null);

        if (replacement != null) {
          team.setManager1(replacement);
        } else {
          team.setManager1(null);
          team.setIsActive(false);
        }
      }
    }

    if (team.getManager2() != null
        && team.getManager2().getIdMember().equals(member.getIdMember())) {
      team.setManager2(null);
    }

    teamRepository.save(team);
  }

  /**
   * Perform the ban operation on the member.
   *
   * @param member the member to ban
   */
  private void performBan(Member member) {
    member.setDeleted(true);
    member.setTeam(null);
    memberRepository.save(member);
  }

  /**
   * Ban a member from the platform (soft delete).
   *
   * @param id the ID of the member to ban
   * @param requesterEmail the email of the authenticated user
   * @throws NotAuthenticatedException if the user is not authenticated
   * @throws NotAdminException if the requester is not an admin
   * @throws MemberNotFoundException if the member does not exist
   * @throws CannotBanAdminException if trying to ban an admin
   * @throws MemberAlreadyBannedException if the member is already banned
   * @throws CannotBanSelfException if the user tries to ban themselves
   */
  @Transactional
  public void banMember(Long id, String requesterEmail) {
    Member requester = getAuthenticatedMember(requesterEmail);

    checkAdmin(requester);

    Member member = getTargetMember(id);

    checkBanValidity(member, requester);

    handleTeamBeforeBan(member);
    handleActiveLineupsWhenMemberRemoval(member);

    performBan(member);
  }

  /**
   * Remove a member from a lineup.
   *
   * @param member the member we want to remove
   */
  public void handleActiveLineupsWhenMemberRemoval(Member member) {
    if (member.getTeam() == null) {
      return;
    }
    List<MatchLineup> activeLineups = matchLineupRepository
        .findByTeamAndMatchDateHourAfter(member.getTeam(), LocalDateTime.now());
    for (MatchLineup lineup : activeLineups) {
      lineup.getMembers().remove(member);
      matchLineupRepository.save(lineup);
    }
  }

  /**
   * Check if the member is the last active member of their team.
   *
   * @param memberId the ID of the member
   * @return true if the member is the last active member, false otherwise
   * @throws MemberNotFoundException if the member does not exist
   */
  public boolean isLastMember(Long memberId) {
    Member member = memberRepository
        .findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException("Membre introuvable"));

    Team team = member.getTeam();

    if (team == null) {
      return false;
    }

    long activeMembers = team.getMembers().stream().filter(m -> !m.isDeleted()).count();

    return activeMembers == 1;
  }

  /**
   * Checks if a member is part of a specific team.
   */
  public boolean isMemberOfTeam(Long memberId, Team team) {
    if (memberId == null || team == null) {
      return false;
    }
    return team.getMembers().stream().map(Member::getIdMember).toList().contains(memberId);
  }

  /**
   * Checks if a member is free at a specific date and time.
   */
  public boolean isMemberFreeAt(Member member, LocalDateTime dateTime) {
    Iterable<Unavailability> unavailabilities = unavailabilityRepository.findByMember(member);
    return member.isFreeAt(dateTime, unavailabilities);
  }
}
