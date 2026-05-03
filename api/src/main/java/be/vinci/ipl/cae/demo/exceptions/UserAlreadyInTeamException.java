package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a user is already part of a team.
 */
public class UserAlreadyInTeamException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public UserAlreadyInTeamException(String message) {
    super(message);
  }
}
