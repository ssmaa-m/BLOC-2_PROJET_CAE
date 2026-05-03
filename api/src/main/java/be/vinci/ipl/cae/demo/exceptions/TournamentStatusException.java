package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a tournament is not in the right state for the operation.
 */
public class TournamentStatusException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public TournamentStatusException(String message) {
    super(message);
  }
}
