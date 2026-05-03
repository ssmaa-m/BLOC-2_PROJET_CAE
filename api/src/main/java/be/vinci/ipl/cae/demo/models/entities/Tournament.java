package be.vinci.ipl.cae.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Tournament table.
 */
@Entity
@Table(name = "tournaments",
    indexes = {@Index(name = "idx_tournament_status_dates",
        columnList = "status, start_date, registration_deadline, end_date")})
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Tournament {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long idTournament;

  @Column(nullable = false, unique = true, length = 50)
  @Size(max = 50)
  private String name;

  @Column(nullable = false, length = 255)
  @Size(max = 255)
  private String description;

  @Column(nullable = false)
  private LocalDate startDate;

  @Column(nullable = false)
  private LocalDate endDate;

  @Column(nullable = false)
  private LocalDateTime registrationDeadline;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TournamentStatus status = TournamentStatus.IN_PREPARATION;

  @Column(nullable = false)
  private int capacity;

  @ManyToOne
  @JoinColumn(name = "winner_id")
  private Team winner;

  @ManyToMany
  @JoinTable(name = "tournament_registrations", joinColumns = @JoinColumn(name = "id_tournament"),
      inverseJoinColumns = @JoinColumn(name = "id_team"))
  @OrderBy("name ASC")
  private List<Team> teams = new ArrayList<>();

  /**
   * Set max number of teams for the current tournament.
   *
   * @param capacity max number of teams
   */
  public void setCapacity(int capacity) {
    if (capacity <= 1) {
      throw new IllegalArgumentException("Max teams must be > 0");
    }
    this.capacity = capacity;
  }

  /**
   * Validates the dates in the entity before inserting or updating any attributes.
   */
  @PrePersist
  @PreUpdate
  public void validateDates() {
    // check registrationDeadline is before startDate
    if (registrationDeadline != null && startDate != null) {
      if (!registrationDeadline.isBefore(startDate.atStartOfDay())) {
        throw new IllegalStateException("registrationDeadline must be before the startDate.");
      }
    }

    // Check startDate is before endDate
    if (startDate != null && endDate != null) {
      if (startDate.isAfter(endDate)) {
        throw new IllegalStateException("startDate must be before the endDate.");
      }
    }

    // Implied: registrationDeadline is before endDate
  }

  public int getRegistrationsNumber() {
    return teams.size();
  }

  @Override
  public String toString() {
    return getName() + ": " + getStatus();
  }

  /**
   * Registers a team and closes the tournament if it becomes full.
   *
   * @return true if registered, false if closed or deadline passed.
   */
  public boolean registerTeam(Team team) {
    // checking dates
    LocalDateTime now = LocalDateTime.now();
    if (this.status != TournamentStatus.REGISTRATION_OPEN || !registrationDeadline.isAfter(now)) {
      return false;
    }
    // register team
    teams.add(team);
    team.joinTournament(this);
    // change status to REGISTRATIONS_CLOSED if tournament became full
    if (getRegistrationsNumber() == capacity) {
      setStatus(TournamentStatus.REGISTRATION_CLOSED);
    }
    return true;
  }

}
