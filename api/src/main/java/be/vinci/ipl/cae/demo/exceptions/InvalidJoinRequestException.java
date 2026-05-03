package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a join request operation is invalid (bad status, bad arguments).
 */
public class InvalidJoinRequestException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public InvalidJoinRequestException(String message) {
    super(message);
  }
}
