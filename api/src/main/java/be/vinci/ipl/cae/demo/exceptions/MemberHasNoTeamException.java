package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a member has no team.
 */
public class MemberHasNoTeamException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public MemberHasNoTeamException(String message) {
    super(message);
  }
}
