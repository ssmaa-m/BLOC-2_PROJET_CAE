package be.vinci.ipl.cae.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Team entity.
 */
@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Team {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long idTeam;

  @Column(unique = true, nullable = false)
  private String name;

  @Column(nullable = false)
  private Boolean isActive;

  // Primary responsable Must be not null in order for team to be considered active.
  @ManyToOne
  @JoinColumn(name = "id_manager1")
  @JsonIgnoreProperties("team")
  private Member manager1;

  // Secondary responsable (optional for team "active" status).
  @ManyToOne
  @JoinColumn(name = "id_manager2")
  @JsonIgnoreProperties("team")
  private Member manager2;

  @ManyToMany(mappedBy = "teams")
  @JsonIgnore
  private List<Tournament> tournaments = new ArrayList<>();

  @OneToMany(mappedBy = "team", fetch = FetchType.EAGER)
  @JsonIgnore
  private List<Member> members = new ArrayList<>();

  /**
   * Adds a tournament to the team's registered list.
   */
  public void joinTournament(Tournament tournament) {
    if (!this.tournaments.contains(tournament)) {
      this.tournaments.add(tournament);
    }
  }
}
