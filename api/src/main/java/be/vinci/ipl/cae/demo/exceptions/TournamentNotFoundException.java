package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a tournament is not found.
 */
public class TournamentNotFoundException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public TournamentNotFoundException(String message) {
    super(message);
  }
}
