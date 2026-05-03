package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.ConfirmationStatus;

/**
 * Match Team DTO including result information.
 */
public record MatchTeamDto(
    Long idTeam,
    String name,
    Integer score,
    boolean isWinner,
    boolean hasForfeited,
    ConfirmationStatus confirmationStatus,
    MatchLineupDto lineup
) {}
