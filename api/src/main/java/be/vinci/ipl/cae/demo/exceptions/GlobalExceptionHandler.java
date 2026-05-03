package be.vinci.ipl.cae.demo.exceptions;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for the API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Handles not found exceptions.
   *
   * @param ex the exception
   * @return a 404 response with error message
   */

  @ExceptionHandler({TournamentNotFoundException.class, TeamNotFoundException.class,
      MatchNotFoundException.class, JoinRequestNotFoundException.class,
      MatchLineupNotFoundException.class, MemberNotFoundException.class})
  public ResponseEntity<Map<String, String>> handleNotFoundExceptions(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
  }

  /**
   * Handles conflict exceptions.
   *
   * @param ex the exception
   * @return a 409 response with error message
   */
  @ExceptionHandler({EmailAlreadyTakenException.class, DuplicateRegistrationException.class,
      TeamNameAlreadyTakenException.class, NoManagerSpotsLeftException.class,
      LastManagerCannotQuitException.class, ReplacementRequiredException.class,
      MemberAlreadyManagerException.class, JoinRequestAlreadyExistsException.class,
      AlreadyConfirmedException.class, NoSlotAvailableForWinnerException.class})
  public ResponseEntity<Map<String, String>> handleConflictExceptions(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
  }

  /**
   * Handles bad request exceptions.
   *
   * @param ex the exception
   * @return a 400 response with error message
   */
  @ExceptionHandler({InvalidPasswordException.class, MemberAlreadyBannedException.class,
      CannotBanSelfException.class, RegistrationClosedException.class,
      InsufficientTeamMembersException.class, InactiveTeamException.class,
      ImpossibleTournamentException.class, InvalidTeamNameException.class,
      UserAlreadyInTeamException.class, UserNotInTeamException.class, TeamNotInMatchException.class,
      MatchNotPlayedException.class, InvalidJoinRequestException.class, BadRequestException.class,
      InvalidBanException.class, MatchScoreNotSetException.class, MemberNotInTeamException.class,
      MemberUnavailableException.class, TournamentStatusException.class,
      UnallowedTieException.class,
      AlreadyPlayedMatchInTournamentMatchGenerationAttemptException.class,
      InvalidMatchStatusException.class, AlreadyContestedException.class})
  public ResponseEntity<Map<String, String>> handleBadRequestExceptions(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
  }

  /**
   * Handles forbidden exceptions.
   *
   * @param ex the exception
   * @return a 403 response with error message
   */
  @ExceptionHandler({AccountBannedException.class, NotAdminException.class,
      CannotBanAdminException.class, ForbiddenException.class, NotManagerException.class,
      MemberHasNoTeamException.class, MemberNotManagerOfTeamException.class,
      PrivateLineupException.class})
  public ResponseEntity<Map<String, String>> handleForbiddenExceptions(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", ex.getMessage()));
  }

  /**
   * Handles unauthorized exceptions.
   *
   * @param ex the exception
   * @return a 401 response with error message
   */
  @ExceptionHandler({InvalidCredentialsException.class, NotAuthenticatedException.class,
      UnauthorizedException.class})
  public ResponseEntity<Map<String, String>> handleUnauthorizedExceptions(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", ex.getMessage()));
  }


}
