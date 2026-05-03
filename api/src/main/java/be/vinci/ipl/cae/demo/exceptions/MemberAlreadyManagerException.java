package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a member is already a manager.
 */
public class MemberAlreadyManagerException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public MemberAlreadyManagerException(String message) {
    super(message);
  }
}
