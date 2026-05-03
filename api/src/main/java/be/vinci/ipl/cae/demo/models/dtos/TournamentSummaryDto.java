package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Tournament summary DTO for list views.
 */
public record TournamentSummaryDto(
    Long idTournament,
    String name,
    String description,
    LocalDate startDate,
    LocalDate endDate,
    LocalDateTime registrationDeadline,
    TournamentStatus status,
    int capacity,
    int registrationsCount
) {}
