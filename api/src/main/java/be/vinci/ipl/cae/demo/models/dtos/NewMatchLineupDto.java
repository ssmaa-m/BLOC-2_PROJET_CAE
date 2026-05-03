package be.vinci.ipl.cae.demo.models.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;

/**
 * Data Transfer Object for creating or updating a match lineup.
 *
 * <p>This record encapsulates the list of player identifiers that a manager
 * intends to assign to a match. It includes validation constraints to ensure the list is present
 * and does not exceed the maximum allowed team size.</p>
 *
 * @param playerIds the set of unique member identifiers to be included in the lineup
 */
public record NewMatchLineupDto(
    @NotNull(message = "Player set cannot be null")
    @Size(max = 4, message = "Lineup cannot exceed 4 players")
    Set<Long> playerIds
) {

}