package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import java.time.LocalDateTime;

/**
 * Match Summary DTO with confirmation state and nested teams.
 */
public record MatchSummaryDto(
    Long idMatch,
    LocalDateTime dateHour,
    Integer turn,
    MatchStatus status,
    MatchTeamDto team1,
    MatchTeamDto team2,
    MatchSummaryTournamentDto tournament,
    boolean isFinal
) {}
