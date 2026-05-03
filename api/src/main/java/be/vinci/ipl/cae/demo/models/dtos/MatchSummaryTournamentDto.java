package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import lombok.Builder;
import lombok.Data;

/**
 * Match Summary Tournament DTO.
 */
@Data
@Builder
public class MatchSummaryTournamentDto {

  private Long id;
  private String name;
  private TournamentStatus status;

  /**
   * Constructs a MatchSummaryTournamentDto with the given id and name.
   *
   * @param id the id of the tournament
   * @param name the name of the tournament
   */
  public MatchSummaryTournamentDto(Long id, String name, TournamentStatus status) {
    this.id = id;
    this.name = name;
    this.status = status;
  }
}
