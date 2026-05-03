package be.vinci.ipl.cae.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a member is expected to be part of a specific team but isn't.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST) // Or CONFLICT (409) if it represents a business rule clash
public class MemberNotInTeamException extends RuntimeException {

  /**
   * Constructs a new MemberNotInTeamException with the default message.
   */
  public MemberNotInTeamException() {
    super("The selected member does not belong to the required team.");
  }

}
