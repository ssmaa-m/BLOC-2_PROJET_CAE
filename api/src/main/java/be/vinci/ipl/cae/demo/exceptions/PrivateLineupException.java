package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a lineup is accessed when it shouldn't be.
 */
public class PrivateLineupException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public PrivateLineupException(String message) {
    super(message);
  }
}
