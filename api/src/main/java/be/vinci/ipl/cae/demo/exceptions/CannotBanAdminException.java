package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when attempting to ban an administrator.
 */
public class CannotBanAdminException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public CannotBanAdminException(String message) {
    super(message);
  }
}
