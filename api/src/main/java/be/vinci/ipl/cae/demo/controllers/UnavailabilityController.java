package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.NewUnavailabilityDto;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Unavailability;
import be.vinci.ipl.cae.demo.services.UnavailabilityService;
import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controller to handle unavailability operations.
 */
@RestController
@RequestMapping("/unavailabilities")
public class UnavailabilityController {

  private final UnavailabilityService unavailabilityService;

  /**
   * Constructor.
   *
   * @param unavailabilityService the unavailability service
   */
  public UnavailabilityController(UnavailabilityService unavailabilityService) {
    this.unavailabilityService = unavailabilityService;
  }

  /**
   * Get all unavailabilities for the authenticated member.
   *
   * @param currentMember the authenticated member
   * @return iterable of unavailabilities
   */
  @GetMapping("/me")
  public Iterable<Unavailability> getMyUnavailabilities(
      @AuthenticationPrincipal Member currentMember) {

    if (currentMember == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    return unavailabilityService.getByMember(currentMember);
  }

  /**
   * Create a new unavailability for the authenticated member.
   *
   * @param currentMember the authenticated member
   * @param dto the unavailability data
   * @return the created unavailability
   */
  @PostMapping("/me")
  public Unavailability createUnavailability(
      @AuthenticationPrincipal Member currentMember,
      @RequestBody NewUnavailabilityDto dto) {

    if (currentMember == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    if (dto == null || dto.getStartDate() == null || dto.getEndDate() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dates are required");
    }

    if (!dto.getStartDate().isBefore(dto.getEndDate())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "Start date must be before end date");
    }

    if (dto.getStartDate().isBefore(LocalDate.now().atStartOfDay())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date must be in the future");
    }

    return unavailabilityService.create(currentMember, dto);
  }

  /**
   * Delete an unavailability by ID (must belong to the authenticated member).
   *
   * @param id the unavailability ID
   * @param currentMember the authenticated member
   */
  @DeleteMapping("/{id}")
  public void deleteUnavailability(
      @PathVariable Long id,
      @AuthenticationPrincipal Member currentMember) {

    if (currentMember == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    boolean deleted = unavailabilityService.delete(id, currentMember);
    if (!deleted) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
  }
}
