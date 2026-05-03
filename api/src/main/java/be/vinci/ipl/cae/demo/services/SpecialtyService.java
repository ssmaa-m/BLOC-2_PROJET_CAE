package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.dtos.SpecialtyDto;
import be.vinci.ipl.cae.demo.models.entities.Specialty;
import be.vinci.ipl.cae.demo.repositories.SpecialtyRepository;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.stereotype.Service;

/**
 * Specialty service.
 */
@Service
public class SpecialtyService {

  private final SpecialtyRepository specialtyRepository;

  /**
   * Specialty Constructor.
   */
  public SpecialtyService(SpecialtyRepository specialtyRepository) {
    this.specialtyRepository = specialtyRepository;
  }

  /**
   * Read all specialties.
   *
   * @return all specialties as DTOs
   */
  public Iterable<SpecialtyDto> readAllSpecialties() {
    Iterable<Specialty> iter = specialtyRepository.findAll();
    return StreamSupport
        .stream(iter.spliterator(), false)
        .map(s -> SpecialtyDto.builder().id(s.getIdSpecialty()).label(s.getName()).build())
        .collect(Collectors.toList());
  }
}
