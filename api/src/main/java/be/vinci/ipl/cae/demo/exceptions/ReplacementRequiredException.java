package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a replacement is required.
 */
public class ReplacementRequiredException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public ReplacementRequiredException(String message) {
    super(message);
  }
}
