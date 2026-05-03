package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a match is not in status PLAYED.
 */
public class MatchNotPlayedException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the error message
   */
  public MatchNotPlayedException(String message) {
    super(message);
  }
}
