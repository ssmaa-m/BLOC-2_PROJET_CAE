package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Tournament Details DTO including participating teams and all matches.
 */
public record TournamentDetailsDto(
    Long idTournament,
    String name,
    String description,
    LocalDate startDate,
    LocalDate endDate,
    LocalDateTime registrationDeadline,
    TournamentStatus status,
    int capacity,
    int registrationsCount,
    List<TeamSummaryDto> teams,
    List<MatchSummaryDto> matches
) {}
