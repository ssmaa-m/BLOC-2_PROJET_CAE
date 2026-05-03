package be.vinci.ipl.cae.demo.models.dtos;

import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * TeamDetails DTO.
 */
@Data
@Builder
public class TeamDetailsDto {

  private Long idTeam;
  private String name;
  private Boolean isActive;
  private List<UserSummaryDto> managers;
  private List<UserSummaryDto> members;
  private List<JoinRequestDto> joinRequests;

}
