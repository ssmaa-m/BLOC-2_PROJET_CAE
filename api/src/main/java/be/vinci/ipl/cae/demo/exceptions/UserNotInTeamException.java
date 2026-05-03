package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a user is not part of a team.
 */
public class UserNotInTeamException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public UserNotInTeamException(String message) {
    super(message);
  }
}
