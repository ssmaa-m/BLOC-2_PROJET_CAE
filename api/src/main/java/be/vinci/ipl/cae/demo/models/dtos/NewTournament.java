package be.vinci.ipl.cae.demo.models.dtos;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * New Tournament.
 *
 * @param name name of the tournament
 * @param description description of the tournament
 * @param startDate stratDate of the tournament
 * @param endDate endDate of the tournament
 * @param capacity nbMaxOfTeams of the tournament
 * @param registrationDeadline registrationDeadline of the tournament
 */
public record NewTournament(
    @Size(max = 50) String name,
    @Size(max = 255) String description,
    LocalDate startDate,
    LocalDate endDate, int capacity,
    LocalDateTime registrationDeadline) {
}
