package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when an account is banned.
 */
public class AccountBannedException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public AccountBannedException(String message) {
    super(message);
  }
}
