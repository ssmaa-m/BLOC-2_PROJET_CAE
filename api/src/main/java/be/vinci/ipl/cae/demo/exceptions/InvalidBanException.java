package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a ban operation is invalid.
 */
public class InvalidBanException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public InvalidBanException(String message) {
    super(message);
  }
}
