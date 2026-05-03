package be.vinci.ipl.cae.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a lineup for a specific team within a match cannot be found in the
 * database.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class MatchLineupNotFoundException extends RuntimeException {

  /**
   * Constructs a new MatchLineupNotFoundException with the default message.
   */
  public MatchLineupNotFoundException() {
    super("The requested match lineup does not exist.");
  }

  /**
   * Constructs a new MatchLineupNotFoundException with the specified message.
   *
   * @param message the detail message
   */
  public MatchLineupNotFoundException(String message) {
    super(message);
  }
}
