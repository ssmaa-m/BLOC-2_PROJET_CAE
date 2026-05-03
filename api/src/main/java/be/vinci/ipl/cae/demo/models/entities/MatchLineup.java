package be.vinci.ipl.cae.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * MatchLineup entity.
 */
@Entity
@Table(name = "match_lineups")
@Getter
@Setter
@NoArgsConstructor
public class MatchLineup {

  @EmbeddedId
  private MatchLineupId id = new MatchLineupId();

  @ManyToOne
  @MapsId("idMatch")
  @JoinColumn(name = "id_match")
  @JsonIgnore
  private Match match;

  @ManyToOne
  @MapsId("idTeam")
  @JoinColumn(name = "id_team")
  private Team team;

  @Column(nullable = false)
  private boolean hasForfeited = false;

  private Integer score;

  private boolean isWinner;

  private ConfirmationStatus confirmationStatus = ConfirmationStatus.PENDING;

  @ManyToMany
  @JoinTable(name = "match_members",
      joinColumns = {@JoinColumn(name = "id_match", referencedColumnName = "id_match"),
          @JoinColumn(name = "id_team", referencedColumnName = "id_team")},
      inverseJoinColumns = @JoinColumn(name = "id_membre"))
  private Set<Member> members = new HashSet<>();

  /**
   * Replaces current lineup list with the given one.
   *
   * @param updatedMembers new lineup
   */
  public void replaceLineup(Set<Member> updatedMembers) {
    this.members = updatedMembers;
  }

  /**
   * Check id a confirmationStatus is confirmed.
   */
  public boolean isConfirmed() {
    return this.confirmationStatus.equals(ConfirmationStatus.CONFIRMED)
        || this.confirmationStatus.equals(ConfirmationStatus.ADMIN_LOCKED);
  }

  /**
   * Check id a confirmationStatus is contested.
   */
  public boolean isContested() {
    return this.confirmationStatus.equals(ConfirmationStatus.CONTESTED);
  }

  /**
   * Check id a confirmationStatus is pending.
   */
  public boolean isPending() {
    return this.confirmationStatus.equals(ConfirmationStatus.PENDING);
  }
}
