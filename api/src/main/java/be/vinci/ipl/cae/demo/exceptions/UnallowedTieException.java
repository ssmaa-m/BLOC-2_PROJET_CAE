package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a tournament is not in the right state for the operation.
 */
public class UnallowedTieException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public UnallowedTieException(String message) {
    super(message);
  }
}
