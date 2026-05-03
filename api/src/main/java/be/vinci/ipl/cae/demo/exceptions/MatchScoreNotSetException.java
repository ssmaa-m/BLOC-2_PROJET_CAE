package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a member is already banned.
 */
public class MatchScoreNotSetException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public MatchScoreNotSetException(String message) {
    super(message);
  }
}
