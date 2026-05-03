package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a team is inactive.
 */
public class InactiveTeamException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public InactiveTeamException(String message) {
    super(message);
  }
}
