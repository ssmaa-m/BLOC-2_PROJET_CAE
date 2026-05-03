package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when the provided credentials are invalid.
 */
public class InvalidCredentialsException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public InvalidCredentialsException(String message) {
    super(message);
  }
}
