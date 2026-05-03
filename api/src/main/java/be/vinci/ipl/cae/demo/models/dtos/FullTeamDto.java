package be.vinci.ipl.cae.demo.models.dtos;

import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * TeamDetails DTO.
 */
@Data
@Builder
public class FullTeamDto {

  private Long idTeam;
  private String name;
  private Boolean isActive;
  private Long managerId1;
  private Long managerId2;
  private List<MemberSummaryDto> members;
}
