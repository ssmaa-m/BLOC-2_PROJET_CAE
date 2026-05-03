package be.vinci.ipl.cae.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested match does not exist in the database.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class MatchNotFoundException extends RuntimeException {

  /**
   * Constructor with no params, exception with default message.
   */
  public MatchNotFoundException() {
    super("Match not found.");
  }

  /**
   * Constructor.
   *
   * @param message the exception message
   */
  public MatchNotFoundException(String message) {
    super(message);
  }
}
