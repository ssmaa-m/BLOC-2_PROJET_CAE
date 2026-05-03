package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a bad request occurs.
 */
public class AlreadyPlayedMatchInTournamentMatchGenerationAttemptException
    extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public AlreadyPlayedMatchInTournamentMatchGenerationAttemptException(String message) {
    super(message);
  }
}
