package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a password does not meet security requirements.
 */
public class InvalidPasswordException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public InvalidPasswordException(String message) {
    super(message);
  }
}
