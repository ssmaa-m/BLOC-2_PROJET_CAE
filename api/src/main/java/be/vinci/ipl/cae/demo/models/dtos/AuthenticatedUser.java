package be.vinci.ipl.cae.demo.models.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AuthenticatedUser DTO.
 */
@Data
@NoArgsConstructor
public class AuthenticatedUser {

  private Long id;
  private String email;
  private boolean isAdmin;
  private String tag;
  private Long managedTeamId;
  private String token;
  private Long teamId;
}
