package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a user is not authenticated.
 */
public class NotAuthenticatedException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public NotAuthenticatedException(String message) {
    super(message);
  }
}
