package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a bad request occurs.
 */
public class BadRequestException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public BadRequestException(String message) {
    super(message);
  }
}
