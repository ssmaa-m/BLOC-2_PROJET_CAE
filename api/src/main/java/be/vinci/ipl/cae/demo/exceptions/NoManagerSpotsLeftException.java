package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a team has no manager spots remaining.
 */
public class NoManagerSpotsLeftException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public NoManagerSpotsLeftException(String message) {
    super(message);
  }
}
