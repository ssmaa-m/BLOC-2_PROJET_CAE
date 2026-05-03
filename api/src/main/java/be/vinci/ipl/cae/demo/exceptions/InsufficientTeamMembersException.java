package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a team does not have enough members.
 */
public class InsufficientTeamMembersException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public InsufficientTeamMembersException(String message) {
    super(message);
  }
}
