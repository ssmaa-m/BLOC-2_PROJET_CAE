package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a team is already registered for a tournament.
 */
public class DuplicateRegistrationException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public DuplicateRegistrationException(String message) {
    super(message);
  }
}

