package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a member cannot be found.
 */
public class MemberNotFoundException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public MemberNotFoundException(String message) {
    super(message);
  }
}
