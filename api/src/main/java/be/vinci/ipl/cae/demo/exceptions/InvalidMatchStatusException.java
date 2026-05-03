package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a match is not in the expected status for the requested operation.
 */
public class InvalidMatchStatusException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public InvalidMatchStatusException(String message) {
    super(message);
  }
}
