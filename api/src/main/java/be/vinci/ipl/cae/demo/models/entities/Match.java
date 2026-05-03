package be.vinci.ipl.cae.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Match entity.
 */
@Entity
@Table(name = "matches",
    indexes = {@Index(name = "idx_match_status_date", columnList = "status, date_hour")})
@Getter
@Setter
@NoArgsConstructor
public class Match {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long idMatch;

  // Foreign Key to the Tournament
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "id_tournament", nullable = false)
  private Tournament tournament;

  // Nullable Foreign Key for Team 1
  @ManyToOne
  @JoinColumn(name = "id_team1")
  private Team team1;

  // Nullable Foreign Key for Team 2
  @ManyToOne
  @JoinColumn(name = "id_team2")
  private Team team2;

  @Column(nullable = false)
  private Integer turn;

  @Column(nullable = false)
  private LocalDateTime dateHour;

  private LocalDateTime scoreEncodedAt;

  // Enum mapped to String to save 'PLANIFIE' instead of 0
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MatchStatus status;

  // Nullable Foreign Key to the NEXT match (self-referencing)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_next_match")
  private Match nextMatch;

  @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<MatchLineup> lineups = new ArrayList<>();

  /**
   * tell match date has passed.
   *
   * @return boolean
   */
  public boolean wasPlayed() {
    return dateHour != null && dateHour.isBefore(LocalDateTime.now());
  }
}
