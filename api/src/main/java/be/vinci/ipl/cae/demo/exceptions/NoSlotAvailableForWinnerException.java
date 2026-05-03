package be.vinci.ipl.cae.demo.exceptions;

/**
 * Exception thrown when a match has no available slot for the winner.
 */
public class NoSlotAvailableForWinnerException extends RuntimeException {

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public NoSlotAvailableForWinnerException(String message) {
    super(message);
  }
}
