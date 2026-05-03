package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when registration is closed.
 */
public class RegistrationClosedException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public RegistrationClosedException(String message) {
    super(message);
  }
}
