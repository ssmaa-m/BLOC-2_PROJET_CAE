package be.vinci.ipl.cae.demo.models.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for encoding match results.
 *
 * @param scoreTeam1 score of team 1
 * @param scoreTeam2 score of team 2
 */
public record EncodeMatchResultDto(
    @NotNull @Min(0) Integer scoreTeam1,
    @NotNull @Min(0) Integer scoreTeam2) {
}
