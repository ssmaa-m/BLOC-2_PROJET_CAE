package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when an email address is already in use.
 */
public class EmailAlreadyTakenException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public EmailAlreadyTakenException(String message) {
    super(message);
  }
}
