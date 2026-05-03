package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.RequestStatus;
import lombok.Data;

/**
 * DTO used to update the status of a join request. Contains the new status and an optional
 * rejection reason.
 */
@Data
public class UpdateJoinRequestDto {

  private RequestStatus status;
  private String rejectionReason;
}
