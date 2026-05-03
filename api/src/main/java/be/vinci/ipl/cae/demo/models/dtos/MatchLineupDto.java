package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Data Transfer Object representing a team's lineup for a specific match.
 *
 * @param matchId  the unique identifier of the match
 * @param teamId   the unique identifier of the team
 * @param teamName the display name of the team
 * @param players  the set of members included in the lineup
 */
public record MatchLineupDto(
    Long matchId,
    Long teamId,
    String teamName,
    Set<MemberSummaryDto> players
) {

  /**
   * Creates a DTO from a MatchLineup entity.
   *
   * @param entity the entity to convert
   * @return a new MatchLineupDto populated with entity data
   */
  public static MatchLineupDto fromEntity(MatchLineup entity) {
    Set<MemberSummaryDto> summaries = entity.getMembers().stream()
        .map(MemberSummaryDto::fromEntity)
        .collect(Collectors.toSet());

    return new MatchLineupDto(
        entity.getMatch().getIdMatch(),
        entity.getTeam().getIdTeam(),
        entity.getTeam().getName(),
        summaries
    );
  }
}