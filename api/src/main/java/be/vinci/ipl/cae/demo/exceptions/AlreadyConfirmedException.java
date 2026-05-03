package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a team has already confirmed or contested a result.
 */
public class AlreadyConfirmedException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public AlreadyConfirmedException(String message) {
    super(message);
  }
}
