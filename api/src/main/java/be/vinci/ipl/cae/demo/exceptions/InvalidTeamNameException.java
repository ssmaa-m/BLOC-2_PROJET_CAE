package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when the provided team name is invalid.
 */
public class InvalidTeamNameException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public InvalidTeamNameException(String message) {
    super(message);
  }
}
