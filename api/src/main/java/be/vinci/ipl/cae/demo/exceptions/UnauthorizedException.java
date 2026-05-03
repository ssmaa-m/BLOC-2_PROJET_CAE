package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a user is not authenticated.
 */
public class UnauthorizedException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public UnauthorizedException(String message) {
    super(message);
  }
}
