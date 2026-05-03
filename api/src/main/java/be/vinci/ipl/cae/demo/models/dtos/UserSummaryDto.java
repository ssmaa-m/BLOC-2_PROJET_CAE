package be.vinci.ipl.cae.demo.models.dtos;

import lombok.Builder;
import lombok.Data;

/**
 * UserSummary DTO.
 */
@Data
@Builder
public class UserSummaryDto {
  private Long id;
  private String tag;
  private String avatar;
}
