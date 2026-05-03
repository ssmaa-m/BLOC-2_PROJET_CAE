package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when the last manager of a team attempts to quit.
 */
public class LastManagerCannotQuitException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public LastManagerCannotQuitException(String message) {
    super(message);
  }
}
