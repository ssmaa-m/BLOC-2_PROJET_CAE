package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a team is not one of the two teams of a match.
 */
public class TeamNotInMatchException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public TeamNotInMatchException(String message) {
    super(message);
  }
}
