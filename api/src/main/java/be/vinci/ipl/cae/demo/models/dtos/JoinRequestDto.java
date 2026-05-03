package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.RequestStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

/**
 * JoinRequest DTO.
 */
@Data
@Builder
public class JoinRequestDto {

  private UserSummaryDto requester;
  private Long idJoinRequest;
  private Long idTeam;
  private String teamName;
  private RequestStatus status;
  private String rejectionReason;
  private LocalDateTime expirationDate;

}
