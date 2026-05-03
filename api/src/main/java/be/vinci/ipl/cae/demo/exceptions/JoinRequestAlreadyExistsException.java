package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a join request already exists.
 */
public class JoinRequestAlreadyExistsException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public JoinRequestAlreadyExistsException(String message) {
    super(message);
  }
}
