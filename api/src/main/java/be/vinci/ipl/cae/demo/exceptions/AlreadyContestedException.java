package be.vinci.ipl.cae.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a team tries to contest a match result they have already contested once.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AlreadyContestedException extends RuntimeException {

  /**
   * Constructs a new AlreadyContestedException with the specified detail message.
   *
   * @param message the detail message
   */
  public AlreadyContestedException(String message) {
    super(message);
  }
}
