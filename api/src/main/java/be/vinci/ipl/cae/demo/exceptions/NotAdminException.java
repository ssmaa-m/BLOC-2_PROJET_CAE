package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a member does not have administrator privileges.
 */
public class NotAdminException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public NotAdminException(String message) {
    super(message);
  }
}
