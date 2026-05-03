package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a member is already banned.
 */
public class MemberAlreadyBannedException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public MemberAlreadyBannedException(String message) {
    super(message);
  }
}
