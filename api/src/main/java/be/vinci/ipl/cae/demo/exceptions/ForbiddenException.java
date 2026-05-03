package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when access is denied due to insufficient permissions.
 */
public class ForbiddenException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public ForbiddenException(String message) {
    super(message);
  }
}
