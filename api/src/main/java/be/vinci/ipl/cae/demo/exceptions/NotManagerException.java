package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a user is not a manager of the team.
 */
public class NotManagerException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public NotManagerException(String message) {
    super(message);
  }
}
