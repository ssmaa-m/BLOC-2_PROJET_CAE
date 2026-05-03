package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a join request does not exist.
 */
public class JoinRequestNotFoundException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public JoinRequestNotFoundException(String message) {
    super(message);
  }
}
