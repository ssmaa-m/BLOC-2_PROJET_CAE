package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.dtos.NewUnavailabilityDto;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Unavailability;
import be.vinci.ipl.cae.demo.repositories.UnavailabilityRepository;
import org.springframework.stereotype.Service;

/**
 * Service handling unavailability operations.
 */
@Service
public class UnavailabilityService {

  private final UnavailabilityRepository unavailabilityRepository;

  /**
   * Constructor.
   *
   * @param unavailabilityRepository the unavailability repository
   */
  public UnavailabilityService(UnavailabilityRepository unavailabilityRepository) {
    this.unavailabilityRepository = unavailabilityRepository;
  }

  /**
   * Get all unavailabilities for a member.
   *
   * @param member the member
   * @return iterable of unavailabilities
   */
  public Iterable<Unavailability> getByMember(Member member) {
    return unavailabilityRepository.findByMember(member);
  }

  /**
   * Create a new unavailability for a member.
   *
   * @param member the member
   * @param dto the unavailability data
   * @return the created unavailability
   */
  public Unavailability create(Member member, NewUnavailabilityDto dto) {
    Unavailability unavailability = new Unavailability();
    unavailability.setMember(member);
    unavailability.setStartDate(dto.getStartDate());
    unavailability.setEndDate(dto.getEndDate());
    return unavailabilityRepository.save(unavailability);
  }

  /**
   * Delete an unavailability by ID, only if it belongs to the given member.
   *
   * @param id the unavailability ID
   * @param member the member who owns the unavailability
   * @return true if deleted, false if not found or not owned by the member
   */
  public boolean delete(Long id, Member member) {
    Unavailability unavailability = unavailabilityRepository.findById(id).orElse(null);

    if (unavailability == null) {
      return false;
    }

    if (!unavailability.getMember().getIdMember().equals(member.getIdMember())) {
      return false;
    }

    unavailabilityRepository.delete(unavailability);
    return true;
  }
}
