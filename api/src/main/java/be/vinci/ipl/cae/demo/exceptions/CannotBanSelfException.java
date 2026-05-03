package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a user attempts to ban themselves.
 */
public class CannotBanSelfException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public CannotBanSelfException(String message) {
    super(message);
  }
}
