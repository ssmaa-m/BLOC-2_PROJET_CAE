package be.vinci.ipl.cae.demo.models.dtos;

/**
 * Forfeit request DTO.
 *
 * @param matchID the match id
 * @param winningTeamId the winning team id
 * @param forfeitingTeamId the forfeiting team id
 */
public record ForfeitRequest(
    Long winningTeamId,
    Long forfeitingTeamId
) {}
