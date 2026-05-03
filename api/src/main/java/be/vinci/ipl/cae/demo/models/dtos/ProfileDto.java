package be.vinci.ipl.cae.demo.models.dtos;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * Profile DTO.
 */
@Data
@Builder
public class ProfileDto {
  private Long id;
  private String email;
  private String tag;
  private String specialty;
  private LocalDateTime creationDate;
  private String avatar;
  private Boolean isAdmin;
  private TeamDto team;
  private List<UnavailabilityDto> unavailabilities;

  /**
   * Team DTO.
   */
  @Data
  @Builder
  public static class TeamDto {
    private Long id;
    private String name;
    private boolean isManager;
    private int membersCount;
    private boolean hasOtherManager;
  }

  /**
   * Unavailability DTO.
   */
  @Data
  @Builder
  public static class UnavailabilityDto {
    private Long id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
  }
}
