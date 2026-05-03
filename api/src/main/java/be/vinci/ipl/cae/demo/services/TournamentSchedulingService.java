package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.entities.Tournament;
import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import be.vinci.ipl.cae.demo.repositories.TournamentRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Match scheduling service.
 */
@Service
public class TournamentSchedulingService {

  private final TournamentRepository tournamentRepository;
  private final TournamentService tournamentService;

  /**
   * Constructor.
   */
  public TournamentSchedulingService(
      TournamentRepository tournamentRepository,
      TournamentService tournamentService) {
    this.tournamentRepository = tournamentRepository;
    this.tournamentService = tournamentService;
  }

  /**
   * Periodically updates tournament statuses. Runs every 5 seconds to synchronize database state
   * with the current time.
   */
  @Scheduled(initialDelay = 5000, fixedDelay = 5000)
  @Transactional
  public void updateAllTournamentStates() {
    System.out.println("Updating tournaments...");
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();

    List<Tournament> openTournaments = tournamentRepository
        .findByStatusAndRegistrationDeadlineLessThanEqual(TournamentStatus.REGISTRATION_OPEN, now);
    for (Tournament t : openTournaments) {
      t
          .setStatus(
              t.getRegistrationsNumber() < 2 ? TournamentStatus.CANCELLED
                  : TournamentStatus.REGISTRATION_CLOSED);
    }

    List<Tournament> closedTournaments = tournamentRepository
        .findByStatusAndStartDateLessThanEqual(TournamentStatus.REGISTRATION_CLOSED, today);
    for (Tournament t : closedTournaments) {
      t.setStatus(TournamentStatus.CANCELLED);
    }

    List<Tournament> plannedTournaments =
        tournamentRepository.findByStatusAndStartDateLessThanEqual(TournamentStatus.PLANNED, today);
    for (Tournament t : plannedTournaments) {
      t.setStatus(TournamentStatus.IN_PROGRESS);
    }

    List<Tournament> runningTournaments = tournamentRepository
        .findByStatusAndEndDateLessThanEqual(TournamentStatus.IN_PROGRESS, today);
    for (Tournament t : runningTournaments) {
      t.setStatus(t.getWinner() != null ? TournamentStatus.DONE : TournamentStatus.CANCELLED);

      if (t.getStatus() == TournamentStatus.CANCELLED) {
        tournamentService.clearExistingMatches(t);
      }
    }
  }
}
