package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a member is not part of a match.
 */
public class MemberNotManagerOfTeamException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public MemberNotManagerOfTeamException(String message) {
    super(message);
  }
}
