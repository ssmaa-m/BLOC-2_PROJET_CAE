package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a tournament is physically impossible to complete.
 */
public class ImpossibleTournamentException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public ImpossibleTournamentException(String message) {
    super(message);
  }
}
