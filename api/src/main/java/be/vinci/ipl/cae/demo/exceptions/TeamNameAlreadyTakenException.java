package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a team name is already in use.
 */
public class TeamNameAlreadyTakenException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public TeamNameAlreadyTakenException(String message) {
    super(message);
  }
}
